/**
 * Zod schemas for VRM component
 * Provides runtime type validation for three-vrm avatar props
 */

import { z } from 'zod';

/**
 * 3D Vector for positions and rotations
 */
export const VRMVector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export type VRMVector3 = z.infer<typeof VRMVector3Schema>;

/**
 * Animation configuration
 */
export const AnimationSchema = z.object({
  name: z.string(),
  clip: z.string().optional(),
  loop: z.boolean().optional()
});

export type Animation = z.infer<typeof AnimationSchema>;

/**
 * Camera configuration
 */
export const CameraConfigSchema = z.object({
  position: VRMVector3Schema,
  target: VRMVector3Schema.optional()
});

export type CameraConfig = z.infer<typeof CameraConfigSchema>;

/**
 * Lighting configuration
 */
export const LightingConfigSchema = z.object({
  ambient: z.number().min(0).max(1).optional(),
  directional: z.object({
    color: z.string(),
    intensity: z.number().min(0).max(10)
  }).optional()
});

export type LightingConfig = z.infer<typeof LightingConfigSchema>;

/**
 * VRM data structure
 */
export const VRMDataSchema = z.object({
  modelUrl: z.string().url(),
  animations: z.array(AnimationSchema).optional(),
  camera: CameraConfigSchema.optional(),
  lighting: LightingConfigSchema.optional(),
  background: z.string().optional()
});

export type VRMData = z.infer<typeof VRMDataSchema>;

/**
 * VRM options
 */
export const VRMOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  antialias: z.boolean().optional(),
  alpha: z.boolean().optional(),
  enableControls: z.boolean().optional()
}).optional();

export type VRMOptions = z.infer<typeof VRMOptionsSchema>;

/**
 * Complete VRM props schema
 */
export const VRMPropsSchema = z.object({
  data: VRMDataSchema,
  options: VRMOptionsSchema
});

export type VRMProps = z.infer<typeof VRMPropsSchema>;
