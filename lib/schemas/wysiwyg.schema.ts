/**
 * Zod schemas for WYSIWYG component
 * Provides runtime type validation for Novel editor props
 */

import { z } from 'zod';

/**
 * Content format types
 */
export const ContentFormatSchema = z.enum([
  'markdown',
  'html',
  'json'
]);

export type ContentFormat = z.infer<typeof ContentFormatSchema>;

/**
 * Editor features configuration
 */
export const FeaturesConfigSchema = z.object({
  images: z.boolean().optional(),
  tables: z.boolean().optional(),
  codeBlocks: z.boolean().optional(),
  links: z.boolean().optional(),
  mentions: z.boolean().optional()
});

export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>;

/**
 * WYSIWYG data structure
 */
export const WYSIWYGDataSchema = z.object({
  content: z.string(),
  format: ContentFormatSchema,
  editable: z.boolean().optional(),
  features: FeaturesConfigSchema.optional()
});

export type WYSIWYGData = z.infer<typeof WYSIWYGDataSchema>;

/**
 * WYSIWYG options
 */
export const WYSIWYGOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  placeholder: z.string().optional(),
  className: z.string().optional()
}).optional();

export type WYSIWYGOptions = z.infer<typeof WYSIWYGOptionsSchema>;

/**
 * Complete WYSIWYG props schema
 */
export const WYSIWYGPropsSchema = z.object({
  data: WYSIWYGDataSchema,
  options: WYSIWYGOptionsSchema
});

export type WYSIWYGProps = z.infer<typeof WYSIWYGPropsSchema>;
