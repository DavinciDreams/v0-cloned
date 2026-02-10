"use client";

import * as React from "react";

/**
 * Stub chart component exports for tool-ui/chart adapter.
 * This is a minimal implementation to satisfy TypeScript compilation.
 * The actual chart functionality is handled by the Charts component using amcharts5.
 */

export type ChartConfig = Record<string, {
  label?: string;
  color?: string;
  theme?: Record<string, string>;
}>;

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { config?: ChartConfig }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
ChartContainer.displayName = "ChartContainer";

export const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
ChartTooltip.displayName = "ChartTooltip";

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
ChartTooltipContent.displayName = "ChartTooltipContent";

export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
ChartLegend.displayName = "ChartLegend";

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
ChartLegendContent.displayName = "ChartLegendContent";
