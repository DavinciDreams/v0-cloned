# API Reference

This document covers the three chat API routes in the Generous Works project. All routes require **Clerk authentication** and support **streaming responses**.

> **Source files:**
> - [`app/api/chat/route.ts`](../app/api/chat/route.ts)
> - [`app/api/a2ui-chat/route.ts`](../app/api/a2ui-chat/route.ts)
> - [`app/api/maf/chat/route.ts`](../app/api/maf/chat/route.ts)

---

## Table of Contents

- [Authentication](#authentication)
- [POST /api/chat](#post-apichat)
- [POST /api/a2ui-chat](#post-apia2ui-chat)
- [POST /api/maf/chat](#post-apimafchat)
- [Error Codes](#error-codes)
- [Provider Configuration](#provider-configuration)
- [Streaming Behavior](#streaming-behavior)

---

## Authentication

All three API routes enforce **Clerk authentication** at two levels:

### 1. Middleware Layer

The [`middleware.ts`](../middleware.ts) file protects all API routes using Clerk's `clerkMiddleware`. Unauthenticated requests are redirected to `/sign-in`.

```typescript
// middleware.ts — API routes are always matched
export const config = {
  matcher: [
    '/(api|trpc)(.*)',  // All API routes require auth
  ],
};
```

### 2. Route Handler Layer

Each route handler additionally calls [`auth()`](../AUTHENTICATION.md) from `@clerk/nextjs/server` to verify the user identity:

```typescript
const { userId } = await auth();
if (!userId) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}
```

### Required Headers

| Header | Value | Description |
|--------|-------|-------------|
| `Authorization` | Bearer token (Clerk JWT) | Automatically included by the Clerk client SDK |
| `Content-Type` | `application/json` | Required for all request bodies |

---

## POST /api/chat

General-purpose chat endpoint that generates both text and UI components (JSX and A2UI JSON). Uses the **Zhipu AI** provider via the Vercel AI SDK.

**Source:** [`app/api/chat/route.ts`](../app/api/chat/route.ts:749)

### Request Schema

The request body is validated with Zod via [`chatRequestSchema`](../app/api/chat/route.ts:741):

```typescript
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1),
  })).optional(),
  prompt: z.string().optional(),
  stream: z.boolean().optional().default(true),
  temperature: z.number().optional().default(0.7),
  maxTokens: z.number().optional().default(4000),
});
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `messages` | `Message[]` | Conditional* | — | Array of conversation messages. Required if `prompt` is not provided. |
| `prompt` | `string` | Conditional* | — | Simple text prompt. Required if `messages` is not provided. |
| `stream` | `boolean` | No | `true` | Enable streaming response. **Note:** Only `true` is currently supported. |
| `temperature` | `number` | No | `0.7` | Generation temperature, clamped to range `[0, 2]` |
| `maxTokens` | `number` | No | `4000` | Maximum output tokens, clamped to range `[1, 8000]` |

> \* Either `messages` or `prompt` must be provided. If both are present, `messages` takes precedence.

#### Message Object

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `role` | `string` | Yes | `"user"`, `"assistant"`, `"system"` |
| `content` | `string` | Yes | Non-empty string |

### Request Example

```bash
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-jwt>" \
  -d '{
    "messages": [
      { "role": "user", "content": "Create a login form with email and password" }
    ],
    "temperature": 0.7,
    "maxTokens": 4000
  }'
```

### Response

#### Success (Streaming)

| Property | Value |
|----------|-------|
| Status | `200 OK` |
| Content-Type | `text/plain; charset=utf-8` |
| Transfer-Encoding | `chunked` |

The response body is a **Vercel AI SDK text stream** produced by [`result.toTextStreamResponse()`](../app/api/chat/route.ts:803). The stream yields incremental text chunks containing the assistant's reply, which may include:

- Plain text explanations
- JSX code blocks (wrapped in ` ```tsx ... ``` ` fences)
- A2UI JSON blocks (wrapped in ` ```json ... ``` ` fences)

#### Validation Error

```json
{
  "error": "Invalid request body",
  "details": { /* Zod flattened error */ }
}
```

#### Missing Fields Error

```json
{
  "error": "Either 'messages' or 'prompt' is required"
}
```

### System Prompt

The route uses [`getSystemPrompt()`](../app/api/chat/route.ts:12) which injects the full A2UI component catalog and instructions for generating both JSX and A2UI JSON formats. The system prompt instructs the model to act as a UI component generator for a Next.js application using React 19 and Tailwind CSS.

### Notes

- Non-streaming mode (`stream: false`) returns a `400` error — it is not currently implemented.
- The route uses [`createZhipu()`](../app/api/chat/route.ts:781) from the `zhipu-ai-provider` package with [`streamText()`](../app/api/chat/route.ts:792) from the Vercel AI SDK.

---

## POST /api/a2ui-chat

Specialized endpoint for generating **A2UI JSON component specifications**. Uses the **Zhipu AI** provider via direct HTTP fetch (not the Vercel AI SDK).

**Source:** [`app/api/a2ui-chat/route.ts`](../app/api/a2ui-chat/route.ts:225)

### Request Schema

The request body is validated with Zod via [`a2uiRequestSchema`](../app/api/a2ui-chat/route.ts:216):

```typescript
const a2uiRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1),
  })).min(1),
  temperature: z.number().optional().default(0.7),
  maxTokens: z.number().optional().default(16000),
});
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `messages` | `Message[]` | Yes | — | Array of conversation messages. Must contain at least 1 message. |
| `temperature` | `number` | No | `0.7` | Generation temperature, clamped to range `[0, 2]` |
| `maxTokens` | `number` | No | `16000` | Maximum output tokens, clamped to range `[1, 32000]` |

