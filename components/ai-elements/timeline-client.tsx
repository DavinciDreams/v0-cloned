"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// Dynamically import Timeline component with no SSR
const TimelineDynamic = dynamic(
  () => import("./timeline").then((mod) => ({ default: mod.Timeline })),
  { ssr: false }
);

const TimelineHeaderDynamic = dynamic(
  () => import("./timeline").then((mod) => ({ default: mod.TimelineHeader })),
  { ssr: false }
);

const TimelineTitleDynamic = dynamic(
  () => import("./timeline").then((mod) => ({ default: mod.TimelineTitle })),
  { ssr: false }
);

const TimelineActionsDynamic = dynamic(
  () => import("./timeline").then((mod) => ({ default: mod.TimelineActions })),
  { ssr: false }
);

const TimelineCopyButtonDynamic = dynamic(
  () =>
    import("./timeline").then((mod) => ({ default: mod.TimelineCopyButton })),
  { ssr: false }
);

const TimelineFullscreenButtonDynamic = dynamic(
  () =>
    import("./timeline").then((mod) => ({
      default: mod.TimelineFullscreenButton,
    })),
  { ssr: false }
);

const TimelineContentDynamic = dynamic(
  () => import("./timeline").then((mod) => ({ default: mod.TimelineContent })),
  { ssr: false }
);

const TimelineErrorDynamic = dynamic(
  () => import("./timeline").then((mod) => ({ default: mod.TimelineError })),
  { ssr: false }
);

// Export with proper types
export { type TimelineData, type TimelineOptions } from "./timeline";

export const Timeline = TimelineDynamic as typeof import("./timeline").Timeline;
export const TimelineHeader = TimelineHeaderDynamic as typeof import("./timeline").TimelineHeader;
export const TimelineTitle = TimelineTitleDynamic as typeof import("./timeline").TimelineTitle;
export const TimelineActions = TimelineActionsDynamic as typeof import("./timeline").TimelineActions;
export const TimelineCopyButton = TimelineCopyButtonDynamic as typeof import("./timeline").TimelineCopyButton;
export const TimelineFullscreenButton = TimelineFullscreenButtonDynamic as typeof import("./timeline").TimelineFullscreenButton;
export const TimelineContent = TimelineContentDynamic as typeof import("./timeline").TimelineContent;
export const TimelineError = TimelineErrorDynamic as typeof import("./timeline").TimelineError;
