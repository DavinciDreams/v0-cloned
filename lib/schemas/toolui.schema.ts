/**
 * ToolUI Component Schema
 *
 * This module imports and re-exports schemas from individual ToolUI components.
 * Component schemas are defined in their respective directories at:
 * components/tool-ui/[component-name]/schema.ts
 *
 * This serves as a central export point for all ToolUI schemas while maintaining
 * the component-defined schemas as the single source of truth.
 */

import { z } from "zod";

// ============================================================================
// SOCIAL POST COMPONENTS
// ============================================================================

// X (Twitter) Post
export {
  SerializableXPostSchema,
  XPostAuthorSchema,
  XPostMediaSchema,
  XPostLinkPreviewSchema,
  XPostStatsSchema,
  parseSerializableXPost,
  type XPostData,
  type XPostAuthor,
  type XPostMedia,
  type XPostLinkPreview,
  type XPostStats,
} from "@/components/tool-ui/x-post/schema";

// Instagram Post
export {
  SerializableInstagramPostSchema,
  InstagramPostAuthorSchema,
  InstagramPostMediaSchema,
  InstagramPostStatsSchema,
  parseSerializableInstagramPost,
  type InstagramPostData,
  type InstagramPostAuthor,
  type InstagramPostMedia,
  type InstagramPostStats,
} from "@/components/tool-ui/instagram-post/schema";

// LinkedIn Post
export {
  SerializableLinkedInPostSchema,
  LinkedInPostAuthorSchema,
  LinkedInPostMediaSchema,
  LinkedInPostLinkPreviewSchema,
  LinkedInPostStatsSchema,
  parseSerializableLinkedInPost,
  type LinkedInPostData,
  type LinkedInPostAuthor,
  type LinkedInPostMedia,
  type LinkedInPostLinkPreview,
  type LinkedInPostStats,
} from "@/components/tool-ui/linkedin-post/schema";

// ============================================================================
// MEDIA COMPONENTS
// ============================================================================

// Image Gallery
export {
  SerializableImageGallerySchema,
  ImageGalleryItemSchema,
  ImageGallerySourceSchema,
  parseSerializableImageGallery,
  type SerializableImageGallery,
  type ImageGalleryItem,
  type ImageGallerySource,
} from "@/components/tool-ui/image-gallery/schema";

// Video
export {
  SerializableVideoSchema,
  SourceSchema,
  parseSerializableVideo,
  type SerializableVideo,
  type Source,
} from "@/components/tool-ui/video/schema";

// ============================================================================
// DATA VISUALIZATION COMPONENTS
// ============================================================================

// Stats Display
export {
  SerializableStatsDisplaySchema,
  StatItemSchema,
  StatFormatSchema,
  StatDiffSchema,
  StatSparklineSchema,
  parseSerializableStatsDisplay,
  type SerializableStatsDisplay,
  type StatItem,
  type StatFormat,
  type StatDiff,
  type StatSparkline,
} from "@/components/tool-ui/stats-display/schema";

// Data Table
export {
  SerializableDataTableSchema,
  serializableColumnSchema,
  serializableDataSchema,
  parseSerializableDataTable,
  type SerializableDataTable,
} from "@/components/tool-ui/data-table/schema";

// ============================================================================
// UI COMPONENTS
// ============================================================================

// Option List
export {
  SerializableOptionListSchema,
  OptionListOptionSchema,
  parseSerializableOptionList,
  type SerializableOptionList,
  type OptionListOption,
  type OptionListSelection,
} from "@/components/tool-ui/option-list/schema";

// Parameter Slider
export {
  SerializableParameterSliderSchema,
  SliderConfigSchema,
  parseSerializableParameterSlider,
  type SerializableParameterSlider,
  type SliderConfig,
  type SliderValue,
} from "@/components/tool-ui/parameter-slider/schema";

// ============================================================================
// WORKFLOW COMPONENTS
// ============================================================================

// Progress Tracker
export {
  SerializableProgressTrackerSchema,
  ProgressStepSchema,
  parseSerializableProgressTracker,
  type SerializableProgressTracker,
  type ProgressStep,
  type ProgressTrackerChoice,
} from "@/components/tool-ui/progress-tracker/schema";

