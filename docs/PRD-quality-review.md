# Generous Works — Quality Review PRD

**Date:** 2026-04-25  
**Branch:** `chore/quality-review-and-fixes`  
**Author:** Claude Code (automated review)  
**Status:** In Progress

---

## Executive Summary

A full-stack quality review of the Generous Works application identified 4 critical security issues, 10 important quality gaps, 6 testing deficiencies, 4 accessibility gaps, and several documentation gaps. This document captures all findings and tracks the implementation of fixes.

The app is a Next.js 16 / React 19 AI chat canvas with Clerk authentication, Vercel AI SDK, Zustand state persistence, and an impressive 114-component A2UI rendering system. The core product is solid — the issues are primarily around security hardening, testing coverage, and production hygiene.

---

## Application Overview

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 (`strict: false`) |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york) |
| State | Zustand v5 with localStorage persistence |
| Authentication | Clerk v6 |
| AI / Streaming | Vercel AI SDK v6, Zhipu GLM-4.7 |
| Testing | Vitest v4, Testing Library, happy-dom |
| CI/CD | GitHub Actions → Vercel (auto-deploy on push) |

---

## Critical Issues (Security / Correctness)

### C1 — API Routes Have No Auth Enforcement
**Severity:** Critical  
**Files:** `app/api/chat/route.ts`, `app/api/a2ui-chat/route.ts`, `app/api/maf/chat/route.ts`

All three AI API routes accept unauthenticated POST requests. `middleware.ts` uses `auth.protect()` which redirects browsers to `/sign-in`, but programmatic HTTP clients (curl, scripts, automated bots) receive a redirect response and can trivially follow it or bypass it — the API will serve the request without a valid Clerk session. This allows anyone who discovers the endpoint to consume API credits without being authenticated.

**Fix:** Add `const { userId } = await auth()` from `@clerk/nextjs/server` at the top of each handler and return HTTP 401 if `userId` is null.

**Status:** ✅ Implemented

---

### C2 — Client-Controlled Model Parameters (Cost/Abuse Risk)
**Severity:** Critical  
**Files:** `app/api/chat/route.ts`, `app/api/a2ui-chat/route.ts`

`temperature` and `maxTokens` are read directly from the request body and forwarded to the AI provider with no clamping or validation. A caller can set `maxTokens: 999999` or an invalid `temperature` to run up costs or trigger provider errors.

**Fix:** Server-side clamp `temperature` to `[0, 2]` and `maxTokens` to `[1, 8000]`.

**Status:** ✅ Implemented

---

### C3 — `onKeyPress` Removed in React 19
**Severity:** Critical (silent breakage)  
**File:** `app/a2ui-chat/page.tsx:309`

`onKeyPress` was deprecated in React 17 and removed in React 19. The app uses React 19.2.3. The keyboard Enter-to-send shortcut in the A2UI Chat page silently does nothing.

**Fix:** Replace `onKeyPress` with `onKeyDown`; rename `handleKeyPress` to `handleKeyDown`.

**Status:** ✅ Implemented

---

### C4 — Stale Component Count Badge
**Severity:** Minor-Critical (misleading UI)  
**File:** `app/a2ui-chat/page.tsx:323,326`

Badge and description text hardcode "87 Components" while the registry validation test asserts 114+ total components are registered in the catalog.

**Fix:** Update badge and description text from "87" to "114".

**Status:** ✅ Implemented

---

## Important Quality Issues

### I1 — No Zod Validation on API Request Bodies
**Severity:** Important  
**Files:** `app/api/chat/route.ts`, `app/api/a2ui-chat/route.ts`

`messages` array content (role values, content types, array structure) and `prompt` are not validated against a schema before being forwarded to AI providers. Zod is already a project dependency and used throughout the component layer.

**Fix:** Add Zod schemas for each route's request body and validate at the handler entry point.

**Status:** ✅ Implemented

---

### I2 — Fragile Error Detection via String Matching
**Severity:** Important  
**File:** `app/api/chat/route.ts:804`

Error type classification uses `error.message.includes("rate limit")` and `error.message.includes("API key")`. If Zhipu or another provider changes error message wording, these checks silently stop working.

**Fix:** Add HTTP status code checks on provider errors in addition to (or instead of) string matching. Also wrap with try/catch specifically for provider SDK error types when available.

**Status:** 🔄 Partially mitigated by Zod validation + auth changes; full provider error type mapping is a future improvement.

---

### I3 — TypeScript Strict Mode Disabled
**Severity:** Important (long-term)  
**File:** `tsconfig.json`

