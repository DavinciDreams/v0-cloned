"use client";

import type { FormEvent, ComponentType } from "react";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import type { StickToBottomContext } from "use-stick-to-bottom";
import Link from "next/link";

import { useMessages, useAppState } from "@/lib/store";

import { GenerativeMessage } from "@/components/ai-elements/generative-message";
import { PromptInput, PromptInputTextarea, type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import {
  CodeEditor,
  CodeEditorHeader,
  CodeEditorTitle,
  CodeEditorActions,
  CodeEditorCopyButton,
  CodeEditorDownloadButton,
  CodeEditorFullscreenButton,
  CodeEditorContent,
} from "@/components/ai-elements/codeeditor";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ExtendedStickToBottomContext extends StickToBottomContext {
  messages?: Array<{ id: string; role: string; content: string }>;
}

type ComponentRegistry = Record<string, ComponentType<any>>;

const componentBindings: ComponentRegistry = {
  Button, Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription,
  Input, Textarea, Badge, Avatar, AvatarImage, AvatarFallback,
  Progress, Spinner, Switch, Alert, AlertTitle, AlertDescription,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Separator,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  ScrollArea,
  Tooltip, TooltipTrigger, TooltipContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  Popover, PopoverTrigger, PopoverContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty,
  ButtonGroup, InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea,
  CodeEditor, CodeEditorHeader, CodeEditorTitle, CodeEditorActions,
  CodeEditorCopyButton, CodeEditorDownloadButton, CodeEditorFullscreenButton, CodeEditorContent,
};

const navGroups = [
  { label: "Pages", links: [{ href: "/a2ui-chat", name: "A2UI Chat" }, { href: "/showcase", name: "Showcase" }, { href: "/canvas", name: "Canvas" }, { href: "/docs", name: "Docs" }] },
  { label: "Development", links: [{ href: "/codeeditor-test", name: "Code Editor" }, { href: "/jsonviewer-test", name: "JSON Viewer" }, { href: "/mermaid-test", name: "Mermaid" }, { href: "/node-editor-test", name: "Node Editor" }, { href: "/markdown-test", name: "Markdown" }] },
  { label: "Multimedia", links: [{ href: "/toolui-test", name: "Images & Video" }, { href: "/imagegallery-test", name: "Image Gallery" }, { href: "/svg-preview-test", name: "SVG Preview" }, { href: "/remotion-test", name: "Remotion" }] },
  { label: "3D & Games", links: [{ href: "/threescene-test", name: "Three.js" }, { href: "/phaser-test", name: "Phaser" }, { href: "/model-viewer-test", name: "Model Viewer" }, { href: "/vrm-test", name: "VRM" }] },
  { label: "Productivity", links: [{ href: "/wysiwyg-test", name: "WYSIWYG" }, { href: "/calendar-test", name: "Calendar" }, { href: "/knowledge-graph-test", name: "Knowledge Graph" }, { href: "/datatable-test", name: "DataTable" }, { href: "/latex-test", name: "LaTeX" }] },
  { label: "Maps", links: [{ href: "/maps-test", name: "Maps" }, { href: "/geospatial-test", name: "Geospatial" }] },
  { label: "Charts", links: [{ href: "/charts-test", name: "Charts" }, { href: "/timeline-test", name: "Timeline" }] },
  { label: "Social", links: [{ href: "/toolui-test", name: "Social Media Posts" }] },
  { label: "Forms", links: [{ href: "/forms-showcase", name: "Forms Showcase" }] },
];

export default function Page() {
  const { messages, addMessage, updateMessage } = useMessages();
  const { isLoading, error, setLoading, setError } = useAppState();
  const [navOpen, setNavOpen] = useState(false);

  const handleSubmit = useCallback(async (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = message.text.trim();
    if (!prompt) return;

    setError(null);

    const userMessageId = nanoid();
    addMessage({ id: userMessageId, role: "user", content: prompt, timestamp: Date.now() });

    const assistantMessageId = nanoid();
    addMessage({ id: assistantMessageId, role: "assistant", content: "", timestamp: Date.now() });

    setLoading(true);

    try {
      const apiMessages = messages
        .filter((msg) => typeof msg.content === 'string' && msg.content.trim().length > 0)
        .map((msg) => ({ role: msg.role, content: msg.content }));

      apiMessages.push({ role: "user", content: prompt });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, stream: true }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
          updateMessage(assistantMessageId, { content: fullContent });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      updateMessage(assistantMessageId, { content: `I apologize, but I encountered an error: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  }, [messages, addMessage, updateMessage, setLoading, setError]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Components navigation bar */}
      <div className="flex-shrink-0 border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-end h-9">
            <button
              type="button"
              onClick={() => setNavOpen(!navOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {navOpen ? "Hide components" : "Components"}
            </button>
          </div>
          {navOpen && (
            <div className="pb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 text-xs">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className="font-medium text-muted-foreground mb-1.5 text-[10px] uppercase tracking-wider">{group.label}</div>
                  <div className="space-y-0.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-muted-foreground hover:text-foreground rounded px-1.5 py-0.5 transition-colors hover:bg-accent"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <Conversation className="flex-1">
        <ConversationContent className="overflow-y-auto">
          <div className="px-4 py-8">
            <div className="mx-auto max-w-3xl space-y-8">
              {messages.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-4 bg-accent text-accent-foreground font-light">
                      ✦
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Ask for anything.</h2>
                    <p className="text-muted-foreground max-w-xs leading-relaxed">
                      Charts, 3D scenes, maps, code, timelines — watch it render live.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <GenerativeMessage
                    key={message.id}
                    message={{ id: message.id, role: message.role, content: message.content, timestamp: message.timestamp }}
                    isStreaming={isLoading && message.role === "assistant" && index === messages.length - 1}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    components={componentBindings as any}
                  />
                ))
              )}

              {isLoading && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Spinner />
                  <span className="text-sm">Generating response...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </ConversationContent>
      </Conversation>

      {/* Prompt input */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-border bg-background">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea placeholder="Ask for anything — a chart, a map, a 3D scene, code..." />
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