#### Message Object

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `role` | `string` | Yes | `"user"`, `"assistant"`, `"system"` |
| `content` | `string` | Yes | Non-empty string |

### Request Example

```bash
curl -X POST https://your-domain.com/api/a2ui-chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-jwt>" \
  -d '{
    "messages": [
      { "role": "user", "content": "Show me a timeline of major tech companies" }
    ],
    "temperature": 0.7,
    "maxTokens": 16000
  }'
```

### Response

#### Success (Streaming)

| Property | Value |
|----------|-------|
| Status | `200 OK` |
| Content-Type | `text/event-stream` |
| Cache-Control | `no-cache` |
| Connection | `keep-alive` |

The response is a **Server-Sent Events (SSE) stream** passed through directly from the Zhipu API. Each event contains incremental text chunks of the assistant's reply in A2UI JSON format.

The stream yields text that contains A2UI JSON wrapped in markdown code fences:

```json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "unique-component-id",
        "component": {
          "ComponentName": {
            "data": { /* component-specific data */ },
            "options": { /* optional configuration */ }
          }
        }
      }
    ]
  }
}
```

#### Validation Error

```json
{
  "error": "Invalid request body",
  "details": { /* Zod flattened error */ }
}
```

### System Prompt

The route uses [`getA2UISystemPrompt()`](../app/api/a2ui-chat/route.ts:12) which focuses exclusively on generating valid A2UI JSON specifications. It includes the A2UI component catalog and strict JSON formatting rules.

### Notes

- Unlike `/api/chat`, this route does **not** support a `prompt` shorthand — `messages` is always required.
- The `maxTokens` default is higher (`16000`) to accommodate complex A2UI JSON output.
- This route calls the Zhipu API directly via `fetch()` rather than using the Vercel AI SDK.

---

## POST /api/maf/chat

Proxy endpoint that forwards chat requests to a **MAF (Microsoft Agent Framework) standalone backend**. Supports both direct MAF format and Vercel AI SDK format.

**Source:** [`app/api/maf/chat/route.ts`](../app/api/maf/chat/route.ts:12)

### Request Schema

The request body is validated manually (no Zod schema):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | `string` | Conditional* | Direct message text (MAF format) |
| `messages` | `Message[]` | Conditional* | Array of conversation messages (Vercel AI SDK format) |

