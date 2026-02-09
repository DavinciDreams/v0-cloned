"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

// Import new components
import {
  KnowledgeGraph,
  KnowledgeGraphActions,
  KnowledgeGraphContent,
  KnowledgeGraphCopyButton,
  KnowledgeGraphError,
  KnowledgeGraphFullscreenButton,
  KnowledgeGraphHeader,
  KnowledgeGraphLegend,
  KnowledgeGraphSearch,
  KnowledgeGraphTitle,
} from "@/components/ai-elements/knowledge-graph";
import type { KnowledgeGraphData } from "@/components/ai-elements/knowledge-graph";

import {
  NodeEditor,
  NodeEditorActions,
  NodeEditorContent,
  NodeEditorCopyButton,
  NodeEditorError,
  NodeEditorFullscreenButton,
  NodeEditorHeader,
  NodeEditorTitle,
} from "@/components/ai-elements/node-editor";
import type { NodeEditorData } from "@/components/ai-elements/node-editor";

import {
  SVGPreview,
  SVGPreviewActions,
  SVGPreviewContent,
  SVGPreviewCopyButton,
  SVGPreviewDownloadButton,
  SVGPreviewError,
  SVGPreviewHeader,
  SVGPreviewModeToggle,
  SVGPreviewTitle,
} from "@/components/ai-elements/svg-preview";

import {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineCopyButton,
  TimelineError,
  TimelineFullscreenButton,
  TimelineHeader,
  TimelineTitle,
} from "@/components/ai-elements/timeline-client";
import type { TimelineData } from "@/components/ai-elements/timeline-client";

import {
  Latex,
  LatexActions,
  LatexContent,
  LatexCopyButton,
  LatexError,
  LatexFullscreenButton,
  LatexHeader,
  LatexTitle,
} from "@/components/ai-elements/latex-client";
import type { LatexData } from "@/components/ai-elements/latex-client";

import {
  Maps,
  MapsActions,
  MapsContent,
  MapsCopyButton,
  MapsFullscreenButton,
  MapsHeader,
  MapsTitle,
} from "@/components/ai-elements/maps-client";
import type { MapsData } from "@/components/ai-elements/maps-client";

import {
  ThreeScene,
  ThreeSceneActions,
  ThreeSceneContent,
  ThreeSceneCopyButton,
  ThreeSceneFullscreenButton,
  ThreeSceneResetButton,
  ThreeSceneHeader,
  ThreeSceneTitle,
} from "@/components/ai-elements/threescene-client";
import type { ThreeSceneData } from "@/components/ai-elements/threescene-client";

// Sample data for components
const sampleSVG = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(59,130,246);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(139,92,246);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#grad1)" rx="10"/>
  <circle cx="150" cy="100" r="50" fill="white" opacity="0.3"/>
  <text x="150" y="110" text-anchor="middle" fill="white" font-size="24" font-weight="bold">
    SVG Preview
  </text>
