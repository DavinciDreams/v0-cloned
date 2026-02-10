"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
  LayersIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// --- Types ---

export interface GeospatialCoordinates {
  lng: number;
  lat: number;
}

export interface GeospatialLayer {
  id: string;
  type: 'point' | 'line' | 'polygon' | 'heatmap' | 'hexagon' | 'arc';
  data: Array<{
    lng: number;
    lat: number;
    value?: number;
    properties?: Record<string, unknown>;
  }>;
  style: {
    color: string | Array<string>;
    size?: number;
    opacity?: number;
  };
  visible?: boolean;
}

export interface GeospatialData {
  center: GeospatialCoordinates;
  zoom: number;
  layers: GeospatialLayer[];
  basemap?: 'light' | 'dark' | 'satellite';
}

export interface GeospatialOptions {
  height?: number | string;
  width?: number | string;
  interactive?: boolean;
  showControls?: boolean;
  [key: string]: unknown;
}

export interface GeospatialRef {
  flyTo: (coords: GeospatialCoordinates, zoom?: number) => void;
  setZoom: (zoom: number) => void;
  toggleLayer: (layerId: string) => void;
  getCenter: () => GeospatialCoordinates | null;
  getZoom: () => number | null;
}

// --- Context ---

interface GeospatialContextValue {
  data: GeospatialData;
  options?: GeospatialOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
  geospatialRef: React.RefObject<GeospatialRef | null>;
  sceneRef: React.RefObject<any>;
  layerVisibility: Map<string, boolean>;
  toggleLayerVisibility: (layerId: string) => void;
}

const GeospatialContext = createContext<GeospatialContextValue | null>(null);

const useGeospatialContext = () => {
  const context = useContext(GeospatialContext);
  if (!context) {
    throw new Error("Geospatial components must be used within Geospatial");
  }
  return context;
};

// --- Geospatial Component ---

export interface GeospatialProps extends HTMLAttributes<HTMLDivElement> {
  data: GeospatialData;
  options?: GeospatialOptions;
  children?: ReactNode;
}

export const Geospatial = forwardRef<GeospatialRef, GeospatialProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const sceneRef = useRef<any>(null);
    const geospatialRef = useRef<GeospatialRef | null>(null);
    const [layerVisibility, setLayerVisibility] = useState<Map<string, boolean>>(() => {
      const map = new Map<string, boolean>();
      data.layers.forEach(layer => {
        map.set(layer.id, layer.visible !== false);
      });
      return map;
    });

    // Expose ref
    useImperativeHandle(ref, () => geospatialRef.current as GeospatialRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const toggleLayerVisibility = useCallback((layerId: string) => {
      setLayerVisibility((prev) => {
        const newMap = new Map(prev);
        newMap.set(layerId, !prev.get(layerId));
        return newMap;
      });
    }, []);

    const contextValue: GeospatialContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
      geospatialRef,
      sceneRef,
      layerVisibility,
      toggleLayerVisibility,
    };

    return (
      <GeospatialContext.Provider value={contextValue}>
        <div
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm",
            fullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </GeospatialContext.Provider>
    );
  }
);

Geospatial.displayName = "Geospatial";

// --- Geospatial Header ---

export const GeospatialHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-2 p-4 pb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

GeospatialHeader.displayName = "GeospatialHeader";

// --- Geospatial Title ---

export const GeospatialTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || "Geospatial Visualization"}
      </h3>
    </div>
  );
});

GeospatialTitle.displayName = "GeospatialTitle";

// --- Geospatial Actions ---

export const GeospatialActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

GeospatialActions.displayName = "GeospatialActions";

// --- Geospatial Layer Toggle ---