// Question Flow
export {
  SerializableQuestionFlowSchema,
  SerializableProgressiveModeSchema,
  SerializableUpfrontModeSchema,
  SerializableReceiptModeSchema,
  QuestionFlowOptionSchema,
  QuestionFlowStepDefinitionSchema,
  QuestionFlowSummaryItemSchema,
  QuestionFlowChoiceSchema,
  parseSerializableQuestionFlow,
  type SerializableQuestionFlow,
  type SerializableProgressiveMode,
  type SerializableUpfrontMode,
  type SerializableReceiptMode,
  type QuestionFlowOption,
  type QuestionFlowStepDefinition,
  type QuestionFlowSummaryItem,
  type QuestionFlowChoice,
} from "@/components/tool-ui/question-flow/schema";

// Approval Card
export {
  SerializableApprovalCardSchema,
  MetadataItemSchema,
  ApprovalDecisionSchema,
  parseSerializableApprovalCard,
  type SerializableApprovalCard,
  type MetadataItem,
  type ApprovalDecision,
} from "@/components/tool-ui/approval-card/schema";

// Message Draft
export {
  SerializableMessageDraftSchema,
  SerializableEmailDraftSchema,
  SerializableSlackDraftSchema,
  MessageDraftChannelSchema,
  MessageDraftOutcomeSchema,
  parseSerializableMessageDraft,
  type SerializableMessageDraft,
  type SerializableEmailDraft,
  type SerializableSlackDraft,
  type MessageDraftChannel,
  type MessageDraftOutcome,
  type SlackTarget,
} from "@/components/tool-ui/message-draft/schema";

// ============================================================================
// SPECIALIZED COMPONENTS
// ============================================================================

// Order Summary
export {
  SerializableOrderSummarySchema,
  OrderItemSchema,
  PricingSchema,
  OrderDecisionSchema,
  parseSerializableOrderSummary,
  type SerializableOrderSummary,
  type OrderItem,
  type Pricing,
  type OrderDecision,
} from "@/components/tool-ui/order-summary/schema";

// Link Preview
export {
  SerializableLinkPreviewSchema,
  parseSerializableLinkPreview,
  type SerializableLinkPreview,
} from "@/components/tool-ui/link-preview/schema";

// Weather Widget
export {
  SerializableWeatherWidgetSchema,
  WeatherConditionSchema,
  CurrentWeatherSchema,
  ExtendedCurrentWeatherSchema,
  ForecastDaySchema,
  TemperatureUnitSchema,
  PrecipitationLevelSchema,
  EffectQualitySchema,
  EffectSettingsSchema,
  parseSerializableWeatherWidget,
  type SerializableWeatherWidget,
  type WeatherCondition,
  type CurrentWeather,
  type ExtendedCurrentWeather,
  type ForecastDay,
  type TemperatureUnit,
  type PrecipitationLevel,
  type EffectQuality,
  type EffectSettings,
} from "@/components/tool-ui/weather-widget/schema";

// Preferences Panel
export {
  SerializablePreferencesPanelSchema,
  SerializablePreferencesPanelReceiptSchema,
  parseSerializablePreferencesPanel,
  parseSerializablePreferencesPanelReceipt,
  type SerializablePreferencesPanel,
  type SerializablePreferencesPanelReceipt,
  type PreferencesValue,
} from "@/components/tool-ui/preferences-panel/schema";

// Item Carousel
export {
  SerializableItemCarouselSchema,
  SerializableItemSchema,
  ItemSchema,
  parseSerializableItemCarousel,
  type SerializableItemCarousel,
  type SerializableItem,
  type Item,
} from "@/components/tool-ui/item-carousel/schema";

// ============================================================================
// IMPORTS FOR DISCRIMINATED UNION
// ============================================================================

import { SerializableXPostSchema } from "@/components/tool-ui/x-post/schema";
import { SerializableInstagramPostSchema } from "@/components/tool-ui/instagram-post/schema";
import { SerializableLinkedInPostSchema } from "@/components/tool-ui/linkedin-post/schema";
import { SerializableImageGallerySchema } from "@/components/tool-ui/image-gallery/schema";
import { SerializableVideoSchema } from "@/components/tool-ui/video/schema";
import { SerializableStatsDisplaySchema } from "@/components/tool-ui/stats-display/schema";
import { SerializableDataTableSchema } from "@/components/tool-ui/data-table/schema";
import { SerializableOptionListSchema } from "@/components/tool-ui/option-list/schema";
import { SerializableParameterSliderSchema } from "@/components/tool-ui/parameter-slider/schema";
import { SerializableProgressTrackerSchema } from "@/components/tool-ui/progress-tracker/schema";
import { SerializableQuestionFlowSchema } from "@/components/tool-ui/question-flow/schema";
import { SerializableApprovalCardSchema } from "@/components/tool-ui/approval-card/schema";
import { SerializableMessageDraftSchema } from "@/components/tool-ui/message-draft/schema";
import { SerializableOrderSummarySchema } from "@/components/tool-ui/order-summary/schema";
import { SerializableLinkPreviewSchema } from "@/components/tool-ui/link-preview/schema";
import { SerializableWeatherWidgetSchema } from "@/components/tool-ui/weather-widget/schema";
import { SerializablePreferencesPanelSchema } from "@/components/tool-ui/preferences-panel/schema";
import { SerializableItemCarouselSchema } from "@/components/tool-ui/item-carousel/schema";

