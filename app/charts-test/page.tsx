"use client";

import {
  Charts,
  ChartsActions,
  ChartsContent,
  ChartsCopyButton,
  ChartsExportButton,
  ChartsFullscreenButton,
  ChartsHeader,
  ChartsLegend,
  ChartsTitle,
  type ChartsData,
} from "@/components/ai-elements/charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// BASIC CHART TYPES
// ============================================================================

const lineChartData: ChartsData = {
  type: 'line',
  title: 'Monthly Revenue Trend',
  series: [
    {
      name: 'Revenue 2025',
      data: [
        { x: 'Jan', y: 45000 },
        { x: 'Feb', y: 52000 },
        { x: 'Mar', y: 48000 },
        { x: 'Apr', y: 61000 },
        { x: 'May', y: 58000 },
        { x: 'Jun', y: 67000 },
      ],
      color: '#3b82f6',
    },
    {
      name: 'Revenue 2024',
      data: [
        { x: 'Jan', y: 38000 },
        { x: 'Feb', y: 42000 },
        { x: 'Mar', y: 41000 },
        { x: 'Apr', y: 49000 },
        { x: 'May', y: 47000 },
        { x: 'Jun', y: 53000 },
      ],
      color: '#10b981',
    },
  ],
  xAxis: { title: 'Month' },
  yAxis: { title: 'Revenue ($)' },
};

const barChartData: ChartsData = {
  type: 'bar',
  title: 'Quarterly Sales by Region',
  series: [
    {
      name: 'North',
      data: [
        { x: 'Q1', y: 145000 },
        { x: 'Q2', y: 186000 },
        { x: 'Q3', y: 167000 },
        { x: 'Q4', y: 203000 },
      ],
      color: '#8b5cf6',
    },
    {
      name: 'South',
      data: [
        { x: 'Q1', y: 123000 },
        { x: 'Q2', y: 156000 },
        { x: 'Q3', y: 178000 },
        { x: 'Q4', y: 195000 },
      ],
      color: '#f59e0b',
    },
  ],
  yAxis: { title: 'Sales ($)' },
};

const pieChartData: ChartsData = {
  type: 'pie',
  title: 'Market Share Distribution',
  series: [
    {
      name: 'Market Share',
      data: [
        { x: 'Product A', y: 35 },
        { x: 'Product B', y: 25 },
        { x: 'Product C', y: 20 },
        { x: 'Product D', y: 12 },
        { x: 'Product E', y: 8 },
      ],
    },
  ],
};

const scatterChartData: ChartsData = {
  type: 'scatter',
  title: 'Customer Age vs Purchase Amount',
  series: [
    {
      name: 'Customers',
      data: [
        { x: 25, y: 1200 },
        { x: 32, y: 2400 },
        { x: 28, y: 1800 },
        { x: 45, y: 3200 },
        { x: 38, y: 2800 },
        { x: 52, y: 4100 },
        { x: 29, y: 1500 },
        { x: 41, y: 3500 },
        { x: 36, y: 2300 },
        { x: 48, y: 3800 },
      ],
      color: '#ec4899',
    },
  ],
  xAxis: { title: 'Age' },
  yAxis: { title: 'Purchase Amount ($)' },
};

const areaChartData: ChartsData = {
  type: 'area',
  title: 'Website Traffic Over Time',
  series: [
    {
      name: 'Organic',
      data: [
        { x: 'Week 1', y: 12000 },
        { x: 'Week 2', y: 15000 },
        { x: 'Week 3', y: 13500 },
        { x: 'Week 4', y: 18000 },
        { x: 'Week 5', y: 21000 },
      ],
      color: '#06b6d4',
    },
    {
      name: 'Paid',
      data: [
        { x: 'Week 1', y: 8000 },
        { x: 'Week 2', y: 9500 },
        { x: 'Week 3', y: 11000 },
        { x: 'Week 4', y: 10500 },
        { x: 'Week 5', y: 12000 },
      ],
      color: '#f97316',
    },
  ],
  xAxis: { title: 'Time Period' },
  yAxis: { title: 'Visitors' },
};

const radarChartData: ChartsData = {
  type: 'radar',
  title: 'Product Feature Comparison',
  series: [
    {
      name: 'Product A',
      data: [
        { x: 'Speed', y: 85 },
        { x: 'Quality', y: 92 },
        { x: 'Price', y: 70 },
        { x: 'Features', y: 88 },
        { x: 'Support', y: 78 },
      ],
      color: '#8b5cf6',
    },
    {
      name: 'Product B',
      data: [
        { x: 'Speed', y: 78 },
        { x: 'Quality', y: 85 },
        { x: 'Price', y: 90 },
        { x: 'Features', y: 75 },
        { x: 'Support', y: 82 },
      ],
      color: '#10b981',
    },
  ],
};

// ============================================================================
// ADVANCED CHART TYPES
// ============================================================================

