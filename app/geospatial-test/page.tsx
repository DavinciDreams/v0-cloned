import {
  Geospatial,
  GeospatialActions,
  GeospatialContent,
  GeospatialCopyButton,
  GeospatialFullscreenButton,
  GeospatialHeader,
  GeospatialLayerToggle,
  GeospatialLegend,
  GeospatialTitle,
  type GeospatialData,
} from "@/components/ai-elements/geospatial";

const sampleData: GeospatialData = {
  center: { lng: -122.4194, lat: 37.7749 },
  zoom: 10,
  layers: [
    {
      id: 'population-density',
      type: 'heatmap',
      data: [
        { lng: -122.4194, lat: 37.7749, value: 100 },
        { lng: -122.4084, lat: 37.7849, value: 80 },
        { lng: -122.4294, lat: 37.7649, value: 120 },
        { lng: -122.3994, lat: 37.7549, value: 95 },
        { lng: -122.4394, lat: 37.7949, value: 110 },
      ],
      style: {
        color: ['#0000ff', '#ff0000'],
        opacity: 0.6,
      },
    },
    {
      id: 'landmarks',
      type: 'point',
      data: [
        { lng: -122.4194, lat: 37.7749, value: 1, properties: { name: 'Downtown' } },
        { lng: -122.4083, lat: 37.7858, value: 1, properties: { name: 'North Beach' } },
      ],
      style: {
        color: '#3b82f6',
        size: 8,
        opacity: 0.9,
      },
    },
  ],
  basemap: 'dark',
};

export default function GeospatialTestPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Geospatial Test</h1>
        <p className="text-muted-foreground mt-2">
          Advanced geospatial visualization using AntV L7. This example shows a heatmap
          of population density and point markers for landmarks in San Francisco.
        </p>
      </div>

      <Geospatial data={sampleData} options={{ height: 600 }}>
        <GeospatialHeader>
          <GeospatialTitle />
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
        <GeospatialLegend />
      </Geospatial>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Geospatial Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Heatmap visualization for density data (100k+ points supported)</li>
          <li>Multiple layer support with independent styling</li>
          <li>Layer visibility toggle control</li>
          <li>Point, line, polygon, arc, hexagon, and heatmap types</li>
          <li>Custom color scales and opacity</li>
          <li>Different basemaps (light, dark, satellite)</li>
        </ul>
      </div>
    </div>
  );
}
