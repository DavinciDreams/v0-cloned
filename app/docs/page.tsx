"use client";

import { useState, useCallback } from "react";
import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactContent,
  ArtifactClose,
} from "@/components/ai-elements/artifact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FileTextIcon, BookIcon, CodeIcon, CopyIcon, DownloadIcon, CheckIcon, XIcon } from "lucide-react";

// Sample documentation content
const GETTING_STARTED_CONTENT = `
# Getting Started

Welcome to the v0 Clone documentation. This project is a Next.js application with AI-powered features.

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Features

- **Canvas Page**: An infinite canvas for visualizing ideas
- **Code Page**: A code editor with live preview
- **Docs Page**: Documentation and artifacts

## Project Structure

\`\`\`
app/
├── canvas/page.tsx    # Infinite canvas with chat
├── code/page.tsx      # Code editor with preview
├── docs/page.tsx      # Documentation
└── page.tsx           # Home page

components/
├── ai-elements/       # AI-powered components
└── ui/               # shadcn/ui components
\`\`\`
`;

const API_REFERENCE_CONTENT = `
# API Reference

## Components

### Canvas

The Canvas component provides an infinite canvas for visualizing ideas.

\`\`\`tsx
import { Canvas } from "@/components/ai-elements/canvas";

<Canvas>
  {/* Your canvas content */}
</Canvas>
\`\`\`

### Conversation

The Conversation component provides a chat interface.

\`\`\`tsx
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";

<Conversation>
  <ConversationContent>
    {/* Your messages */}
  </ConversationContent>
</Conversation>
\`\`\`

### GenerativeMessage

The GenerativeMessage component displays AI-generated messages.

\`\`\`tsx
import { GenerativeMessage } from "@/components/ai-elements/generative-message";

<GenerativeMessage message={message} />
\`\`\`
`;

const EXAMPLES_CONTENT = `
# Examples

## Basic Card Component

\`\`\`tsx
<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Example Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This is an example card component.</p>
  </CardContent>
</Card>
\`\`\`

## Button with Icon

\`\`\`tsx
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Click Me
</Button>
\`\`\`

## Artifact Component

\`\`\`tsx
<Artifact>
  <ArtifactHeader>
    <ArtifactTitle>Documentation</ArtifactTitle>
    <ArtifactDescription>View and manage documentation</ArtifactDescription>
    <ArtifactActions>
      <ArtifactAction icon={CopyIcon} tooltip="Copy" />
      <ArtifactAction icon={DownloadIcon} tooltip="Download" />
    </ArtifactActions>
  </ArtifactHeader>
  <ArtifactContent>
    {/* Your content */}
  </ArtifactContent>
</Artifact>
\`\`\`
`;

interface DocArtifact {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: React.ElementType;
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<string>("getting-started");
  const [copied, setCopied] = useState<string | null>(null);

  const artifacts: DocArtifact[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Quick start guide and installation instructions",
      content: GETTING_STARTED_CONTENT,
      icon: BookIcon,
    },
    {
      id: "api-reference",
      title: "API Reference",
      description: "Component API documentation",
      content: API_REFERENCE_CONTENT,
      icon: CodeIcon,
    },
    {
      id: "examples",
      title: "Examples",
      description: "Code examples and usage patterns",
      content: EXAMPLES_CONTENT,
      icon: FileTextIcon,
    },
  ];

  const activeArtifact = artifacts.find((a) => a.id === activeTab) || artifacts[0];

  const handleCopy = useCallback((content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleDownload = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Documentation</h1>
            <p className="text-sm text-muted-foreground">
              View and manage project documentation and artifacts
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b px-6">
            <TabsList>
              {artifacts.map((artifact) => {
                const Icon = artifact.icon;
                return (
                  <TabsTrigger key={artifact.id} value={artifact.id} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {artifact.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {artifacts.map((artifact) => {
            const Icon = artifact.icon;
            return (
              <TabsContent key={artifact.id} value={artifact.id} className="h-full m-0">
                <div className="h-full p-6">
                  <Artifact className="h-full">
                    <ArtifactHeader>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <ArtifactTitle>{artifact.title}</ArtifactTitle>
                          <ArtifactDescription>{artifact.description}</ArtifactDescription>
                        </div>
                      </div>
                      <ArtifactActions>
                        <ArtifactAction
                          icon={copied === artifact.id ? CheckIcon : CopyIcon}
                          tooltip={copied === artifact.id ? "Copied!" : "Copy"}
                          onClick={() => handleCopy(artifact.content, artifact.id)}
                        />
                        <ArtifactAction
                          icon={DownloadIcon}
                          tooltip="Download"
                          onClick={() => handleDownload(artifact.content, artifact.id)}
                        />
                      </ArtifactActions>
                    </ArtifactHeader>
                    <ArtifactContent>
                      <ScrollArea className="h-full">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            {artifact.content}
                          </pre>
                        </div>
                      </ScrollArea>
                    </ArtifactContent>
                  </Artifact>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