> \* Either `message` or `messages` must be provided. If both are present, `message` takes precedence. When using `messages`, the last message with `role: "user"` is extracted.

#### Message Object (Vercel AI SDK format)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | `string` | Yes | Message role (e.g., `"user"`, `"assistant"`) |
| `content` | `string` | Yes | Message content |

### Request Example

**Direct MAF format:**

```bash
curl -X POST https://your-domain.com/api/maf/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-jwt>" \
  -d '{
    "message": "Hello, what can you do?"
  }'
```

**Vercel AI SDK format:**

```bash
curl -X POST https://your-domain.com/api/maf/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-jwt>" \
  -d '{
    "messages": [
      { "role": "user", "content": "Hello, what can you do?" }
    ]
  }'
```

### Response

#### Success (Streaming)

| Property | Value |
|----------|-------|
| Status | `200 OK` |
| Content-Type | `text/plain; charset=utf-8` |
| Transfer-Encoding | `chunked` |

The response streams the MAF backend's output directly to the client. The MAF backend receives the request as:

```json
{ "message": "<extracted-user-message>", "stream": true }
```

#### Configuration Error

```json
{
  "error": "MAF backend not configured. Set NEXT_PUBLIC_MAF_URL."
}
```

#### Connection Error

```json
{
  "error": "Failed to connect to MAF backend at http://localhost:5555"
}
```

#### Backend Error

```json
{
  "error": "MAF backend error: 500"
}
```

### Notes

- This route requires the `NEXT_PUBLIC_MAF_URL` environment variable to be set. If not configured, the route returns `503`.
- The route proxies requests to `{MAF_URL}/chat` on the MAF backend.
- Unlike the other two routes, this endpoint does **not** inject a system prompt — the MAF backend manages its own prompting.
- The MAF backend's health can be checked via `GET {MAF_URL}/health` (returns `{ "status": "Healthy" }`).

---

## Error Codes

All three routes share a common error response format:

```json
{
  "error": "Description of the error",
  "details": { /* Optional: additional context (e.g., Zod validation errors) */ }
}
```

### Summary Table

| Status | Code | Description | Routes |
|--------|------|-------------|--------|
| `400` | Bad Request | Invalid JSON body, validation failure, or missing required fields | All |
| `400` | Bad Request | Non-streaming mode requested (not supported) | `/api/chat` |
| `401` | Unauthorized | Missing or invalid Clerk authentication token | All |
| `401` | Unauthorized | API key authentication failed with provider | `/api/chat`, `/api/a2ui-chat` |
| `429` | Rate Limited | Provider rate limit exceeded | `/api/chat`, `/api/a2ui-chat` |
| `500` | Internal Error | Clerk authentication threw an exception | `/api/maf/chat` |
| `500` | Internal Error | Unexpected server error | All |
| `502` | Bad Gateway | Failed to connect to MAF backend | `/api/maf/chat` |
| `503` | Service Unavailable | Network error or provider unreachable | `/api/chat`, `/api/a2ui-chat` |
| `503` | Service Unavailable | MAF backend not configured (`NEXT_PUBLIC_MAF_URL` missing) | `/api/maf/chat` |

### Error Handling Behavior

All three routes catch errors and classify them by inspecting the error message:

| Error Pattern | Status | Response |
|---------------|--------|----------|
| `"API key"` or `"authentication"` | `401` | `"Authentication failed. Please check your API key configuration."` |
| `"fetch"` or `"network"` | `503` | `"Network error. Please check your connection and try again."` |
| `"rate limit"` or `"429"` | `429` | `"Rate limit exceeded. Please try again later."` |
| Any other error | `500` | `"An unexpected error occurred. Please try again."` |

---

## Provider Configuration

### Environment Variables

All provider configuration is managed through environment variables. Copy [`.env.example`](../.env.example) to `.env.local` and fill in your keys.

#### Zhipu AI (Used by `/api/chat` and `/api/a2ui-chat`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ZHIPU_API_KEY` | Yes | — | API key for Zhipu AI (GLM-4.7) |
| `ZHIPU_BASE_URL` | Yes | — | Base URL for the Zhipu API (e.g., `https://api.z.ai/api/paas/v4`) |
| `ZHIPU_MODEL` | No | `glm-4.7` | Model name to use |

