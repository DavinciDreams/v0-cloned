import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/a2ui/catalog', () => ({
  getCatalogPrompt: vi.fn(() => ''),
}));

import { auth } from '@clerk/nextjs/server';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/a2ui-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeStreamBody(): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('data: {}\n\n'));
      controller.close();
    },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('POST /api/a2ui-chat — auth', () => {
  it('returns 401 when auth() returns { userId: null }', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const res = await POST(makeRequest({ messages: [{ role: 'user', content: 'Hi' }] }) as any);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });
});

describe('POST /api/a2ui-chat — validation', () => {
  it('returns 400 when messages is an empty array', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const res = await POST(makeRequest({ messages: [] }) as any);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid request body');
  });

  it('returns 400 when messages is missing', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const res = await POST(makeRequest({}) as any);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid request body');
  });

  it('returns 400 when a message has an invalid role', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const res = await POST(
      makeRequest({ messages: [{ role: 'invalid', content: 'Hi' }] }) as any
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid request body');
  });

  it('returns a streaming SSE response for valid input', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const mockFetchResponse = new Response(makeStreamBody(), {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse));

    const res = await POST(
      makeRequest({ messages: [{ role: 'user', content: 'Create a chart' }] }) as any
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');
  });
});
