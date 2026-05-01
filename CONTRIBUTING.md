# Contributing to Generous Works

## Welcome

We're genuinely glad you're here. Generous Works is an open source project under the [Decentralized Intelligence Agency / Logos Liber](https://github.com/davincidreams) nonprofit ecosystem, and we believe that building in the open means being open to the people who show up. Whether you're fixing a typo, adding a new AI component, or proposing a major architectural change — your contribution matters. We ask only that you treat everyone in this project with the same generosity the project tries to embody: be kind, be curious, assume good faith, and leave things better than you found them.

---

## Getting Started

### 1. Fork and clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Generous-Works.git
cd Generous-Works
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

At minimum you need an AI provider key. The default is Zhipu GLM-4.7 (cost-effective and capable):

```env
ZHIPU_API_KEY=your_key_here
ZHIPU_BASE_URL=https://api.z.ai/api/paas/v4
ZHIPU_MODEL=glm-4.7
```

For authentication (Clerk), add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

See `.env.example` for the full list of supported providers (OpenAI, Anthropic, Google).

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the chat interface.

---

## Project Structure

The parts you'll touch most often:

```
app/                    # Next.js App Router pages and API routes
  api/chat/route.ts     # Main AI endpoint — system prompt lives here
  api/a2ui-chat/        # A2UI-specific chat endpoint

components/
  ui/                   # Base UI primitives (shadcn/ui + Radix)
  ai-elements/          # AI chat and visualization components (90+)
  tool-ui/              # Tool call visualization components (18)

lib/
  a2ui/
    catalog.ts          # Component catalog — what the AI knows about
    renderer.tsx        # Parses A2UI JSON and renders components
    adapter.ts          # Interface all adapters implement
    adapters/           # One adapter file per component category
  store.ts              # Zustand global state
  utils.ts              # cn() and other utilities
  schemas/              # Zod schemas for data-driven components
```

---

## How to Add a New AI Component

This is the most common contribution. Here is the full workflow.

### Step 1: Pick a category

There are two categories with different conventions:

| Category | Location | When to use |
|---|---|---|
| **AI Element** | `components/ai-elements/` | Domain-specific components for the chat experience — visualizations, panels, code blocks, etc. |
| **UI Primitive** | `components/ui/` | Generic, reusable building blocks (button, input, dialog). Prefer `npx shadcn@latest add <name>` for these. |

Most new contributions are AI Elements.

### Step 2: Create the file

File name: `components/ai-elements/my-component.tsx` (kebab-case, always `.tsx`).

Start with this template:

```tsx
"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { SomeIcon } from "lucide-react";
import { memo, useState } from "react";

// Export the prop type — extend HTMLAttributes so className and children work naturally
export type MyComponentProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  data?: unknown;
};

// Named export, arrow function, cn() for className merging, spread ...props
export const MyComponent = ({ className, title, data, ...props }: MyComponentProps) => (
  <div className={cn("rounded-lg border bg-card p-4", className)} {...props}>
    {title && <h3 className="font-semibold">{title}</h3>}
  </div>
);
```

Key rules:
- Always `"use client";` at the top
- Always `export type XProps` (not inline)
- Always `export const X` (named export, not default)
- Always use `cn()` for `className` — never concatenate strings directly
- Use `lucide-react` for icons
- Use `motion` from `motion/react` for animations
- Use Zustand (`@/lib/store.ts`) for state that needs to be shared across the app; use React hooks for local state

### Step 3: Use the compound component pattern for complex components

Complex components should be composable. Export multiple named sub-components from the same file:

```tsx
export const MyComponent = ({ className, children, ...props }: MyComponentProps) => (
  <div className={cn("...", className)} {...props}>{children}</div>
);

export const MyComponentHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-between p-3 border-b", className)} {...props}>
    {children}
  </div>
);

export const MyComponentContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4", className)} {...props}>{children}</div>
);
```

Then it composes naturally:

```tsx
<MyComponent>
  <MyComponentHeader>Title here</MyComponentHeader>
  <MyComponentContent>Body content</MyComponentContent>
</MyComponent>
```

### Step 4: useEffect safety — avoid infinite loops

This is the most common source of bugs. Objects and functions in `useEffect` dependency arrays cause infinite re-renders.

```tsx
// BAD — data and options are recreated on every render
useEffect(() => {
  initChart(data, options);
}, [data, options]);

// GOOD — only stable primitives in deps; capture data inside the effect
useEffect(() => {
  initChart(data, options); // data/options used but not in deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isMounted, componentId]);
```

Safe dependency values: `isMounted` (boolean), component IDs (stable strings), simple primitives.
Unsafe: objects, arrays, functions, refs — anything recreated each render.

### Step 5: Register in the A2UI catalog

If the AI should be able to generate your component, add it to `lib/a2ui/catalog.ts`. This is what tells the AI your component exists and how to use it.

Each entry needs:
- A unique `id` (kebab-case)
- `component` name matching the export
- `description` — plain English, how an AI would describe it
- `propsSchema` — a Zod schema for validation
- `example` — a working JSON usage example

Run the registry validator after adding:

```bash
npm run test:registry
```

(There's also a quick standalone script: `npx tsx scripts/validate-a2ui-registry.ts` — it's a console check, not a test suite. Both should pass.)

---

## Code Style

### TypeScript

- `"strict": false` in tsconfig — the project does not use strict mode, but write new code as if it did
- Never use `as any` — if you need to escape types, use `as unknown as TargetType` and leave a comment explaining why
- Export prop types explicitly: `export type MyComponentProps = ...`
- Prefer `type` over `interface` for component props

### Styling

- Tailwind CSS only — no inline `style={}` unless absolutely necessary (e.g., dynamic values not expressible in Tailwind)
- Use `cn()` from `@/lib/utils` for conditional/merged class names
- Follow the design system: use `bg-card`, `text-foreground`, `border`, etc. for themed colors — not hardcoded hex values
- The project uses Tailwind CSS 4 — utility class names are standard

### File conventions

- Components: `kebab-case.tsx`
- Types/utilities: `kebab-case.ts`
- No default exports for components — named exports only
- `"use client"` directive required for AI elements (they use hooks and browser APIs)

---

## Testing

### Running tests

```bash
# Run all tests once (use this before opening a PR)
npm run test:run

# Interactive watch mode
npm test

# Visual test UI
npm run test:ui

# Coverage report
npm run test:coverage
```

CI requires all 256+ tests to pass and the registry validation to pass.

### Writing tests

Tests live next to the files they test: `my-component.test.tsx` alongside `my-component.tsx`.

The project uses [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/react). Write behavior-driven tests — test what a user sees and can interact with, not implementation details.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders the title", () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<MyComponent className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
```

Good tests cover: normal rendering, edge cases (null/undefined/empty data), custom className propagation, and error states.

### Validating the component registry

After adding components to the A2UI catalog:

```bash
npm run test:registry
```

---

## Pull Request Process

### Branch naming

```
feature/your-feature-name
fix/what-you-fixed
chore/what-you-cleaned-up
docs/what-you-documented
```

### Before you open a PR

```bash
npm run lint          # No lint errors
npm run test:run      # All tests pass
npm run build         # Build succeeds
```

### PR description template

When you open a PR, please include:

```
## What this does
[One sentence summary]

## Why
[What problem does this solve, or what value does it add]

## How to test
[Steps a reviewer can follow to verify the change]

## Screenshots / demos (if UI changes)
[Before/after screenshots or a short screen recording]

## Checklist
- [ ] Tests added or updated
- [ ] npm run test:run passes
- [ ] npm run build passes
- [ ] New components registered in catalog (if applicable)
```

### What reviewers look for

- Does it follow the component conventions in this guide?
- Are prop types exported correctly?
- Are `useEffect` dependencies safe (no infinite loop risk)?
- Is Tailwind used for styling (no raw inline styles)?
- Do tests cover the meaningful behavior?
- Is the catalog entry correct if the AI should use this component?

---

## Questions and Community

If something isn't working, something in the docs is wrong, or you have an idea — open an issue on GitHub. We read them all.

[GitHub Issues](https://github.com/davincidreams/Generous-Works/issues)

Thank you for contributing.
