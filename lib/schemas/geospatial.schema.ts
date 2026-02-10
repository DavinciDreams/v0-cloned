/**
 * Geospatial Component Schema
 * Advanced geospatial visualizations using L7
 */

import { z } from "zod";

// Coordinates schema
export const GeospatialCoordinatesSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

// Layer schema
export const GeospatialLayerSchema = z.object({
  id: z.string(),
  type: z.enum(['point', 'line', 'polygon', 'heatmap', 'hexagon', 'arc']),
  data: z.array(z.object({
    lng: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
    value: z.number().optional(),
    properties: z.record(z.string(), z.unknown()).optional(),
  })),
  style: z.object({
    color: z.union([z.string(), z.array(z.string())]),
    size: z.number().positive().optional(),
    opacity: z.number().min(0).max(1).optional(),
  }),
  visible: z.boolean().optional(),
});

// Data schema
export const GeospatialDataSchema = z.object({
  center: GeospatialCoordinatesSchema,
  zoom: z.number().min(0).max(22),
  layers: z.array(GeospatialLayerSchema),
  basemap: z.enum(['light', 'dark', 'satellite']).optional(),
});

// Options schema
export const GeospatialOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  interactive: z.boolean().optional(),
  showControls: z.boolean().optional(),
}).passthrough().optional();

// Props schema
export const GeospatialPropsSchema = z.object({
  data: GeospatialDataSchema,
  options: GeospatialOptionsSchema,
});

// TypeScript types
export type GeospatialCoordinates = z.infer<typeof GeospatialCoordinatesSchema>;
export type GeospatialLayer = z.infer<typeof GeospatialLayerSchema>;
export type GeospatialData = z.infer<typeof GeospatialDataSchema>;
export type GeospatialOptions = z.infer<typeof GeospatialOptionsSchema>;
export type GeospatialProps = z.infer<typeof GeospatialPropsSchema>;
