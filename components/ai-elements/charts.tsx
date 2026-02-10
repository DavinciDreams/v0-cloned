"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Import and re-export Zod-inferred types from schema
import type {
  ChartsData,
  ChartsOptions,
  Series,
  DataPoint,
  AxisConfig,
} from '@/lib/schemas/charts.schema';

export type {
  ChartsData,
  ChartsOptions,
  Series,
  DataPoint,
  AxisConfig,
};

// --- Types ---

// Component-specific types (not in schema)

// --- Context ---

interface ChartsContextValue {
  data: ChartsData;
  options?: ChartsOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  chartDivId: string;
  rootRef: React.RefObject<any>;
}

const ChartsContext = createContext<ChartsContextValue | null>(null);

const useChartsContext = () => {
  const context = useContext(ChartsContext);
  if (!context) {
    throw new Error("Charts components must be used within Charts");
  }
  return context;
};

// --- Charts Component ---

export interface ChartsProps extends HTMLAttributes<HTMLDivElement> {
  data: ChartsData;
  options?: ChartsOptions;
  children?: ReactNode;
}

export const Charts = forwardRef<HTMLDivElement, ChartsProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const rootRef = useRef<any>(null);
    const [chartDivId] = useState(() =>
      typeof window !== 'undefined'
        ? `chart-${Math.random().toString(36).substr(2, 9)}`
        : 'chart-ssr'
    );

    const contextValue: ChartsContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      chartDivId,
      rootRef,
    };

    return (
      <ChartsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm",
            fullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ChartsContext.Provider>
    );
  }
);

Charts.displayName = "Charts";

// --- Charts Header ---

export const ChartsHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ChartsHeader.displayName = "ChartsHeader";

// --- Charts Title ---

export const ChartsTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { data } = useChartsContext();

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <span className="font-mono">
        {children || data.title || `${data.type.toUpperCase()} Chart`}
      </span>
    </div>
  );
});

ChartsTitle.displayName = "ChartsTitle";

// --- Charts Actions ---

export const ChartsActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

ChartsActions.displayName = "ChartsActions";

// --- Charts Export Button ---

export const ChartsExportButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & { format?: 'png' | 'svg' }
>(({ className, format = 'png', ...props }, ref) => {
  const { rootRef } = useChartsContext();

  const handleExport = useCallback(async () => {
    if (!rootRef.current) return;

    try {
      if (format === 'png') {
        const exporting = await import('@amcharts/amcharts5/plugins/exporting');
        // Note: Actual export would be handled by the chart instance
        // This is a placeholder for the button
        console.log('Export as PNG requested');
      } else {
        console.log('Export as SVG requested');
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [rootRef, format]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleExport}
      title={`Export as ${format.toUpperCase()}`}
      {...props}
    >
      <DownloadIcon className="h-3.5 w-3.5" />
    </Button>
  );
});

ChartsExportButton.displayName = "ChartsExportButton";

// --- Charts Copy Button ---

export const ChartsCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { data } = useChartsContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
});

ChartsCopyButton.displayName = "ChartsCopyButton";

// --- Charts Fullscreen Button ---

export const ChartsFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useChartsContext();

  const handleToggle = useCallback(() => {
    setFullscreen(!fullscreen);
  }, [fullscreen, setFullscreen]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleToggle}
      {...props}
    >
      {fullscreen ? (
        <MinimizeIcon className="h-3.5 w-3.5" />
      ) : (
        <MaximizeIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
});

ChartsFullscreenButton.displayName = "ChartsFullscreenButton";

// --- Charts Content ---

