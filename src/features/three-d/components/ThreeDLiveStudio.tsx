"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { SceneManager } from "../services/viewer/SceneManager";
import { CameraManager, CameraPreset } from "../services/viewer/CameraManager";
import { LightingManager, LightingPreset } from "../services/viewer/LightingManager";
import { AssetManager } from "../services/asset-manager/AssetManager";
import { AvatarStorage } from "../services/avatar/AvatarStorage";
import { AvatarGenerator } from "../services/avatar/AvatarGenerator";
import { GarmentLoader } from "../services/garments/GarmentLoader";
import { GarmentFittingService } from "../services/garments/GarmentFittingService";
import { GarmentDisposer } from "../services/garments/GarmentDisposer";
import { GARMENT_REGISTRY } from "../services/garments/GarmentRegistry";
import { AvatarConfig } from "../types/AvatarTypes";
import { GarmentManifestEntry } from "../types/GarmentTypes";
import { DownloadProgress } from "../types/AssetTypes";

import ViewportControls from "./ViewportControls";
import GarmentSelector from "./GarmentSelector";
import DownloadProgressBar from "./DownloadProgressBar";
import AvatarCreationModal from "./AvatarCreationModal";

interface Props {
  initialProductId?: string;
}

export default function ThreeDLiveStudio({ initialProductId }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Viewer Managers
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const lightingManagerRef = useRef<LightingManager | null>(null);

  // Mesh Hierarchy References in Three.js Scene
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const currentTopMeshRef = useRef<THREE.Group | null>(null);
  const currentBottomMeshRef = useRef<THREE.Group | null>(null);
  const currentBagMeshRef = useRef<THREE.Group | null>(null);
  const currentChainMeshRef = useRef<THREE.Group | null>(null);

  // State: Avatar
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // State: Garment Selection
  const initialTop =
    (initialProductId && GARMENT_REGISTRY[initialProductId]?.category === "top"
      ? GARMENT_REGISTRY[initialProductId]
      : GARMENT_REGISTRY["prod_01"]) || GARMENT_REGISTRY["prod_01"];

  const initialBottom =
    (initialProductId && GARMENT_REGISTRY[initialProductId]?.category === "bottom"
      ? GARMENT_REGISTRY[initialProductId]
      : GARMENT_REGISTRY["prod_03"]) || GARMENT_REGISTRY["prod_03"];

  const [selectedTop, setSelectedTop] = useState<GarmentManifestEntry>(initialTop);
  const [selectedTopSize, setSelectedTopSize] = useState("L");
  const [selectedTopColor, setSelectedTopColor] = useState(initialTop.colors[0]?.hex || "#0c0c0c");

  const [selectedBottom, setSelectedBottom] = useState<GarmentManifestEntry>(initialBottom);
  const [selectedBottomSize, setSelectedBottomSize] = useState("L");
  const [selectedBottomColor, setSelectedBottomColor] = useState(initialBottom.colors[0]?.hex || "#121212");

  const [hasBag, setHasBag] = useState(true);
  const [hasChain, setHasChain] = useState(true);

  // State: Viewer Controls
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("full");
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("afterhours");
  const [autoRotate, setAutoRotate] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // State: Asset Downloading
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    totalFiles: 0,
    completedFiles: 0,
    totalBytes: 0,
    loadedBytes: 0,
    phase: "idle"
  });

  // 1. Subscribe to AssetManager & Trigger Stage 2 High-Priority Download on mount
  useEffect(() => {
    const unsub = AssetManager.subscribeProgress((p) => {
      setDownloadProgress(p);
    });

    // Start Stage 2 priority download since user is actively in the 3D Live studio
    AssetManager.startStage2Priority().catch((err) => {
      console.warn("[ThreeDLiveStudio] Stage 2 download issue:", err);
    });

    return () => {
      unsub();
    };
  }, []);

  // 2. Initialize Three.js Scene, Camera, Lighting & Render Loop
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const sm = new SceneManager(container);
    sceneManagerRef.current = sm;

    const cm = new CameraManager(container);
    cameraManagerRef.current = cm;

    const lm = new LightingManager(sm.scene);
    lightingManagerRef.current = lm;

    // Root Group for all avatar and clothing elements
    const avatarRoot = new THREE.Group();
    avatarRoot.name = "Avatar_Studio_Root";
    sm.scene.add(avatarRoot);
    avatarGroupRef.current = avatarRoot;

    // Render loop
    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (sm.canRender()) {
        cm.update(avatarRoot);
        sm.renderer.render(sm.scene, cm.camera);
      }
    };
    render();

    // Window Resize Handler
    const onResize = () => {
      sm.handleResize();
      cm.handleResize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      sm.dispose();
    };
  }, []);

  // 3. Check for Saved Avatar in IndexedDB on Load
  useEffect(() => {
    async function loadSaved() {
      const saved = await AvatarStorage.loadSavedAvatar();
      if (saved) {
        setAvatarConfig(saved);
      } else {
        // Default initial avatar configuration
        const defaultAvatar: AvatarConfig = {
          id: "default_user_avatar",
          gender: "masculine",
          build: "athletic",
          skinTone: "#181818",
          measurements: {
            heightCm: 180,
            chestCm: 100,
            waistCm: 80,
            hipCm: 98,
            confirmedAt: Date.now(),
            source: "preset"
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          engineVersion: "oxihuman-0.2.0"
        };
        setAvatarConfig(defaultAvatar);
      }
    }
    loadSaved();
  }, []);

  // 4. Build or Rebuild Base Avatar Body Mesh when AvatarConfig changes
  useEffect(() => {
    if (!avatarConfig || !avatarGroupRef.current) return;
    const root = avatarGroupRef.current;

    async function rebuildAvatar() {
      // Find and remove previous base avatar meshes
      const existingBase = root.children.find((c) => c.userData?.isAvatarBase);
      if (existingBase) {
        GarmentDisposer.disposeObject(existingBase);
      }

      // Generate new avatar mesh conforming to confirmed measurements
      const newAvatarMesh = await AvatarGenerator.generateAvatarMesh(avatarConfig!);
      root.add(newAvatarMesh);

      // Re-fit currently equipped garments to new proportions
      if (currentTopMeshRef.current) {
        GarmentFittingService.fitGarmentToAvatar(currentTopMeshRef.current, avatarConfig!, "top");
      }
      if (currentBottomMeshRef.current) {
        GarmentFittingService.fitGarmentToAvatar(currentBottomMeshRef.current, avatarConfig!, "bottom");
      }
    }

    rebuildAvatar();
  }, [avatarConfig]);

  // 5. Load and Fit TOP Garment
  useEffect(() => {
    if (!avatarGroupRef.current || !avatarConfig) return;
    const root = avatarGroupRef.current;
    let isCancelled = false;

    async function updateTop() {
      try {
        const topMesh = await GarmentLoader.loadGarment(selectedTop.productId, selectedTopSize);
        if (isCancelled) {
          GarmentDisposer.disposeObject(topMesh);
          return;
        }

        // Apply selected colorway to materials
        topMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material && (mesh.material as any).color) {
              (mesh.material as THREE.MeshStandardMaterial).color.set(selectedTopColor);
            }
          }
        });

        // Remove old top mesh
        if (currentTopMeshRef.current) {
          GarmentDisposer.disposeObject(currentTopMeshRef.current);
        }

        GarmentFittingService.fitGarmentToAvatar(topMesh, avatarConfig!, "top");
        root.add(topMesh);
        currentTopMeshRef.current = topMesh;
      } catch (err) {
        console.warn(`[ThreeDLiveStudio] Could not load top ${selectedTop.productId}:`, err);
      }
    }

    updateTop();

    return () => {
      isCancelled = true;
    };
  }, [selectedTop, selectedTopSize, selectedTopColor, avatarConfig]);

  // 6. Load and Fit BOTTOM Garment
  useEffect(() => {
    if (!avatarGroupRef.current || !avatarConfig) return;
    const root = avatarGroupRef.current;
    let isCancelled = false;

    async function updateBottom() {
      try {
        const bottomMesh = await GarmentLoader.loadGarment(selectedBottom.productId, selectedBottomSize);
        if (isCancelled) {
          GarmentDisposer.disposeObject(bottomMesh);
          return;
        }

        bottomMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material && (mesh.material as any).color) {
              (mesh.material as THREE.MeshStandardMaterial).color.set(selectedBottomColor);
            }
          }
        });

        if (currentBottomMeshRef.current) {
          GarmentDisposer.disposeObject(currentBottomMeshRef.current);
        }

        GarmentFittingService.fitGarmentToAvatar(bottomMesh, avatarConfig!, "bottom");
        root.add(bottomMesh);
        currentBottomMeshRef.current = bottomMesh;
      } catch (err) {
        console.warn(`[ThreeDLiveStudio] Could not load bottom ${selectedBottom.productId}:`, err);
      }
    }

    updateBottom();

    return () => {
      isCancelled = true;
    };
  }, [selectedBottom, selectedBottomSize, selectedBottomColor, avatarConfig]);

  // 7. Load and Fit ACCESSORIES (Bag & Chain)
  useEffect(() => {
    if (!avatarGroupRef.current || !avatarConfig) return;
    const root = avatarGroupRef.current;

    async function updateAccessories() {
      // Crossbody Bag
      if (hasBag) {
        if (!currentBagMeshRef.current) {
          try {
            const bagMesh = await GarmentLoader.loadGarment("prod_11", "ONE_SIZE");
            GarmentFittingService.fitGarmentToAvatar(bagMesh, avatarConfig!, "accessory");
            root.add(bagMesh);
            currentBagMeshRef.current = bagMesh;
          } catch (e) {
            console.warn(e);
          }
        }
      } else if (currentBagMeshRef.current) {
        GarmentDisposer.disposeObject(currentBagMeshRef.current);
        currentBagMeshRef.current = null;
      }

      // Cuban Chain
      if (hasChain) {
        if (!currentChainMeshRef.current) {
          try {
            const chainMesh = await GarmentLoader.loadGarment("prod_16", "ONE_SIZE");
            GarmentFittingService.fitGarmentToAvatar(chainMesh, avatarConfig!, "accessory");
            root.add(chainMesh);
            currentChainMeshRef.current = chainMesh;
          } catch (e) {
            console.warn(e);
          }
        }
      } else if (currentChainMeshRef.current) {
        GarmentDisposer.disposeObject(currentChainMeshRef.current);
        currentChainMeshRef.current = null;
      }
    }

    updateAccessories();
  }, [hasBag, hasChain, avatarConfig]);

  // 8. Heatmap Wireframe / Drape Effect
  useEffect(() => {
    const meshes = [currentTopMeshRef.current, currentBottomMeshRef.current];
    meshes.forEach((m) => {
      if (!m) return;
      m.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            (mesh.material as any).wireframe = showHeatmap;
          }
        }
      });
    });
  }, [showHeatmap]);

  // Fit Evaluations
  const topFitEvaluation = useMemo(() => {
    if (!avatarConfig) {
      return { rating: "OPTIMAL", tone: "text-cyan-400", ratio: 1.0, message: "" };
    }
    return GarmentFittingService.evaluateFit(selectedTopSize, avatarConfig, "top");
  }, [selectedTopSize, avatarConfig]);

  const bottomFitEvaluation = useMemo(() => {
    if (!avatarConfig) {
      return { rating: "OPTIMAL", tone: "text-cyan-400", ratio: 1.0, message: "" };
    }
    return GarmentFittingService.evaluateFit(selectedBottomSize, avatarConfig, "bottom");
  }, [selectedBottomSize, avatarConfig]);

  // Camera Presets & Reset
  const handleSetCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    cameraManagerRef.current?.setPreset(preset);
  };

  const handleResetCamera = () => {
    setCameraPreset("full");
    cameraManagerRef.current?.reset();
  };

  const handleSetLightingPreset = (preset: LightingPreset) => {
    setLightingPreset(preset);
    lightingManagerRef.current?.setPreset(preset);
  };

  const handleToggleAutoRotate = () => {
    if (cameraManagerRef.current) {
      const state = cameraManagerRef.current.toggleAutoRotate();
      setAutoRotate(state);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!sceneManagerRef.current) return;
    const dataUrl = sceneManagerRef.current.renderer.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `HAII-WEAES-3D-FIT-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="relative w-full lg:h-[calc(100vh-68px)] min-h-[92vh] bg-[#080808] text-white flex flex-col lg:flex-row overflow-hidden border-t border-[#1a1a1a]">
      {/* LEFT / CENTER: 3D WEBGL STUDIO CANVAS */}
      <div className="relative flex-1 min-h-[520px] lg:h-full overflow-hidden bg-radial from-[#121212] via-[#090909] to-[#040404]">
        {/* Mount container for Three.js WebGL canvas */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

        {/* Viewport UI Controls & Overlays */}
        <ViewportControls
          activeCameraPreset={cameraPreset}
          onSetCameraPreset={handleSetCameraPreset}
          lightingPreset={lightingPreset}
          onSetLightingPreset={handleSetLightingPreset}
          autoRotate={autoRotate}
          onToggleAutoRotate={handleToggleAutoRotate}
          onResetCamera={handleResetCamera}
          onCaptureSnapshot={handleCaptureSnapshot}
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          avatarConfig={avatarConfig}
          onOpenAvatarCreator={() => setIsAvatarModalOpen(true)}
        />

        {/* Download Progress Bar Overlay (when downloading Stage 2 or garments) */}
        <div className="absolute top-20 left-4 right-4 sm:right-auto sm:w-96 z-30">
          <DownloadProgressBar
            progress={downloadProgress}
            onRetry={() => AssetManager.startStage2Priority()}
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR: CATALOGUE OUTFIT SELECTOR */}
      <GarmentSelector
        selectedTop={selectedTop}
        onSelectTop={setSelectedTop}
        selectedTopSize={selectedTopSize}
        onSelectTopSize={setSelectedTopSize}
        selectedTopColor={selectedTopColor}
        onSelectTopColor={setSelectedTopColor}
        selectedBottom={selectedBottom}
        onSelectBottom={setSelectedBottom}
        selectedBottomSize={selectedBottomSize}
        onSelectBottomSize={setSelectedBottomSize}
        selectedBottomColor={selectedBottomColor}
        onSelectBottomColor={setSelectedBottomColor}
        hasBag={hasBag}
        onToggleBag={() => setHasBag(!hasBag)}
        hasChain={hasChain}
        onToggleChain={() => setHasChain(!hasChain)}
        topFitEvaluation={topFitEvaluation}
        bottomFitEvaluation={bottomFitEvaluation}
      />

      {/* Multi-Step Avatar Creation / Photo Measurement Modal */}
      <AvatarCreationModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onAvatarCreated={(newConfig) => setAvatarConfig(newConfig)}
      />
    </div>
  );
}
