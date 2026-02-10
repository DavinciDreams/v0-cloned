/**
 * Zod schemas for Remotion component
 * Provides runtime type validation for Remotion video preview props
 */

import { z } from 'zod';

/**
 * Composition types
 */
export const CompositionTypeSchema = z.enum([
  'TextAnimation',
  'ShapeAnimation',
  'CountdownTimer',
  'LogoReveal'
]);

export type CompositionType = z.infer<typeof CompositionTypeSchema>;

/**
 * Shape type for ShapeAnimation
 */
export const ShapeSchema = z.object({
  type: z.enum(['circle', 'square', 'triangle']),
  color: z.string(),
  size: z.number().positive(),
  startX: z.number(),
  startY: z.number(),
  endX: z.number(),
  endY: z.number()
});

/**
 * Composition props schemas
 */
export const TextAnimationPropsSchema = z.object({
  text: z.string(),
  color: z.string().optional(),
  fontSize: z.number().positive().optional(),
  backgroundColor: z.string().optional()
});

export const ShapeAnimationPropsSchema = z.object({
  shapes: z.array(ShapeSchema).optional(),
  backgroundColor: z.string().optional()
});

export const CountdownTimerPropsSchema = z.object({
  from: z.number(),
  to: z.number().optional(),
  color: z.string().optional(),
  fontSize: z.number().positive().optional(),
  backgroundColor: z.string().optional(),
  label: z.string().optional()
});

export const LogoRevealPropsSchema = z.object({
  text: z.string(),
  subtitle: z.string().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional()
});

/**
 * Union of all composition props
 */
export const CompositionPropsSchema = z.union([
  TextAnimationPropsSchema,
  ShapeAnimationPropsSchema,
  CountdownTimerPropsSchema,
  LogoRevealPropsSchema,
  z.record(z.string(), z.unknown()) // Allow other props
]);

/**
 * Remotion composition
 */
export const RemotionCompositionSchema = z.object({
  type: CompositionTypeSchema,
  width: z.number().positive(),
  height: z.number().positive(),
  fps: z.number().positive(),
  durationInFrames: z.number().positive(),
  props: z.record(z.string(), z.unknown()) // Composition-specific props
});

export type RemotionComposition = z.infer<typeof RemotionCompositionSchema>;

/**
 * Remotion data structure
 */
export const RemotionDataSchema = z.object({
  composition: RemotionCompositionSchema
});

export type RemotionData = z.infer<typeof RemotionDataSchema>;

/**
 * Remotion options
 */
export const RemotionOptionsSchema = z.object({
  autoPlay: z.boolean().optional(),
  loop: z.boolean().optional(),
  controls: z.boolean().optional(),
  muted: z.boolean().optional(),
  playbackRate: z.number().positive().optional()
}).optional();

export type RemotionOptions = z.infer<typeof RemotionOptionsSchema>;

/**
 * Complete Remotion props schema
 */
export const RemotionPropsSchema = z.object({
  data: RemotionDataSchema,
  options: RemotionOptionsSchema
});

export type RemotionProps = z.infer<typeof RemotionPropsSchema>;
