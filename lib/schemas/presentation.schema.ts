import { z } from 'zod';

export const SlideLayoutSchema = z.enum([
  'title',
  'content',
  'two-column',
  'image',
  'quote',
  'blank',
  'team',
  'comparison',
]);

export const SlideSchema = z.object({
  id: z.string(),
  layout: SlideLayoutSchema.default('content'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  leftTitle: z.string().optional(),
  rightTitle: z.string().optional(),
  leftContent: z.string().optional(),
  rightContent: z.string().optional(),
  leftBullets: z.array(z.string()).optional(),
  rightBullets: z.array(z.string()).optional(),
  image: z.string().optional(),
  caption: z.string().optional(),
  quote: z.string().optional(),
  author: z.string().optional(),
  background: z.string().optional(),
  accent: z.string().optional(),
  notes: z.string().optional(),
});

export const PresentationThemeSchema = z.enum([
  'professional',
  'modern',
  'minimal',
  'dark',
  'colorful',
]).default('professional');

export const PresentationDataSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  theme: PresentationThemeSchema.optional(),
  slides: z.array(SlideSchema).min(1),
});

export const PresentationOptionsSchema = z.object({
  height: z.number().optional(),
  aspectRatio: z.enum(['16:9', '4:3']).optional(),
}).optional();

export const PresentationPropsSchema = z.object({
  data: PresentationDataSchema,
  options: PresentationOptionsSchema,
});

export type SlideLayout = z.infer<typeof SlideLayoutSchema>;
export type Slide = z.infer<typeof SlideSchema>;
export type PresentationTheme = z.infer<typeof PresentationThemeSchema>;
export type PresentationProps = z.infer<typeof PresentationPropsSchema>;
