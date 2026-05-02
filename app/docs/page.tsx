"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ExternalLinkIcon,
  GithubIcon,
  CopyIcon,
  CheckIcon,
  ChevronRightIcon,
  SparklesIcon,
  LayersIcon,
  ZapIcon,
  CodeIcon,
  PuzzleIcon,
  SettingsIcon,
  GitForkIcon,
  ArrowRightIcon,
  CircleIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: { id: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  { id: "introduction", label: "Introduction", icon: SparklesIcon },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: ZapIcon,
    children: [
      { id: "prerequisites", label: "Prerequisites" },
      { id: "installation", label: "Installation" },
      { id: "env-setup", label: "Environment Setup" },
      { id: "run-dev", label: "Run Dev Server" },
    ],
  },
  {
    id: "how-it-works",
    label: "How It Works",
    icon: LayersIcon,
    children: [
      { id: "rendering-pipeline", label: "Rendering Pipeline" },
      { id: "jsx-mode", label: "JSX Mode" },
      { id: "a2ui-mode", label: "A2UI JSON Mode" },
    ],
  },
  {
    id: "component-catalog",
    label: "Component Catalog",
    icon: PuzzleIcon,
    children: [
      { id: "ui-primitives", label: "UI Primitives" },
      { id: "ai-elements", label: "AI Elements" },
      { id: "tool-ui", label: "Tool UI" },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    icon: CodeIcon,
    children: [
      { id: "chat-endpoint", label: "POST /api/chat" },
      { id: "a2ui-schema", label: "A2UI JSON Schema" },
      { id: "jsx-generation", label: "JSX Generation" },
    ],
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: SettingsIcon,
    children: [
      { id: "ai-providers", label: "AI Providers" },
      { id: "auth-config", label: "Authentication" },
      { id: "env-vars", label: "Environment Variables" },
    ],
  },
  { id: "contributing", label: "Contributing", icon: GitForkIcon },
];

// ---------------------------------------------------------------------------
// Code block with copy button
// ---------------------------------------------------------------------------

function CodeBlock({
  code,
  language = "bash",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-border bg-muted/50 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-muted-foreground font-mono">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
        <code className="text-foreground">{code.trim()}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline code
// ---------------------------------------------------------------------------

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground border border-border/50">
      {children}
    </code>
  );
}

// ---------------------------------------------------------------------------
// Section heading anchor
// ---------------------------------------------------------------------------

