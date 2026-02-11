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

// Import Leaflet styles
import "leaflet/dist/leaflet.css";

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

// --- Tile URLs for basemaps ---

const TILE_URLS: Record<string, string> = {
  light: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

const TILE_ATTRIBUTIONS: Record<string, string> = {
  light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  satellite: '&copy; <a href="https://www.esri.com/">Esri</a>',
};

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

      // Initialize Leaflet map with geospatial layers
      useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        const initMap = async () => {
          try {
            const L = (await import("leaflet")).default;
            // Import leaflet.heat - it attaches to L automatically
            await import("leaflet.heat");

            // Fix default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
              iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            const map = L.map(containerRef.current!, {
              center: [data.center.lat, data.center.lng],
              zoom: data.zoom,
              zoomControl: options?.showControls !== false,
            });

            // Add tile layer based on basemap setting
            const basemap = data.basemap || 'light';
            L.tileLayer(TILE_URLS[basemap] || TILE_URLS.light, {
              attribution: TILE_ATTRIBUTIONS[basemap] || TILE_ATTRIBUTIONS.light,
              maxZoom: 19,
            }).addTo(map);

            // Track Leaflet layers for toggling
            const leafletLayers = new Map<string, L.Layer>();

            // Add data layers
            data.layers.forEach((layer) => {
              const isVisible = layerVisibility.get(layer.id) ?? true;

              if (layer.type === 'heatmap') {
                // Use leaflet.heat for heatmap layers
                const heatData: Array<[number, number, number]> = layer.data.map((point) => [
                  point.lat,
                  point.lng,
                  point.value || 1,
                ]);

                const heatLayer = (L as any).heatLayer(heatData, {
                  radius: layer.style.size || 25,
                  blur: 15,
                  maxZoom: 17,
                  max: Math.max(...layer.data.map(p => p.value || 1)),
                  gradient: Array.isArray(layer.style.color)
                    ? layer.style.color.reduce((acc: Record<number, string>, color: string, i: number, arr: string[]) => {
                        acc[i / (arr.length - 1)] = color;
                        return acc;
                      }, {} as Record<number, string>)
                    : undefined,
                });

                leafletLayers.set(layer.id, heatLayer);
                if (isVisible) heatLayer.addTo(map);

              } else if (layer.type === 'point' || layer.type === 'hexagon') {
                // Point layers as circle markers
                const layerGroup = L.layerGroup();
                layer.data.forEach((point) => {
                  const color = Array.isArray(layer.style.color) ? layer.style.color[0] : layer.style.color;
                  L.circleMarker([point.lat, point.lng], {
                    radius: layer.style.size || 6,
                    fillColor: color,
                    color: color,
                    weight: 1,
                    opacity: layer.style.opacity || 0.9,
                    fillOpacity: layer.style.opacity || 0.7,
                  })
                    .bindPopup(
                      point.properties
                        ? Object.entries(point.properties).map(([k, v]) => `<b>${k}:</b> ${v}`).join('<br/>')
                        : `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`
                    )
                    .addTo(layerGroup);
                });

                leafletLayers.set(layer.id, layerGroup);
                if (isVisible) layerGroup.addTo(map);

              } else if (layer.type === 'line' || layer.type === 'arc') {
                // Line/arc layers as polylines
                const color = Array.isArray(layer.style.color) ? layer.style.color[0] : layer.style.color;
                const coords = layer.data.map(p => [p.lat, p.lng] as [number, number]);
                const polyline = L.polyline(coords, {
                  color,
                  weight: layer.style.size || 2,
                  opacity: layer.style.opacity || 0.8,
                });

                leafletLayers.set(layer.id, polyline);
                if (isVisible) polyline.addTo(map);

              } else if (layer.type === 'polygon') {
                // Polygon layers
                const color = Array.isArray(layer.style.color) ? layer.style.color[0] : layer.style.color;
                const coords = layer.data.map(p => [p.lat, p.lng] as [number, number]);
                const polygon = L.polygon(coords, {
                  color,
                  fillColor: color,
                  weight: 2,
                  opacity: layer.style.opacity || 0.8,
                  fillOpacity: (layer.style.opacity || 0.8) * 0.3,
                });

                leafletLayers.set(layer.id, polygon);
                if (isVisible) polygon.addTo(map);
              }
            });

            sceneRef.current = { map, leafletLayers };

            // Set up ref methods
            geospatialRef.current = {
              flyTo: (coords: GeospatialCoordinates, zoom?: number) => {
                map.flyTo([coords.lat, coords.lng], zoom || map.getZoom());
              },
              setZoom: (zoom: number) => {
                map.setZoom(zoom);
              },
              toggleLayer: (layerId: string) => {
                const layer = leafletLayers.get(layerId);
                if (layer) {
                  if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                  } else {
                    layer.addTo(map);
                  }
                }
              },
              getCenter: () => {
                const center = map.getCenter();
                return { lng: center.lng, lat: center.lat };
              },
              getZoom: () => {
                return map.getZoom();
              },
            };
          } catch (err) {
            console.error("Failed to initialize geospatial map:", err);
          }
        };

        initMap();

        return () => {
          if (sceneRef.current?.map) {
            sceneRef.current.map.remove();
            sceneRef.current = null;
            geospatialRef.current = null;
          }
        };
      }, [isMounted, data, layerVisibility, sceneRef, geospatialRef, options]);

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
            className={cn("relative flex-1 overflow-hidden", className)}
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
          className={cn("relative flex-1 overflow-hidden", className)}
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
