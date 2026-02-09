"use client";

import { useState, useCallback, useMemo } from "react";
import { JSXPreview, JSXPreviewContent, JSXPreviewError } from "@/components/ai-elements/jsx-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RefreshCwIcon, CopyIcon, CheckIcon } from "lucide-react";

// Default example code
const DEFAULT_CODE = `<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Hello World</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This is a live preview of your code!</p>
    <Button className="mt-4">Click Me</Button>
  </CardContent>
</Card>`;

export default function CodePage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "split">("split");

  const componentBindings = useMemo(
    () => ({
      Button,
      Card,
      CardHeader,
      CardContent,
      CardTitle,
    }),
    []
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE);
  }, []);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Code Editor</h1>
            <p className="text-sm text-muted-foreground">
              Write JSX code and see live preview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <CheckIcon className="mr-2 h-4 w-4" />
              ) : (
                <CopyIcon className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "code" | "preview" | "split")} className="h-full">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="code">Code Only</TabsTrigger>
              <TabsTrigger value="preview">Preview Only</TabsTrigger>
              <TabsTrigger value="split">Split View</TabsTrigger>
            </TabsList>
          </div>

          {/* Code Only */}
          <TabsContent value="code" className="h-full m-0">
            <div className="h-full p-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Code Editor</CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-60px)]">
                  <ScrollArea className="h-full">
                    <Textarea
                      value={code}
                      onChange={handleCodeChange}
                      placeholder="Write your JSX code here..."
                      className="font-mono text-sm min-h-[500px]"
                      spellCheck={false}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Only */}
          <TabsContent value="preview" className="h-full m-0">
            <div className="h-full p-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-60px)]">
                  <ScrollArea className="h-full">
                    <div className="flex min-h-[500px] items-center justify-center p-8">
                      <JSXPreview
                        jsx={code}
                        components={componentBindings}
                        className="w-full"
                      >
                        <JSXPreviewError />
                        <JSXPreviewContent />
                      </JSXPreview>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Split View */}
          <TabsContent value="split" className="h-full m-0">
            <div className="flex h-full">
              {/* Code Editor */}
              <div className="flex-1 border-r p-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Code Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-60px)]">
                    <ScrollArea className="h-full">
                      <Textarea
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="Write your JSX code here..."
                        className="font-mono text-sm min-h-[500px]"
                        spellCheck={false}
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Live Preview */}
              <div className="flex-1 p-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-60px)]">
                    <ScrollArea className="h-full">
                      <div className="flex min-h-[500px] items-center justify-center p-8">
                        <JSXPreview
                          jsx={code}
                          components={componentBindings}
                          className="w-full"
                        >
                          <JSXPreviewError />
                          <JSXPreviewContent />
                        </JSXPreview>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
