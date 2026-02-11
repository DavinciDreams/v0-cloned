"use client";

import {
  JSONViewer,
  JSONViewerHeader,
  JSONViewerTitle,
  JSONViewerActions,
  JSONViewerCopyButton,
  JSONViewerDownloadButton,
  JSONViewerFullscreenButton,
  JSONViewerContent,
  type JSONViewerData,
} from "@/components/ai-elements/jsonviewer";

// Simple object example
const simpleData: JSONViewerData = {
  value: {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    active: true,
    roles: ["admin", "user"],
    metadata: {
      created: "2026-01-15",
      lastLogin: "2026-02-10T10:30:00Z"
    }
  },
  rootName: "User",
  collapsed: false
};

// Complex nested example
const complexData: JSONViewerData = {
  value: {
    id: "api-response-123",
    success: true,
    data: {
      users: [
        {
          id: 1,
          name: "Alice Smith",
          email: "alice@company.com",
          department: "Engineering",
          projects: ["Project A", "Project B"],
          stats: {
            commits: 247,
            reviews: 89,
            issues: 12
          }
        },
        {
          id: 2,
          name: "Bob Johnson",
          email: "bob@company.com",
          department: "Design",
          projects: ["Project C"],
          stats: {
            designs: 156,
            reviews: 45,
            feedback: 23
          }
        }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    },
    metadata: {
      timestamp: "2026-02-10T15:30:00Z",
      version: "1.2.3",
      server: "api-prod-01"
    }
  },
  rootName: "API Response",
  collapsed: 2 // Collapse at depth 2
};

// AI response example (complex structure)
const aiResponseData: JSONViewerData = {
  value: {
    model: "gpt-4",
    choices: [
      {
        message: {
          role: "assistant",
          content: "Here's a comprehensive analysis of your data...",
          function_call: null
        },
        finish_reason: "stop",
        index: 0,
        logprobs: null
      }
    ],
    usage: {
      prompt_tokens: 245,
      completion_tokens: 512,
      total_tokens: 757
    },
    metadata: {
      model_version: "gpt-4-0613",
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0
    },
    created: 1707574200,
    id: "chatcmpl-8xKj7v4Jx5dFh9Qm2N3P1S6",
    object: "chat.completion"
  },
  rootName: "AI Response",
  collapsed: 3
};

// Large array example
const arrayData: JSONViewerData = {
  value: {
    products: [
      { id: 1, name: "Laptop", price: 999.99, stock: 45, category: "Electronics" },
      { id: 2, name: "Mouse", price: 29.99, stock: 150, category: "Electronics" },
      { id: 3, name: "Keyboard", price: 79.99, stock: 89, category: "Electronics" },
      { id: 4, name: "Monitor", price: 299.99, stock: 23, category: "Electronics" },
      { id: 5, name: "Desk Chair", price: 199.99, stock: 12, category: "Furniture" },
      { id: 6, name: "Desk Lamp", price: 39.99, stock: 67, category: "Furniture" },
    ],
    summary: {
      totalProducts: 6,
      totalValue: 14994.0,
      categories: ["Electronics", "Furniture"]
    }
  },
  rootName: "Inventory",
  collapsed: 1
};

export default function JSONViewerTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">JSON Viewer Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Interactive JSON visualization with expand/collapse, copy, and download features
        </p>
      </div>

      {/* Simple Object */}
      <JSONViewer data={simpleData} options={{ height: 400 }}>
        <JSONViewerHeader>
          <JSONViewerTitle />
          <JSONViewerActions>
            <JSONViewerCopyButton />
            <JSONViewerDownloadButton />
            <JSONViewerFullscreenButton />
          </JSONViewerActions>
        </JSONViewerHeader>
        <JSONViewerContent />
      </JSONViewer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complex Nested Data */}
        <JSONViewer
          data={complexData}
          options={{
            height: 500,
            theme: "dark",
            displayDataTypes: true,
            displayObjectSize: true
          }}
        >
          <JSONViewerHeader>
            <JSONViewerTitle />
            <JSONViewerActions>
              <JSONViewerCopyButton />
              <JSONViewerDownloadButton />
              <JSONViewerFullscreenButton />
            </JSONViewerActions>
          </JSONViewerHeader>
          <JSONViewerContent />
        </JSONViewer>

        {/* AI Response Example */}
        <JSONViewer
          data={aiResponseData}
          options={{
            height: 500,
            theme: "github",
            displayDataTypes: true,
            displayObjectSize: true
          }}
        >
          <JSONViewerHeader>
            <JSONViewerTitle />
            <JSONViewerActions>
              <JSONViewerCopyButton />
              <JSONViewerDownloadButton />
              <JSONViewerFullscreenButton />
            </JSONViewerActions>
          </JSONViewerHeader>
          <JSONViewerContent />
        </JSONViewer>
      </div>

      {/* Large Array */}
      <JSONViewer
        data={arrayData}
        options={{
          height: 450,
          theme: "light",
          displayObjectSize: true,
          displayDataTypes: true
        }}
      >
        <JSONViewerHeader>
          <JSONViewerTitle />
          <JSONViewerActions>
            <JSONViewerCopyButton />
            <JSONViewerDownloadButton />
            <JSONViewerFullscreenButton />
          </JSONViewerActions>
        </JSONViewerHeader>
        <JSONViewerContent />
      </JSONViewer>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">JSONViewer Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Interactive:</strong> Expand/collapse nested structures</li>
          <li><strong>Copy:</strong> Copy JSON to clipboard with one click</li>
          <li><strong>Download:</strong> Export JSON as .json file</li>
          <li><strong>Themes:</strong> Light, dark, GitHub, VSCode themes</li>
          <li><strong>Data Types:</strong> Show type labels for values</li>
          <li><strong>Object Size:</strong> Display array/object size</li>
          <li><strong>Customizable:</strong> Indent width, key quotes, sorting</li>
          <li><strong>Fullscreen:</strong> View large JSON in fullscreen mode</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Perfect for debugging AI responses, API data, and complex configurations
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by <strong>@uiw/react-json-view</strong>
        </p>
      </div>
    </div>
  );
}
