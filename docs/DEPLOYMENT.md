# Deployment Guide

This document covers the complete deployment workflow for Generous Works — from environment setup through production deployment on Vercel, including CI/CD pipeline configuration and troubleshooting.

> **Related documents:**
> - [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — System architecture and data flow
> - [`docs/API.md`](API.md) — API route reference
> - [`AUTHENTICATION.md`](../AUTHENTICATION.md) — Clerk authentication setup
> - [`.env.example`](../.env.example) — Full environment variable template

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deploying to Vercel](#deploying-to-vercel)
- [CI/CD Pipeline](#cicd-pipeline)
- [Build Configuration](#build-configuration)
- [Custom Domain Setup](#custom-domain-setup)
- [Monitoring & Debugging](#monitoring--debugging)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## Overview

Generous Works is a **Next.js 16** application deployed on [Vercel](https://vercel.com). The deployment model leverages:

| Aspect | Detail |
|---|---|
| **Platform** | Vercel (serverless functions + edge runtime) |
| **Framework** | Next.js 16 with App Router |
| **Build Tool** | Turbopack (primary), Webpack (fallback) |
| **Domain** | [generous.works](https://generous.works) |
| **CI/CD** | GitHub Actions → Vercel auto-deploy |
| **Auth** | Clerk v6 (middleware-protected routes) |
| **AI Providers** | Zhipu (default), OpenAI, Anthropic, Google |

### Deployment Architecture

```
GitHub Push/PR
     │
     ▼
GitHub Actions CI ──────► Lint → Test → Build → Upload Artifacts
     │
     ▼
Vercel Git Integration ──► Auto-build & Deploy
     │
     ├── Production  (main/master branch → generous.works)
     ├── Preview     (PR branches → preview-*.vercel.app)
     └── Development (local → localhost:3000)
```

---

## Prerequisites

Before deploying, ensure you have:

- [ ] **Vercel account** — [sign up](https://vercel.com/signup) (free tier works)
- [ ] **Vercel CLI** (optional) — `npm i -g vercel`
- [ ] **GitHub repository** — code hosted on GitHub with Vercel integration enabled
- [ ] **Clerk application** — created at [dashboard.clerk.com](https://dashboard.clerk.com/)
- [ ] **At least one AI provider API key** — Zhipu GLM-4.7 is the default
- [ ] **Node.js 20.x** — matching the CI environment

---

## Environment Variables

Environment variables are managed through the **Vercel Dashboard** → Project → Settings → Environment Variables. They can also be set via the [Vercel CLI](https://vercel.com/docs/cli).

### Required Variables

These must be configured for the application to function:

| Variable | Description | Example |
|---|---|---|
| `ZHIPU_API_KEY` | Zhipu AI API key (default provider) | `your-zhipu-api-key` |
| `ZHIPU_BASE_URL` | Zhipu API base URL | `https://api.z.ai/api/paas/v4` |
| `ZHIPU_MODEL` | Zhipu model identifier | `glm-4.7` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (client-side) | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side) | `sk_test_...` |

### Optional Variables

| Variable | Description | Default |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key | — |
| `OPENAI_MODEL` | OpenAI model identifier | `gpt-4-turbo` |
| `ANTHROPIC_API_KEY` | Anthropic API key | — |
| `ANTHROPIC_MODEL` | Anthropic model identifier | `claude-3-sonnet` |
| `GOOGLE_API_KEY` | Google AI API key | — |
| `GOOGLE_MODEL` | Google model identifier | `gemini-pro` |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway API key | — |
| `NEXT_PUBLIC_MAF_URL` | MAF backend URL (enables MAF integration) | — |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Custom sign-in route | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Custom sign-up route | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Post-sign-in redirect | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Post-sign-up redirect | `/` |

### Turbopack Variables (Optional)

| Variable | Description | Default |
|---|---|---|
| `TURBOPACK` | Enable Turbopack | `1` |
| `TURBOPACK_MEMORY_LIMIT` | Memory limit in MB | `4096` |

### Setting Variables via Vercel CLI

```bash
# Set a single variable (production)
vercel env add ZHIPU_API_KEY production

# Set a variable for all environments
vercel env add ZHIPU_API_KEY preview development

# Pull all environment variables locally
vercel env pull .env.local
```

### Setting Variables via Vercel Dashboard

1. Navigate to **vercel.com/dashboard** → select your project
2. Go to **Settings** → **Environment Variables**
3. Add each variable with the appropriate scope:
   - **Production** — live site
   - **Preview** — PR previews
   - **Development** — local development (via `vercel dev`)

> **Important:** Never commit `.env` or `.env.local` files to the repository. The [`.gitignore`](../.gitignore) file excludes these patterns.

---

## Deploying to Vercel

### Method 1: Git Integration (Recommended)

This is the standard deployment method — Vercel automatically builds and deploys on every push.

#### Initial Setup

1. **Import the project** in the [Vercel Dashboard](https://vercel.com/new):
   - Connect your GitHub account
   - Select the `Generous-Works` repository
   - Vercel auto-detects Next.js and configures build settings

2. **Configure build settings** (auto-detected, but verify):
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm ci`
   - **Node.js Version:** 20.x

3. **Add environment variables** — see [Environment Variables](#environment-variables)

4. **Deploy** — click "Deploy" and wait for the build to complete

#### Ongoing Deploys

After initial setup, deployments are automatic:

| Event | Target | URL |
|---|---|---|
| Push to `main`/`master` | Production | `generous.works` |
| Push to any other branch | Preview | `preview-<hash>-generous-works.vercel.app` |
| Open/re-push to a PR | Preview | `preview-<hash>-generous-works.vercel.app` |

### Method 2: Vercel CLI

For manual or scripted deployments:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Log in to Vercel
vercel login

# Deploy to preview (from project root)
vercel

# Deploy to production
vercel --prod
```

### Method 3: Vercel API / Programmatic

For advanced CI/CD integrations:

```bash
# Deploy using a Vercel token (for CI environments)
vercel --token=$VERCEL_TOKEN --prod --yes
```

---

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration, defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

### CI Workflow

**Trigger:** Push to `main`/`master`/`testing-infrastructure` or pull requests to `main`/`master`.

```
┌──────────────────────────────────────────────────────────┐
│  CI Pipeline                                             │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │  Checkout    │──►│  Setup Node │──►│  npm ci      │  │
│  └─────────────┘   │  20.x       │   └──────────────┘  │
│                    └─────────────┘                      │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │  ESLint     │──►│  Vitest     │──►│  A2UI Registry│  │
│  │  (lint)     │   │  (test:run) │   │  Validation  │  │
│  └─────────────┘   └─────────────┘   └──────────────┘  │
│                                                          │
│  ┌─────────────┐   ┌──────────────┐                     │
│  │  next build │──►│  Upload      │                     │
│  │             │   │  Artifacts   │                     │
│  └─────────────┘   └──────────────┘                     │
│                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Test Coverage (runs after Test & Build)        │    │
│  │  npm run test:coverage → Upload coverage report │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### CI Jobs

#### 1. Test & Build

| Step | Command | Purpose |
|---|---|---|
| Checkout | `actions/checkout@v4` | Clone the repository |
| Setup Node.js | `actions/setup-node@v4` | Configure Node 20.x with npm cache |
| Install | `npm ci` | Clean install from lockfile |
| Lint | `npm run lint` | ESLint checks |
| Unit Tests | `npm run test:run` | Run all Vitest tests |
| Registry Validation | `npm run test:run -- lib/a2ui/__tests__/registry-validation.test.ts` | Validate A2UI component registry |
| Build | `npm run build` | Production Next.js build |
| Upload Artifacts | `actions/upload-artifact@v4` | Save `.next/` for 7 days |

#### 2. Test Coverage

Runs after the Test & Build job completes successfully:

| Step | Command | Purpose |
|---|---|---|
| Install & Test | `npm run test:coverage` | Generate coverage report |
| Upload Coverage | `actions/upload-artifact@v4` | Save `coverage/` for 30 days |

### Claude Code Workflow

The [`.github/workflows/claude.yml`](../.github/workflows/claude.yml) workflow enables AI-assisted code review:

- **Trigger:** `@claude` mention in issues, PR comments, or reviews
- **Security:** Only the repository owner can trigger it
- **Requires:** `CLAUDE_CODE_OAUTH_TOKEN` secret in GitHub repository settings

### Required GitHub Secrets

Configure these in **GitHub Repository** → Settings → Secrets and variables → Actions:

| Secret | Description | Required For |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Anthropic Claude Code OAuth token | Claude Code workflow |

> **Note:** AI provider API keys are not needed in GitHub Secrets because the CI pipeline only runs linting, tests, and builds — it does not execute API calls to AI providers.

---

## Build Configuration

### Next.js Configuration

The [`next.config.ts`](../next.config.ts) file configures:

- **Turbopack rules** — LESS files ignored via `ignore-loader`
- **Package transpilation** — `@knight-lab/timelinejs` transpiled for compatibility
- **Image optimization** — AVIF + WebP formats, responsive device sizes
- **Console removal** — `console.*` stripped in production builds
- **Webpack fallback** — LESS file handling, TimelineJS SSR externals, filesystem caching

### Build Commands

| Command | Description | Use Case |
|---|---|---|
| `npm run build` | Standard production build | Vercel deploys, CI |
| `npm run build:turbo` | Turbopack production build | Faster local builds |
| `npm run dev` | Dev server with Turbopack | Local development |
| `npm run dev:webpack` | Dev server with Webpack | Debugging build issues |

### Runtime Configurations

The application uses multiple Next.js runtime modes:

| Route | Runtime | File |
|---|---|---|
| OpenGraph image generation | Edge | [`app/opengraph-image.tsx`](../app/opengraph-image.tsx) |
| API routes | Node.js (default) | [`app/api/chat/route.ts`](../app/api/chat/route.ts), [`app/api/a2ui-chat/route.ts`](../app/api/a2ui-chat/route.ts) |
| Pages | Node.js (default) | [`app/page.tsx`](../app/page.tsx), [`app/canvas/page.tsx`](../app/canvas/page.tsx) |

---

## Custom Domain Setup

The production site is served at [generous.works](https://generous.works).

### Configuring in Vercel

1. Go to **Vercel Dashboard** → Project → **Settings** → **Domains**
2. Add `generous.works`
3. Configure DNS with your domain registrar:
   - **A Record:** `76.76.21.21` (Vercel's IP)
   - **CNAME:** `cname.vercel-dns.com` (alternative)
4. Wait for SSL certificate provisioning (automatic)

### Sitemap and SEO

The application generates a dynamic sitemap at [`/sitemap.xml`](../app/sitemap.ts) with all public routes. The [`robots.txt`](../public/robots.txt) file is served from the `public/` directory.

---

## Monitoring & Debugging

### Vercel Dashboard

- **Deployment logs** — real-time build output and errors
- **Function logs** — serverless function execution logs
- **Analytics** — Web Vitals (Core Web Vitals, custom events)
- **Speed Insights** — real-user performance data

### Viewing Logs

```bash
# View deployment logs via CLI
vercel logs <deployment-url>

# Stream real-time logs
vercel logs <deployment-url> --follow
```

### Local Production Testing

Before pushing, test the production build locally:

```bash
# Build and start locally
npm run build
npm run start

# Or use Vercel's local development emulator
vercel dev
```

---

## Troubleshooting

### Build Failures

#### `next build` fails with memory errors

The project includes heavy dependencies (Three.js, deck.gl, Phaser, amCharts). If the build runs out of memory:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

In Vercel, set the `NODE_OPTIONS` environment variable to `--max-old-space-size=4096`.

#### LESS file import errors

LESS files from `@knight-lab/timelinejs` are handled by both Turbopack and Webpack configurations in [`next.config.ts`](../next.config.ts). If you see LESS-related errors:

1. Verify the `ignore-loader` dependency is installed: `npm ls ignore-loader`
2. Check that the Turbopack rules in `next.config.ts` include the `*.less` pattern
3. Clear the build cache: `npm run clean:turbo` then rebuild

#### Turbopack build issues

If Turbopack-specific issues occur:

```bash
# Fall back to Webpack build
npm run build  # uses Webpack by default in production

# Or explicitly use Webpack dev server
npm run dev:webpack
```

### Runtime Errors

#### Authentication errors (401)

- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set correctly
- Ensure Clerk dashboard has the correct domain configured under **Paths** → **Domain**
- Check that the Vercel deployment URL is added to Clerk's allowed origins

#### AI provider errors (500)

- Verify the relevant API key environment variable is set for the correct environment (Production/Preview/Development)
- Check API key validity and remaining quota
- The default provider is Zhipu (`ZHIPU_API_KEY`); ensure it's configured

#### MAF integration not working

- Set `NEXT_PUBLIC_MAF_URL` to the MAF backend URL
- Verify the MAF backend is accessible from Vercel's serverless functions
- Check [`lib/maf/config.ts`](../lib/maf/config.ts) for configuration details

### Environment Variable Issues

```bash
# Pull current Vercel environment variables locally
vercel env pull .env.local

# Verify a specific variable is set
vercel env ls
```

Common issues:
- **`NEXT_PUBLIC_` prefix required** for client-side variables (Clerk publishable key, MAF URL)
- **Server-only variables** (API keys, Clerk secret) must NOT have the `NEXT_PUBLIC_` prefix
- **Redeploy required** after changing environment variables in the Vercel dashboard

---

## Rollback Procedures

### Via Vercel Dashboard

1. Go to **Vercel Dashboard** → Project → **Deployments**
2. Find the last known-good deployment
3. Click the **⋯** menu → **Promote to Production**

### Via Vercel CLI

```bash
# List recent deployments
vercel ls

# Promote a specific deployment to production
vercel promote <deployment-url>
```

### Via Git

```bash
# Revert to a previous commit
git revert <commit-hash>
git push origin main

# Vercel will automatically deploy the reverted commit
```

### Emergency: Redeploy Current Code

If a deployment is broken but the code is correct:

1. Go to **Vercel Dashboard** → **Deployments**
2. Find the failing deployment
3. Click **⋯** → **Redeploy**
4. Optionally check "Use existing Build Cache" to skip the build step

---

## Quick Reference

### Deployment Checklist

- [ ] All tests passing: `npm run test:run`
- [ ] Lint clean: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables set in Vercel Dashboard
- [ ] Clerk domain configuration matches deployment URL
- [ ] AI provider API keys valid with sufficient quota

### Key URLs

| Resource | URL |
|---|---|
| Production | [generous.works](https://generous.works) |
| Vercel Dashboard | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Clerk Dashboard | [dashboard.clerk.com](https://dashboard.clerk.com/) |
| GitHub Actions | [github.com/davincidreams/Generous-Works/actions](https://github.com/davincidreams/Generous-Works/actions) |

### Key Files

| File | Purpose |
|---|---|
| [`next.config.ts`](../next.config.ts) | Next.js build and runtime configuration |
| [`middleware.ts`](../middleware.ts) | Clerk auth middleware (route protection) |
| [`.env.example`](../.env.example) | Environment variable template |
| [`package.json`](../package.json) | Build scripts and dependencies |
| [`app/sitemap.ts`](../app/sitemap.ts) | Dynamic sitemap generation |
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | GitHub Actions CI pipeline |
