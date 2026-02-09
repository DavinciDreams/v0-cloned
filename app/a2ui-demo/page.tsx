"use client";

import { A2UIRenderer } from '@/lib/a2ui/renderer';
import type { A2UIMessage } from '@/lib/a2ui/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export default function A2UIDemoPage() {
  const [activeDemo, setActiveDemo] = useState<string>('timeline');

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-4xl font-bold">A2UI Demo</h1>
          <Badge variant="outline" className="text-xs">Phase 1 Complete</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Testing AI-generated UI components with A2UI + Zod validation
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">What is A2UI?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>A2UI (Agent-to-User Interface)</strong> is Google's protocol for AI agents to generate
              rich, interactive UIs using declarative JSON specifications.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Security (No code execution)
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Zod Validation
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Framework Agnostic
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                LLM Friendly
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="threescene">3D Scene</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="unknown">Unknown</TabsTrigger>
        </TabsList>

        {/* Timeline Demo */}
        <TabsContent value="timeline" className="space-y-4">
          <DemoSection
            title="Timeline Component"
            description="Interactive timeline visualization with TimelineJS"
            status="valid"
          >
            <A2UIRenderer message={timelineMessage} />
          </DemoSection>

          <CodePreview
            title="A2UI Specification"
            code={JSON.stringify(timelineMessage, null, 2)}
          />
        </TabsContent>

        {/* Maps Demo */}
        <TabsContent value="maps" className="space-y-4">
          <DemoSection
            title="Maps Component"
            description="2D geographic visualization with Leaflet + OpenStreetMap"
            status="valid"
          >
            <A2UIRenderer message={mapsMessage} />
          </DemoSection>

          <CodePreview
            title="A2UI Specification"
            code={JSON.stringify(mapsMessage, null, 2)}
          />
        </TabsContent>

        {/* ThreeScene Demo */}
        <TabsContent value="threescene" className="space-y-4">
          <DemoSection
            title="ThreeScene Component"
            description="3D scene viewer with Three.js + OrbitControls"
            status="valid"
          >
            <A2UIRenderer message={threeSceneMessage} />
          </DemoSection>

          <CodePreview
            title="A2UI Specification"
            code={JSON.stringify(threeSceneMessage, null, 2)}
          />
        </TabsContent>

        {/* Validation Error Demo */}
        <TabsContent value="validation" className="space-y-4">
          <DemoSection
            title="Validation Error Handling"
            description="Demonstrates Zod validation catching invalid props"
            status="error"
          >
            <A2UIRenderer message={invalidMessage} />
          </DemoSection>

          <CodePreview
            title="Invalid A2UI Specification"
            code={JSON.stringify(invalidMessage, null, 2)}
          />

          <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Expected Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                The Timeline component above has <strong>invalid coordinates</strong> (year: "2020" as string instead of number).
              </p>
              <p>
                Zod validation catches this error before rendering and displays a helpful error message.
              </p>
              <p className="text-muted-foreground">
                ✅ Component doesn't crash
                <br />
                ✅ User sees what went wrong
                <br />
                ✅ Developer gets validation details in console
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unknown Component Demo */}
        <TabsContent value="unknown" className="space-y-4">
          <DemoSection
            title="Unknown Component Handling"
            description="Demonstrates fallback for unregistered component types"
            status="warning"
          >
            <A2UIRenderer message={unknownMessage} />
          </DemoSection>

          <CodePreview
            title="A2UI Specification (Unknown Type)"
            code={JSON.stringify(unknownMessage, null, 2)}
          />

          <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Expected Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                The component type <code className="px-1 py-0.5 bg-muted rounded">BarChart</code> is not
                registered in the component catalog.
              </p>
              <p>
                The renderer displays a fallback component instead of crashing.
              </p>
              <p className="text-muted-foreground">
                ✅ Graceful degradation
                <br />
                ✅ User sees component is missing
                <br />
                ✅ App continues to function
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Next Steps</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>✅ Phase 1: A2UI foundation + Zod validation (Complete)</li>
          <li>⏳ Phase 2: Demo page (You are here)</li>
          <li>⏳ Phase 3: AG-UI streaming integration</li>
          <li>⏳ Phase 4: AI agent endpoint</li>
          <li>⏳ Phase 5: End-to-end AI → UI generation</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Demo Section Component
 */
