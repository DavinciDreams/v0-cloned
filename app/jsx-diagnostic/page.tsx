"use client";

import { JSXPreview, JSXPreviewContent, JSXPreviewError } from "@/components/ai-elements/jsx-preview";
import { GenerativeMessage } from "@/components/ai-elements/generative-message";
import { parseMessageContent } from "@/components/ai-elements/generative-message";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import type { ComponentType } from "react";

// Same component bindings as app/page.tsx
const componentBindings: Record<string, ComponentType<any>> = {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Input,
};

// ============================================================================
// Test Cases
// ============================================================================

// Test 1: Simple JSX with a single component
const simpleJsx = `<Button>Click Me</Button>`;

// Test 2: Nested components
const nestedJsx = `
<Card>
  <CardHeader>
    <CardTitle>Test Card</CardTitle>
    <CardDescription>This is a test card</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
    <Button>Action</Button>
  </CardContent>
</Card>
`;

// Test 3: Multiple components
const multipleJsx = `
<div className="flex gap-2">
  <Badge>Label 1</Badge>
  <Badge>Label 2</Badge>
  <Badge>Label 3</Badge>
</div>
`;

// Test 4: JSX with Tailwind classes
const styledJsx = `
<div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
  <h2 className="text-lg font-bold mb-2">Styled Section</h2>
  <p className="text-muted-foreground">This uses Tailwind utility classes</p>
  <div className="mt-4 flex gap-2">
    <Button>Primary</Button>
    <Button variant="outline">Secondary</Button>
  </div>
</div>
`;

// Test 5: Simulated AI response with code fence (tests parseMessageContent)
const aiResponseWithJsx = `Here is a login form component:

\`\`\`tsx
<Card className="w-full max-w-md mx-auto">
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Enter your credentials</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Button className="w-full">Sign In</Button>
    </div>
  </CardContent>
</Card>
\`\`\`

This form includes email and password fields with a submit button.`;

// Test 6: Message with jsx prop set (legacy path - potential double rendering bug)
const legacyMessage = {
  id: "test-legacy",
  role: "assistant" as const,
  content: `Here is a button:\n\n\`\`\`tsx\n<Button>Hello World</Button>\n\`\`\`\n\nAbove is the rendered button.`,
  jsx: `<Button>Hello World</Button>`,
};

// Test 7: Message without jsx prop (parseMessageContent path)
const parsedMessage = {
  id: "test-parsed",
  role: "assistant" as const,
  content: `Here is a button:\n\n\`\`\`tsx\n<Button>Hello World</Button>\n\`\`\`\n\nAbove is the rendered button.`,
};

