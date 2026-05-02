import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { SignInTrigger } from "@/components/auth/sign-in-trigger";

export default function LandingPage() {
  return (
    <main className="relative min-h-full flex flex-col">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section aria-label="Hero" className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <div className="max-w-5xl w-full mx-auto space-y-10">

          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
              114+ Generative Components · Live Streaming UI
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight leading-none text-foreground">
              Generous
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-muted-foreground">
              The Universal Canvas for AI
            </p>
          </div>

          {/* Sub-headline */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Ask for anything — charts, 3D scenes, maps, timelines, code editors.
            Watch it render live as interactive components, streamed in real time.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <SignedOut>
              <SignInTrigger className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-opacity bg-primary text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                  Get Started — It&apos;s Free
                  <svg aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
              </SignInTrigger>
            </SignedOut>

            <SignedIn>
              <Link
                href="/canvas"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-opacity bg-primary text-primary-foreground hover:opacity-90"
              >
                Open Canvas
                <svg aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </SignedIn>

            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border border-border text-foreground hover:bg-accent transition-colors"
            >
              View Showcase
            </Link>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {[
              { value: "114+", label: "Components" },
              { value: "∞", label: "Possibilities" },
              { value: "100%", label: "Open Source" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border"
              >
                <span className="text-xl font-bold text-primary">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ───────────────────────────────────── */}
      <section aria-label="Features" className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="✦"
              title="Generative UI"
              description="Streaming AI-powered components that render as you type — live, interactive, beautiful."
            />
            <FeatureCard
              icon="◆"
              title="Data Visualization"
              description="Charts, graphs, maps, and timelines — all interactive and powered by your data."
            />
            <FeatureCard
              icon="●"
              title="3D & Games"
              description="Three.js scenes, Phaser games, VRM avatars, and immersive 3D experiences."
            />
            <FeatureCard
              icon="⊞"
              title="Code Editors"
              description="Syntax highlighting across 100+ languages with live preview and export."
            />
            <FeatureCard
              icon="◎"
              title="Maps & Geo"
              description="Geospatial visualization with Mapbox, Leaflet, and Deck.gl — all from a prompt."
            />
            <FeatureCard
              icon="⊕"
              title="114+ Components"
              description="The most comprehensive generative UI library — ask for anything, get it instantly."
            />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t border-border">
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
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col space-y-3 p-6 rounded-2xl bg-card border border-border transition-colors hover:border-primary/30 cursor-default">
      <div className="text-2xl text-primary font-light" aria-hidden="true">{icon}</div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
