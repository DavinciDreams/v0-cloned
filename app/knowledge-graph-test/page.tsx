
import {
  KnowledgeGraph,
  KnowledgeGraphActions,
  KnowledgeGraphContent,
  KnowledgeGraphCopyButton,
  KnowledgeGraphFullscreenButton,
  KnowledgeGraphHeader,
  KnowledgeGraphLegend,
  KnowledgeGraphSearch,
  KnowledgeGraphTitle,
  type KnowledgeGraphData,
} from "@/components/ai-elements/knowledge-graph";

const sampleData: KnowledgeGraphData = {
  entities: [
    {
      id: "react",
      label: "React",
      type: "concept",
      description: "UI library",
    },
    {
      id: "nextjs",
      label: "Next.js",
      type: "concept",
      description: "React framework",
    },
    {
      id: "vercel",
      label: "Vercel",
      type: "organization",
      description: "Cloud platform company",
    },
    {
      id: "typescript",
      label: "TypeScript",
      type: "concept",
      description: "Typed superset of JavaScript",
    },
    {
      id: "tailwind",
      label: "Tailwind CSS",
      type: "concept",
      description: "Utility-first CSS framework",
    },
    {
      id: "shadcn",
      label: "shadcn/ui",
      type: "concept",
      description: "Component library",
    },
    {
      id: "san-francisco",
      label: "San Francisco",
      type: "location",
      description: "Tech hub city",
    },
    {
      id: "guillermo",
      label: "Guillermo Rauch",
      type: "person",
      description: "CEO of Vercel",
    },
  ],
  relationships: [
    { id: "r1", source: "nextjs", target: "react", type: "built_on", label: "built on" },
    { id: "r2", source: "nextjs", target: "typescript", type: "supports", label: "supports" },
    { id: "r3", source: "vercel", target: "nextjs", type: "creates", label: "creates" },
    { id: "r4", source: "vercel", target: "san-francisco", type: "located_in", label: "located in" },
    { id: "r5", source: "guillermo", target: "vercel", type: "leads", label: "leads" },
    { id: "r6", source: "shadcn", target: "react", type: "built_for", label: "built for" },
    { id: "r7", source: "shadcn", target: "tailwind", type: "uses", label: "uses" },
    { id: "r8", source: "nextjs", target: "tailwind", type: "integrates", label: "integrates" },
  ],
};

export default function KnowledgeGraphTestPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Knowledge Graph Test</h1>
        <p className="text-muted-foreground mt-2">
          Entity-relationship graph visualization
        </p>
      </div>

      <KnowledgeGraph data={sampleData} title="Modern Web Stack">
        <KnowledgeGraphHeader>
          <KnowledgeGraphTitle />
          <KnowledgeGraphActions>
            <KnowledgeGraphSearch />
            <KnowledgeGraphCopyButton />
            <KnowledgeGraphFullscreenButton />
          </KnowledgeGraphActions>
        </KnowledgeGraphHeader>
        <KnowledgeGraphContent />
        <KnowledgeGraphLegend />
      </KnowledgeGraph>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Knowledge Graph Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Interactive node-based graph visualization</li>
          <li>Color-coded entity types (person, organization, concept, location)</li>
          <li>Search and filter entities</li>
          <li>Drag nodes to rearrange</li>
          <li>Pan and zoom controls</li>
          <li>Legend showing entity types</li>
          <li>Relationship labels between entities</li>
        </ul>
      </div>
    </div>
  );
}
