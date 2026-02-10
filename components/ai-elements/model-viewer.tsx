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
  RotateCcwIcon,
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

export type ModelFormat = "gltf" | "glb" | "obj" | "fbx" | "stl" | "dae";

export interface ModelViewerData {
  url: string;
  format: ModelFormat;
  scale?: number;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

export interface ModelViewerOptions {
  height?: number | string;
  width?: number | string;
  enableControls?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  cameraPosition?: { x: number; y: number; z: number };
  backgroundColor?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  antialias?: boolean;
  [key: string]: unknown;
}

export interface ModelViewerRef {
  resetCamera: () => void;
  setAutoRotate: (enabled: boolean) => void;
  focusOnModel: () => void;
}

// --- Context ---

interface ModelViewerContextValue {
  data: ModelViewerData;
  options?: ModelViewerOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  copyToClipboard: () => Promise<void>;
  modelViewerRef: React.RefObject<ModelViewerRef | null>;
  sceneRef: React.RefObject<any>;
  cameraRef: React.RefObject<any>;
  controlsRef: React.RefObject<any>;
  rendererRef: React.RefObject<any>;
}

const ModelViewerContext = createContext<ModelViewerContextValue | null>(null);

const useModelViewerContext = () => {
  const context = useContext(ModelViewerContext);
  if (!context) {
    throw new Error("ModelViewer components must be used within ModelViewer");
  }
  return context;
};

// --- ModelViewer Component ---

export interface ModelViewerProps extends HTMLAttributes<HTMLDivElement> {
  data: ModelViewerData;
  options?: ModelViewerOptions;
  children?: ReactNode;
}

export const ModelViewer = forwardRef<ModelViewerRef, ModelViewerProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const modelViewerRef = useRef<ModelViewerRef | null>(null);
    const sceneRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const controlsRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);

    // Expose ref
    useImperativeHandle(ref, () => modelViewerRef.current as ModelViewerRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const contextValue: ModelViewerContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      loading,
      setLoading,
      copyToClipboard,
      modelViewerRef,
      sceneRef,
      cameraRef,
      controlsRef,
      rendererRef,
    };

    return (
      <ModelViewerContext.Provider value={contextValue}>
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
      </ModelViewerContext.Provider>
    );
  }
);

ModelViewer.displayName = "ModelViewer";

// --- ModelViewer Header ---

export const ModelViewerHeader = forwardRef<
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

ModelViewerHeader.displayName = "ModelViewerHeader";

// --- ModelViewer Title ---

export const ModelViewerTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { data } = useModelViewerContext();

  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || `3D Model (${data.format.toUpperCase()})`}
      </h3>
    </div>
  );
});

ModelViewerTitle.displayName = "ModelViewerTitle";

// --- ModelViewer Actions ---

export const ModelViewerActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

ModelViewerActions.displayName = "ModelViewerActions";

// --- ModelViewer Reset Button ---

export const ModelViewerResetButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { modelViewerRef } = useModelViewerContext();

  const handleReset = () => {
    modelViewerRef.current?.resetCamera();
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleReset}
      {...props}
    >
      <RotateCcwIcon className="h-4 w-4" />
    </Button>
  );
});

ModelViewerResetButton.displayName = "ModelViewerResetButton";

// --- ModelViewer Copy Button ---

export const ModelViewerCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useModelViewerContext();
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

ModelViewerCopyButton.displayName = "ModelViewerCopyButton";

// --- ModelViewer Fullscreen Button ---

export const ModelViewerFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useModelViewerContext();

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

ModelViewerFullscreenButton.displayName = "ModelViewerFullscreenButton";

// --- ModelViewer Content ---

