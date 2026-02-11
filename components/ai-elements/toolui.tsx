"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { ToolUIData, ToolUIOptions } from "@/lib/schemas/toolui.schema";

// Import unique tool-ui components (skip duplicates we already have)
// Social Posts
import { XPost } from "@/components/tool-ui/x-post";
import { InstagramPost } from "@/components/tool-ui/instagram-post";
import { LinkedInPost } from "@/components/tool-ui/linkedin-post";

// Media (skip image, audio - we have those; keep gallery and video)
import { ImageGallery } from "@/components/tool-ui/image-gallery";
import { Video } from "@/components/tool-ui/video";

// Data/UI (skip chart - we have amCharts)
import { StatsDisplay } from "@/components/tool-ui/stats-display";
import { DataTable } from "@/components/tool-ui/data-table";
import { OptionList } from "@/components/tool-ui/option-list";
import { ParameterSlider } from "@/components/tool-ui/parameter-slider";

// Workflow
import { ProgressTracker } from "@/components/tool-ui/progress-tracker";
import { QuestionFlow } from "@/components/tool-ui/question-flow";
import { ApprovalCard } from "@/components/tool-ui/approval-card";
import { MessageDraft } from "@/components/tool-ui/message-draft";
import { OrderSummary } from "@/components/tool-ui/order-summary";

// Specialized (skip code-block, terminal, citation, plan - we have those)
import { LinkPreview } from "@/components/tool-ui/link-preview";
import { WeatherWidget } from "@/components/tool-ui/weather-widget";
import { PreferencesPanel } from "@/components/tool-ui/preferences-panel";
import { ItemCarousel } from "@/components/tool-ui/item-carousel";

// --- ToolUI Component ---

export interface ToolUIProps extends HTMLAttributes<HTMLDivElement> {
  data: ToolUIData;
  options?: ToolUIOptions;
}

export const ToolUI = forwardRef<HTMLDivElement, ToolUIProps>(
  ({ data, options, className, ...props }, ref) => {
    // Render based on component type using discriminated union
    const renderComponent = () => {
      switch (data.type) {
        // Social Posts
        case "x-post":
          return <XPost post={data.data} />;

        case "instagram-post":
          return <InstagramPost post={data.data} />;

        case "linkedin-post":
          return <LinkedInPost post={data.data} />;

        // Media
        case "image-gallery":
          return <ImageGallery {...data.data} />;

        case "video":
          return <Video {...data.data} />;

        // Data Visualization
        case "stats-display":
          return <StatsDisplay {...data.data} />;

        case "data-table":
          return <DataTable {...data.data} />;

        // UI Components
        case "option-list":
          return <OptionList {...data.data} />;

        case "parameter-slider":
          return <ParameterSlider {...data.data} />;

        // Workflow
        case "progress-tracker":
          return <ProgressTracker {...data.data} />;

        case "question-flow":
          return <QuestionFlow {...data.data} />;

        case "approval-card":
          return <ApprovalCard {...data.data} />;

        case "message-draft":
          return <MessageDraft {...data.data} />;

        case "order-summary":
          return <OrderSummary {...data.data} />;

        // Specialized
        case "link-preview":
          return <LinkPreview {...data.data} />;

        case "weather-widget":
          return <WeatherWidget {...data.data} />;

        case "preferences-panel":
          return <PreferencesPanel {...data.data} />;

        case "item-carousel":
          return <ItemCarousel {...data.data} />;

        // Fallback for unsupported or duplicate types
        default:
          return (
            <div className="rounded-lg border border-dashed border-muted-foreground/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Component type "{(data as any).type}" not supported or is handled by existing AI elements.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported types: social posts, image-gallery, video, stats-display, data-table, option-list, parameter-slider, workflow components, and specialized components.
              </p>
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          className
        )}
        style={{
          height: options?.height,
          width: options?.width,
        }}
        {...props}
      >
        {renderComponent()}
      </div>
    );
  }
);

ToolUI.displayName = "ToolUI";
