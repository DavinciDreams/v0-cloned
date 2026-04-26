# Generous Works — AI Agent Guide

Generous Works is a streaming generative UI platform: users type natural language prompts and the AI generates live, interactive React components in real time.

---

## Essential Commands

```bash
npm run dev          # Start dev server (Turbopack, port 3000)
npm run build        # Production build
npm run test:run     # Run all tests once (CI mode)
npm run test:ui      # Interactive test UI
npm run lint         # ESLint
npm run test:registry  # Validate A2UI component registry
```

---

## Key Architecture

### Dual rendering pipeline

The AI can respond with two formats, mixed in a single response:

1. **JSX rendering** — plain JSX strings for simple UI (Button, Card, form elements). Parsed and sandboxed by `components/ai-elements/jsx-preview.tsx`.
2. **A2UI JSON rendering** — structured JSON (`surfaceUpdate.components[].component`) for complex data-driven components (Charts, Maps, Timeline, ThreeScene, etc.). Parsed by `lib/a2ui/renderer.tsx`.

The `GenerativeMessage` component (`components/ai-elements/generative-message.tsx`) handles both: it streams markdown and detects embedded JSX blocks or A2UI JSON, rendering each inline.

### A2UI adapter system

- `lib/a2ui/catalog.ts` — component catalog; also generates the system prompt section that tells the AI what components exist
- `lib/a2ui/renderer.tsx` — parses A2UI JSON, looks up adapters, renders components
- `lib/a2ui/adapter.ts` — interface for adapters
- `lib/a2ui/adapters/` — one file per component category (button, card, charts, maps, etc.)

### API routes

- `app/api/chat/route.ts` — main chat endpoint; AI provider config lives here
- `app/api/a2ui-chat/route.ts` — A2UI-specific endpoint

### State

- `lib/store.ts` — Zustand v5 store; `useMessages()`, `useAppState()`

---

## Component Conventions

Full detail: `.claude/skills/new-component/SKILL.md`

Short version:
- AI elements live in `components/ai-elements/`, UI primitives in `components/ui/`
- AI elements: `"use client"`, arrow function, named export, `cn()` for className
- UI primitives: function declaration, `data-slot` attribute, `cva()` for variants
- Compound components: export `MyComponent`, `MyComponentHeader`, `MyComponentContent`, etc. from the same file
- `useEffect`: only primitive values in deps arrays — never objects, arrays, or functions (infinite loop risk)
- Icons: `lucide-react`; animations: `motion/react`; shared state: Zustand; local state: React hooks

---

## Important Constraints

- **TypeScript strict is OFF** — `"strict": false` in `tsconfig.json`. Write new code defensively but the compiler won't enforce it.
- **AI provider** — Default is Zhipu GLM-4.7, configured in `app/api/chat/route.ts` via `createZhipu()` from `zhipu-ai-provider`. To swap providers, import the relevant `@ai-sdk/*` package and update the `streamText` call.
- **No `as any`** — use `as unknown as TargetType` with a comment if you must escape the type system.
- **Tailwind CSS 4** — no inline `style={}` except for truly dynamic values.
- **Clerk v6 auth** — all routes are protected by default via `middleware.ts`. Auth keys are required in `.env.local` for local dev.

---

## Known Issues / TODOs

- **A2UI action handling is a TODO** — buttons and form elements rendered via A2UI JSON are currently no-ops. The renderer renders them but does not wire up event handlers. See `lib/a2ui/renderer.tsx`.
- **Dark mode CSS exists, no ThemeProvider yet** — CSS variables for dark mode are defined in `app/globals.css`, but there is no ThemeProvider or toggle in the app. Dark mode respects OS preference via `prefers-color-scheme` only.
- **Calendar navigation** — calendar component's prev/next navigation buttons are non-functional (TODO).
- **Charts export** — export button in Charts component is a placeholder; needs the amCharts export plugin.

---

## File Structure Quick Reference

```
app/
  page.tsx                    # Main chat UI
  api/chat/route.ts           # AI endpoint + system prompt builder
  api/a2ui-chat/route.ts      # A2UI endpoint

components/
  ui/                         # 25 shadcn/Radix primitives
  ai-elements/                # 90 AI chat + visualization components
  tool-ui/                    # 18 tool call visualization components

lib/
  a2ui/
    catalog.ts                # THE source of truth for what AI can render
    renderer.tsx              # A2UI JSON -> React
    adapters/                 # Per-category adapter implementations
  store.ts                    # Zustand state
  schemas/                    # Zod schemas (22 component types)
  utils.ts                    # cn() and helpers

middleware.ts                 # Clerk auth route protection
.claude/skills/               # Agent skill definitions
plans/                        # Working docs: PRDs, architecture, session notes
```