`"strict": false` disables `strictNullChecks`, `noImplicitAny`, and other safety features. The codebase has 206 uses of `as any` / `@ts-ignore`. Four adapter files are excluded from compilation entirely.

**Fix:** Enable strict mode incrementally — this is high effort and risky to do in one pass. Track as a follow-up initiative with a dedicated branch per adapter file.

**Status:** 🔜 Deferred — requires per-file remediation work

---

### I4 — A2UI Action Handling is a TODO
**Severity:** Important (product gap)  
**File:** `lib/a2ui/renderer.tsx:974,1018`

Both `A2UIRenderer` and `SimpleA2UIRenderer` have `// TODO: Implement action handling` at their action dispatcher points. Interactive component actions (button clicks, form submits, select changes) are no-ops that log to the console only.

**Status:** 🔜 Deferred — requires product design decision on action routing

---

### I5 — CI Lint and Coverage Jobs Use `continue-on-error`
**Severity:** Important  
**File:** `.github/workflows/ci.yml`

The lint step and coverage job both use `continue-on-error: true`, meaning linting can fail completely and coverage can regress without blocking any PR merge. These failures are invisible to reviewers.

**Fix:** Remove `continue-on-error: true` from the lint step. Keep it on coverage (coverage failures should warn, not block) but add explicit reporting.

**Status:** ✅ Implemented

---

### I6 — Module-Level `console.log` in `lib/store.ts`
**Severity:** Important  
**File:** `lib/store.ts:317`

```js
console.log('[DEBUG] lib/store.ts - useUIComponents hook created');
```

This statement lives at module scope (outside any function), so it fires once per module evaluation — i.e., on every page load in the browser. While `next.config.ts` strips console calls in production builds, this still fires in development and test environments.

**Fix:** Remove the stray log statement.

**Status:** ✅ Implemented

---

### I7 — No Route-Level Error/Loading Segments
**Severity:** Important  
**Files:** `app/` directory

No `loading.tsx` or `error.tsx` files exist in any route directory. Errors in async Server Components bubble up to a blank Next.js error page with no user-friendly messaging.

**Fix:** Add `error.tsx` and `loading.tsx` at the root `app/` level and for key routes (`app/canvas/`).

**Status:** ✅ Implemented

---

### I8 — Dark Mode CSS Defined but Permanently Inactive
**Severity:** Minor  
**File:** `app/globals.css`

A full `.dark` theme with `oklch()` color variables is defined but there is no ThemeProvider, `next-themes` integration, or toggle UI in the app. Users cannot access dark mode.

**Status:** 🔜 Deferred — requires product decision; adding toggle is a new feature, not a fix

---

### I9 — No Prettier Config, No Pre-commit Hooks
**Severity:** Minor  
**Files:** repo root

Code formatting is entirely unenforced. Combined with `@typescript-eslint/no-explicit-any` being a warning rather than an error, quality enforcement relies solely on reviewer discretion.

**Fix:** Add `.prettierrc` with standard settings.

**Status:** ✅ Implemented

---

## Testing Gaps

### T1 — No Tests for API Routes
**Severity:** High  
**Files:** `app/api/*/route.ts`

None of the three API route handlers have any tests. Auth bypass, missing env vars, bad inputs, streaming behavior, and error paths are all untested.

**Fix:** Add Vitest unit tests for `/api/chat` and `/api/a2ui-chat` covering: unauthenticated request, valid request, invalid body shape, missing API key.

**Status:** ✅ Implemented

---

### T2 — No Tests for Zustand Store
**Severity:** Medium  
**File:** `lib/store.ts`

The global state store has no tests. Message adding/removing, UIComponent CRUD, loading/error state, and localStorage persistence are all untested.

**Fix:** Add unit tests for all store actions and selector hooks.

**Status:** ✅ Implemented

---

### T3 — Coverage Scope Artificially Narrowed
**Severity:** Medium  
**File:** `vitest.config.ts`

Coverage `include` only covers `lib/**` and `components/tool-ui/shared/**`. The `components/ai-elements/` directory and `app/api/` routes are excluded, making reported coverage percentages misleading.

**Fix:** Expand `include` to also cover `components/ai-elements/**` and `app/api/**`.

**Status:** ✅ Implemented

---

### T4 — Debug Test Artifact Present
**Severity:** Minor  
**File:** `vitest-fix-verification.test.ts`

A verification test file from a prior debugging session exists at the repo root. It provides no ongoing test value and inflates the test count.