// ============================================================================
// DISCRIMINATED UNION FOR ALL COMPONENT TYPES
// ============================================================================

/**
 * Discriminated union schema for all ToolUI components.
 *
 * This schema is used to validate LLM tool call payloads and determine
 * which component to render based on the "type" field.
 *
 * Each variant maps to a component-specific schema:
 * - x-post -> SerializableXPostSchema
 * - instagram-post -> SerializableInstagramPostSchema
 * - linkedin-post -> SerializableLinkedInPostSchema
 * - image-gallery -> SerializableImageGallerySchema
 * - video -> SerializableVideoSchema
 * - stats-display -> SerializableStatsDisplaySchema
 * - data-table -> SerializableDataTableSchema
 * - option-list -> SerializableOptionListSchema
 * - parameter-slider -> SerializableParameterSliderSchema
 * - progress-tracker -> SerializableProgressTrackerSchema
 * - question-flow -> SerializableQuestionFlowSchema
 * - approval-card -> SerializableApprovalCardSchema
 * - message-draft -> SerializableMessageDraftSchema
 * - order-summary -> SerializableOrderSummarySchema
 * - link-preview -> SerializableLinkPreviewSchema
 * - weather-widget -> SerializableWeatherWidgetSchema
 * - preferences-panel -> SerializablePreferencesPanelSchema
 * - item-carousel -> SerializableItemCarouselSchema
 */
export const ToolUIDataSchema = z.discriminatedUnion("type", [
  // Social Posts
  z.object({ type: z.literal("x-post"), data: SerializableXPostSchema }),
  z.object({ type: z.literal("instagram-post"), data: SerializableInstagramPostSchema }),
  z.object({ type: z.literal("linkedin-post"), data: SerializableLinkedInPostSchema }),

  // Media
  z.object({ type: z.literal("image-gallery"), data: SerializableImageGallerySchema }),
  z.object({ type: z.literal("video"), data: SerializableVideoSchema }),

  // Data Visualization
  z.object({ type: z.literal("stats-display"), data: SerializableStatsDisplaySchema }),
  z.object({ type: z.literal("data-table"), data: SerializableDataTableSchema }),

  // UI Components
  z.object({ type: z.literal("option-list"), data: SerializableOptionListSchema }),
  z.object({ type: z.literal("parameter-slider"), data: SerializableParameterSliderSchema }),

  // Workflow
  z.object({ type: z.literal("progress-tracker"), data: SerializableProgressTrackerSchema }),
  z.object({ type: z.literal("question-flow"), data: SerializableQuestionFlowSchema }),
  z.object({ type: z.literal("approval-card"), data: SerializableApprovalCardSchema }),
  z.object({ type: z.literal("message-draft"), data: SerializableMessageDraftSchema }),

  // Specialized
  z.object({ type: z.literal("order-summary"), data: SerializableOrderSummarySchema }),
  z.object({ type: z.literal("link-preview"), data: SerializableLinkPreviewSchema }),
  z.object({ type: z.literal("weather-widget"), data: SerializableWeatherWidgetSchema }),
  z.object({ type: z.literal("preferences-panel"), data: SerializablePreferencesPanelSchema }),
  z.object({ type: z.literal("item-carousel"), data: SerializableItemCarouselSchema }),
]);

// Options schema
export const ToolUIOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
}).passthrough().optional();

// Props schema
export const ToolUIPropsSchema = z.object({
  data: ToolUIDataSchema,
  options: ToolUIOptionsSchema,
});

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type ToolUIData = z.infer<typeof ToolUIDataSchema>;
export type ToolUIOptions = z.infer<typeof ToolUIOptionsSchema>;
export type ToolUIProps = z.infer<typeof ToolUIPropsSchema>;