function SectionHeading({
  id,
  level = 2,
  children,
  className,
}: {
  id: string;
  level?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  if (level === 3) {
    return (
      <h3
        id={id}
        className={cn(
          "mt-8 mb-3 text-lg font-semibold text-foreground scroll-mt-24",
          className
        )}
      >
        {children}
      </h3>
    );
  }
  return (
    <h2
      id={id}
      className={cn(
        "mt-12 mb-4 text-2xl font-bold text-foreground scroll-mt-24",
        className
      )}
    >
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Component category card
// ---------------------------------------------------------------------------

function CatalogCard({
  title,
  count,
  description,
  items,
  badgeVariant = "secondary",
}: {
  title: string;
  count: number;
  description: string;
  items: string[];
  badgeVariant?: "default" | "secondary" | "outline";
}) {
  return (
    <Card className="flex flex-col gap-3 p-5 h-full">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <Badge variant={badgeVariant} className="shrink-0 tabular-nums">
          {count}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono"
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Environment variable table row
// ---------------------------------------------------------------------------

function EnvRow({
  name,
  required,
  description,
  example,
}: {
  name: string;
  required?: boolean;
  description: string;
  example?: string;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4 align-top">
        <InlineCode>{name}</InlineCode>
      </td>
      <td className="py-3 pr-4 align-top">
        {required ? (
          <Badge variant="default" className="text-xs">
            required
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            optional
          </Badge>
        )}
      </td>
      <td className="py-3 pr-4 align-top text-sm text-muted-foreground leading-relaxed">
        {description}
        {example && (
          <div className="mt-1">
            <InlineCode>{example}</InlineCode>
          </div>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Flow step â€” for the how-it-works pipeline diagram
// ---------------------------------------------------------------------------

function PipelineStep({
  step,
  label,
  description,
  last = false,
}: {
  step: string;
  label: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {step}
        </div>
        {!last && (
          <div className="mt-1 w-px flex-1 min-h-8 bg-border" />
        )}
      </div>
      <div className="pb-6">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(NAV_ITEMS.map((i) => i.id))
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Collect all section IDs from nav structure
  const allSectionIds = NAV_ITEMS.flatMap((item) => [
    item.id,
    ...(item.children?.map((c) => c.id) ?? []),
  ]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    allSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                              */}
      {/* ------------------------------------------------------------------ */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border">
        <div className="sticky top-0 flex flex-col h-screen">
          {/* Sidebar header */}
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <SparklesIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              Generous Works
            </span>
            <Badge variant="outline" className="ml-auto text-xs">
              Docs
            </Badge>
          </div>

          {/* Nav */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isParentActive =
                  item.id === activeSection ||
                  item.children?.some((c) => c.id === activeSection);
                const isOpen = openSections.has(item.id);

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        scrollTo(item.id);
                        if (item.children) toggleSection(item.id);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors text-left",
                        isParentActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.children && (
                        <ChevronRightIcon
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            isOpen && "rotate-90"
                          )}
                        />
                      )}
                    </button>

                    {item.children && isOpen && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollTo(child.id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left",
                              activeSection === child.id
                                ? "text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <CircleIcon className="h-1.5 w-1.5 shrink-0 fill-current" />
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Sidebar footer links */}
          <div className="border-t border-border px-5 py-4 space-y-2">
            <a
              href="https://github.com/davincidreams/Generous-Works"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
              <ExternalLinkIcon className="ml-auto h-3 w-3" />
            </a>
            <a
              href="https://generous.works"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <SparklesIcon className="h-4 w-4" />
              generous.works
              <ExternalLinkIcon className="ml-auto h-3 w-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 min-w-0">
        <ScrollArea className="h-screen">
          <div className="mx-auto max-w-3xl px-6 py-12 pb-24">

            {/* ============================================================ */}
            {/* 1. Hero / Introduction                                         */}
            {/* ============================================================ */}
            <section id="introduction">
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  v1.0
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Open Source
                </Badge>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                Generous Works
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                Stream generative UI from natural language to live React
                components.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                Generous is a universal canvas for AI. Describe what you want â€”
                a chart, a 3D scene, a dashboard, a game, a map, a timeline â€”
                and Generous renders it live, in your browser, right now.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Built on Next.js 16, React 19, and the Vercel AI SDK. Powered
                by a catalog of{" "}
                <strong className="text-foreground">114+ composable components</strong>{" "}
                spanning data visualization, 3D graphics, maps, games, editors,
                social media previews, and workflow tools.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a
                    href="https://generous.works"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    Live Demo
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://github.com/davincidreams/Generous-Works"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    Open App
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              {/* Quick feature pills */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: ZapIcon,
                    title: "Streaming UI",
                    desc: "Components appear as the AI streams. Zero waiting.",
                  },
                  {
                    icon: PuzzleIcon,
                    title: "114+ Components",
                    desc: "Charts, maps, 3D, games, editors â€” all AI-addressable.",
                  },
                  {
                    icon: LayersIcon,
                    title: "Dual Rendering",
                    desc: "JSX for simple UI. A2UI JSON for data-driven power.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-lg border border-border p-4 bg-card"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                    <p className="font-semibold text-sm text-foreground mb-1">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="my-12" />

            {/* ============================================================ */}
            {/* 2. Getting Started                                             */}
            {/* ============================================================ */}
            <section id="getting-started">
              <SectionHeading id="getting-started" level={2}>
                Getting Started
              </SectionHeading>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Get a local Generous instance running in under five minutes.
              </p>

              {/* Prerequisites */}
              <SectionHeading id="prerequisites" level={3}>
                Prerequisites
              </SectionHeading>
              <ul className="space-y-2 mb-8">
                {[
                  "Node.js 18 or higher",
                  "npm, yarn, pnpm, or bun",
                  "An API key for at least one AI provider (Zhipu GLM is the default)",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Installation */}
              <SectionHeading id="installation" level={3}>
                Installation
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                Clone the repository and install dependencies.
              </p>
              <CodeBlock
                language="bash"
                code={`# Clone the repository
git clone https://github.com/davincidreams/Generous-Works.git
cd Generous-Works

# Install dependencies
npm install`}
              />

              {/* Environment setup */}
              <SectionHeading id="env-setup" level={3}>
                Environment Setup
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                Copy the example file and fill in your values.
              </p>
              <CodeBlock
                language="bash"
                code={`cp .env.example .env.local`}
              />

              <p className="text-sm text-muted-foreground mt-4 mb-4">
                The minimum required variables to run the app:
              </p>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Variable
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <EnvRow
                      name="ZHIPU_API_KEY"
                      required
                      description="Your Zhipu AI API key. The default provider."
                      example="your-key-here"
                    />
                    <EnvRow
                      name="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
                      description="Clerk publishable key for authentication. Required if auth is enabled."
                      example="pk_test_..."
                    />
                    <EnvRow
                      name="CLERK_SECRET_KEY"
                      description="Clerk secret key. Keep this server-side only."
                      example="sk_test_..."
                    />
                    <EnvRow
                      name="NEXT_PUBLIC_MAF_URL"
                      description="URL of an optional MAF backend for agent features."
                      example="http://localhost:5555"
                    />
                  </tbody>
                </table>
              </div>

              {/* Run dev */}
              <SectionHeading id="run-dev" level={3}>
                Run the Dev Server
              </SectionHeading>
              <CodeBlock
                language="bash"
                code={`# Fast (Turbopack â€” recommended)
npm run dev

# Stable (Webpack)
npm run dev:webpack`}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Open{" "}
                <a
                  href="http://localhost:3000"
                  className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                  http://localhost:3000
                </a>{" "}
                â€” type any prompt to generate a live component.
              </p>
            </section>

            <Separator className="my-12" />

            {/* ============================================================ */}
            {/* 3. How It Works                                                */}
            {/* ============================================================ */}
            <section id="how-it-works">
              <SectionHeading id="how-it-works" level={2}>
                How It Works
              </SectionHeading>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Generous connects a chat interface to a streaming AI endpoint.
                The AI knows your full component catalog and chooses the right
                output format for every request.
              </p>

              {/* Pipeline steps */}
              <SectionHeading id="rendering-pipeline" level={3}>
                Rendering Pipeline
              </SectionHeading>
              <div className="mt-6 mb-8">
                <PipelineStep
                  step="1"
                  label="User prompt"
                  description="The user types a natural language request â€” 'Show me a bar chart of monthly revenue' or 'Build me a login form.'"
                />
                <PipelineStep
                  step="2"
                  label="System prompt injection"
                  description="The AI receives the full component catalog as its system prompt. It knows every component name, its props, and example usage."
                />
                <PipelineStep
                  step="3"
                  label="AI generation"
                  description="The AI streams back either JSX markup (for UI primitives) or A2UI JSON (for data-driven components like charts and maps)."
                />
                <PipelineStep
                  step="4"
                  label="Live render"
                  description="The GenerativeMessage component detects JSX vs. A2UI JSON as the stream arrives and routes each to the correct renderer â€” in real time."
                  last
                />
              </div>

              {/* JSX mode */}
              <SectionHeading id="jsx-mode" level={3}>
                JSX Mode â€” Simple UI Components
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                For layout, forms, and UI primitives the AI emits JSX directly.
                The stream is parsed and rendered as React components.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Prompt
                  </p>
                  <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground italic">
                    {`"Create a settings card with a title and a save button"`}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    AI Output (streams)
                  </p>
                  <CodeBlock
                    language="tsx"
                    code={`<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Save changes</Button>
  </CardContent>
</Card>`}
                  />
                </div>
              </div>

              {/* A2UI mode */}
              <SectionHeading id="a2ui-mode" level={3}>
                A2UI JSON Mode â€” Data-Driven Components
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                For complex, data-heavy components the AI emits A2UI JSON. The{" "}
                <InlineCode>lib/a2ui/renderer.tsx</InlineCode> parses this and
                mounts the correct component with validated props.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Prompt
                  </p>
                  <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground italic">
                    {`"Line chart of website visitors, Jan-Jun 2024"`}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    AI Output (streams)
                  </p>
                  <CodeBlock
                    language="json"
                    code={`{
  "surfaceUpdate": {
    "components": [{
      "id": "visitors-chart",
      "component": {
        "Charts": {
          "data": {
            "type": "line",
            "series": [{
              "name": "Visitors",
              "data": [
                12400, 18200, 15800,
                21300, 19700, 24600
              ]
            }]
          },
          "options": { "height": 300 }
        }
      }
    }]
  }
}`}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                The full A2UI protocol is defined in{" "}
                <InlineCode>lib/a2ui/</InlineCode>. The catalog lives in{" "}
                <InlineCode>lib/a2ui/catalog.ts</InlineCode> â€” it is the single
                source of truth for what the AI knows how to render.
              </div>
            </section>

            <Separator className="my-12" />

            {/* ============================================================ */}
            {/* 4. Component Catalog                                           */}
            {/* ============================================================ */}
            <section id="component-catalog">
              <SectionHeading id="component-catalog" level={2}>
                Component Catalog
              </SectionHeading>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Generous ships with{" "}
                <strong className="text-foreground">114+ components</strong>{" "}
                organized in three tiers. Every component is registered in{" "}
                <InlineCode>lib/a2ui/catalog.ts</InlineCode>, which means the
                AI knows about all of them automatically.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Explore them live at{" "}
                <a
                  href="https://v0-cloned-kappa.vercel.app/showcase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                  /showcase
                </a>{" "}
                and{" "}
                <a
                  href="https://v0-cloned-kappa.vercel.app/tool-ui-showcase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                  /tool-ui-showcase
                </a>
                .
              </p>

              {/* UI Primitives */}
              <SectionHeading id="ui-primitives" level={3}>
                UI Primitives â€” 33 components
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-4">
                Foundation layer built on shadcn/ui and Radix UI. Used by the
                AI for layout, forms, and all interactive UI patterns.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <CatalogCard
                  title="Layout & Navigation"
                  count={10}
                  description="Structural components for page layout and navigation."
                  items={[
                    "Card",
                    "Separator",
                    "Tabs",
                    "Accordion",
                    "Breadcrumb",
                    "Pagination",
                    "Sheet",
                    "Dialog",
                    "ScrollArea",
                    "Collapsible",
                  ]}
                />
                <CatalogCard
                  title="Forms & Inputs"
                  count={11}
                  description="Controlled form elements with accessible defaults."
                  items={[
                    "Button",
                    "Input",
                    "Textarea",
                    "Select",
                    "Checkbox",
                    "Switch",
                    "Slider",
                    "RadioGroup",
                    "Label",
                    "InputGroup",
                    "ButtonGroup",
                  ]}
                />
                <CatalogCard
                  title="Display & Feedback"
                  count={12}
                  description="Status, loading, and data display primitives."
                  items={[
                    "Badge",
                    "Alert",
                    "Avatar",
                    "Progress",
                    "Skeleton",
                    "Spinner",
                    "Tooltip",
                    "Popover",
                    "HoverCard",
                    "Table",
                    "Carousel",
                    "DropdownMenu",
                  ]}
                />
              </div>

              {/* AI Elements */}
              <SectionHeading id="ai-elements" level={3}>
                AI Elements â€” 90+ components
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-4">
                Rich, interactive components built for AI-generated content.
                Each follows the compound component pattern with composable
                sub-components (Header, Content, Actions, etc.).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <CatalogCard
                  title="Charts & Data Viz"
                  count={23}
                  description="18 chart types via amCharts 5, plus DataTable, JsonViewer, StatsDisplay, SchemaDisplay, and more."
                  items={[
                    "Charts",
                    "DataTable",
                    "JsonViewer",
                    "StatsDisplay",
                    "SchemaDisplay",
                  ]}
                  badgeVariant="default"
                />
                <CatalogCard
                  title="3D & Games"
                  count={5}
                  description="Interactive 3D scenes, model loading, VRM avatars with physics, and full HTML5 game engine support."
                  items={[
                    "ThreeScene",
                    "ModelViewer",
                    "VRM",
                    "Phaser",
                    "SVGPreview",
                  ]}
                  badgeVariant="default"
                />
                <CatalogCard
                  title="Maps & Diagrams"
                  count={6}
                  description="Interactive maps, geospatial heatmaps (100K+ points), flow diagrams, knowledge graphs, and timelines."
                  items={[
                    "Maps",
                    "Geospatial",
                    "Mermaid",
                    "NodeEditor",
                    "KnowledgeGraph",
                    "Timeline",
                  ]}
                  badgeVariant="default"
                />
                <CatalogCard
                  title="Editors & Media"
                  count={9}
                  description="Code editors, rich text (WYSIWYG), markdown, LaTeX equations, image galleries, audio/video playback."
                  items={[
                    "CodeEditor",
                    "WYSIWYG",
                    "Markdown",
                    "LaTeX",
                    "CodeBlock",
                    "ImageGallery",
                    "Video",
                    "AudioPlayer",
                    "Remotion",
                  ]}
                  badgeVariant="default"
                />
                <CatalogCard
                  title="Social & Workflow"
                  count={10}
                  description="Social media previews, approval flows, multi-step forms, progress tracking, and interactive option selection."
                  items={[
                    "XPost",
                    "InstagramPost",
                    "LinkedInPost",
                    "ApprovalCard",
                    "QuestionFlow",
                    "ProgressTracker",
                    "OptionList",
                    "Confirmation",
                    "Plan",
                    "Task",
                  ]}
                />
                <CatalogCard
                  title="Chat & AI Interface"
                  count={14}
                  description="Conversation containers, generative messages, reasoning displays, voice input, model selectors, and more."
                  items={[
                    "Conversation",
                    "Message",
                    "GenerativeMessage",
                    "PromptInput",
                    "Reasoning",
                    "ChainOfThought",
                    "Agent",
                    "Artifact",
                    "Terminal",
                    "SpeechInput",
                  ]}
                />
              </div>

              {/* Tool UI */}
              <SectionHeading id="tool-ui" level={3}>
                Tool UI â€” 18 components
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-4">
                Specialized components for rendering structured AI tool call
                results. Each includes Zod schema validation, error boundaries,
                and copy/share actions.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Component
                      </th>
                      <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["WeatherWidget", "Weather conditions with animated effects"],
                      ["StatsDisplay", "Statistical metrics with sparkline charts"],
                      ["ImageGallery", "Photo grid with lightbox"],
                      ["DataTable", "Sortable and filterable data table"],
                      ["XPost / InstagramPost / LinkedInPost", "Social media post previews"],
                      ["ItemCarousel", "Product and item carousel"],
                      ["ProgressTracker", "Step-by-step progress indicator"],
                      ["OptionList", "Selectable option list"],
                      ["QuestionFlow", "Multi-step questionnaire"],
                      ["ApprovalCard", "Approve/reject workflow card"],
                      ["MessageDraft", "Email and message composer"],
                      ["OrderSummary", "E-commerce order details"],
                      ["LinkPreview", "URL preview card with metadata"],
                      ["ParameterSlider", "Named parameter with slider control"],
                      ["PreferencesPanel", "Settings and preferences form"],
                    ].map(([name, desc]) => (
                      <tr key={name} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-4 align-top">
                          <InlineCode>{name}</InlineCode>
                        </td>
                        <td className="py-2.5 px-4 align-top text-muted-foreground">
                          {desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Separator className="my-12" />

            {/* ============================================================ */}
            {/* 5. API Reference                                               */}
            {/* ============================================================ */}
            <section id="api-reference">
              <SectionHeading id="api-reference" level={2}>
                API Reference
              </SectionHeading>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The Generous backend exposes a single streaming chat endpoint.
                All component knowledge is injected via system prompt â€” clients
                send plain messages.
              </p>

              {/* Chat endpoint */}
              <SectionHeading id="chat-endpoint" level={3}>
                POST /api/chat
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                Main AI chat endpoint. Returns a server-sent event stream.
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default" className="font-mono text-xs">
                  POST
                </Badge>
                <InlineCode>/api/chat</InlineCode>
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Request Body
              </p>
              <CodeBlock
                language="json"
                code={`{
  "messages": [
    { "role": "user", "content": "Create a login form" }
  ],
  "stream": true,
  "temperature": 0.7,
  "maxTokens": 4000
}`}
              />

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4 mb-2">
                Response
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                A server-sent event stream of generated text. The stream
                contains JSX markup and/or A2UI JSON objects, mixed with
                prose. The <InlineCode>GenerativeMessage</InlineCode> component
                handles parsing and rendering on the client.
              </p>

              {/* A2UI schema */}
              <SectionHeading id="a2ui-schema" level={3}>
                A2UI JSON Schema
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                A2UI is the protocol that maps JSON component specifications to
                live React components. A valid A2UI payload looks like this:
              </p>
              <CodeBlock
                language="json"
                code={`{
  "surfaceUpdate": {
    "components": [
      {
        "id": "unique-component-id",
        "component": {
          "Charts": {
            "data": {
              "type": "bar",
              "categories": ["Jan", "Feb", "Mar", "Apr"],
              "series": [
                {
                  "name": "Revenue",
                  "data": [4200, 5800, 4900, 7100]
                }
              ]
            },
            "options": {
              "height": 320,
              "title": "Monthly Revenue"
            }
          }
        }
      }
    ]
  }
}`}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                The top-level key inside <InlineCode>component</InlineCode> is
                the component name. It must match a key in the A2UI catalog.
                Zod schemas for all specialized components live in{" "}
                <InlineCode>lib/schemas/</InlineCode>.
              </p>

              {/* JSX generation */}
              <SectionHeading id="jsx-generation" level={3}>
                JSX Generation
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                For UI primitives, the AI emits JSX that maps directly to
                components available in <InlineCode>components/ui/</InlineCode>{" "}
                and <InlineCode>components/ai-elements/</InlineCode>.
              </p>
              <CodeBlock
                language="tsx"
                code={`// Prompt: "Make a profile card for Alice"
<Card className="max-w-sm p-6">
  <div className="flex items-center gap-4">
    <Avatar>
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
    <div>
      <CardTitle className="text-base">Alice Liddell</CardTitle>
      <p className="text-sm text-muted-foreground">
        Product Designer
      </p>
    </div>
  </div>
  <Separator className="my-4" />
  <Button variant="outline" className="w-full">
    View Profile
  </Button>
</Card>`}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                JSX is executed client-side in a sandboxed evaluation context.
                Only registered component names resolve â€” unknown tags are
                silently dropped.
              </p>
            </section>

            <Separator className="my-12" />

            {/* ============================================================ */}
            {/* 6. Configuration                                               */}
            {/* ============================================================ */}
            <section id="configuration">
              <SectionHeading id="configuration" level={2}>
                Configuration
              </SectionHeading>

              {/* AI providers */}
              <SectionHeading id="ai-providers" level={3}>
                AI Provider Switching
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                Generous defaults to Zhipu GLM-4.7. Switching providers takes
                two steps: update your <InlineCode>.env.local</InlineCode> and
                swap the model in the API route.
              </p>
              <CodeBlock
                language="typescript"
                code={`// app/api/chat/route.ts
// --- Zhipu (default) ---
import { createZhipu } from "zhipu-ai-provider";
const zhipu = createZhipu({
  baseURL: process.env.ZHIPU_BASE_URL,
  apiKey: process.env.ZHIPU_API_KEY,
});
const model = zhipu(process.env.ZHIPU_MODEL ?? "glm-4.7");

// --- OpenAI ---
// import { openai } from "@ai-sdk/openai";
// const model = openai("gpt-4-turbo");

// --- Anthropic ---
// import { anthropic } from "@ai-sdk/anthropic";
// const model = anthropic("claude-3-sonnet-20240229");

// --- Google ---
// import { google } from "@ai-sdk/google";
// const model = google("gemini-pro");`}
              />

              {/* Auth */}
              <SectionHeading id="auth-config" level={3}>
                Authentication
              </SectionHeading>
              <p className="text-sm text-muted-foreground mb-3">
                Authentication is handled by{" "}
                <a
                  href="https://clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                  Clerk
                </a>
                . Get your keys from the{" "}
                <a
                  href="https://dashboard.clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                  Clerk dashboard
                </a>{" "}
                and add them to <InlineCode>.env.local</InlineCode>:
              </p>
              <CodeBlock
                language="bash"
                code={`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...`}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Auth is optional for local development. See{" "}
                <InlineCode>AUTHENTICATION.md</InlineCode> for full Clerk setup
                including custom sign-in/sign-up routes and redirect URLs.
              </p>

              {/* Full env vars */}
              <SectionHeading id="env-vars" level={3}>
                All Environment Variables
              </SectionHeading>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Variable
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <EnvRow
                      name="ZHIPU_API_KEY"
                      required
                      description="Zhipu AI API key (default provider)"
                    />
                    <EnvRow
                      name="ZHIPU_BASE_URL"
                      description="Zhipu API base URL"
                      example="https://api.z.ai/api/paas/v4"
                    />
                    <EnvRow
                      name="ZHIPU_MODEL"
                      description="Zhipu model ID"
                      example="glm-4.7"
                    />
                    <EnvRow
                      name="OPENAI_API_KEY"
                      description="OpenAI API key (alternative provider)"
                    />
                    <EnvRow
                      name="OPENAI_MODEL"
                      description="OpenAI model ID"
                      example="gpt-4-turbo"
                    />
                    <EnvRow
                      name="ANTHROPIC_API_KEY"
                      description="Anthropic API key (alternative provider)"
                    />
                    <EnvRow
                      name="ANTHROPIC_MODEL"
                      description="Anthropic model ID"
                      example="claude-3-sonnet"
                    />
                    <EnvRow
                      name="GOOGLE_API_KEY"
                      description="Google API key (alternative provider)"
                    />
                    <EnvRow
                      name="GOOGLE_MODEL"
                      description="Google model ID"
                      example="gemini-pro"
                    />
                    <EnvRow
                      name="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
                      description="Clerk publishable key for auth UI"
                    />
                    <EnvRow
                      name="CLERK_SECRET_KEY"
                      description="Clerk secret key â€” server-side only"
                    />
                    <EnvRow
                      name="NEXT_PUBLIC_MAF_URL"
                      description="MAF backend URL for agent mode"
                      example="http://localhost:5555"
                    />
                    <EnvRow
                      name="TURBOPACK_MEMORY_LIMIT"
                      description="Memory limit for Turbopack in MB"
                      example="4096"
                    />
                  </tbody>
                </table>
              </div>
            </section>

            <Separator className="my-12" />

            {/* ============================================================ */}
            {/* 7. Contributing                                                */}
            {/* ============================================================ */}
            <section id="contributing">
              <SectionHeading id="contributing" level={2}>
                Contributing
              </SectionHeading>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <GitForkIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Generous is open source
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Contributions are welcome â€” whether that is a new
                      component adapter, a bug fix, improved docs, or a
                      completely new rendering capability. The project is built
                      in the open and wants your ideas.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Before opening a pull request, read{" "}
                      <InlineCode>CONTRIBUTING.md</InlineCode> for the branch
                      conventions, commit style, and test requirements. The
                      fastest path to a merged PR: write a test, keep the diff
                      small, and describe the motivation clearly.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="outline" size="sm">
                        <a
                          href="https://github.com/davincidreams/Generous-Works"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GithubIcon className="h-4 w-4" />
                          View on GitHub
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <a href="/CONTRIBUTING.md">
                          Read CONTRIBUTING.md
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick contributing guide */}
              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground mb-4">
                  Adding a new component to the catalog:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      text: "Create the component in components/ai-elements/ or components/tool-ui/",
                    },
                    {
                      step: "2",
                      text: "If data-driven, write a Zod schema in lib/schemas/",
                    },
                    {
                      step: "3",
                      text: "Create an adapter in lib/a2ui/adapters/ using createAdapter()",
                    },
                    {
                      step: "4",
                      text: "Register it in lib/a2ui/catalog.ts with description, props, and examples",
                    },
                    {
                      step: "5",
                      text: "Run npx tsx scripts/validate-a2ui-registry.ts to confirm 114+ components pass",
                    },
                    {
                      step: "6",
                      text: "Write tests â€” npm run test:run â€” and open a PR",
                    },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {step}
                      </div>
                      <p className="text-sm text-muted-foreground pt-0.5 leading-relaxed">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack quick ref */}
              <div className="mt-10">
                <p className="text-sm font-semibold text-foreground mb-4">
                  Tech stack at a glance:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["Framework", "Next.js 16"],
                    ["UI", "React 19"],
                    ["Styling", "Tailwind CSS 4"],
                    ["AI", "Vercel AI SDK 6"],
                    ["Primitives", "shadcn/ui + Radix"],
                    ["State", "Zustand"],
                    ["Validation", "Zod"],
                    ["Testing", "Vitest + Testing Library"],
                    ["3D", "Three.js"],
                    ["Charts", "amCharts 5"],
                    ["Maps", "Leaflet + deck.gl"],
                    ["Diagrams", "Mermaid + React Flow"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <SparklesIcon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Generous Works
                </span>
                <Badge variant="outline" className="text-xs">
                  Open Source
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://generous.works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  generous.works
                </a>
                <a
                  href="https://github.com/davincidreams/Generous-Works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to app
                </Link>
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
