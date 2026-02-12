import { getMafConfig } from '@/lib/maf/config';

/**
 * API route that proxies chat requests to a maf-standalone backend.
 * Injects the A2UI system prompt and forwards the request.
 *
 * Accepts both formats:
 * - { message: "..." } (direct MAF format)
 * - { messages: [...] } (Vercel AI SDK format)
 */
export async function POST(request: Request) {
  const config = getMafConfig();

  if (!config.enabled) {
    return new Response(
      JSON.stringify({
        error: 'MAF backend not configured. Set NEXT_PUBLIC_MAF_URL.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let body: {
    messages?: Array<{ role: string; content: string }>;
    message?: string;
  };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract the latest user message
  let userMessage: string;
  if (body.message) {
    userMessage = body.message;
  } else if (body.messages && body.messages.length > 0) {
    const lastUserMsg = [...body.messages]
      .reverse()
      .find((m) => m.role === 'user');
    userMessage = lastUserMsg?.content || '';
  } else {
    return new Response(JSON.stringify({ error: 'No message provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Forward to MAF backend as streaming request
  let mafResponse: Response;
  try {
    mafResponse = await fetch(`${config.url}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, stream: true }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: `Failed to connect to MAF backend at ${config.url}`,
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!mafResponse.ok) {
    return new Response(
      JSON.stringify({
        error: `MAF backend error: ${mafResponse.status}`,
      }),
      {
        status: mafResponse.status,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // Stream the response through
  return new Response(mafResponse.body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
