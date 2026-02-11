"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
  FileTextIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

// Markdown editor imports
import MDEditor from "@uiw/react-md-editor";

// Import schemas
import type {
  MarkdownData,
  MarkdownOptions,
  MarkdownMode,
} from "@/lib/schemas/markdown.schema";

// --- Types ---

export type MarkdownProps = ComponentProps<"div"> & {
  data: MarkdownData;
  options?: MarkdownOptions;
  onChange?: (content: string) => void;
};

interface MarkdownContextValue {
  data: MarkdownData;
  options: MarkdownOptions;
  content: string;
  setContent: (content?: string) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  onChange?: (content: string) => void;
}

const MarkdownContext = createContext<MarkdownContextValue | null>(null);

export const useMarkdown = () => {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error("Markdown components must be used within Markdown");
  }
  return context;
};

// --- Markdown Root Component ---

export const Markdown = memo(
  forwardRef<HTMLDivElement, MarkdownProps>(
    ({ data, options = {}, onChange, className, children, ...props }, ref) => {
      const [content, setContent] = useState(data.content || "");
      const [isFullscreen, setIsFullscreen] = useState(false);

      const handleChange = useCallback(
        (value?: string) => {
          const newContent = value || "";
          setContent(newContent);
          onChange?.(newContent);
        },
        [onChange]
      );

      const value: MarkdownContextValue = {
        data,
        options,
        content,
        setContent: handleChange,
        isFullscreen,
        setIsFullscreen,
        onChange,
      };

      return (
        <MarkdownContext.Provider value={value}>
          <div
            ref={ref}
            className={cn(
              "markdown-container flex flex-col rounded-lg border bg-card",
              isFullscreen && "fixed inset-0 z-50 m-0 rounded-none",
              className
            )}
            style={{
              width: options.width || "100%",
              height: options.height || 600,
            }}
            {...props}
          >
            {children}
          </div>
        </MarkdownContext.Provider>
      );
    }
  )
);

Markdown.displayName = "Markdown";

// --- Markdown Header ---

export type MarkdownHeaderProps = HTMLAttributes<HTMLDivElement>;

export const MarkdownHeader = memo(
  forwardRef<HTMLDivElement, MarkdownHeaderProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-b p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

MarkdownHeader.displayName = "MarkdownHeader";

// --- Markdown Title ---

export type MarkdownTitleProps = HTMLAttributes<HTMLDivElement>;

export const MarkdownTitle = memo(
  forwardRef<HTMLDivElement, MarkdownTitleProps>(
    ({ className, children, ...props }, ref) => {
      const { data, options } = useMarkdown();

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          <FileTextIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">
            {children || data.title || "Markdown Editor"}
          </h3>
          {options?.mode && (
            <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
              {options.mode}
            </span>
          )}
        </div>
      );
    }
  )
);

MarkdownTitle.displayName = "MarkdownTitle";

// --- Markdown Actions ---

export type MarkdownActionsProps = HTMLAttributes<HTMLDivElement>;

export const MarkdownActions = memo(
  forwardRef<HTMLDivElement, MarkdownActionsProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

MarkdownActions.displayName = "MarkdownActions";

// --- Markdown Copy Button ---

export const MarkdownCopyButton = memo(() => {
  const [copied, setCopied] = useState(false);
  const { content } = useMarkdown();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  }, [content]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy markdown"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

MarkdownCopyButton.displayName = "MarkdownCopyButton";

// --- Markdown Download Button ---

export const MarkdownDownloadButton = memo(() => {
  const { content, data } = useMarkdown();

  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.title ? `${data.title}.md` : "document.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download markdown:", err);
    }
  }, [content, data]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      aria-label="Download markdown"
    >
      <DownloadIcon className="h-4 w-4" />
    </Button>
  );
});

MarkdownDownloadButton.displayName = "MarkdownDownloadButton";

// --- Markdown Fullscreen Button ---

export const MarkdownFullscreenButton = memo(() => {
  const { isFullscreen, setIsFullscreen } = useMarkdown();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsFullscreen(!isFullscreen)}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

MarkdownFullscreenButton.displayName = "MarkdownFullscreenButton";

// --- Markdown Content ---

export type MarkdownContentProps = HTMLAttributes<HTMLDivElement>;

export const MarkdownContent = memo(
  forwardRef<HTMLDivElement, MarkdownContentProps>(
    ({ className, ...props }, ref) => {
      const { content, setContent, options } = useMarkdown();

      const handleEditorChange = useCallback(
        (value?: string) => {
          setContent(value);
        },
        [setContent]
      );

      return (
        <div
          ref={ref}
          className={cn("markdown-content flex-1 overflow-auto", className)}
          data-color-mode="light"
          {...props}
        >
          <MDEditor
            value={content}
            onChange={handleEditorChange}
            preview={options?.preview || options?.mode || "live"}
            height="100%"
            hideToolbar={options?.hideToolbar}
            enableScroll={options?.enableScroll}
            highlightEnable={options?.highlightEnable}
            visiableDragbar={options?.visiableDragbar}
          />
        </div>
      );
    }
  )
);

MarkdownContent.displayName = "MarkdownContent";

// --- Exports ---

export type {
  MarkdownData,
  MarkdownOptions,
  MarkdownMode,
} from "@/lib/schemas/markdown.schema";
