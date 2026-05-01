# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Glassmorphism design system with translucent panels, blur effects, and gradient borders
- Comprehensive quality review documentation ([`docs/PRD-quality-review.md`](docs/PRD-quality-review.md))
- Accessibility improvements across AI element components
- CI workflow hardening and security improvements

### Changed

- Upgraded Next.js from 16.1.6 to 16.2.4 to resolve CVEs
- Overhauled UI/UX with updated glassmorphism design system and fixed input panel layout

### Fixed

- Resolved all pre-existing test failures in [`lib/store.test.ts`](lib/store.test.ts) and [`lib/utils.test.ts`](lib/utils.test.ts)
- Fixed PR review issues in API routes and test files
- Addressed security findings from quality audit

## [0.1.0] - 2026-02-17

### Added

- **Streaming Generative UI Platform** — Type a natural language prompt and the AI generates live, interactive React components in real time ([`README.md`](README.md))
- **114+ Composable Components** across three categories:
  - 90+ AI Elements: Charts, Maps, ThreeScene, Timeline, NodeEditor, CodeEditor, DataTable, Phaser, Mermaid, LaTeX, VRM, WYSIWYG, and more
  - 18 Tool UI components: ApprovalCard, WeatherWidget, LinkPreview, InstagramPost, OrderSummary, ParameterSlider, and more
  - 76 Standard UI Adapters: Button, Card, Input, Dialog, Tabs, Alert, Breadcrumb, Skeleton, Accordion, and more
- **Dual Rendering Pipeline** — JSX for simple UI elements and A2UI JSON for complex data-driven components, mixed in a single response ([`lib/a2ui/renderer.tsx`](lib/a2ui/renderer.tsx))
- **Multi-Provider AI Support** — OpenAI, Anthropic, Google, and Zhipu (GLM-4.7 default) out of the box
- **Runtime Type Safety** — Zod schemas validate all component props before rendering ([`lib/schemas/index.ts`](lib/schemas/index.ts))
- **Clerk v6 Authentication** — GitHub, Discord, Google, and Email providers with middleware-protected routes ([`AUTHENTICATION.md`](AUTHENTICATION.md))
- **MAF Client Layer** — Multi-agent framework client with testing infrastructure ([`lib/maf/`](lib/maf/))
- **A2UI Adapter System** — Full adapter system with 87 components registered in the catalog ([`lib/a2ui/catalog.ts`](lib/a2ui/catalog.ts), [`lib/a2ui/catalog-standard-ui.ts`](lib/a2ui/catalog-standard-ui.ts))
- **Component Showcase Pages** — Test routes for all major component types (charts, maps, geospatial, markdown, mermaid, etc.)
- **Chat Sidebar** — Persistent conversation history with Zustand + localStorage ([`components/chat-sidebar.tsx`](components/chat-sidebar.tsx))
- **Public Landing Page** — Auth-aware redirect to [`/canvas`](app/canvas/page.tsx) for authenticated users
- **CI/CD Pipeline** — Vitest test runner, ESLint, and automated checks
- **Comprehensive Documentation** — Architecture, API reference, deployment guide, and contributing guide

### AI Element Components

- **Charts** — amCharts 5 with 5+ business analytics chart types ([`lib/schemas/charts.schema.ts`](lib/schemas/charts.schema.ts))
- **Maps** — Leaflet integration with geospatial tile layers ([`lib/schemas/maps.schema.ts`](lib/schemas/maps.schema.ts))
- **Geospatial** — deck.gl + MapLibre GL with geo-layers ([`lib/schemas/geospatial.schema.ts`](lib/schemas/geospatial.schema.ts))
- **ThreeScene** — Three.js 3D scene rendering ([`lib/schemas/threescene.schema.ts`](lib/schemas/threescene.schema.ts))
- **VRM** — 3D avatar rendering with @pixiv/three-vrm ([`lib/schemas/vrm.schema.ts`](lib/schemas/vrm.schema.ts))
- **Phaser** — 2D game engine integration ([`lib/schemas/phaser.schema.ts`](lib/schemas/phaser.schema.ts))
- **Timeline** — TimelineJS3 integration ([`lib/schemas/timeline.schema.ts`](lib/schemas/timeline.schema.ts))
- **NodeEditor** — Visual node graph with XYFlow ([`lib/schemas/nodeeditor.schema.ts`](lib/schemas/nodeeditor.schema.ts))
- **KnowledgeGraph** — Interactive graph visualization ([`lib/schemas/knowledgegraph.schema.ts`](lib/schemas/knowledgegraph.schema.ts))
- **CodeEditor** — CodeMirror 6 with multi-language support ([`lib/schemas/codeeditor.schema.ts`](lib/schemas/codeeditor.schema.ts))
- **Markdown** — Live preview with @uiw/react-md-editor ([`lib/schemas/markdown.schema.ts`](lib/schemas/markdown.schema.ts))
- **Mermaid** — Diagram and flowchart rendering ([`lib/schemas/mermaid.schema.ts`](lib/schemas/mermaid.schema.ts))
- **LaTeX** — Mathematical typesetting with KaTeX ([`lib/schemas/latex.schema.ts`](lib/schemas/latex.schema.ts))
- **DataTable** — TanStack Table v8 with sorting, filtering, pagination ([`lib/schemas/datatable.schema.ts`](lib/schemas/datatable.schema.ts))
- **ImageGallery** — Lightbox with multiple layout modes ([`lib/schemas/imagegallery.schema.ts`](lib/schemas/imagegallery.schema.ts))
- **JSONViewer** — Interactive JSON inspection ([`lib/schemas/jsonviewer.schema.ts`](lib/schemas/jsonviewer.schema.ts))
- **Calendar** — schedule-x integration ([`lib/schemas/calendar.schema.ts`](lib/schemas/calendar.schema.ts))
- **ModelViewer** — 3D model display ([`lib/schemas/modelviewer.schema.ts`](lib/schemas/modelviewer.schema.ts))
- **WYSIWYG** — Rich text editing with TipTap
- **SVG Preview** — Inline SVG rendering ([`lib/schemas/svgpreview.schema.ts`](lib/schemas/svgpreview.schema.ts))
- **Remotion** — Video composition player ([`lib/schemas/remotion.schema.ts`](lib/schemas/remotion.schema.ts))

### Changed

- Switched default AI provider to Zhipu GLM-4.7 for cost-effectiveness
- Resolved React 19 purity violations in tool-ui-showcase components
- Cleaned up WYSIWYG component types for better type safety

### Fixed

- Resolved JSX double-rendering and streaming flag issues
- Fixed geospatial map tile rendering
- Fixed JSX namespace error in [`lib/a2ui/adapter.ts`](lib/a2ui/adapter.ts) for Vercel builds
- Fixed KnowledgeGraph `EntityType` to accept any string for extensibility
- Fixed A2UI JSON extraction and component rendering pipeline
- Resolved TypeScript errors across component registries
- Resolved React Hooks linting issues
- Fixed test runner circular dependency and charts schema validation errors
- Fixed Clerk SignInButton invalid `redirectUrl` prop
- Fixed middleware errors by making root route (`/`) public
- Fixed authentication redirect URLs after sign-in

### Security

- Added access control to Claude workflow — restricted to repository owner only

[Unreleased]: https://github.com/davincidreams/Generous-Works/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/davincidreams/Generous-Works/releases/tag/v0.1.0
