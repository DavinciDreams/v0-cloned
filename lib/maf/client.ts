/**
 * HTTP client for maf-standalone backend.
 * Handles both streaming and non-streaming chat requests.
 */

import type {
  MafChatRequest,
  MafChatResponse,
  MafHealthResponse,
  MafConnectionStatus,
} from './types';
import { getMafUrl } from './config';

export class MafClient {
  private baseUrl: string;
  private _status: MafConnectionStatus = 'disconnected';
  private _onStatusChange?: (status: MafConnectionStatus) => void;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getMafUrl();
  }

  get status(): MafConnectionStatus {
    return this._status;
  }

  onStatusChange(callback: (status: MafConnectionStatus) => void): void {
    this._onStatusChange = callback;
  }

  private setStatus(status: MafConnectionStatus): void {
    this._status = status;
    this._onStatusChange?.(status);
  }

  /** Check if the MAF backend is healthy */
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) return false;
      const data: MafHealthResponse = await res.json();
      this.setStatus('connected');
      return data.status === 'Healthy';
    } catch {
      this.setStatus('error');
      return false;
    }
  }

  /** Send a non-streaming chat message */
  async chat(message: string): Promise<string> {
    this.setStatus('connecting');
    const request: MafChatRequest = { message, stream: false };

    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      this.setStatus('error');
      throw new Error(`MAF chat failed: ${res.status} ${res.statusText}`);
    }

    this.setStatus('connected');
    const data: MafChatResponse = await res.json();
    return data.response;
  }

  /**
   * Send a streaming chat message.
   * Returns an AsyncGenerator that yields text chunks.
   */
  async *chatStream(
    message: string,
    signal?: AbortSignal,
  ): AsyncGenerator<string> {
    this.setStatus('connecting');
    const request: MafChatRequest = { message, stream: true };

    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    });

    if (!res.ok) {
      this.setStatus('error');
      throw new Error(`MAF stream failed: ${res.status} ${res.statusText}`);
    }

    this.setStatus('connected');
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    } finally {
      reader.releaseLock();
    }
  }
}

/** Singleton client instance */
let _client: MafClient | null = null;

export function getMafClient(baseUrl?: string): MafClient {
  if (!_client || baseUrl) {
    _client = new MafClient(baseUrl);
  }
  return _client;
}