export const GeospatialLayerToggle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, layerVisibility, toggleLayerVisibility } = useGeospatialContext();
  const [showLayers, setShowLayers] = useState(false);

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setShowLayers(!showLayers)}
      >
        <LayersIcon className="h-4 w-4" />
      </Button>
      {showLayers && (
        <div className="absolute right-0 top-10 z-10 w-48 rounded-md border bg-popover p-2 shadow-md">
          <div className="text-sm font-semibold mb-2">Layers</div>
          {data.layers.map((layer) => (
            <label
              key={layer.id}
              className="flex items-center gap-2 p-1 cursor-pointer hover:bg-accent rounded"
            >
              <input
                type="checkbox"
                checked={layerVisibility.get(layer.id) ?? true}
                onChange={() => toggleLayerVisibility(layer.id)}
                className="h-4 w-4"
              />
              <span className="text-sm">{layer.id}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
});

GeospatialLayerToggle.displayName = "GeospatialLayerToggle";

// --- Geospatial Copy Button ---

export const GeospatialCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useGeospatialContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

GeospatialCopyButton.displayName = "GeospatialCopyButton";

// --- Geospatial Fullscreen Button ---

export const GeospatialFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useGeospatialContext();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={() => setFullscreen(!fullscreen)}
      {...props}
    >
      {fullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

GeospatialFullscreenButton.displayName = "GeospatialFullscreenButton";

// --- Geospatial Content ---

export const GeospatialContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        fullscreen,
        geospatialRef,
        sceneRef,
        layerVisibility,
      } = useGeospatialContext();

      const [isMounted, setIsMounted] = useState(false);
      const containerRef = useRef<HTMLDivElement>(null);

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize L7 map
      useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        const initMap = async () => {
          try {
            const { Scene, GaodeMap, PointLayer, HeatmapLayer } = await import('@antv/l7');

            const scene = new Scene({
              id: containerRef.current!,
              map: new GaodeMap({
                center: [data.center.lng, data.center.lat],
                zoom: data.zoom,
                style: data.basemap || 'light',
              }),
            });

            await scene.on('loaded', () => {
              // Add layers
              data.layers.forEach((layer) => {
                const isVisible = layerVisibility.get(layer.id) ?? true;
                if (!isVisible) return;

                const geoData = {
                  type: 'FeatureCollection',
                  features: layer.data.map((point) => ({
                    type: 'Feature',
                    properties: {
                      ...point.properties,
                      value: point.value || 1, // Ensure value is in properties
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: [point.lng, point.lat],
                    },
                  })),
                };

                if (layer.type === 'heatmap') {
                  const heatmapLayer = new HeatmapLayer({})
                    .source(geoData)
                    .size('value', [0, 1])
                    .shape('heatmap')
                    .style({
                      intensity: 3,
                      radius: 30,
                      opacity: layer.style.opacity || 0.8,
                      rampColors: {
                        colors: Array.isArray(layer.style.color)
                          ? layer.style.color
                          : ['#0000ff', '#00ff00', '#ffff00', '#ff0000'],
                        positions: [0, 0.33, 0.66, 1],
                      },
                    });
                  scene.addLayer(heatmapLayer);
                } else if (layer.type === 'hexagon') {
                  // HexagonLayer not available in @antv/l7 - using PointLayer as fallback
                  const pointLayer = new PointLayer({})
                    .source(geoData)
                    .shape('circle')
                    .size(layer.style.size || 8)
                    .color(layer.style.color)
                    .style({
                      opacity: layer.style.opacity || 0.8,
                    });
                  scene.addLayer(pointLayer);
                } else {
                  const pointLayer = new PointLayer({})
                    .source(geoData)
                    .shape('circle')
                    .size(layer.style.size || 5)
                    .color(layer.style.color)
                    .style({
                      opacity: layer.style.opacity || 0.8,
                    });
                  scene.addLayer(pointLayer);
                }
              });
            });

            sceneRef.current = scene;

            // Set up ref methods
            geospatialRef.current = {
              flyTo: (coords: GeospatialCoordinates, zoom?: number) => {
                scene.setCenter([coords.lng, coords.lat]);
                if (zoom) scene.setZoom(zoom);
              },
              setZoom: (zoom: number) => {
                scene.setZoom(zoom);
              },
              toggleLayer: (layerId: string) => {
                // Implementation for layer toggle
                console.log('Toggle layer:', layerId);
              },
              getCenter: () => {
                const center = scene.getCenter();
                return { lng: center.lng, lat: center.lat };
              },
              getZoom: () => {
                return scene.getZoom();
              },
            };
          } catch (err) {
            console.error("Failed to initialize geospatial map:", err);
          }
        };

        initMap();

        return () => {
          if (sceneRef.current) {
            sceneRef.current.destroy();
            sceneRef.current = null;
            geospatialRef.current = null;
          }
        };
      }, [isMounted, data, layerVisibility, sceneRef, geospatialRef]);

      if (error) {
        return <GeospatialError error={error} />;
      }

      const height = options?.height || (fullscreen ? "100%" : 600);
      const width = options?.width || "100%";

      // Don't render map container until mounted on client
      if (!isMounted) {
        return (
          <div
            ref={ref}
            className={cn("relative flex-1 p-4", className)}
            {...props}
          >
            <div
              style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Loading geospatial visualization...
            </div>
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 p-4", className)}
          {...props}
        >
          <div
            ref={containerRef}
            style={{
              width: typeof width === "number" ? `${width}px` : width,
              height: typeof height === "number" ? `${height}px` : height,
            }}
          />
        </div>
      );
    }
  )
);

GeospatialContent.displayName = "GeospatialContent";

// --- Geospatial Legend ---

export const GeospatialLegend = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useGeospatialContext();

  return (
    <div
      ref={ref}
      className={cn("p-4 pt-0", className)}
      {...props}
    >
      <div className="rounded-md bg-muted p-3">
        <div className="text-sm font-semibold mb-2">Layers</div>
        <div className="space-y-1">
          {data.layers.map((layer) => (
            <div key={layer.id} className="flex items-center gap-2 text-xs">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: Array.isArray(layer.style.color)
                    ? layer.style.color[0]
                    : layer.style.color,
                }}
              />
              <span>{layer.id} ({layer.type})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

GeospatialLegend.displayName = "GeospatialLegend";

// --- Geospatial Error ---

const GeospatialError = ({ error }: { error: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
      <AlertCircle className="h-8 w-8" />
      <p className="text-sm">{error}</p>
    </div>
  );
};