const sankeyChartData: ChartsData = {
  type: 'sankey',
  title: 'Energy Flow Diagram',
  sankeyNodes: [
    { id: 'coal', name: 'Coal' },
    { id: 'gas', name: 'Natural Gas' },
    { id: 'solar', name: 'Solar' },
    { id: 'wind', name: 'Wind' },
    { id: 'electricity', name: 'Electricity' },
    { id: 'heating', name: 'Heating' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
  ],
  sankeyLinks: [
    { from: 'coal', to: 'electricity', value: 30 },
    { from: 'gas', to: 'electricity', value: 25 },
    { from: 'gas', to: 'heating', value: 15 },
    { from: 'solar', to: 'electricity', value: 12 },
    { from: 'wind', to: 'electricity', value: 18 },
    { from: 'electricity', to: 'industrial', value: 35 },
    { from: 'electricity', to: 'residential', value: 28 },
    { from: 'electricity', to: 'commercial', value: 22 },
    { from: 'heating', to: 'residential', value: 10 },
    { from: 'heating', to: 'commercial', value: 5 },
  ],
};

const chordChartData: ChartsData = {
  type: 'chord',
  title: 'Data Flow Between Systems',
  chordNodes: ['Frontend', 'Backend', 'Database', 'Cache', 'API'],
  chordLinks: [
    { from: 'Frontend', to: 'Backend', value: 150 },
    { from: 'Backend', to: 'Database', value: 200 },
    { from: 'Backend', to: 'Cache', value: 80 },
    { from: 'Backend', to: 'API', value: 120 },
    { from: 'Cache', to: 'Database', value: 60 },
    { from: 'API', to: 'Database', value: 90 },
    { from: 'Frontend', to: 'API', value: 100 },
  ],
};

const treemapChartData: ChartsData = {
  type: 'treemap',
  title: 'Company Revenue by Department',
  treeMapData: [
    {
      name: 'Sales',
      value: 450000,
      children: [
        { name: 'Enterprise', value: 280000 },
        { name: 'SMB', value: 120000 },
        { name: 'Retail', value: 50000 },
      ],
    },
    {
      name: 'Engineering',
      value: 380000,
      children: [
        { name: 'Product', value: 180000 },
        { name: 'Infrastructure', value: 120000 },
        { name: 'Security', value: 80000 },
      ],
    },
    {
      name: 'Marketing',
      value: 220000,
      children: [
        { name: 'Digital', value: 140000 },
        { name: 'Events', value: 50000 },
        { name: 'Content', value: 30000 },
      ],
    },
    {
      name: 'Operations',
      value: 150000,
      children: [
        { name: 'Support', value: 90000 },
        { name: 'HR', value: 60000 },
      ],
    },
  ],
};

const forceDirectedChartData: ChartsData = {
  type: 'forceDirected',
  title: 'Social Network Graph',
  graphNodes: [
    { id: 'user1', name: 'Alice', value: 100 },
    { id: 'user2', name: 'Bob', value: 80 },
    { id: 'user3', name: 'Charlie', value: 90 },
    { id: 'user4', name: 'Diana', value: 70 },
    { id: 'user5', name: 'Eve', value: 85 },
    { id: 'user6', name: 'Frank', value: 75 },
  ],
  graphLinks: [
    { from: 'user1', to: 'user2', value: 5 },
    { from: 'user1', to: 'user3', value: 3 },
    { from: 'user2', to: 'user3', value: 4 },
    { from: 'user2', to: 'user4', value: 2 },
    { from: 'user3', to: 'user5', value: 6 },
    { from: 'user4', to: 'user5', value: 3 },
    { from: 'user5', to: 'user6', value: 4 },
    { from: 'user1', to: 'user6', value: 2 },
  ],
};

const hierarchyChartData: ChartsData = {
  type: 'hierarchy',
  title: 'Organization Structure',
  hierarchyData: {
    name: 'CEO',
    value: 1,
    children: [
      {
        name: 'CTO',
        value: 1,
        children: [
          { name: 'Engineering Manager', value: 1, children: [
            { name: 'Senior Dev 1', value: 1 },
            { name: 'Senior Dev 2', value: 1 },
          ]},
          { name: 'DevOps Lead', value: 1 },
        ],
      },
      {
        name: 'CMO',
        value: 1,
        children: [
          { name: 'Marketing Manager', value: 1 },
          { name: 'Content Lead', value: 1 },
        ],
      },
      {
        name: 'CFO',
        value: 1,
        children: [
          { name: 'Accounting', value: 1 },
          { name: 'Finance', value: 1 },
        ],
      },
    ],
  },
};

const wordCloudChartData: ChartsData = {
  type: 'wordCloud',
  title: 'Technology Keywords',
  words: [
    { text: 'React', value: 85 },
    { text: 'TypeScript', value: 78 },
    { text: 'JavaScript', value: 92 },
    { text: 'Node.js', value: 70 },
    { text: 'Python', value: 65 },
    { text: 'AI', value: 88 },
    { text: 'Machine Learning', value: 75 },
    { text: 'Cloud', value: 68 },
    { text: 'Docker', value: 58 },
    { text: 'Kubernetes', value: 52 },
    { text: 'GraphQL', value: 45 },
    { text: 'REST API', value: 62 },
    { text: 'Microservices', value: 48 },
    { text: 'DevOps', value: 55 },
    { text: 'CI/CD', value: 42 },
  ],
};

const vennChartData: ChartsData = {
  type: 'venn',
  title: 'Skills Overlap Analysis',
  vennSets: [
    { name: 'Frontend', value: 120 },
    { name: 'Backend', value: 100 },
    { name: 'DevOps', value: 80 },
  ],
  vennIntersections: [
    { sets: ['Frontend', 'Backend'], value: 45 },
    { sets: ['Backend', 'DevOps'], value: 35 },
    { sets: ['Frontend', 'DevOps'], value: 25 },
    { sets: ['Frontend', 'Backend', 'DevOps'], value: 15 },
  ],
};

export default function ChartsTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Charts Component Gallery</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Comprehensive showcase of all 13 chart types powered by amCharts 5
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Charts (6)</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Charts (7)</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
              <CardDescription>Perfect for showing trends over time with multiple series</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={lineChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
                <ChartsLegend />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bar Chart</CardTitle>
              <CardDescription>Ideal for comparing values across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={barChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
                <ChartsLegend />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pie Chart</CardTitle>
              <CardDescription>Show proportions and percentages of a whole</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={pieChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scatter Plot</CardTitle>
              <CardDescription>Visualize correlations between two variables</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={scatterChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
                <ChartsLegend />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Area Chart</CardTitle>
              <CardDescription>Emphasize magnitude of change over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={areaChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
                <ChartsLegend />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radar Chart</CardTitle>
              <CardDescription>Compare multiple variables across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={radarChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
                <ChartsLegend />
              </Charts>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sankey Diagram</CardTitle>
              <CardDescription>Visualize flow and quantity distribution between nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={sankeyChartData} options={{ height: 500 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chord Diagram</CardTitle>
              <CardDescription>Show relationships and flows between entities in a circular layout</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={chordChartData} options={{ height: 500 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TreeMap</CardTitle>
              <CardDescription>Display hierarchical data using nested rectangles</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={treemapChartData} options={{ height: 500 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Force-Directed Graph</CardTitle>
              <CardDescription>Network visualization with physics-based node positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={forceDirectedChartData} options={{ height: 500 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hierarchy Chart</CardTitle>
              <CardDescription>Tree structure visualization for organizational data</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={hierarchyChartData} options={{ height: 500 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Word Cloud</CardTitle>
              <CardDescription>Text frequency visualization with sized keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={wordCloudChartData} options={{ height: 400 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Venn Diagram</CardTitle>
              <CardDescription>Show set overlaps and intersections</CardDescription>
            </CardHeader>
            <CardContent>
              <Charts data={vennChartData} options={{ height: 500 }}>
                <ChartsHeader>
                  <ChartsTitle />
                  <ChartsActions>
                    <ChartsExportButton />
                    <ChartsCopyButton />
                    <ChartsFullscreenButton />
                  </ChartsActions>
                </ChartsHeader>
                <ChartsContent />
              </Charts>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Chart Types Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-3 text-base">Basic Charts (6)</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Line:</strong> Trends and time series data</li>
                <li><strong>Bar:</strong> Category comparisons</li>
                <li><strong>Pie:</strong> Proportions and percentages</li>
                <li><strong>Scatter:</strong> Correlations and distributions</li>
                <li><strong>Area:</strong> Magnitude over time</li>
                <li><strong>Radar:</strong> Multi-variable comparisons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-base">Advanced Charts (7)</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Sankey:</strong> Flow and quantity distribution</li>
                <li><strong>Chord:</strong> Circular relationship visualization</li>
                <li><strong>TreeMap:</strong> Hierarchical nested rectangles</li>
                <li><strong>Force-Directed:</strong> Network graphs</li>
                <li><strong>Hierarchy:</strong> Tree structure organization</li>
                <li><strong>Word Cloud:</strong> Text frequency visualization</li>
                <li><strong>Venn:</strong> Set overlaps and intersections</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <li>✅ 13 chart types</li>
              <li>✅ Interactive pan & zoom</li>
              <li>✅ Export to PNG/SVG</li>
              <li>✅ Fullscreen mode</li>
              <li>✅ Auto legends</li>
              <li>✅ Smooth animations</li>
              <li>✅ Custom colors</li>
              <li>✅ Multiple series</li>
              <li>✅ Responsive design</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
