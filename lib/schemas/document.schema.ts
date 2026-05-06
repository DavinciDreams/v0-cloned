import { z } from 'zod';

export const DocumentSectionTypeSchema = z.enum([
  'heading',
  'paragraph',
  'bulletList',
  'numberedList',
  'table',
  'divider',
  'code',
  'quote',
  'image',
  'callout',
]);

export const DocumentSectionSchema = z.object({
  type: DocumentSectionTypeSchema,
  level: z.number().min(1).max(4).optional(),
  text: z.string().optional(),
  items: z.array(z.string()).optional(),
  headers: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
  language: z.string().optional(),
  url: z.string().optional(),
  caption: z.string().optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  style: z.enum(['info', 'warning', 'success', 'error']).optional(),
});

export const DocumentDataSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  sections: z.array(DocumentSectionSchema),
});

export const DocumentOptionsSchema = z.object({
  height: z.number().optional(),
  pageSize: z.enum(['A4', 'Letter', 'Legal']).optional(),
  showPageNumbers: z.boolean().optional(),
  theme: z.enum(['default', 'academic', 'business', 'minimal']).optional(),
}).optional();

export const DocumentPropsSchema = z.object({
  data: DocumentDataSchema,
  options: DocumentOptionsSchema,
});

export type DocumentSectionType = z.infer<typeof DocumentSectionTypeSchema>;
export type DocumentSection = z.infer<typeof DocumentSectionSchema>;
export type DocumentProps = z.infer<typeof DocumentPropsSchema>;