export const ModelViewerContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        setError,
        fullscreen,
        loading,
        setLoading,
        modelViewerRef,
        sceneRef,
        cameraRef,
        controlsRef,
        rendererRef,
      } = useModelViewerContext();

      const containerRef = useRef<HTMLDivElement>(null);
      const [isMounted, setIsMounted] = useState(false);
      const animationFrameRef = useRef<number | undefined>(undefined);
      const initialCameraPosition = useRef<any>(null);

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Load model and set up scene
      useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        let mounted = true;

        const initViewer = async () => {
          try {
            setLoading(true);
            setError(null);

            const THREE = await import("three");
            const { OrbitControls } = await import(
              "three/examples/jsm/controls/OrbitControls.js"
            );

            // Create scene
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(
              options?.backgroundColor ?? 0x1a1a1a
            );
            sceneRef.current = scene;

            // Create camera
            const camera = new THREE.PerspectiveCamera(
              75,
              containerRef.current!.clientWidth /
                containerRef.current!.clientHeight,
              0.1,
              1000
            );
            const camPos = options?.cameraPosition ?? { x: 5, y: 5, z: 5 };
            camera.position.set(camPos.x, camPos.y, camPos.z);
            cameraRef.current = camera;
            initialCameraPosition.current = camera.position.clone();

            // Create renderer
            const renderer = new THREE.WebGLRenderer({
              antialias: options?.antialias ?? true,
            });
            renderer.setSize(
              containerRef.current!.clientWidth,
              containerRef.current!.clientHeight
            );
            renderer.setPixelRatio(window.devicePixelRatio);
            containerRef.current!.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 7.5);
            scene.add(directionalLight);

            // Add helpers
            if (options?.showGrid) {
              const gridHelper = new THREE.GridHelper(10, 10);
              scene.add(gridHelper);
            }

            if (options?.showAxes) {
              const axesHelper = new THREE.AxesHelper(5);
              scene.add(axesHelper);
            }

            // Add controls
            if (options?.enableControls !== false) {
              const controls = new OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;
              controls.dampingFactor = 0.05;
              controls.autoRotate = options?.autoRotate ?? false;
              controls.autoRotateSpeed = options?.autoRotateSpeed ?? 2.0;
              controlsRef.current = controls;
            }

            // Load model based on format
            await loadModel(THREE, scene, data);

            if (!mounted) return;

            // Animation loop
            const animate = () => {
              animationFrameRef.current = requestAnimationFrame(animate);

              if (controlsRef.current) {
                controlsRef.current.update();
              }

              renderer.render(scene, camera);
            };
            animate();

            // Set up ref methods
            modelViewerRef.current = {
              resetCamera: () => {
                if (cameraRef.current && initialCameraPosition.current) {
                  cameraRef.current.position.copy(initialCameraPosition.current);
                  if (controlsRef.current) {
                    controlsRef.current.reset();
                  }
                }
              },
              setAutoRotate: (enabled: boolean) => {
                if (controlsRef.current) {
                  controlsRef.current.autoRotate = enabled;
                }
              },
              focusOnModel: () => {
                if (sceneRef.current && controlsRef.current) {
                  const box = new THREE.Box3().setFromObject(sceneRef.current);
                  const center = box.getCenter(new THREE.Vector3());
                  controlsRef.current.target.copy(center);
                  controlsRef.current.update();
                }
              },
            };

            setLoading(false);
          } catch (err) {
            console.error("Failed to load model:", err);
            if (mounted) {
              setError(
                err instanceof Error ? err.message : "Failed to load model"
              );
              setLoading(false);
            }
          }
        };

        initViewer();

        return () => {
          mounted = false;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          if (rendererRef.current && containerRef.current) {
            containerRef.current.removeChild(rendererRef.current.domElement);
            rendererRef.current.dispose();
          }
          if (sceneRef.current) {
            sceneRef.current.traverse((object: any) => {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((mat: any) => mat.dispose());
                } else {
                  object.material.dispose();
                }
              }
            });
          }
        };
      }, [isMounted, data, options, setError, setLoading, modelViewerRef]);

      if (error) {
        return <ModelViewerError error={error} />;
      }

      const height = options?.height || (fullscreen ? "100%" : 600);
      const width = options?.width || "100%";

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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Loading viewer...
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
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <div className="text-muted-foreground">Loading model...</div>
            </div>
          )}
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

ModelViewerContent.displayName = "ModelViewerContent";

// --- Helper: Load Model ---

async function loadModel(THREE: any, scene: any, data: ModelViewerData) {
  let loader: any;

  switch (data.format) {
    case "gltf":
    case "glb": {
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      loader = new GLTFLoader();
      break;
    }
    case "obj": {
      const { OBJLoader } = await import(
        "three/examples/jsm/loaders/OBJLoader.js"
      );
      loader = new OBJLoader();
      break;
    }
    case "fbx": {
      const { FBXLoader } = await import(
        "three/examples/jsm/loaders/FBXLoader.js"
      );
      loader = new FBXLoader();
      break;
    }
    case "stl": {
      const { STLLoader } = await import(
        "three/examples/jsm/loaders/STLLoader.js"
      );
      loader = new STLLoader();
      break;
    }
    case "dae": {
      const { ColladaLoader } = await import(
        "three/examples/jsm/loaders/ColladaLoader.js"
      );
      loader = new ColladaLoader();
      break;
    }
    default:
      throw new Error(`Unsupported format: ${data.format}`);
  }

  return new Promise<void>((resolve, reject) => {
    loader.load(
      data.url,
      (result: any) => {
        let object: any;

        // Handle different loader result formats
        if (data.format === "gltf" || data.format === "glb") {
          object = result.scene;
        } else if (data.format === "dae") {
          object = result.scene;
        } else if (data.format === "stl") {
          // STL loader returns geometry, need to create mesh
          const material = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            metalness: 0.3,
            roughness: 0.4,
          });
          object = new THREE.Mesh(result, material);
        } else {
          object = result;
        }

        // Apply transformations
        if (data.scale) {
          object.scale.set(data.scale, data.scale, data.scale);
        }
        if (data.position) {
          object.position.set(data.position.x, data.position.y, data.position.z);
        }
        if (data.rotation) {
          object.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        }

        scene.add(object);
        resolve();
      },
      undefined,
      (error: any) => {
        reject(error);
      }
    );
  });
}

// --- ModelViewer Error ---

export const ModelViewerError = forwardRef<
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

ModelViewerError.displayName = "ModelViewerError";