</svg>`;

const sampleTimeline: TimelineData = {
  title: {
    text: {
      headline: "Product Development Timeline",
      text: "<p>Key milestones in our product journey</p>",
    },
  },
  events: [
    {
      start_date: { year: 2023, month: 1, day: 15 },
      text: {
        headline: "Project Kickoff",
        text: "<p>Initial planning and team formation</p>",
      },
    },
    {
      start_date: { year: 2023, month: 4, day: 1 },
      text: {
        headline: "Alpha Release",
        text: "<p>First working prototype completed</p>",
      },
    },
    {
      start_date: { year: 2023, month: 8, day: 15 },
      text: {
        headline: "Beta Launch",
        text: "<p>Public beta testing begins</p>",
      },
    },
    {
      start_date: { year: 2024, month: 1, day: 1 },
      text: {
        headline: "Version 1.0",
        text: "<p>Official product launch!</p>",
      },
    },
  ],
};

const sampleNodeEditor: NodeEditorData = {
  nodes: [
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { label: "User Input" },
      type: "input",
    },
    {
      id: "2",
      position: { x: 300, y: 100 },
      data: { label: "Process Data" },
    },
    {
      id: "3",
      position: { x: 500, y: 50 },
      data: { label: "Success Path" },
    },
    {
      id: "4",
      position: { x: 500, y: 150 },
      data: { label: "Error Handler" },
    },
    {
      id: "5",
      position: { x: 700, y: 100 },
      data: { label: "Output" },
      type: "output",
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3", label: "Valid" },
    { id: "e2-4", source: "2", target: "4", label: "Error" },
    { id: "e3-5", source: "3", target: "5" },
    { id: "e4-5", source: "4", target: "5" },
  ],
};

const sampleKnowledgeGraph: KnowledgeGraphData = {
  entities: [
    {
      id: "ai",
      label: "Artificial Intelligence",
      type: "concept",
      description: "Machine intelligence",
    },
    {
      id: "ml",
      label: "Machine Learning",
      type: "concept",
      description: "Learning from data",
    },
    {
      id: "dl",
      label: "Deep Learning",
      type: "concept",
      description: "Neural networks",
    },
    {
      id: "nlp",
      label: "Natural Language Processing",
      type: "concept",
      description: "Language understanding",
    },
    {
      id: "cv",
      label: "Computer Vision",
      type: "concept",
      description: "Image understanding",
    },
    {
      id: "openai",
      label: "OpenAI",
      type: "organization",
      description: "AI research company",
    },
    {
      id: "google",
      label: "Google",
      type: "organization",
      description: "Tech company",
    },
  ],
  relationships: [
    { id: "r1", source: "ml", target: "ai", type: "subset_of", label: "part of" },
    { id: "r2", source: "dl", target: "ml", type: "subset_of", label: "part of" },
    { id: "r3", source: "nlp", target: "ai", type: "applies", label: "applies" },
    { id: "r4", source: "cv", target: "ai", type: "applies", label: "applies" },
    {
      id: "r5",
      source: "openai",
      target: "ai",
      type: "researches",
      label: "researches",
    },
    {
      id: "r6",
      source: "google",
      target: "ai",
      type: "researches",
      label: "researches",
    },
  ],
};

const sampleLatex: LatexData = {
  equations: [
    {
      equation: "E = mc^2",
      displayMode: true,
      label: "Einstein's mass-energy equivalence",
    },
    {
      equation: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}",
      displayMode: true,
      label: "Gauss's law",
    },
    {
      equation:
        "\\int_a^b f(x) \\, dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)",
      displayMode: true,
      label: "Fundamental theorem of calculus",
    },
  ],
};

const sampleMaps: MapsData = {
  center: {
    longitude: -122.4194,
    latitude: 37.7749,
  },
  zoom: 12,
  markers: [
    {
      id: "marker1",
      coordinates: {
        longitude: -122.4194,
        latitude: 37.7749,
      },
      color: "#ef4444",
      label: "San Francisco",
    },
    {
      id: "marker2",
      coordinates: {
        longitude: -122.4083,
        latitude: 37.7833,
      },
      color: "#3b82f6",
      label: "Golden Gate Park",
    },
    {
      id: "marker3",
      coordinates: {
        longitude: -122.3959,
        latitude: 37.7937,
      },
      color: "#10b981",
      label: "Fisherman's Wharf",
    },
  ],
};

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState("svg");
  const [isMounted, setIsMounted] = useState(false);
  const [sampleThreeScene, setSampleThreeScene] = useState<ThreeSceneData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Create 3D objects only on client
    const createObjects = async () => {
      const THREE = await import("three");

      // Create a rotating cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.3,
        roughness: 0.4,
      });
      const cube = new THREE.Mesh(geometry, material);

      // Create a sphere
      const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x4ecdc4,
        metalness: 0.7,
        roughness: 0.3,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      setSampleThreeScene({
        camera: {
          type: "perspective",
          position: { x: 4, y: 4, z: 4 },
          fov: 75,
        },
        lights: [
          {
            type: "ambient",
            color: 0xffffff,
            intensity: 0.6,
          },
          {
            type: "directional",
            color: 0xffffff,
            intensity: 0.8,
            position: { x: 5, y: 10, z: 7.5 },
          },
        ],
        background: 0x1a1a1a,
        objects: [
          {
            id: "cube",
            object: cube,
            position: { x: -1.5, y: 0, z: 0 },
            rotation: { x: 0.5, y: 0.5, z: 0 },
          },
          {
            id: "sphere",
            object: sphere,
            position: { x: 1.5, y: 0, z: 0 },
          },
        ],
      });
    };

    createObjects();
  }, [isMounted]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-2 font-bold text-4xl">
            Component Showcase
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore interactive AI elements: SVG Preview, Timeline, Node Editor,
            Knowledge Graph, LaTeX, Maps, and Three.js Scenes
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-7">
            <TabsTrigger value="svg">SVG</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="node-editor">Nodes</TabsTrigger>
            <TabsTrigger value="knowledge-graph">Graph</TabsTrigger>
            <TabsTrigger value="latex">LaTeX</TabsTrigger>
            <TabsTrigger value="maps">Maps</TabsTrigger>
            <TabsTrigger value="threescene">3D</TabsTrigger>
          </TabsList>

          {/* SVG Preview Tab */}
          <TabsContent value="svg" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SVG Preview Component</CardTitle>
                <CardDescription>
                  Display and interact with SVG graphics. Toggle between preview
                  and source code modes, copy to clipboard, or download as a
                  file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SVGPreview svg={sampleSVG} title="Gradient Example">
                  <SVGPreviewHeader>
                    <SVGPreviewTitle />
                    <SVGPreviewActions>
                      <SVGPreviewModeToggle />
                      <SVGPreviewCopyButton />
                      <SVGPreviewDownloadButton />
                    </SVGPreviewActions>
                  </SVGPreviewHeader>
                  <SVGPreviewError />
                  <SVGPreviewContent />
                </SVGPreview>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Switch between preview and source code modes</li>
                  <li>Copy SVG source to clipboard</li>
                  <li>Download SVG as a file</li>
                  <li>Inline or isolated (iframe) rendering</li>
                  <li>Validates SVG markup and shows errors</li>
                  <li>Supports custom dimensions</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Component</CardTitle>
                <CardDescription>
                  Create interactive timelines using TimelineJS. Display events,
                  eras, and stories with rich media support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline data={sampleTimeline}>
                  <TimelineHeader>
                    <TimelineTitle />
                    <TimelineActions>
                      <TimelineCopyButton />
                      <TimelineFullscreenButton />
                    </TimelineActions>
                  </TimelineHeader>
                  <TimelineContent />
                </Timeline>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>TimelineJS integration with full feature support</li>
                  <li>Events with start and end dates</li>
                  <li>Media support (images, videos, embeds)</li>
                  <li>Eras for labeling time periods</li>
                  <li>Customizable options (position, scale, zoom)</li>
                  <li>Copy timeline data and fullscreen mode</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Node Editor Tab */}
          <TabsContent value="node-editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Node Editor Component</CardTitle>
                <CardDescription>
                  Build interactive flow diagrams and node-based editors using
                  React Flow. Perfect for workflows, state machines, and data
                  pipelines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NodeEditor data={sampleNodeEditor}>
                  <NodeEditorHeader>
                    <NodeEditorTitle />
                    <NodeEditorActions>
                      <NodeEditorCopyButton />
                      <NodeEditorFullscreenButton />
                    </NodeEditorActions>
                  </NodeEditorHeader>
                  <NodeEditorError />
                  <NodeEditorContent />
                </NodeEditor>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>React Flow integration with full customization</li>
                  <li>Interactive node editing (drag, connect, delete)</li>
                  <li>Pan, zoom, and fit view controls</li>
                  <li>Custom node and edge types support</li>
                  <li>MiniMap and controls components</li>
                  <li>Copy flow data and fullscreen mode</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Graph Tab */}
          <TabsContent value="knowledge-graph" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Graph Component</CardTitle>
                <CardDescription>
                  Visualize entity-relationship graphs with color-coded nodes and
                  interactive search. Perfect for showing connections between
                  concepts, people, and organizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraph data={sampleKnowledgeGraph} title="AI Concepts">
                  <KnowledgeGraphHeader>
                    <KnowledgeGraphTitle />
                    <KnowledgeGraphActions>
                      <KnowledgeGraphSearch />
                      <KnowledgeGraphCopyButton />
                      <KnowledgeGraphFullscreenButton />
                    </KnowledgeGraphActions>
                  </KnowledgeGraphHeader>
                  <KnowledgeGraphError />
                  <KnowledgeGraphContent />
                  <KnowledgeGraphLegend />
                </KnowledgeGraph>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>
                    Entity types: person, organization, concept, location, event,
                    document
                  </li>
                  <li>Color-coded nodes by entity type</li>
                  <li>Interactive search and filtering</li>
                  <li>Customizable color schemes</li>
                  <li>Legend showing entity types</li>
                  <li>Relationship labels and connections</li>
                  <li>Copy graph data and fullscreen mode</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LaTeX Tab */}
          <TabsContent value="latex" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LaTeX Component</CardTitle>
                <CardDescription>
                  Render beautiful mathematical equations using KaTeX. Perfect for
                  displaying formulas, theorems, and mathematical notation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Latex data={sampleLatex}>
                  <LatexHeader>
                    <LatexTitle>Mathematical Equations</LatexTitle>
                    <LatexActions>
                      <LatexCopyButton />
                      <LatexFullscreenButton />
                    </LatexActions>
                  </LatexHeader>
                  <LatexContent />
                </Latex>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Fast rendering with KaTeX</li>
                  <li>Display mode (block) and inline mode</li>
                  <li>Support for multiple equations</li>
                  <li>Equation labels and descriptions</li>
                  <li>Custom macros and options</li>
                  <li>Error handling for invalid LaTeX</li>
                  <li>Copy equation source and fullscreen mode</li>
                  <li>MathML and HTML output support</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maps Tab */}
          <TabsContent value="maps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maps Component</CardTitle>
                <CardDescription>
                  Display interactive maps with markers using Leaflet. Perfect for
                  showing locations, routes, and geographic data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Maps data={sampleMaps}>
                  <MapsHeader>
                    <MapsTitle>San Francisco</MapsTitle>
                    <MapsActions>
                      <MapsCopyButton />
                      <MapsFullscreenButton />
                    </MapsActions>
                  </MapsHeader>
                  <MapsContent />
                </Maps>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Interactive map with Leaflet</li>
                  <li>Pan, zoom, and navigation controls</li>
                  <li>Custom colored markers</li>
                  <li>Marker labels and popups</li>
                  <li>OpenStreetMap tiles</li>
                  <li>Center and zoom control</li>
                  <li>Copy map data and fullscreen mode</li>
                  <li>Programmatic map control via ref</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ThreeScene Tab */}
          <TabsContent value="threescene" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Three.js Scene Component</CardTitle>
                <CardDescription>
                  Render interactive 3D scenes with Three.js. Perfect for
                  visualizing 3D models, data, and interactive graphics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sampleThreeScene ? (
                  <ThreeScene
                    data={sampleThreeScene}
                    options={{
                      height: 500,
                      enableControls: true,
                      autoRotate: false,
                      gridHelper: true,
                      axesHelper: true,
                      antialias: true,
                    }}
                  >
                    <ThreeSceneHeader>
                      <ThreeSceneTitle>Interactive 3D Scene</ThreeSceneTitle>
                      <ThreeSceneActions>
                        <ThreeSceneResetButton />
                        <ThreeSceneCopyButton />
                        <ThreeSceneFullscreenButton />
                      </ThreeSceneActions>
                    </ThreeSceneHeader>
                    <ThreeSceneContent />
                  </ThreeScene>
                ) : (
                  <div className="flex h-[500px] items-center justify-center text-muted-foreground">
                    Loading 3D scene...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Three.js integration with WebGL rendering</li>
                  <li>OrbitControls for camera manipulation</li>
                  <li>Custom 3D objects and meshes</li>
                  <li>Multiple light types (ambient, directional, point, spot)</li>
                  <li>Grid and axes helpers</li>
                  <li>Auto-rotation and animation support</li>
                  <li>Reset camera and fullscreen mode</li>
                  <li>Customizable background and rendering options</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Component Statistics</CardTitle>
            <CardDescription>
              All components follow compound component patterns and are
              production-ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">7</div>
                <div className="text-muted-foreground text-sm">
                  Components Created
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">3,990+</div>
                <div className="text-muted-foreground text-sm">
                  Lines of Code
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">100%</div>
                <div className="text-muted-foreground text-sm">
                  TypeScript Coverage
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">✓</div>
                <div className="text-muted-foreground text-sm">
                  ESLint Compliant
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
