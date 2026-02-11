"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center gap-1",
  {
    variants: {
      variant: {
        default: "gap-1",
        outline: "gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ToggleGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      className={cn(toggleGroupVariants({ variant }), className)}
      {...props}
    />
  )
}

const toggleGroupItemVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground dark:hover:bg-accent/50 dark:data-[state=on]:bg-accent/50",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground dark:data-[state=on]:bg-input/50",
      },
      size: {
        default: "h-9 px-3 py-2 min-w-9",
        sm: "h-8 px-2 py-1.5 min-w-8 rounded-md",
        lg: "h-10 px-4 py-2.5 min-w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function ToggleGroupItem({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      className={cn(toggleGroupItemVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants }
