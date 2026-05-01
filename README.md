# Generous Works

**The universal canvas for AI. Ask for anything.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Vercel AI SDK](https://img.shields.io/badge/AI_SDK-6-black)](https://sdk.vercel.ai/)

Generous Works is a streaming generative UI platform — type a natural language prompt and the AI generates live, interactive React components in real time. Charts, 3D scenes, maps, timelines, code editors, games, data tables, and 100+ more component types, all rendered progressively as the AI streams its response.

Built by [Decentralized Intelligence Agency / Logos Liber](https://github.com/davincidreams) as the rendering layer of an open-source ecosystem for collective intelligence.

🌐 **Live at [generous.works](https://generous.works)**

---

## Key Features

- **Streaming Generative UI** — Components appear progressively as the AI generates them, with no waiting for full responses
- **114+ Composable Components** — Data visualizations, 3D scenes, maps, editors, games, social cards, and more
- **Dual Rendering Pipeline** — JSX for simple UI elements and A2UI JSON for complex data-driven components, mixed in a single response
- **Multi-Provider AI Support** — OpenAI, Anthropic, Google, and Zhipu out of the box
- **Runtime Type Safety** — Zod schemas validate all component props before rendering
- **Authenticated** — Clerk v6 with GitHub, Discord, Google, and Email providers

### Component Categories

| Category | Count | Examples |
|---|---|---|
| **AI Elements** | 90+ | Charts, Maps, ThreeScene, Timeline, NodeEditor, CodeEditor, DataTable, Phaser, Mermaid, LaTeX, VRM, WYSIWYG |
| **Tool UI** | 18 | ApprovalCard, WeatherWidget, LinkPreview, InstagramPost, OrderSummary, ParameterSlider |
| **Standard UI Adapters** | 76 | Button, Card, Input, Dialog, Tabs, Alert, Breadcrumb, Skeleton, Accordion |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI** | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **AI** | [Vercel AI SDK 6](https://sdk.vercel.ai/), [AG-UI](https://github.com/CopilotKit/CopilotKit), [A2UI](https://a2ui.dev/) |
| **State** | [Zustand v5](https://zustand.docs.pmnd.rs/) |
| **Auth** | [Clerk v6](https://clerk.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Testing** | [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/) |
| **3D / Visual** | [Three.js](https://threejs.org/), [deck.gl](https://deck.gl/), [amCharts 5](https://www.amcharts.com/), [Phaser](https://phaser.io/) |
| **Maps** | [MapLibre GL](https://maplibre.org/), [Leaflet](https://leafletjs.com/), [deck.gl geo-layers](https://deck.gl/) |
| **Editors** | [CodeMirror](https://codemirror.net/), [TipTap](https://tiptap.dev/), [XYFlow](https://xyflow.com/) |
| **Media** | [Remotion](https://www.remotion.dev/), [Rive](https://rive.app/), [KaTeX](https://katex.org/), [Mermaid](https://mermaid.js.org/) |

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** 9+
- An AI provider API key (Zhipu GLM-4.7 is the default — cost-effective and capable)
- Clerk keys for authentication

### 1. Clone and install

```bash
git clone https://github.com/davincidreams/Generous-Works.git
cd Generous-Works
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys. At minimum:

```env
# AI Provider (default: Zhipu GLM-4.7)
ZHIPU_API_KEY=your_zhipu_key
ZHIPU_BASE_URL=https://api.z.ai/api/paas/v4
ZHIPU_MODEL=glm-4.7

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

See [`.env.example`](.env.example) for all supported providers (OpenAI, Anthropic, Google) and additional configuration options.

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll see the chat interface — sign in and start asking for anything.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack (port 3000) |
| `npm run dev:webpack` | Start dev server with Webpack (fallback) |
| `npm run build` | Production build |
| `npm run build:turbo` | Production build with Turbopack |
| `npm run start` | Start production server |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once (CI mode) |
| `npm run test:ui` | Interactive Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:registry` | Validate A2UI component registry |
| `npm run lint` | ESLint with caching |

---

## Architecture

### Dual Rendering Pipeline

The AI can respond with two formats, mixed freely in a single response:

1. **JSX Rendering** — Plain JSX strings for simple UI (Button, Card, form elements). Parsed and sandboxed by [`jsx-preview.tsx`](components/ai-elements/jsx-preview.tsx).
2. **A2UI JSON Rendering** — Structured JSON for complex data-driven components (Charts, Maps, Timeline, ThreeScene). Parsed by [`renderer.tsx`](lib/a2ui/renderer.tsx).

The [`generative-message.tsx`](components/ai-elements/generative-message.tsx) component handles both — it streams markdown and detects embedded JSX blocks or A2UI JSON, rendering each inline.

### A2UI Adapter System

```
lib/a2ui/
  catalog.ts              # Component catalog — the AI's vocabulary
  catalog-standard-ui.ts  # Standard UI component registrations
  catalog-variants.ts     # Variant definitions
  renderer.tsx            # Parses A2UI JSON → React components
  adapter.ts              # Interface all adapters implement
  adapters/               # One file per component category
    button.tsx, card.tsx, charts.tsx, layout.tsx, ...
```

The catalog ([`catalog.ts`](lib/a2ui/catalog.ts)) is the source of truth for what the AI can render. It generates the system prompt section that tells the AI what components exist and how to use them.

### API Routes

- [`app/api/chat/route.ts`](app/api/chat/route.ts) — Main chat endpoint with AI provider configuration
- [`app/api/a2ui-chat/route.ts`](app/api/a2ui-chat/route.ts) — A2UI-specific endpoint

### State Management

- [`lib/store.ts`](lib/store.ts) — Zustand v5 store with `useMessages()` and `useAppState()` hooks

---

## Project Structure

```
app/                          # Next.js App Router
  page.tsx                    # Main chat UI
  canvas/                     # Canvas page with loading/error states
  api/chat/route.ts           # AI endpoint + system prompt builder
  api/a2ui-chat/route.ts      # A2UI-specific endpoint
  sign-in/                    # Clerk sign-in page
  sign-up/                    # Clerk sign-up page
  *-test/                     # Individual component demo pages

components/
  ui/                         # 25 shadcn/Radix UI primitives
  ai-elements/                # 90+ AI chat & visualization components
  tool-ui/                    # 18 tool call visualization components
  chat-sidebar.tsx            # Chat sidebar navigation

lib/
  a2ui/                       # A2UI framework (catalog, renderer, adapters)
  schemas/                    # Zod schemas for 22+ component types
  store.ts                    # Zustand global state
  utils.ts                    # cn() and utility functions
  maf/                        # Microsoft Agent Framework integration

middleware.ts                 # Clerk auth route protection
plans/                        # PRDs, architecture docs, session notes
Marketing/                    # Brand guide, landing pages, SEO strategy
docs/                         # Additional documentation
```

---

## Documentation

| Document | Description |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide with setup, conventions, and workflow |
| [AUTHENTICATION.md](AUTHENTICATION.md) | Clerk authentication setup and provider configuration |
| [CLAUDE.md](CLAUDE.md) | AI agent guide with architecture and conventions |
| [lib/a2ui/README.md](lib/a2ui/README.md) | A2UI framework internals and adapter system |
| [Marketing/ECOSYSTEM.md](Marketing/ECOSYSTEM.md) | Logos Liber ecosystem overview |
| [Marketing/BRAND_GUIDE.md](Marketing/BRAND_GUIDE.md) | Brand guidelines |
| [plans/](plans/) | PRDs, architecture decisions, and implementation plans |

---

## The Logos Liber Ecosystem

Generous Works is part of the [Logos Liber](https://logosliber.org) ecosystem — *"The word, freely rendered."* An open-source suite of projects under the [Decentralized Intelligence Agency](https://decentralizedintelligence.agency) 501(c)(3) nonprofit, united by the mission to increase collective intelligence.

```
                    ┌──────────────────────────────┐
                    │   DECENTRALIZED INTELLIGENCE  │
                    │          AGENCY               │
                    │  501(c)(3) Scientific NonProfit│
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       LOGOS LIBER            │
                    │    logosliber.org            │
                    │  The open-source ecosystem   │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────┐
          │                        │                     │
┌─────────▼─────────┐  ┌──────────▼────────┐  ┌────────▼────────┐
│   GALAXY BRAIN    │  │    GENEROUS ◄──── YOU ARE HERE │
│ galaxybrain.info  │  │  generous.works   │  │ Agents of Empire│
│ Knowledge layer   │  │  Rendering layer  │  │ Agent management│
│ Universal KMS     │  │  Universal canvas │  │ Game GUI for AI │
└───────────────────┘  └───────────────────┘  └─────────────────┘
```

| Project | Role | Description |
|---|---|---|
| **[Generous](https://generous.works)** | Rendering Layer | The universal canvas — AI generates live, interactive UI from natural language |
| **[Galaxy Brain](https://galaxybrain.info)** | Knowledge Layer | Universal data store, parser, and knowledge management system |
| **Agents of Empire** | Command Layer | Game-inspired GUI for visualizing and directing AI agent workflows |
| **Monumental Systems** | Infrastructure | Orleans actor framework for distributed agent execution |

---

## Contributing

We welcome contributions of all kinds — new components, bug fixes, documentation, and ideas. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide covering:

- Development setup and environment configuration
- Project structure and component conventions
- How to add new AI components (the most common contribution)
- Code style, testing, and PR workflow

**Quick contribution start:**

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Generous-Works.git

# 2. Install and configure
npm install
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Create a branch and start developing
git checkout -b feature/my-new-component
npm run dev
```

---

## License

[MIT](LICENSE) © 2024–2025 Decentralized Intelligence Agency / Logos Liber

---

<p align="center">
  <em>The word, freely rendered.</em>
</p>
