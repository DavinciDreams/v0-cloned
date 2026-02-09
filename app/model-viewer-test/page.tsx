"use client";

import {
  ModelViewer,
  ModelViewerHeader,
  ModelViewerTitle,
  ModelViewerActions,
  ModelViewerResetButton,
  ModelViewerCopyButton,
  ModelViewerFullscreenButton,
  ModelViewerContent,
  type ModelViewerData,
} from "@/components/ai-elements/model-viewer-client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ModelViewerTestPage() {
  const [activeTab, setActiveTab] = useState("gltf");

  // GLTF Example - Using glTF Sample Models from Khronos
  const gltfModel: ModelViewerData = {
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    format: "glb",
    scale: 0.5,
  };

  // OBJ Example - Using a simple cube
  const objModel: ModelViewerData = {
    url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/male02/male02.obj",
    format: "obj",
    scale: 0.05,
  };

  // STL Example
  const stlModel: ModelViewerData = {
    url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/ascii/slotted_disk.stl",
    format: "stl",
    scale: 0.5,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">3D Model Viewer Test</h1>
          <p className="mt-2 text-muted-foreground">
            Load and view 3D models in various formats (GLTF/GLB, OBJ, FBX, STL,
            Collada)
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="gltf">GLTF/GLB</TabsTrigger>
            <TabsTrigger value="obj">OBJ</TabsTrigger>
            <TabsTrigger value="stl">STL</TabsTrigger>
          </TabsList>

          {/* GLTF Tab */}
          <TabsContent value="gltf" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>GLTF/GLB Model Viewer</CardTitle>
                <CardDescription>
                  glTF (GL Transmission Format) is the standard format for 3D
                  models on the web. Supports animations, materials, and textures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModelViewer
                  data={gltfModel}
                  options={{
                    height: 600,
                    enableControls: true,
                    autoRotate: true,
                    autoRotateSpeed: 1.0,
                    showGrid: true,
                    showAxes: false,
                    antialias: true,
                  }}
                >
                  <ModelViewerHeader>
                    <ModelViewerTitle>Duck Model (GLB)</ModelViewerTitle>
                    <ModelViewerActions>
                      <ModelViewerResetButton />
                      <ModelViewerCopyButton />
                      <ModelViewerFullscreenButton />
                    </ModelViewerActions>
                  </ModelViewerHeader>
                  <ModelViewerContent />
                </ModelViewer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Industry standard format for web 3D</li>
                  <li>Supports PBR materials and textures</li>
                  <li>Animation support</li>
                  <li>Efficient binary format (GLB)</li>
                  <li>Widely supported across platforms</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OBJ Tab */}
          <TabsContent value="obj" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>OBJ Model Viewer</CardTitle>
                <CardDescription>
                  Wavefront OBJ is a simple, widely-supported 3D geometry format.
                  Great for static models and meshes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModelViewer
                  data={objModel}
                  options={{
                    height: 600,
                    enableControls: true,
                    autoRotate: false,
                    showGrid: true,
                    showAxes: true,
                    antialias: true,
                  }}
                >
                  <ModelViewerHeader>
                    <ModelViewerTitle>Character Model (OBJ)</ModelViewerTitle>
                    <ModelViewerActions>
                      <ModelViewerResetButton />
                      <ModelViewerCopyButton />
                      <ModelViewerFullscreenButton />
                    </ModelViewerActions>
                  </ModelViewerHeader>
                  <ModelViewerContent />
                </ModelViewer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Simple ASCII or binary format</li>
                  <li>Widely supported by 3D software</li>
                  <li>Easy to parse and modify</li>
                  <li>Supports vertex colors and normals</li>
                  <li>Can be paired with MTL files for materials</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STL Tab */}
          <TabsContent value="stl" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>STL Model Viewer</CardTitle>
                <CardDescription>
                  STL (Stereolithography) format is commonly used for 3D printing.
                  Describes surface geometry without color or texture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModelViewer
                  data={stlModel}
                  options={{
                    height: 600,
                    enableControls: true,
                    autoRotate: true,
                    autoRotateSpeed: 2.0,
                    showGrid: false,
                    showAxes: false,
                    antialias: true,
                    backgroundColor: 0x2a2a2a,
                  }}
                >
                  <ModelViewerHeader>
                    <ModelViewerTitle>Slotted Disk (STL)</ModelViewerTitle>
                    <ModelViewerActions>
                      <ModelViewerResetButton />
                      <ModelViewerCopyButton />
                      <ModelViewerFullscreenButton />
                    </ModelViewerActions>
                  </ModelViewerHeader>
                  <ModelViewerContent />
                </ModelViewer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Standard format for 3D printing</li>
                  <li>Simple triangulated mesh representation</li>
                  <li>ASCII or binary format</li>
                  <li>Compact file size</li>
                  <li>No color or texture support</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Controls Info */}
        <Card>
          <CardHeader>
            <CardTitle>Viewer Controls</CardTitle>
            <CardDescription>
              Interact with the 3D models using these controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Mouse Controls</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Left Click + Drag:</strong> Rotate camera around model
                  </li>
                  <li>
                    <strong>Right Click + Drag:</strong> Pan camera
                  </li>
                  <li>
                    <strong>Scroll Wheel:</strong> Zoom in/out
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Button Controls</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Reset:</strong> Return camera to initial position
                  </li>
                  <li>
                    <strong>Copy:</strong> Copy model data to clipboard
                  </li>
                  <li>
                    <strong>Fullscreen:</strong> Toggle fullscreen mode
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Supported 3D Formats</CardTitle>
            <CardDescription>
              The ModelViewer component supports the following formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-bold">GLTF/GLB</h4>
                <p className="text-sm text-muted-foreground">
                  Modern web standard with full feature support
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-bold">OBJ</h4>
                <p className="text-sm text-muted-foreground">
                  Classic format with wide compatibility
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-bold">FBX</h4>
                <p className="text-sm text-muted-foreground">
                  Autodesk format for complex scenes
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-bold">STL</h4>
                <p className="text-sm text-muted-foreground">
                  3D printing standard format
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-bold">DAE (Collada)</h4>
                <p className="text-sm text-muted-foreground">
                  XML-based interchange format
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