export default function JSXDiagnosticPage() {
  // Test parseMessageContent
  const parsedBlocks = parseMessageContent(aiResponseWithJsx);
  const legacyBlocks = parseMessageContent(legacyMessage.content);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">JSX Rendering Diagnostic</h1>
        <p className="text-muted-foreground">
          Testing the JSX preview pipeline for rendering issues
        </p>
      </div>

      {/* ================================================================ */}
      {/* TEST 1: Direct JSXPreview - Simple */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Test 1: Simple JSXPreview</h2>
        <p className="text-sm text-muted-foreground">
          Direct JSXPreview with a single Button component
        </p>
        <div className="border rounded-lg p-4 bg-background">
          <JSXPreview
            jsx={simpleJsx}
            components={componentBindings as any}
          >
            <JSXPreviewError />
            <JSXPreviewContent />
          </JSXPreview>
        </div>
        <details>
          <summary className="text-xs cursor-pointer">Input JSX</summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded">{simpleJsx}</pre>
        </details>
      </section>

      {/* ================================================================ */}
      {/* TEST 2: Direct JSXPreview - Nested */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Test 2: Nested Components</h2>
        <p className="text-sm text-muted-foreground">
          Card with nested CardHeader, CardTitle, CardDescription, CardContent, Button
        </p>
        <div className="border rounded-lg p-4 bg-background">
          <JSXPreview
            jsx={nestedJsx}
            components={componentBindings as any}
          >
            <JSXPreviewError />
            <JSXPreviewContent />
          </JSXPreview>
        </div>
        <details>
          <summary className="text-xs cursor-pointer">Input JSX</summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded">{nestedJsx}</pre>
        </details>
      </section>

      {/* ================================================================ */}
      {/* TEST 3: Direct JSXPreview - Multiple */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Test 3: Multiple Components</h2>
        <p className="text-sm text-muted-foreground">
          Multiple Badge components in a flex container
        </p>
        <div className="border rounded-lg p-4 bg-background">
          <JSXPreview
            jsx={multipleJsx}
            components={componentBindings as any}
          >
            <JSXPreviewError />
            <JSXPreviewContent />
          </JSXPreview>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TEST 4: Direct JSXPreview - Styled */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Test 4: Tailwind Styled JSX</h2>
        <p className="text-sm text-muted-foreground">
          JSX with Tailwind utility classes and variants
        </p>
        <div className="border rounded-lg p-4 bg-background">
          <JSXPreview
            jsx={styledJsx}
            components={componentBindings as any}
          >
            <JSXPreviewError />
            <JSXPreviewContent />
          </JSXPreview>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TEST 5: parseMessageContent */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Test 5: parseMessageContent</h2>
        <p className="text-sm text-muted-foreground">
          Tests extraction of JSX blocks from AI response text
        </p>
        <div className="border rounded-lg p-4 bg-muted space-y-2">
          <p className="text-sm font-medium">Parsed blocks ({parsedBlocks.length} total):</p>
          {parsedBlocks.map((block, i) => (
            <div key={block.id} className="border rounded p-3 bg-background text-xs">
              <div className="flex gap-2 mb-1">
                <Badge variant={block.type === 'jsx' ? 'default' : 'secondary'}>
                  {block.type}
                </Badge>
                <span className="text-muted-foreground">id: {block.id}</span>
              </div>
              <pre className="whitespace-pre-wrap">
                {block.type === 'jsx' ? block.code : block.type === 'text' ? block.content : JSON.stringify(block)}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* TEST 6: GenerativeMessage with jsx prop (LEGACY - potential bug) */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold text-orange-600">
          Test 6: Legacy Path (jsx prop set) - POTENTIAL DOUBLE RENDER BUG
        </h2>
        <p className="text-sm text-muted-foreground">
          When message.jsx is set, content still includes the code fence.
          This creates a text block with raw code + a separate JSX render.
        </p>
        <div className="border-2 border-orange-300 rounded-lg p-4 bg-background">
          <GenerativeMessage
            message={legacyMessage}
            components={componentBindings as any}
          />
        </div>
        <Alert>
          <AlertTitle>Bug Analysis</AlertTitle>
          <AlertDescription>
            If you see the Button rendered TWICE (once as code block, once as component),
            this confirms the double-rendering bug in the legacy jsx prop path.
          </AlertDescription>
        </Alert>
      </section>

      {/* ================================================================ */}
      {/* TEST 7: GenerativeMessage without jsx prop (parseMessageContent path) */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold text-green-600">
          Test 7: Modern Path (no jsx prop) - parseMessageContent
        </h2>
        <p className="text-sm text-muted-foreground">
          When message.jsx is NOT set, parseMessageContent handles extraction.
          The code fence should be replaced with the rendered component.
        </p>
        <div className="border-2 border-green-300 rounded-lg p-4 bg-background">
          <GenerativeMessage
            message={parsedMessage}
            components={componentBindings as any}
          />
        </div>
        <Alert>
          <AlertTitle>Expected Behavior</AlertTitle>
          <AlertDescription>
            You should see: text, then rendered Button component, then more text.
            No raw code fence should be visible.
          </AlertDescription>
        </Alert>
      </section>

      {/* ================================================================ */}
      {/* TEST 8: Streaming simulation */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Test 8: Streaming Flag</h2>
        <p className="text-sm text-muted-foreground">
          Tests isStreaming=true with incomplete JSX
        </p>
        <div className="border rounded-lg p-4 bg-background">
          <JSXPreview
            jsx={`<Card><CardHeader><CardTitle>Streaming`}
            isStreaming={true}
            components={componentBindings as any}
          >
            <JSXPreviewError />
            <JSXPreviewContent />
          </JSXPreview>
        </div>
        <p className="text-xs text-muted-foreground">
          completeJsxTag should auto-close: CardTitle, CardHeader, Card
        </p>
      </section>

      {/* ================================================================ */}
      {/* SUMMARY */}
      {/* ================================================================ */}
      <section className="space-y-4 border-t pt-6 pb-12">
        <h2 className="text-xl font-semibold">Known Issues Found</h2>
        <div className="space-y-3">
          <Alert variant="destructive">
            <AlertTitle>Bug 1: Double JSX Rendering</AlertTitle>
            <AlertDescription>
              In app/page.tsx lines 228-237, JSX is extracted and set as message.jsx.
              But GenerativeMessage&apos;s legacy path (when jsx prop exists) creates a text block
              with the FULL content (including code fence) + a separate JSX block.
              Result: users see raw code AND rendered component.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Bug 2: Streaming Flag on All Messages</AlertTitle>
            <AlertDescription>
              In app/page.tsx line 297: isStreaming=&#123;isLoading &amp;&amp; message.role === &quot;assistant&quot;&#125;
              marks ALL assistant messages as streaming, not just the latest one.
              This causes completeJsxTag to run on already-complete messages.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Note: react-jsx-parser v2.4.1 + React 19</AlertTitle>
            <AlertDescription>
              The parser has peer dep react &gt;= 18. While React 19 qualifies,
              there may be runtime issues with React 19&apos;s changes to ref forwarding
              and context. Test results above will confirm.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  );
}