function DemoSection({
  title,
  description,
  status,
  children
}: {
  title: string;
  description: string;
  status: 'valid' | 'error' | 'warning';
  children: React.ReactNode;
}) {
  const statusConfig = {
    valid: {
      icon: CheckCircle2,
      color: 'text-green-500',
      badge: 'Valid',
      variant: 'default' as const
    },
    error: {
      icon: XCircle,
      color: 'text-red-500',
      badge: 'Validation Error',
      variant: 'destructive' as const
    },
    warning: {
      icon: Info,
      color: 'text-yellow-500',
      badge: 'Unknown Type',
      variant: 'secondary' as const
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${config.color}`} />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={config.variant}>{config.badge}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Code Preview Component
 */
function CodePreview({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// A2UI Test Messages
// =============================================================================

/**
 * Valid Timeline Message
 */
const timelineMessage: A2UIMessage = {
  surfaceUpdate: {
    components: [
      {
        id: 'timeline-demo',
        component: {
          Timeline: {
            data: {
              title: {
                text: {
                  headline: 'History of Computing',
                  text: 'Major milestones in computer science and technology'
                }
              },
              events: [
                {
                  unique_id: 'event-1',
                  start_date: { year: 1936 },
                  text: {
                    headline: 'Turing Machine',
                    text: 'Alan Turing introduces the concept of a universal computing machine'
                  },
                  media: {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turing_Machine_Model_Davey_2012.jpg/440px-Turing_Machine_Model_Davey_2012.jpg',
                    caption: 'Model of a Turing machine',
                    credit: 'Wikimedia Commons',
                    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turing_Machine_Model_Davey_2012.jpg/200px-Turing_Machine_Model_Davey_2012.jpg'
                  }
                },
                {
                  unique_id: 'event-2',
                  start_date: { year: 1971 },
                  text: {
                    headline: 'First Microprocessor',
                    text: 'Intel releases the 4004, the first commercial microprocessor'
                  }
                },
                {
                  unique_id: 'event-3',
                  start_date: { year: 1989 },
                  text: {
                    headline: 'World Wide Web',
                    text: 'Tim Berners-Lee invents the World Wide Web at CERN'
                  }
                },
                {
                  unique_id: 'event-4',
                  start_date: { year: 2007 },
                  text: {
                    headline: 'iPhone Released',
                    text: 'Apple introduces the first iPhone, revolutionizing mobile computing'
                  }
                }
              ]
            },
            options: {
              height: 500
            }
          }
        }
      }
    ]
  }
};

/**
 * Valid Maps Message
 */
const mapsMessage: A2UIMessage = {
  surfaceUpdate: {
    components: [
      {
        id: 'maps-demo',
        component: {
          Maps: {
            data: {
              center: { longitude: -122.4194, latitude: 37.7749 },
              zoom: 12,
              markers: [
                {
                  id: 'marker-sf',
                  coordinates: { longitude: -122.4194, latitude: 37.7749 },
                  label: 'San Francisco',
                  description: 'City by the Bay',
                  color: 'blue',
                  popup: '<strong>San Francisco</strong><br/>California, USA'
                },
                {
                  id: 'marker-gg',
                  coordinates: { longitude: -122.4783, latitude: 37.8199 },
                  label: 'Golden Gate Bridge',
                  color: 'red',
                  popup: '<strong>Golden Gate Bridge</strong><br/>Iconic suspension bridge'
                }
              ]
            },
            options: {
              height: 500,
              enableFullscreen: true
            }
          }
        }
      }
    ]
  }
};

/**
 * Valid ThreeScene Message
 */
const threeSceneMessage: A2UIMessage = {
  surfaceUpdate: {
    components: [
      {
        id: 'threescene-demo',
        component: {
          ThreeScene: {
            data: {
              camera: {
                type: 'perspective',
                position: { x: 5, y: 5, z: 5 },
                fov: 75
              },
              lights: [
                {
                  type: 'ambient',
                  color: 0xffffff,
                  intensity: 0.5
                },
                {
                  type: 'directional',
                  color: 0xffffff,
                  intensity: 0.8,
                  position: { x: 10, y: 10, z: 10 }
                }
              ],
              background: 0x111111,
              objects: [
                {
                  type: 'box',
                  position: { x: 0, y: 0, z: 0 },
                  color: 0x00ff88,
                  scale: 1
                }
              ]
            },
            options: {
              height: 500,
              enableControls: true,
              gridHelper: true,
              axesHelper: true
            }
          }
        }
      }
    ]
  }
};

/**
 * Invalid Message (Validation Error)
 */
const invalidMessage: A2UIMessage = {
  surfaceUpdate: {
    components: [
      {
        id: 'invalid-timeline',
        component: {
          Timeline: {
            data: {
              events: [
                {
                  unique_id: 'bad-event',
                  start_date: { year: '2020' as any }, // ❌ String instead of number
                  text: { headline: 'Invalid Event' }
                }
              ]
            }
          }
        }
      }
    ]
  }
};

/**
 * Unknown Component Message
 */
const unknownMessage: A2UIMessage = {
  surfaceUpdate: {
    components: [
      {
        id: 'unknown-component',
        component: {
          BarChart: { // ❌ Not in catalog
            data: {
              values: [10, 20, 30]
            }
          }
        }
      }
    ]
  }
};
