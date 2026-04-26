import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Generous — The Universal Canvas for AI",
    template: "%s | Generous",
  },
  description:
    "Ask for anything. Generous is a streaming generative UI platform that renders live, interactive components from natural language. 114+ components: charts, 3D, maps, editors, games, and more.",
  keywords: [
    "generative UI",
    "streaming UI",
    "AI interface",
    "universal canvas",
    "generative interface",
    "AI components",
    "data visualization",
    "3D rendering",
    "interactive maps",
    "code editor",
    "AI chat interface",
    "open source",
    "Next.js",
    "React",
    "Vercel AI SDK",
    "A2UI",
    "Logos Liber",
    "collective intelligence",
  ],
  authors: [{ name: "Decentralized Intelligence Agency" }],
  creator: "Decentralized Intelligence Agency",
  publisher: "Logos Liber",
  metadataBase: new URL("https://generous.works"),
  alternates: {
    canonical: "https://generous.works",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://generous.works",
    siteName: "Generous",
    title: "Generous — Ask for anything.",
    description:
      "The universal canvas for AI. Describe what you need — a chart, dashboard, 3D scene, game, timeline — and watch it render live as interactive components.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Generous — The Universal Canvas for AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generous — Ask for anything.",
    description:
      "The universal canvas for AI. Streaming generative UI with 114+ components. Open source.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
        >
          {/* Glass header — sits above all page content */}
          <header
            className="flex-shrink-0 px-4 py-3 flex items-center justify-between z-50 relative"
            style={{
              background: "oklch(1 0 0 / 0.06)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderBottom: "1px solid oklch(1 0 0 / 0.12)",
            }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo mark */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.26 285), oklch(0.58 0.24 310))",
                  boxShadow: "0 0 12px oklch(0.62 0.26 285 / 0.4)",
                }}
              >
                G
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground group-hover:text-gradient-primary transition-all">
                  Generous
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline opacity-70">
                  Universal Canvas for AI
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    aria-label="Sign in to Generous"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all h-8 px-4"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.62 0.26 285), oklch(0.58 0.24 310))",
                      color: "oklch(0.98 0.01 270)",
                      boxShadow: "0 0 16px oklch(0.62 0.26 285 / 0.35)",
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-white/20",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </header>

          {/* Page content — fills remaining viewport height */}
          <div className="flex-1 min-h-0 overflow-auto relative z-10">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
