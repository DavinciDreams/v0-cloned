# Security

This document describes the security model, authentication architecture, API key handling, rate limiting, and security best practices for the Generous Works platform.

> **Related documents:**
> - [`AUTHENTICATION.md`](../AUTHENTICATION.md) — Clerk authentication setup and usage guide
> - [`docs/API.md`](API.md) — API route reference
> - [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — System architecture and data flow
> - [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) — Deployment and environment variable configuration
> - [`.env.example`](../.env.example) — Environment variable template

---

## Table of Contents

- [Overview](#overview)
- [Authentication Model](#authentication-model)
- [API Key Handling](#api-key-handling)
- [Rate Limiting](#rate-limiting)
- [Input Validation](#input-validation)
- [Data Protection](#data-protection)
- [Security Headers and Configuration](#security-headers-and-configuration)
- [CI/CD Security](#cicd-security)
- [Security Best Practices](#security-best-practices)
- [Reporting Vulnerabilities](#reporting-vulnerabilities)

---

## Overview

Generous Works is a streaming generative UI platform that integrates multiple AI providers behind an authenticated API layer. The security model is built on three pillars:

| Pillar | Implementation |
|---|---|
| **Authentication** | Clerk v6 with middleware-enforced route protection |
| **API Key Isolation** | All provider keys are server-side only, never exposed to the client |
| **Input Validation** | Zod schemas validate every API request before processing |

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Client)                                       │
│  ─ Clerk JWT (auto-managed)                             │
│  ─ NEXT_PUBLIC_* env vars only                          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + Clerk JWT
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Next.js Middleware (Edge)                              │
│  ─ Clerk session verification                           │
│  ─ Route-level access control                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  API Route Handlers (Server)                            │
│  ─ auth() identity check                                │
│  ─ Zod request validation                               │
│  ─ Provider API key access (process.env)                │
└──────────────────────┬──────────────────────────────────┘
                       │ Server-to-server (API keys)
                       ▼
┌─────────────────────────────────────────────────────────┐
│  External AI Providers                                  │
│  ─ Zhipu AI (default)                                   │
│  ─ OpenAI, Anthropic, Google (optional)                 │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication Model

Generous Works uses [Clerk](https://clerk.com/) v6 as its authentication provider, integrated via the `@clerk/nextjs` package. Authentication is enforced at two layers to ensure defense in depth.

### Supported Providers

| Provider | Type | Configuration |
|---|---|---|
| GitHub | OAuth 2.0 | [GitHub Developer Settings](https://github.com/settings/developers) |
| Discord | OAuth 2.0 | [Discord Developer Portal](https://discord.com/developers/applications) |
| Google | OAuth 2.0 | [Google Cloud Console](https://console.cloud.google.com/) |
| Email | Magic link / Password | Configured in Clerk Dashboard |

### Layer 1: Middleware Protection

The [`middleware.ts`](../middleware.ts) file protects all routes using Clerk's `clerkMiddleware`. This runs at the Edge before any route handler executes.

```typescript
// middleware.ts
const isPublicRoute = createRouteMatcher([
  '/',                // Public landing page
  '/sign-in(.*)',     // Sign-in flow
  '/sign-up(.*)',     // Sign-up flow
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: '/sign-in',
      unauthorizedUrl: '/sign-in',
    });
  }
});
```

**Public routes** — accessible without authentication:
- `/` — Landing page
- `/sign-in(.*)` — Sign-in pages
- `/sign-up(.*)` — Sign-up pages

**Protected routes** — all other routes, including:
- `/canvas` — Main application canvas
- `/api/(.*)` — All API endpoints
- `/trpc/(.*)` — tRPC endpoints

The middleware matcher explicitly excludes static assets:

```typescript
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### Layer 2: Route Handler Verification

Every API route handler performs an additional identity check using [`auth()`](../AUTHENTICATION.md) from `@clerk/nextjs/server`:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // ... proceed with authenticated request
}
```

This dual-layer approach ensures that even if middleware is bypassed or misconfigured, individual route handlers reject unauthenticated requests.

### Session Management

Clerk manages sessions automatically:

- **JWT tokens** — Automatically included in requests by the Clerk client SDK
- **Token rotation** — Handled by Clerk transparently
- **Session expiry** — Configured in the Clerk Dashboard
- **Sign-out** — Available via the `UserButton` component or programmatically via [`useClerk().signOut()`](../AUTHENTICATION.md)

### ClerkProvider Configuration

The application root is wrapped in [`<ClerkProvider>`](../app/layout.tsx) which provides authentication context to all components:

```typescript
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {/* ... */}
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      {/* ... */}
    </ClerkProvider>
  );
}
```

---

## API Key Handling

Generous Works integrates with multiple AI providers. All API keys are handled exclusively on the server side and are never exposed to the client.

### Key Classification

| Variable | Scope | Exposure | Description |
|---|---|---|---|
| `CLERK_SECRET_KEY` | Server-only | **Never** sent to client | Clerk server-side API key |
| `ZHIPU_API_KEY` | Server-only | **Never** sent to client | Zhipu AI provider key |
| `OPENAI_API_KEY` | Server-only | **Never** sent to client | OpenAI provider key |
| `ANTHROPIC_API_KEY` | Server-only | **Never** sent to client | Anthropic provider key |
| `GOOGLE_API_KEY` | Server-only | **Never** sent to client | Google AI provider key |
| `AI_GATEWAY_API_KEY` | Server-only | **Never** sent to client | Vercel AI Gateway key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client + Server | **Public** (intentional) | Clerk publishable key (designed for client use) |
| `NEXT_PUBLIC_MAF_URL` | Client + Server | **Public** (intentional) | MAF backend URL |

### How Keys Are Accessed

API keys are read from `process.env` exclusively within server-side code (API route handlers):

```typescript
// app/api/chat/route.ts (server-only)
const zhipu = createZhipu({
  baseURL: process.env.ZHIPU_BASE_URL,
  apiKey: process.env.ZHIPU_API_KEY,
});
```

The `NEXT_PUBLIC_` prefix in Next.js causes a variable to be bundled into client-side JavaScript. Only variables that are explicitly designed for public use (like `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) use this prefix.

### Environment Variable Management

| Environment | Storage Mechanism |
|---|---|
| **Local development** | `.env.local` file (excluded from Git via [`.gitignore`](../.gitignore)) |
| **Vercel deployment** | Vercel Dashboard → Settings → Environment Variables (encrypted at rest) |
| **CI/CD** | GitHub Actions secrets (for any keys needed during build/test) |

The [`.gitignore`](../.gitignore) file excludes all `.env*` files:

```gitignore
# env files (can opt-in for committing if needed)
.env*
```

The [`.env.example`](../.env.example) file serves as a template with placeholder values:

```bash
# Replace values with your actual API keys before use
ZHIPU_API_KEY=your-zhipu-api-key
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

### Key Rotation

When rotating API keys:

1. Generate a new key from the provider's dashboard
2. Update the environment variable in all environments:
   - **Vercel:** Dashboard → Settings → Environment Variables
   - **Local:** Update `.env.local`
3. Redeploy the application (Vercel redeploys automatically on env var changes)
4. Revoke the old key from the provider's dashboard
5. Verify the application functions correctly with the new key

---

## Rate Limiting

### Current Implementation

Rate limiting in Generous Works operates at the **provider level** rather than through application-level middleware. AI providers enforce their own rate limits, and the application handles provider rate limit errors gracefully.

### Provider Rate Limit Error Handling

The [`POST /api/chat`](../app/api/chat/route.ts:836) route handler catches rate limit responses from upstream AI providers:

```typescript
// app/api/chat/route.ts
if (error.message.includes("rate limit") || error.message.includes("429")) {
  return new Response(
    JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
    { status: 429, headers: { "Content-Type": "application/json" } }
  );
}
```

### Provider Rate Limits

Rate limits vary by provider and plan tier. Refer to each provider's documentation:

| Provider | Documentation |
|---|---|
| Zhipu AI (default) | [Zhipu API docs](https://open.bigmodel.cn/) |
| OpenAI | [OpenAI Rate Limits](https://platform.openai.com/docs/guides/rate-limits) |
| Anthropic | [Anthropic Rate Limits](https://docs.anthropic.com/en/api/rate-limits) |
| Google AI | [Google AI Rate Limits](https://ai.google.dev/pricing) |

### Recommendations for Production

For production deployments, consider adding application-level rate limiting:

1. **Vercel Edge Middleware** — Use [`@vercel/edge`](https://vercel.com/docs/functions/edge-middleware) or a rate-limiting solution to cap requests per user
2. **Upstash Ratelimit** — A Redis-based rate limiter compatible with Vercel Edge:
   ```typescript
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, "10 s"),
   });
   ```
3. **Clerk Metadata** — Use Clerk's user metadata to implement tiered rate limits

---

## Input Validation

All API endpoints use [Zod](https://zod.dev/) schemas to validate request bodies before processing. This prevents malformed, oversized, or malicious input from reaching AI providers.

### Chat API Validation

The [`chatRequestSchema`](../app/api/chat/route.ts:741) validates all requests to `/api/chat`:

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

### Input Clamping

Numeric inputs are clamped to safe ranges after validation:

| Parameter | Min | Max | Default |
|---|---|---|---|
| `temperature` | 0 | 2 | 0.7 |
| `maxTokens` | 1 | 8,000 | 4,000 |

```typescript
const clampedTemperature = Math.min(Math.max(Number(temperature) || 0.7, 0), 2);
const clampedMaxTokens = Math.min(Math.max(Math.floor(Number(maxTokens) || 4000), 1), 8000);
```

### A2UI Component Validation

All A2UI component specifications are validated at render time using Zod schemas defined in [`lib/schemas/`](../lib/schemas/index.ts). Each component type has a dedicated schema (e.g., [`charts.schema.ts`](../lib/schemas/charts.schema.ts), [`maps.schema.ts`](../lib/schemas/maps.schema.ts)) that validates the `data` and `options` props before rendering.

---

## Data Protection

### Client-Side Data

- **Conversation history** — Stored in the browser's `localStorage` via Zustand persistence middleware ([`lib/store.ts`](../lib/store.ts)). This data never leaves the client unless explicitly sent to an API endpoint.
- **Clerk tokens** — Managed by the Clerk SDK and stored in secure, HTTP-only cookies automatically.
- **No sensitive data in URLs** — Chat messages and API keys are never passed as URL parameters.

### Server-Side Data

- **No persistent storage** — API route handlers are stateless. The application does not maintain a database or server-side session store for chat history.
- **Request body parsing** — JSON request bodies are parsed with `req.json()` inside try/catch blocks to handle malformed input safely.
- **Error messages** — Production error responses are generic to avoid leaking internal details. Specific error information (API key errors, network errors) is only logged server-side via `console.error()`.

### Console Output in Production

The Next.js compiler is configured to strip `console.*` calls in production builds via [`next.config.ts`](../next.config.ts):

```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
},
```

This prevents sensitive debugging information from leaking to the browser console in production.

---

## Security Headers and Configuration

### HTTPS

- **Vercel deployment** — HTTPS is enforced automatically by Vercel with automatic TLS certificate management
- **Local development** — Uses `http://localhost:3000` (acceptable for development only)

### Content Security Policy

When deploying to production, configure Content Security Policy headers via `next.config.ts` or Vercel's `vercel.json` to restrict resource loading origins. This is especially important for:

- Clerk's JavaScript and iframe origins
- AI provider API endpoints
- Map tile servers (if using geospatial components)

### Static Asset Protection

The middleware matcher in [`middleware.ts`](../middleware.ts) explicitly skips static files and Next.js internals, preventing unnecessary authentication checks on public assets:

```typescript
'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
```

---

## CI/CD Security

The [GitHub Actions CI pipeline](../.github/workflows/ci.yml) follows security best practices:

| Practice | Implementation |
|---|---|
| **Dependency auditing** | `npm ci` fails on dependency conflicts |
| **Linting** | `npm run lint` enforces code standards |
| **Testing** | Unit tests and registry validation run on every push |
| **Build verification** | `npm run build` catches compilation errors |
| **Artifact retention** | Build artifacts are retained for 7 days, coverage for 30 days |
| **No secrets in CI** | Environment variables are not required for lint/test/build steps |

---

## Security Best Practices

### For Developers

#### 1. Never Commit Secrets

```bash
# ❌ Never do this
git add .env.local

# ✅ Verify .gitignore is working
git status --ignored
```

All `.env*` files are excluded by [`.gitignore`](../.gitignore). If a secret is accidentally committed:

1. Rotate the compromised key immediately
2. Remove the file from Git history using `git filter-branch` or `git filter-repo`
3. Force-push the cleaned history
4. Notify all collaborators

#### 2. Use `auth()` in Every API Route

Always verify authentication at the route handler level, even though middleware provides blanket protection:

```typescript
// ✅ Always verify identity in route handlers
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  // ... handle request
}
```

#### 3. Validate All Input with Zod

Never trust client-side input. Always validate request bodies with Zod schemas:

```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
  count: z.number().int().min(0).max(1000),
});

const result = schema.safeParse(await req.json());
if (!result.success) {
  return new Response(JSON.stringify({ error: 'Invalid input', details: result.error.flatten() }), {
    status: 400,
  });
}
```

#### 4. Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Check for known vulnerabilities
npm audit

# Fix automatically patchable vulnerabilities
npm audit fix
```

#### 5. Use Server-Only Environment Variables

Never prefix sensitive keys with `NEXT_PUBLIC_`:

```bash
# ❌ Exposed to client
NEXT_PUBLIC_ZHIPU_API_KEY=sk-...

# ✅ Server-only
ZHIPU_API_KEY=sk-...
```

### For Deployment

#### 1. Rotate Clerk Keys When Changing Environments

Use separate Clerk applications for development, staging, and production. Never share `CLERK_SECRET_KEY` across environments.

#### 2. Configure Clerk Dashboard Security

In the [Clerk Dashboard](https://dashboard.clerk.com/):

- Set **authorized redirect URLs** to only allow your production domain
- Enable **bot protection** for sign-in/sign-up flows
- Configure **session duration** appropriate for your security requirements
- Review **authorized origins** for API requests

#### 3. Monitor API Usage

- Monitor AI provider dashboards for unexpected usage spikes
- Set up billing alerts on provider accounts
- Use Vercel Analytics or logging to track API endpoint usage patterns

#### 4. Secure the MAF Backend

If using the MAF (Microsoft Agent Framework) integration:

- The MAF backend URL (`NEXT_PUBLIC_MAF_URL`) is exposed to the client by design
- Ensure the MAF backend has its own authentication layer
- Use HTTPS for the MAF backend URL in production
- Restrict network access to the MAF backend where possible

---

## Reporting Vulnerabilities

If you discover a security vulnerability in Generous Works:

1. **Do not** open a public GitHub issue
2. Report the vulnerability privately through [GitHub Security Advisories](https://github.com/security)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

The maintainers will acknowledge the report within 48 hours and provide a timeline for resolution.

---

## Security Checklist

Use this checklist when deploying or reviewing the application:

- [ ] All API keys are set via environment variables (not hardcoded)
- [ ] `.env.local` is not committed to Git
- [ ] Clerk middleware is active and protecting all non-public routes
- [ ] All API route handlers call `auth()` to verify identity
- [ ] Request bodies are validated with Zod schemas
- [ ] `CLERK_SECRET_KEY` and all provider API keys use server-only env vars (no `NEXT_PUBLIC_` prefix)
- [ ] Production build strips console output (`removeConsole` in [`next.config.ts`](../next.config.ts))
- [ ] HTTPS is enforced in production
- [ ] Dependencies are audited (`npm audit`)
- [ ] Clerk Dashboard is configured with correct authorized redirect URLs
- [ ] AI provider dashboards have billing alerts configured