#### MAF Backend (Used by `/api/maf/chat`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_MAF_URL` | No* | `http://localhost:5555` | Base URL for the MAF standalone backend |

> \* If `NEXT_PUBLIC_MAF_URL` is not set, the `/api/maf/chat` route returns `503 Service Unavailable`.

#### Clerk Authentication (Used by all routes)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (client-side) |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (server-side) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Custom sign-in URL (default: `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Custom sign-up URL (default: `/sign-up`) |

### Provider Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  ChatSidebar │  │  Canvas Page │  │  useMafChat Hook  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                 │                    │             │
└─────────┼─────────────────┼────────────────────┼─────────────┘
          │                 │                    │
          ▼                 ▼                    ▼
   ┌─────────────┐  ┌──────────────┐   ┌───────────────┐
   │ /api/chat   │  │/api/a2ui-chat│   │ /api/maf/chat │
   └──────┬──────┘  └──────┬───────┘   └───────┬───────┘
          │                │                    │
          ▼                ▼                    ▼
   ┌──────────────────────────────┐    ┌───────────────┐
   │     Zhipu AI (GLM-4.7)      │    │  MAF Backend   │
   │  (via zhipu-ai-provider SDK │    │ (standalone)   │
   │   or direct HTTP fetch)     │    │                │
   └──────────────────────────────┘    └───────────────┘
```

---

## Streaming Behavior

### `/api/chat` — Vercel AI SDK Stream

- **Transport:** Chunked transfer encoding (`text/plain`)
- **SDK:** Uses [`streamText()`](../app/api/chat/route.ts:792) from the `ai` package with [`result.toTextStreamResponse()`](../app/api/chat/route.ts:803)
- **Format:** Incremental text chunks decoded by the Vercel AI SDK client
- **Client consumption:** Use the `useChat` hook from `@ai-sdk/react` or the `streamText` utility

### `/api/a2ui-chat` — SSE Passthrough

- **Transport:** Server-Sent Events (`text/event-stream`)
- **SDK:** Direct `fetch()` to Zhipu API — response body is passed through as-is
- **Format:** SSE events from the Zhipu API
- **Headers:** `Cache-Control: no-cache`, `Connection: keep-alive`
- **Client consumption:** Use `EventSource` or a fetch-based SSE reader

### `/api/maf/chat` — Proxied Stream

- **Transport:** Chunked transfer encoding (`text/plain; charset=utf-8`)
- **SDK:** Proxied from the MAF backend's streaming response
- **Format:** Raw text chunks from the MAF backend
- **Client consumption:** Use the [`MafClient.chatStream()`](../lib/maf/client.ts:75) async generator or the [`useMafChat`](../lib/maf/use-maf-chat.ts:51) hook

### Comparison

| Feature | `/api/chat` | `/api/a2ui-chat` | `/api/maf/chat` |
|---------|-------------|------------------|-----------------|
| Content-Type | `text/plain` | `text/event-stream` | `text/plain` |
| SDK | Vercel AI SDK | Direct fetch | Proxied fetch |
| System prompt | Yes (UI + A2UI catalog) | Yes (A2UI-only catalog) | No (backend manages) |
| Max tokens default | 4,000 | 16,000 | Backend-defined |
| Max tokens limit | 8,000 | 32,000 | Backend-defined |
| Accepts `prompt` | Yes | No | No (uses `message`) |
| Non-streaming | Not supported | Not supported | Not supported |

---

## Related Documentation

- [Authentication Guide](../AUTHENTICATION.md) — Clerk setup and configuration
- [A2UI Library](../lib/a2ui/README.md) — A2UI component catalog and rendering
- [MAF Types](../lib/maf/types.ts) — TypeScript types for MAF communication
- [MAF Client](../lib/maf/client.ts) — HTTP client for the MAF backend
- [MAF Config](../lib/maf/config.ts) — MAF backend configuration
