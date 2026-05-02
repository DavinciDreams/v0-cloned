import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SignInTrigger } from "@/components/auth/sign-in-trigger";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
          {/* Sets .dark on <html> before first paint — localStorage wins, then OS preference */}
          <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()` }} />

          {/* Header */}
          <header className="flex-shrink-0 px-6 py-3 flex items-center justify-between z-50 relative bg-background border-b border-border">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
                G
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-foreground">
                  Generous
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Universal Canvas for AI
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SignedOut>
                <SignInTrigger
                  aria-label="Sign in to Generous"
                  className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Sign In
                </SignInTrigger>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 min-h-0 overflow-auto relative">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
