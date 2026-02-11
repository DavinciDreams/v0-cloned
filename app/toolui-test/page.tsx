"use client";

import { ToolUI } from "@/components/ai-elements/toolui";
import type { ToolUIData } from "@/lib/schemas/toolui.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// WORKING EXAMPLES - Social Post Components
// ============================================================================
// These examples match their component schemas correctly

const xPostExample: ToolUIData = {
  type: "x-post",
  data: {
    id: "1",
    author: {
      name: "Claude AI",
      handle: "anthropic",
      avatarUrl: "https://pbs.twimg.com/profile_images/1730224114344218624/lEvxqKhS_400x400.jpg",
      verified: true,
    },
    text: "Building the future of AI interfaces with @assistant-ui/tool-ui 🚀\n\nJust shipped support for 18 new UI components including social posts, data tables, and workflow visualizations. The composable approach makes it so easy to create rich AI experiences!",
    stats: {
      likes: 342,
      isLiked: true,
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
};

const instagramPostExample: ToolUIData = {
  type: "instagram-post",
  data: {
    id: "1",
    author: {
      name: "AI Design",
      handle: "aidesign",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      verified: true,
    },
    text: "Exploring the intersection of AI and beautiful UI design ✨ #AIDesign #UIComponents",
    media: [
      { type: "image" as const, url: "https://picsum.photos/400/400?random=1", alt: "Design sample 1" },
      { type: "image" as const, url: "https://picsum.photos/400/400?random=2", alt: "Design sample 2" },
    ],
    stats: {
      likes: 1247,
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
};

const linkedInPostExample: ToolUIData = {
  type: "linkedin-post",
  data: {
    id: "1",
    author: {
      name: "Tech Lead",
      headline: "Senior Engineer at AI Corp",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    text: "Excited to share our latest work on composable AI UI components! We've integrated @assistant-ui/tool-ui into our platform, enabling rich social media embeds, data visualizations, and interactive workflows. The type-safe approach with Zod validation has been game-changing for our development velocity.",
    stats: {
      likes: 523,
      isLiked: false,
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
};

// ============================================================================
// TODO: Fix These Examples to Match Component Schemas
// ============================================================================
// The following 15 components have schema mismatches and are commented out:
//
// 1. image-gallery - needs: id, src (not url), width, height per image
// 2. video - needs: id, assetId, src (not url), poster (not thumbnail)
// 3. stats-display - needs: id, key per stat, diff object (not change/trend)
// 4. data-table - needs: id, key (not id), label (not header), format (not type), data (not rows)
// 5. option-list - needs: selectionMode (not multiSelect), defaultValue (not selected)
// 6. parameter-slider - needs: wrapped in sliders array with id
// 7. progress-tracker - remove currentStep
// 8. question-flow - needs: steps array structure (Upfront mode)
// 9. approval-card - needs: metadata array (not details object)
// 10. message-draft - needs: channel, to as array
// 11. order-summary - needs: unitPrice (not price), imageUrl (not image), pricing object
// 12. link-preview - needs: href (not url), image (not imageUrl)
// 13. weather-widget - needs: current object, fix forecast field names
// 14. preferences-panel - needs: heading (not title), items (not settings)
// 15. item-carousel - needs: name (not title), subtitle (not description)
//
// See QA review report for detailed fixes needed for each component.
// Backup of original file: app/toolui-test/page.tsx.backup

export default function ToolUITestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tool UI Component Gallery</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Showcase of @assistant-ui/tool-ui components integrated into the AI elements library.
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-2">
          ⚠️ Currently showing 3/18 components. The remaining 15 components have test data that needs to be updated to match their schemas.
        </p>
      </div>

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="social">Social Posts (3 components)</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>X (Twitter) Post</CardTitle>
              <CardDescription>Render X/Twitter posts with author, text, media, and engagement stats</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={xPostExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instagram Post</CardTitle>
              <CardDescription>Display Instagram posts with multi-image galleries</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={instagramPostExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Post</CardTitle>
              <CardDescription>Professional posts with author headlines and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={linkedInPostExample} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 border-yellow-500/50">
        <CardHeader>
          <CardTitle>Component Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>✅ Working (3/18):</strong> X-Post, Instagram-Post, LinkedIn-Post</p>
            <p><strong>⚠️ Need Schema Fixes (15/18):</strong> Image-Gallery, Video, Stats-Display, Data-Table, Option-List, Parameter-Slider, Progress-Tracker, Question-Flow, Approval-Card, Message-Draft, Order-Summary, Link-Preview, Weather-Widget, Preferences-Panel, Item-Carousel</p>
            <p className="text-sm text-muted-foreground mt-4">
              See comments in source code for detailed fix requirements. Original full test page backed up to page.tsx.backup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
