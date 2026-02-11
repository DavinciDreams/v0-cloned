"use client";

import {
  Markdown,
  MarkdownHeader,
  MarkdownTitle,
  MarkdownActions,
  MarkdownCopyButton,
  MarkdownDownloadButton,
  MarkdownFullscreenButton,
  MarkdownContent,
  type MarkdownData,
} from "@/components/ai-elements/markdown";

// Documentation example
const documentationMarkdown: MarkdownData = {
  title: "API Documentation",
  content: `# API Documentation

## Overview

Welcome to our **RESTful API** documentation. This API allows you to interact with our service programmatically.

## Authentication

All API requests require authentication using an API key:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/v1/users
\`\`\`

## Endpoints

### GET /users

Retrieve a list of users.

**Parameters:**
- \`limit\` (integer): Maximum number of results (default: 10)
- \`offset\` (integer): Pagination offset (default: 0)

**Response:**

\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 100
}
\`\`\`

### POST /users

Create a new user.

**Request Body:**

\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin"
}
\`\`\`

## Rate Limiting

- **100 requests per minute** for authenticated users
- **10 requests per minute** for unauthenticated users

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 429  | Rate Limit Exceeded |
| 500  | Internal Server Error |

## Support

For support, email us at support@example.com or visit our [Help Center](https://help.example.com).`,
};

// Tutorial example
const tutorialMarkdown: MarkdownData = {
  title: "React Hooks Tutorial",
  content: `# React Hooks Tutorial

## Introduction

React Hooks allow you to use state and other React features without writing a class.

## useState Hook

The \`useState\` hook lets you add state to functional components:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The \`useEffect\` hook lets you perform side effects:

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return <div>Welcome, {user.name}!</div>;
}
\`\`\`

## Custom Hooks

You can create your own hooks to reuse stateful logic:

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
\`\`\`

## Best Practices

1. ✅ **Call hooks at the top level** - Don't call hooks inside loops or conditions
2. ✅ **Only call hooks from React functions** - Don't call them from regular JavaScript functions
3. ✅ **Use the ESLint plugin** - Install \`eslint-plugin-react-hooks\` for warnings

---

*Happy coding!* 🚀`,
};

// README example
const readmeMarkdown: MarkdownData = {
  title: "README",
  content: `# Awesome Project

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/workflow/status/user/repo/CI)](https://github.com/user/repo/actions)
[![npm version](https://badge.fury.io/js/awesome-project.svg)](https://www.npmjs.com/package/awesome-project)

> A modern, powerful library for building amazing applications

## Features

- 🚀 **Fast** - Optimized for performance
- 📦 **Lightweight** - Minimal bundle size
- 🎨 **Customizable** - Fully themeable
- 🔧 **TypeScript** - Full type safety
- 📱 **Responsive** - Works on all devices
- ♿ **Accessible** - WCAG 2.1 compliant

## Installation

\`\`\`bash
npm install awesome-project
\`\`\`

or

\`\`\`bash
yarn add awesome-project
\`\`\`

## Quick Start

\`\`\`javascript
import { AwesomeComponent } from 'awesome-project';

function App() {
  return (
    <AwesomeComponent
      title="Hello World"
      theme="dark"
    />
  );
}
\`\`\`

## Documentation

Full documentation is available at [docs.awesome-project.io](https://docs.awesome-project.io)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

MIT © 2026 Awesome Project Team

## Acknowledgments

- Thanks to all our [contributors](https://github.com/user/repo/graphs/contributors)
- Inspired by [similar-project](https://github.com/other/project)`,
};

// Blog post example
const blogMarkdown: MarkdownData = {
  title: "Blog Post",
  content: `# The Future of Web Development

*Published on February 10, 2026 by Jane Doe*

---

## Introduction

The web development landscape is constantly evolving. Let's explore what's coming next.

## Key Trends

### 1. AI-Powered Development

AI tools are transforming how we write code:

> "AI will not replace developers, but developers who use AI will replace those who don't."
> — Anonymous

### 2. Edge Computing

Moving computation closer to users for better performance:

- **Reduced latency**: 50ms vs 200ms
- **Better user experience**: Faster page loads
- **Cost efficiency**: Less data transfer

### 3. WebAssembly

Run code at near-native speeds in the browser:

\`\`\`rust
// Rust code compiled to WebAssembly
#[no_mangle]
pub fn fibonacci(n: i32) -> i32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
\`\`\`

## Conclusion

The future is bright for web developers. Embrace these changes and stay ahead of the curve!

---

*What do you think? Share your thoughts in the comments below.*`,
};

