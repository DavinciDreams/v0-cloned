'use client';

/**
 * React hook for chatting with a maf-standalone backend.
 * Manages streaming, message history, and connection state.
 */

import { useState, useCallback, useRef } from 'react';
import { MafClient } from './client';
import { getMafConfig } from './config';
import type { MafConnectionStatus } from './types';

export interface MafMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface UseMafChatOptions {
  /** Override the MAF backend URL */
  url?: string;
  /** Callback when a complete response is received */
  onFinish?: (message: MafMessage) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export interface UseMafChatReturn {
  /** All messages in the conversation */
  messages: MafMessage[];
  /** Whether the assistant is currently responding */
  isLoading: boolean;
  /** Connection status to the MAF backend */
  status: MafConnectionStatus;
  /** Send a message (streams the response) */
  sendMessage: (content: string) => Promise<void>;
  /** Stop the current streaming response */
  stop: () => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Whether MAF is enabled via env config */
  isEnabled: boolean;
}

let messageCounter = 0;
function generateId(): string {
  return `maf-${Date.now()}-${++messageCounter}`;
}

export function useMafChat(
  options: UseMafChatOptions = {},
): UseMafChatReturn {
  const config = getMafConfig();
  const [messages, setMessages] = useState<MafMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<MafConnectionStatus>('disconnected');
  const abortRef = useRef<AbortController | null>(null);
  const clientRef = useRef<MafClient | null>(null);

  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = new MafClient(options.url || config.url);
      clientRef.current.onStatusChange(setStatus);
    }
    return clientRef.current;
  }, [options.url, config.url]);

  const sendMessage = useCallback(
    async (content: string) => {
      const client = getClient();

      const userMessage: MafMessage = {
        id: generateId(),
        role: 'user',
        content,
        createdAt: new Date(),
      };

      const assistantId = generateId();
      const assistantMessage: MafMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);

      const abort = new AbortController();
      abortRef.current = abort;

      try {
        let fullContent = '';
        for await (const chunk of client.chatStream(content, abort.signal)) {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullContent } : m,
            ),
          );
        }

        const finalMessage: MafMessage = {
          id: assistantId,
          role: 'assistant',
          content: fullContent,
          createdAt: new Date(),
        };
        options.onFinish?.(finalMessage);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          options.onError?.(err);
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [getClient, options],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    status,
    sendMessage,
    stop,
    clearMessages,
    isEnabled: config.enabled,
  };
}
