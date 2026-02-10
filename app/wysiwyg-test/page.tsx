"use client";

import {
  WYSIWYG,
  WYSIWYGActions,
  WYSIWYGContent,
  WYSIWYGCopyButton,
  WYSIWYGExportButton,
  WYSIWYGHeader,
  WYSIWYGTitle,
  type WYSIWYGData,
} from "@/components/ai-elements/wysiwyg";

const sampleMarkdown: WYSIWYGData = {
  content: `# Getting Started with Next.js

## Introduction

Next.js is a powerful React framework that enables you to build full-stack web applications. It provides features like:

- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- File-based routing
- Built-in CSS support

## Installation

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features

### 1. File-based Routing

Pages are automatically routed based on their file names in the \`app\` directory.

### 2. Server Components

Next.js 13+ uses React Server Components by default, improving performance.

### 3. Image Optimization

The \`<Image>\` component automatically optimizes images for faster loading.

## Conclusion

Next.js makes it easy to build modern, performant web applications with React.`,
  format: 'markdown',
  editable: true,
  features: {
    images: true,
    tables: true,
    codeBlocks: true,
  },
};

const sampleHTML: WYSIWYGData = {
  content: `<div>
  <h1>HTML Content Example</h1>
  <p>This is a <strong>rich text</strong> example with <em>HTML formatting</em>.</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ul>
</div>`,
  format: 'html',
  editable: false,
};

const sampleEditable: WYSIWYGData = {
  content: `Start typing your content here...

This is an editable WYSIWYG editor. You can:
- Write and edit text
- Format content
- Add code blocks
- Insert images and tables

Try editing this text!`,
  format: 'markdown',
  editable: true,
  features: {
    images: true,
    tables: true,
    codeBlocks: true,
    links: true,
  },
};

export default function WYSIWYGTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">WYSIWYG Editor Test</h1>
        <p className="text-muted-foreground mt-2">
          Rich text editor with markdown, HTML, and JSON support
        </p>
      </div>

      <div className="space-y-8">
        {/* Editable Markdown */}
        <WYSIWYG data={sampleEditable} options={{ height: 400, placeholder: "Start typing..." }}>
          <WYSIWYGHeader>
            <WYSIWYGTitle>Editable Markdown</WYSIWYGTitle>
            <WYSIWYGActions>
              <WYSIWYGExportButton format="markdown" />
              <WYSIWYGCopyButton />
            </WYSIWYGActions>
          </WYSIWYGHeader>
          <WYSIWYGContent />
        </WYSIWYG>

        {/* Read-only Markdown */}
        <WYSIWYG data={sampleMarkdown} options={{ height: 500 }}>
          <WYSIWYGHeader>
            <WYSIWYGTitle>Next.js Guide</WYSIWYGTitle>
            <WYSIWYGActions>
              <WYSIWYGExportButton format="markdown" />
              <WYSIWYGCopyButton />
            </WYSIWYGActions>
          </WYSIWYGHeader>
          <WYSIWYGContent />
        </WYSIWYG>

        {/* HTML Content */}
        <WYSIWYG data={sampleHTML} options={{ height: 250 }}>
          <WYSIWYGHeader>
            <WYSIWYGTitle>HTML Preview</WYSIWYGTitle>
            <WYSIWYGActions>
              <WYSIWYGExportButton format="html" />
              <WYSIWYGCopyButton />
            </WYSIWYGActions>
          </WYSIWYGHeader>
          <WYSIWYGContent />
        </WYSIWYG>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">WYSIWYG Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Support for markdown, HTML, and JSON formats</li>
          <li>Editable and read-only modes</li>
          <li>Export to markdown or HTML files</li>
          <li>Copy to clipboard functionality</li>
          <li>Configurable features (images, tables, code blocks)</li>
          <li>Responsive design with custom height/width</li>
          <li>Syntax highlighting for code blocks</li>
        </ul>
      </div>
    </div>
  );
}
