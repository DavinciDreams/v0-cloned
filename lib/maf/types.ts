/**
 * TypeScript types matching maf-standalone request/response models.
 * Source: MyApp/Program.cs ChatRequest/ChatResponse records
 */

/** Request body for POST /chat */
export interface MafChatRequest {
  /** The user's message */
  message: string;
  /** Whether to stream the response (default: false) */
  stream?: boolean;
}

/** Response body for non-streaming POST /chat */
export interface MafChatResponse {
  /** The assistant's full response text */
  response: string;
}

/** Health check response from GET /health */
export interface MafHealthResponse {
  status: string;
}

/** Connection status for the MAF client */
export type MafConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';