**Fix:** Delete the file.

**Status:** ✅ Implemented

---

### T5 — No E2E Tests
**Severity:** Medium (long-term)  
**Note:** README references `tests/e2e/` directory that does not exist.

No Playwright or Cypress setup is present. The streaming AI routes, Clerk auth flow, and A2UI rendering pipeline have zero integration or E2E coverage.

**Status:** 🔜 Deferred — large infrastructure addition; requires separate initiative

---

### T6 — No Tests for `generative-message` or `hybrid-renderer`
**Severity:** Medium  
**Files:** `components/ai-elements/generative-message.tsx`, `components/ai-elements/hybrid-renderer.tsx`

The core rendering pipeline (message parsing → block routing → component rendering) has no tests.

**Status:** 🔜 Deferred — complex mocking requirements; tracked for follow-up

---

## Accessibility Gaps

### A1 — No `aria-label` on Sign-In Button
**File:** `app/layout.tsx:108`  
The Sign In button in the header has no `aria-label`. Screen readers announce it as an unlabelled button.

**Status:** ✅ Fixed

---

### A2 — No `aria-live` Region for Streaming Indicator
**File:** `components/ai-elements/generative-message.tsx`  
The pulsing "streaming" indicator has no `aria-live` announcement. Screen readers have no way to know a response is being generated.

**Status:** ✅ Fixed

---

### A3 — Icon-Only Send Button Has No Accessible Text
**File:** `app/a2ui-chat/page.tsx`  
The Send button renders only a `<Send>` SVG icon with no `aria-label`.

**Status:** ✅ Fixed

---

### A4 — Canvas Nav Dropdown Missing `aria-expanded`
**File:** `app/canvas/page.tsx`  
The collapsible nav toggle button has no `aria-expanded` or `aria-controls` attributes.

**Status:** 🔜 Deferred — requires reading more of the canvas page; tracked for follow-up

---

## Documentation Gaps

### D1 — README References Non-Existent `tests/e2e/` Directory
**File:** `README.md`

**Status:** ✅ Fixed

---

### D2 — No Deployment Documentation
The Vercel auto-deploy flow is implicit and undocumented. Developers joining the project don't know how deployments are triggered or how to set up preview environments.

**Status:** ✅ Added to README

---

## Implementation Phases

### Phase A — Critical Fixes (Completed)
- [x] C1: Add `auth()` guard to all 3 API routes
- [x] C2: Clamp `temperature` and `maxTokens` server-side
- [x] C3: Fix `onKeyPress` → `onKeyDown`
- [x] C4: Fix stale "87 Components" badge → "114"
- [x] I6: Remove module-scope `console.log` from `lib/store.ts`

### Phase B — Quality Improvements (Completed)
- [x] I1: Add Zod validation to API request bodies
- [x] I5: Remove `continue-on-error` from CI lint step
- [x] I7: Add `error.tsx` and `loading.tsx` route segments
- [x] I9: Add `.prettierrc`
- [x] A1–A3: Accessibility fixes

### Phase C — Testing (Completed)
- [x] T1: API route tests (`/api/chat`, `/api/a2ui-chat`)
- [x] T2: Zustand store tests
- [x] T3: Expand coverage scope in `vitest.config.ts`
- [x] T4: Remove debug test artifact

### Phase D — Deferred (Future Sprints)
- [ ] I2: Improve provider error type handling
- [ ] I3: Enable TypeScript strict mode incrementally
- [ ] I4: Implement A2UI action handling
- [ ] I8: Add dark mode toggle
- [ ] A4: Fix canvas nav `aria-expanded`
- [ ] T5: Set up Playwright E2E test suite
- [ ] T6: Add tests for `generative-message` / `hybrid-renderer`

---

## Success Metrics

| Metric | Before | After |
|---|---|---|
| Unauthenticated API access | ✅ Allowed (bug) | ❌ Blocked (HTTP 401) |
| Client-controlled maxTokens | Unbounded | Clamped to 8000 |
| Module-scope console.log | 1 (on every import) | 0 |
| stale component count | "87" | "114" |
| API route test coverage | 0 tests | Covered |
| Store test coverage | 0 tests | Covered |
| CI lint enforcement | Non-blocking | Blocking |
| Coverage measurement scope | lib/ + tool-ui/shared/ | + ai-elements/ + api/ |
| Route error handling | No error.tsx | Root + canvas error boundaries |
| React 19 keyboard handler | Broken (onKeyPress) | Fixed (onKeyDown) |