// Simple note example
const simpleNote: MarkdownData = {
  title: "Quick Note",
  content: `# Meeting Notes - Q1 Planning

## Attendees
- Alice (Product Manager)
- Bob (Engineering Lead)
- Carol (Design Lead)

## Discussion Points

1. **Q1 Goals**
   - Launch new dashboard
   - Improve mobile experience
   - Reduce page load time by 30%

2. **Timeline**
   - Week 1-2: Design mockups
   - Week 3-4: Backend API
   - Week 5-8: Frontend implementation
   - Week 9-10: Testing and polish

3. **Blockers**
   - Need API access from vendor
   - Waiting on design system updates

## Action Items

- [ ] Alice: Follow up with vendor
- [ ] Bob: Review architecture proposal
- [ ] Carol: Finalize color palette

**Next meeting:** February 17, 2026`,
};

export default function MarkdownTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Markdown Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Full-featured markdown editing with live preview
        </p>
      </div>

      {/* Live Mode (Side-by-side) */}
      <Markdown data={documentationMarkdown} options={{ height: 600, mode: "live" }}>
        <MarkdownHeader>
          <MarkdownTitle />
          <MarkdownActions>
            <MarkdownCopyButton />
            <MarkdownDownloadButton />
            <MarkdownFullscreenButton />
          </MarkdownActions>
        </MarkdownHeader>
        <MarkdownContent />
      </Markdown>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Mode */}
        <Markdown
          data={tutorialMarkdown}
          options={{
            height: 500,
            mode: "edit",
          }}
        >
          <MarkdownHeader>
            <MarkdownTitle />
            <MarkdownActions>
              <MarkdownCopyButton />
              <MarkdownDownloadButton />
              <MarkdownFullscreenButton />
            </MarkdownActions>
          </MarkdownHeader>
          <MarkdownContent />
        </Markdown>

        {/* Preview Mode */}
        <Markdown
          data={readmeMarkdown}
          options={{
            height: 500,
            mode: "preview",
          }}
        >
          <MarkdownHeader>
            <MarkdownTitle />
            <MarkdownActions>
              <MarkdownCopyButton />
              <MarkdownDownloadButton />
              <MarkdownFullscreenButton />
            </MarkdownActions>
          </MarkdownHeader>
          <MarkdownContent />
        </Markdown>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blog Post */}
        <Markdown
          data={blogMarkdown}
          options={{
            height: 500,
            mode: "live",
          }}
        >
          <MarkdownHeader>
            <MarkdownTitle />
            <MarkdownActions>
              <MarkdownCopyButton />
              <MarkdownDownloadButton />
              <MarkdownFullscreenButton />
            </MarkdownActions>
          </MarkdownHeader>
          <MarkdownContent />
        </Markdown>

        {/* Simple Note */}
        <Markdown
          data={simpleNote}
          options={{
            height: 500,
            mode: "live",
          }}
        >
          <MarkdownHeader>
            <MarkdownTitle />
            <MarkdownActions>
              <MarkdownCopyButton />
              <MarkdownDownloadButton />
              <MarkdownFullscreenButton />
            </MarkdownActions>
          </MarkdownHeader>
          <MarkdownContent />
        </Markdown>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Markdown Component Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Three Modes:</strong> Edit, Preview, or Live (side-by-side)</li>
          <li><strong>GitHub-Flavored:</strong> Full GFM syntax support</li>
          <li><strong>Syntax Highlighting:</strong> Code blocks with language support</li>
          <li><strong>Live Preview:</strong> See changes as you type</li>
          <li><strong>Toolbar:</strong> Rich editing toolbar (can be hidden)</li>
          <li><strong>Copy & Download:</strong> Built-in actions</li>
          <li><strong>Fullscreen:</strong> Distraction-free editing</li>
          <li><strong>Scroll Sync:</strong> Synchronized scrolling in live mode</li>
          <li><strong>Tables:</strong> Full markdown table support</li>
          <li><strong>Task Lists:</strong> Interactive checkboxes</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Perfect for documentation, blog posts, README files, and note-taking
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by <strong>@uiw/react-md-editor</strong>
        </p>
      </div>
    </div>
  );
}