export const ChartsContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const { data, options, error, setError, fullscreen, chartDivId, rootRef } =
        useChartsContext();

      const [isMounted, setIsMounted] = useState(false);

      // Only render on client
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize chart
      useEffect(() => {
        if (!isMounted) return;

        let root: any;
        let chart: any;

        const initChart = async () => {
          try {
            const am5 = await import('@amcharts/amcharts5');
            const am5xy = await import('@amcharts/amcharts5/xy');
            const am5percent = await import('@amcharts/amcharts5/percent');
            const am5radar = await import('@amcharts/amcharts5/radar');
            const am5themes_Animated = await import('@amcharts/amcharts5/themes/Animated');

            const chartDiv = document.getElementById(chartDivId);
            if (!chartDiv) return;

            // Create root
            root = am5.Root.new(chartDiv);
            rootRef.current = root;

            // Set themes
            if (options?.animated !== false) {
              root.setThemes([am5themes_Animated.default.new(root)]);
            }

            // Create chart based on type
            switch (data.type) {
              case 'line':
              case 'area':
              case 'bar':
              case 'scatter': {
                chart = root.container.children.push(
                  am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    wheelX: 'panX',
                    wheelY: 'zoomX',
                    pinchZoomX: true,
                  })
                );

                // Add cursor
                chart.set('cursor', am5xy.XYCursor.new(root, {}));

                // Create axes
                const xAxis = chart.xAxes.push(
                  am5xy.CategoryAxis.new(root, {
                    categoryField: 'x',
                    renderer: am5xy.AxisRendererX.new(root, {}),
                  })
                );

                const yAxis = chart.yAxes.push(
                  am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererY.new(root, {}),
                  })
                );

                if ('yAxis' in data && data.yAxis?.title) {
                  yAxis.children.unshift(
                    am5.Label.new(root, {
                      text: data.yAxis.title,
                      rotation: -90,
                      y: am5.p50,
                      centerX: am5.p50,
                    })
                  );
                }

                // Add series
                if ('series' in data) {
                  data.series.forEach((seriesData) => {
                  let series: any;

                  if (data.type === 'line') {
                    series = chart.series.push(
                      am5xy.LineSeries.new(root, {
                        name: seriesData.name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: 'y',
                        categoryXField: 'x',
                        stroke: seriesData.color ? am5.color(seriesData.color) : undefined,
                      })
                    );
                    series.strokes.template.setAll({ strokeWidth: 2 });
                  } else if (data.type === 'area') {
                    series = chart.series.push(
                      am5xy.LineSeries.new(root, {
                        name: seriesData.name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: 'y',
                        categoryXField: 'x',
                        fill: seriesData.color ? am5.color(seriesData.color) : undefined,
                      })
                    );
                    series.fills.template.setAll({ visible: true, fillOpacity: 0.5 });
                  } else if (data.type === 'bar') {
                    series = chart.series.push(
                      am5xy.ColumnSeries.new(root, {
                        name: seriesData.name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: 'y',
                        categoryXField: 'x',
                        fill: seriesData.color ? am5.color(seriesData.color) : undefined,
                      })
                    );
                  } else if (data.type === 'scatter') {
                    series = chart.series.push(
                      am5xy.LineSeries.new(root, {
                        name: seriesData.name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: 'y',
                        categoryXField: 'x',
                      })
                    );
                    series.strokes.template.set('visible', false);
                    series.bullets.push(() => {
                      return am5.Bullet.new(root, {
                        sprite: am5.Circle.new(root, {
                          radius: 5,
                          fill: seriesData.color ? am5.color(seriesData.color) : series.get('fill'),
                        }),
                      });
                    });
                  }

                    series.data.setAll(seriesData.data);
                  });

                  // Set data on xAxis
                  const allXValues = Array.from(
                    new Set(data.series.flatMap((s) => s.data.map((d) => d.x)))
                  );
                  xAxis.data.setAll(allXValues.map((x) => ({ x })));
                }
                break;
              }

              case 'pie': {
                chart = root.container.children.push(
                  am5percent.PieChart.new(root, {
                    layout: root.verticalLayout,
                  })
                );

                const series = chart.series.push(
                  am5percent.PieSeries.new(root, {
                    valueField: 'value',
                    categoryField: 'category',
                  })
                );

                // Combine all series data for pie chart
                if ('series' in data) {
                  const pieData = data.series.flatMap((s) =>
                    s.data.map((d) => ({
                      category: typeof d.x === 'string' ? d.x : d.label || `${d.x}`,
                      value: d.y,
                    }))
                  );

                  series.data.setAll(pieData);
                  series.labels.template.set('text', "{category}: {valuePercentTotal.formatNumber('0.00')}%");
                }
                break;
              }

              case 'radar': {
                chart = root.container.children.push(
                  am5radar.RadarChart.new(root, {
                    panX: false,
                    panY: false,
                    wheelX: 'none',
                    wheelY: 'none',
                  })
                );

                const xAxis = chart.xAxes.push(
                  am5xy.CategoryAxis.new(root, {
                    categoryField: 'x',
                    renderer: am5radar.AxisRendererCircular.new(root, {}),
                  })
                );

                const yAxis = chart.yAxes.push(
                  am5xy.ValueAxis.new(root, {
                    renderer: am5radar.AxisRendererRadial.new(root, {}),
                  })
                );

                if ('series' in data) {
                  data.series.forEach((seriesData) => {
                    const series = chart.series.push(
                      am5radar.RadarLineSeries.new(root, {
                        name: seriesData.name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: 'y',
                        categoryXField: 'x',
                        stroke: seriesData.color ? am5.color(seriesData.color) : undefined,
                        fill: seriesData.color ? am5.color(seriesData.color) : undefined,
                      })
                    );

                    series.fills.template.setAll({ visible: true, fillOpacity: 0.2 });
                    series.data.setAll(seriesData.data);
                  });

                  const allXValues = Array.from(
                    new Set(data.series.flatMap((s) => s.data.map((d) => d.x)))
                  );
                  xAxis.data.setAll(allXValues.map((x) => ({ x })));
                }
                break;
              }

              case 'sankey': {
                const am5flow = await import('@amcharts/amcharts5/flow');

                chart = root.container.children.push(
                  am5flow.Sankey.new(root, {
                    sourceIdField: 'from',
                    targetIdField: 'to',
                    valueField: 'value',
                    nodePadding: 20,
                  })
                );

                if ('sankeyNodes' in data && 'sankeyLinks' in data) {
                  chart.nodes.data.setAll(data.sankeyNodes);
                  chart.data.setAll(data.sankeyLinks);
                }
                break;
              }

              case 'chord': {
                const am5flow = await import('@amcharts/amcharts5/flow');

                chart = root.container.children.push(
                  am5flow.Chord.new(root, {
                    sourceIdField: 'from',
                    targetIdField: 'to',
                    valueField: 'value',
                  })
                );

                if ('chordNodes' in data && 'chordLinks' in data) {
                  chart.nodes.data.setAll(data.chordNodes.map(node => ({ id: node, name: node })));
                  chart.data.setAll(data.chordLinks);
                }
                break;
              }

              case 'treemap': {
                const am5hierarchy = await import('@amcharts/amcharts5/hierarchy');

                chart = root.container.children.push(
                  am5hierarchy.Treemap.new(root, {
                    singleBranchOnly: false,
                    downDepth: 1,
                    initialDepth: 2,
                    valueField: 'value',
                    categoryField: 'name',
                    childDataField: 'children',
                  })
                );

                if ('treeMapData' in data) {
                  chart.data.setAll(data.treeMapData);
                }
                break;
              }

              case 'forceDirected': {
                const am5hierarchy = await import('@amcharts/amcharts5/hierarchy');

                chart = root.container.children.push(
                  am5hierarchy.ForceDirected.new(root, {
                    singleBranchOnly: false,
                    downDepth: 1,
                    initialDepth: 1,
                    valueField: 'value',
                    categoryField: 'name',
                    childDataField: 'children',
                    linkWithField: 'linkWith',
                  })
                );

                // Convert graph nodes/links to hierarchy format
                if ('graphNodes' in data && 'graphLinks' in data) {
                  const hierarchyData = data.graphNodes.map(node => ({
                    id: node.id,
                    name: node.name,
                    value: node.value || 1,
                    color: node.color,
                    linkWith: data.graphLinks
                      .filter(link => link.from === node.id)
                      .map(link => link.to),
                  }));
                  chart.data.setAll(hierarchyData);
                }
                break;
              }

              case 'hierarchy': {
                const am5hierarchy = await import('@amcharts/amcharts5/hierarchy');

                // Use Tree instead of abstract Hierarchy class
                chart = root.container.children.push(
                  am5hierarchy.Tree.new(root, {
                    singleBranchOnly: false,
                    downDepth: 1,
                    initialDepth: 2,
                    valueField: 'value',
                    categoryField: 'name',
                    childDataField: 'children',
                  })
                );

                if ('hierarchyData' in data) {
                  chart.data.setAll([data.hierarchyData]);
                }
                break;
              }

              case 'wordCloud': {
                const am5wc = await import('@amcharts/amcharts5/wc');

                chart = root.container.children.push(
                  am5wc.WordCloud.new(root, {
                    categoryField: 'text',
                    valueField: 'value',
                    maxFontSize: am5.percent(15),
                  })
                );

                if ('words' in data) {
                  chart.data.setAll(data.words);
                }
                break;
              }

              case 'venn': {
                const am5venn = await import('@amcharts/amcharts5/venn');

                chart = root.container.children.push(
                  am5venn.Venn.new(root, {
                    categoryField: 'name',
                    valueField: 'value',
                    intersectionsField: 'sets',
                  })
                );

                if ('vennSets' in data && 'vennIntersections' in data) {
                  chart.data.setAll([...data.vennSets, ...data.vennIntersections]);
                }
                break;
              }
            }

            // Add legend if enabled (only for chart types with series)
            if (options?.showLegend !== false && 'series' in data && data.series && data.series.length > 1) {
              const legend = chart.children.push(
                am5.Legend.new(root, {
                  centerX: am5.p50,
                  x: am5.p50,
                })
              );
              legend.data.setAll(chart.series.values);
            }

            chart.appear(1000, 100);
          } catch (err) {
            console.error('Failed to initialize chart:', err);
            setError(`Failed to initialize chart: ${err instanceof Error ? err.message : String(err)}`);
          }
        };

        initChart();

        return () => {
          if (root) {
            root.dispose();
          }
        };
      }, [isMounted, data, options, chartDivId, setError, rootRef]);

      if (error) {
        return <ChartsError error={error} />;
      }

      const height = fullscreen ? '100%' : options?.height || 400;
      const width = fullscreen ? '100%' : options?.width || '100%';

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 p-4", className)}
          {...props}
        >
          <div
            id={chartDivId}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          />
        </div>
      );
    }
  )
);

ChartsContent.displayName = "ChartsContent";

// --- Charts Legend ---

export const ChartsLegend = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useChartsContext();

  // Only show legend for chart types with series data
  if (!('series' in data) || !data.series || data.series.length <= 1) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-4 border-t bg-muted/50 px-4 py-3",
        className
      )}
      {...props}
    >
      {data.series.map((series, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-sm"
            style={{
              backgroundColor: series.color || `hsl(${(idx * 360) / data.series.length}, 70%, 50%)`,
            }}
          />
          <span className="text-xs text-muted-foreground">{series.name}</span>
        </div>
      ))}
    </div>
  );
});

ChartsLegend.displayName = "ChartsLegend";

// --- Charts Error ---

export const ChartsError = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { error: string }
>(({ className, error, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive",
        className
      )}
      {...props}
    >
      <AlertCircle className="h-5 w-5" />
      <p className="text-sm font-medium">{error}</p>
    </div>
  );
});

ChartsError.displayName = "ChartsError";
