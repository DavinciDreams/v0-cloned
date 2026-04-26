import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-full flex flex-col">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <div className="max-w-5xl w-full mx-auto space-y-10">

          {/* Badge */}
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "oklch(0.62 0.26 285 / 0.15)",
                border: "1px solid oklch(0.62 0.26 285 / 0.35)",
                color: "oklch(0.80 0.18 275)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.72 0.22 275)" }}
              />
              114+ Generative Components · Live Streaming UI
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1
              className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight leading-none"
              style={{
                background: "linear-gradient(135deg, oklch(0.90 0.08 270) 0%, oklch(0.75 0.22 280) 40%, oklch(0.72 0.20 215) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Generous
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground/70">
              The Universal Canvas for AI
            </p>
          </div>

          {/* Sub-headline */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Ask for anything — charts, 3D scenes, maps, timelines, code editors.
            Watch it render live as interactive components, streamed in real time.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.62 0.26 285), oklch(0.58 0.24 310))",
                    color: "oklch(0.98 0.01 270)",
                    boxShadow: "0 0 24px oklch(0.62 0.26 285 / 0.45), 0 4px 20px oklch(0 0 0 / 0.3)",
                  }}
                >
                  Get Started — It&apos;s Free
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/canvas"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.26 285), oklch(0.58 0.24 310))",
                  color: "oklch(0.98 0.01 270)",
                  boxShadow: "0 0 24px oklch(0.62 0.26 285 / 0.45), 0 4px 20px oklch(0 0 0 / 0.3)",
                }}
              >
                Open Canvas
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </SignedIn>

            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium transition-all duration-200"
              style={{
                background: "oklch(1 0 0 / 0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid oklch(1 0 0 / 0.13)",
                color: "oklch(0.88 0.04 270)",
              }}
            >
              View Showcase
            </Link>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {[
              { value: "114+", label: "Components" },
              { value: "∞", label: "Possibilities" },
              { value: "100%", label: "Open Source" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full"
                style={{
                  background: "oklch(1 0 0 / 0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                }}
              >
                <span
                  className="text-xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.80 0.18 275), oklch(0.72 0.22 215))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {value}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ───────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🎨"
              title="Generative UI"
              description="Streaming AI-powered components that render as you type — live, interactive, beautiful."
              gradient="oklch(0.55 0.26 285 / 0.15)"
            />
            <FeatureCard
              icon="📊"
              title="Data Visualization"
              description="Charts, graphs, maps, and timelines — all interactive and powered by your data."
              gradient="oklch(0.50 0.22 200 / 0.15)"
            />
            <FeatureCard
              icon="🎮"
              title="3D & Games"
              description="Three.js scenes, Phaser games, VRM avatars, and immersive 3D experiences."
              gradient="oklch(0.50 0.24 310 / 0.15)"
            />
            <FeatureCard
              icon="💻"
              title="Code Editors"
              description="Syntax highlighting across 100+ languages with live preview and export."
              gradient="oklch(0.55 0.22 150 / 0.15)"
            />
            <FeatureCard
              icon="🗺️"
              title="Maps & Geo"
              description="Geospatial visualization with Mapbox, Leaflet, and Deck.gl — all from a prompt."
              gradient="oklch(0.55 0.20 55 / 0.15)"
            />
            <FeatureCard
              icon="⚡"
              title="114+ Components"
              description="The most comprehensive generative UI library — ask for anything, get it instantly."
              gradient="oklch(0.55 0.24 340 / 0.15)"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        className="py-8 px-4"
        style={{
          borderTop: "1px solid oklch(1 0 0 / 0.10)",
        }}
      >
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground space-y-1">
          <p>Built with Next.js, React, Tailwind CSS, and the Vercel AI SDK.</p>
          <p>
            By{" "}
            <a
              href="https://github.com/DavinciDreams/Generous-Works"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground underline underline-offset-4"
            >
              Logos Liber
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div
      className="group relative flex flex-col space-y-3 p-6 rounded-2xl transition-all duration-300 cursor-default"
      style={{
        background: "oklch(1 0 0 / 0.05)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid oklch(1 0 0 / 0.10)",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.08)",
      }}
    >
      {/* Gradient glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: gradient }}
      />

      <div className="relative text-4xl">{icon}</div>
      <div className="relative space-y-1.5">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
