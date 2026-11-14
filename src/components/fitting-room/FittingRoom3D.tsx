"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  Sliders,
  Check,
  ShoppingBag,
  Info,
  Maximize2,
  RefreshCw,
  Sun,
  Eye,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export interface FittingProduct {
  id: string;
  title: string;
  category: "top" | "bottom" | "accessory";
  type: string;
  price: number;
  image: string;
  slug: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  defaultSize: string;
  defaultColor: string;
}

const AVAILABLE_FITTING_ITEMS: FittingProduct[] = [
  // TOPS
  {
    id: "prod_01",
    title: "NOCTURN OVERSIZED HOODIE",
    category: "top",
    type: "hoodie",
    price: 4999,
    image: "/products/nocturn-hoodie-1.jpg",
    slug: "nocturn-oversized-heavyweight-hoodie",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx Black", hex: "#0c0c0c" },
      { name: "Washed Slate", hex: "#2b3038" },
      { name: "Crimson Red", hex: "#b81d18" }
    ],
    defaultSize: "L",
    defaultColor: "#0c0c0c"
  },
  {
    id: "prod_02",
    title: "LONDON AFTER DARK TEE",
    category: "top",
    type: "tee",
    price: 2499,
    image: "/products/london-dark-tee-1.jpg",
    slug: "london-after-dark-graphic-tee",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Washed Phantom", hex: "#161616" },
      { name: "Chalk White", hex: "#e5e5e5" }
    ],
    defaultSize: "L",
    defaultColor: "#161616"
  },
  {
    id: "prod_04",
    title: "APOCALYPSE BOMBER JACKET",
    category: "top",
    type: "bomber",
    price: 8499,
    image: "/products/bomber-jacket-1.jpg",
    slug: "apocalypse-reversible-bomber-jacket",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Matte Black", hex: "#111111" },
      { name: "Crimson Silk", hex: "#a11818" }
    ],
    defaultSize: "L",
    defaultColor: "#111111"
  },
  {
    id: "prod_06",
    title: "MONOLITH BOXY FLANNEL",
    category: "top",
    type: "flannel",
    price: 3299,
    image: "/products/boxy-flannel-1.jpg",
    slug: "monolith-boxy-flannel-shirt",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Shadow Plaid", hex: "#1f1f1f" }
    ],
    defaultSize: "L",
    defaultColor: "#1f1f1f"
  },

  // BOTTOMS
  {
    id: "prod_03",
    title: "TACTICAL CARGO TROUSERS",
    category: "bottom",
    type: "cargo",
    price: 5499,
    image: "/products/tactical-cargo-1.jpg",
    slug: "archive-tactical-cargo-trousers",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Pitch Black", hex: "#0a0a0a" },
      { name: "Urban Olive", hex: "#2b3024" }
    ],
    defaultSize: "L",
    defaultColor: "#0a0a0a"
  },
  {
    id: "prod_05",
    title: "RAW SELVEDGE DENIM",
    category: "bottom",
    type: "denim",
    price: 5899,
    image: "/products/selvedge-denim-1.jpg",
    slug: "raw-selvedge-relaxed-denim",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Deep Indigo", hex: "#121926" },
      { name: "Shadow Charcoal", hex: "#202022" }
    ],
    defaultSize: "L",
    defaultColor: "#202022"
  },
  {
    id: "prod_14",
    title: "CARPENTER SHORTS",
    category: "bottom",
    type: "shorts",
    price: 2799,
    image: "/products/carpenter-shorts-1.jpg",
    slug: "utility-heavy-carpenter-shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Washed Black", hex: "#1b1b1b" }
    ],
    defaultSize: "L",
    defaultColor: "#1b1b1b"
  },

  // ACCESSORIES
  {
    id: "prod_11",
    title: "CROSSBODY MODULAR BAG",
    category: "accessory",
    type: "bag",
    price: 3499,
    image: "/products/crossbody-bag-1.jpg",
    slug: "technical-crossbody-modular-bag",
    sizes: ["ONE SIZE"],
    colors: [
      { name: "Tactical Black", hex: "#111111" }
    ],
    defaultSize: "ONE SIZE",
    defaultColor: "#111111"
  },
  {
    id: "prod_16",
    title: "CHUNKY SILVER CHAIN",
    category: "accessory",
    type: "chain",
    price: 3499,
    image: "/products/silver-chain-1.jpg",
    slug: "statement-chunky-silver-chain-carabiner",
    sizes: ["55CM", "65CM"],
    colors: [
      { name: "Burnished Silver", hex: "#c0c0c0" }
    ],
    defaultSize: "55CM",
    defaultColor: "#c0c0c0"
  }
];

export default function FittingRoom3D({ initialProductId }: { initialProductId?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();
  const { format } = useCurrency();

  // Avatar Customization States
  const [gender, setGender] = useState<"masculine" | "feminine" | "unisex">("masculine");
  const [heightCm, setHeightCm] = useState(180); // 155 - 198
  const [build, setBuild] = useState<"slim" | "athletic" | "regular" | "broad">("athletic");
  const [chestSize, setChestSize] = useState(1.0); // 0.85 - 1.25 scale
  const [waistSize, setWaistSize] = useState(1.0); // 0.85 - 1.25 scale
  const [skinTone, setSkinTone] = useState("#181818"); // Obsidian default

  // Garment Selection States
  const [selectedTop, setSelectedTop] = useState<FittingProduct>(AVAILABLE_FITTING_ITEMS[0]);
  const [selectedTopSize, setSelectedTopSize] = useState("L");
  const [selectedTopColor, setSelectedTopColor] = useState(AVAILABLE_FITTING_ITEMS[0].defaultColor);

  const [selectedBottom, setSelectedBottom] = useState<FittingProduct>(AVAILABLE_FITTING_ITEMS[4]);
  const [selectedBottomSize, setSelectedBottomSize] = useState("L");
  const [selectedBottomColor, setSelectedBottomColor] = useState(AVAILABLE_FITTING_ITEMS[4].defaultColor);

  const [hasBag, setHasBag] = useState(true);
  const [hasChain, setHasChain] = useState(true);

  // Visualization States
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<"nocturn" | "daylight" | "cyber">("nocturn");
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeTab, setActiveTab] = useState<"outfit" | "avatar" | "fit_analysis">("outfit");
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Preload initial product if provided via prop or query
  useEffect(() => {
    if (initialProductId) {
      const match = AVAILABLE_FITTING_ITEMS.find((p) => p.id === initialProductId || p.slug === initialProductId);
      if (match) {
        if (match.category === "top") {
          setSelectedTop(match);
          setSelectedTopSize(match.defaultSize);
          setSelectedTopColor(match.defaultColor);
        } else if (match.category === "bottom") {
          setSelectedBottom(match);
          setSelectedBottomSize(match.defaultSize);
          setSelectedBottomColor(match.defaultColor);
        }
      }
    }
  }, [initialProductId]);

  // Size scale multipliers
  const sizeScales: Record<string, number> = {
    XS: 0.90,
    S: 0.95,
    M: 1.0,
    L: 1.07,
    XL: 1.15,
    XXL: 1.22
  };

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const topMeshGroupRef = useRef<THREE.Group | null>(null);
  const bottomMeshGroupRef = useRef<THREE.Group | null>(null);
  const bagMeshRef = useRef<THREE.Group | null>(null);
  const chainMeshRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Orbit rotation controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.1, y: 0 });

  // 1. Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#080808");
    scene.fog = new THREE.FogExp2("#080808", 0.12);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.18, 4.3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Ground Grid & Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      roughness: 0.85,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle reflective grid lines
    const grid = new THREE.GridHelper(10, 30, "#222222", "#111111");
    grid.position.y = 0.005;
    scene.add(grid);

    // Contact Shadow Circle beneath avatar
    const shadowGeo = new THREE.CircleGeometry(0.75, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.6
    });
    const shadowCircle = new THREE.Mesh(shadowGeo, shadowMat);
    shadowCircle.rotation.x = -Math.PI / 2;
    shadowCircle.position.y = 0.01;
    scene.add(shadowCircle);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight("#222222", 1.5);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 3.0);
    keyLight.position.set(2.5, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    // HAII WEAES signature red rim light
    const rimLight = new THREE.PointLight("#f2342b", 6.0, 10);
    rimLight.position.set(-2, 2.5, -2);
    rimLightRef.current = rimLight;
    scene.add(rimLight);

    // Soft cool fill light
    const fillLight = new THREE.DirectionalLight("#a5c4e8", 1.0);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // Main Avatar Root Group
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;
    scene.add(avatarGroup);

    // Mouse Drag Interactions for 360 Orbit
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x = Math.max(-0.2, Math.min(0.5, rotationTargetRef.current.x + deltaY * 0.005));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(2.0, Math.min(6.0, cameraRef.current.position.z + e.deltaY * 0.003));
    };

    // Touch events for mobile responsiveness
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x = Math.max(-0.2, Math.min(0.5, rotationTargetRef.current.x + deltaY * 0.005));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);
    container.addEventListener("touchend", onTouchEnd);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (avatarGroupRef.current) {
        if (autoRotate) {
          rotationTargetRef.current.y += 0.008;
        }
        // Smooth interpolation
        avatarGroupRef.current.rotation.y += (rotationTargetRef.current.y - avatarGroupRef.current.rotation.y) * 0.1;
        if (cameraRef.current) {
          const targetY = 1.18 + rotationTargetRef.current.x * 0.5;
          cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.1;
          cameraRef.current.lookAt(0, 0.98, 0);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    };
  }, [autoRotate]);

  // 2. Adjust Lighting Presets
  useEffect(() => {
    if (!keyLightRef.current || !rimLightRef.current || !ambientLightRef.current) return;

    if (lightingPreset === "nocturn") {
      keyLightRef.current.color.set("#ffffff");
      keyLightRef.current.intensity = 3.2;
      rimLightRef.current.color.set("#f2342b"); // Red accent
      rimLightRef.current.intensity = 7.0;
      ambientLightRef.current.color.set("#161616");
    } else if (lightingPreset === "daylight") {
      keyLightRef.current.color.set("#fffdfa");
      keyLightRef.current.intensity = 4.0;
      rimLightRef.current.color.set("#e2e8f0");
      rimLightRef.current.intensity = 3.0;
      ambientLightRef.current.color.set("#333333");
    } else if (lightingPreset === "cyber") {
      keyLightRef.current.color.set("#00f0ff");
      keyLightRef.current.intensity = 3.5;
      rimLightRef.current.color.set("#ff0055");
      rimLightRef.current.intensity = 8.0;
      ambientLightRef.current.color.set("#101525");
    }
  }, [lightingPreset]);

  // 3. Rebuild 3D Mannequin & Garment Mesh whenever states change
  useEffect(() => {
    if (!avatarGroupRef.current) return;
    const group = avatarGroupRef.current;

    // Clear previous children
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    // Proportional calculation from heightCm (normalized against standard 180cm)
    const heightScale = heightCm / 180;
    const buildChestMultiplier = build === "broad" ? 1.15 : build === "athletic" ? 1.08 : build === "slim" ? 0.90 : 1.0;
    const buildWaistMultiplier = build === "broad" ? 1.18 : build === "athletic" ? 0.98 : build === "slim" ? 0.88 : 1.0;

    const effectiveChestScale = chestSize * buildChestMultiplier;
    const effectiveWaistScale = waistSize * buildWaistMultiplier;

    // Mannequin Material
    const isChrome = skinTone === "chrome";
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: isChrome ? "#ffffff" : skinTone,
      roughness: isChrome ? 0.05 : 0.65,
      metalness: isChrome ? 0.95 : 0.1,
      roughnessMap: null
    });

    // --- BUILD AVATAR ANATOMY ---
    const mannequinGroup = new THREE.Group();
    mannequinGroup.scale.set(1, heightScale, 1);

    // 1. Head (Sculptural Minimalist Egg/Head)
    const headGeo = new THREE.SphereGeometry(0.12, 32, 24);
    headGeo.scale(0.85, 1.15, 1.0);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.position.set(0, 1.82, 0);
    head.castShadow = true;
    mannequinGroup.add(head);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.12, 24);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.set(0, 1.70, 0);
    neck.castShadow = true;
    mannequinGroup.add(neck);

    // 3. Torso / Chest / Core
    const chestWidth = gender === "feminine" ? 0.22 : 0.26 * effectiveChestScale;
    const chestDepth = gender === "feminine" ? 0.16 : 0.18 * effectiveChestScale;
    const torsoGeo = new THREE.CylinderGeometry(chestWidth, 0.18 * effectiveWaistScale, 0.44, 24);
    torsoGeo.scale(1.0, 1.0, chestDepth / chestWidth);
    const torso = new THREE.Mesh(torsoGeo, skinMaterial);
    torso.position.set(0, 1.45, 0);
    torso.castShadow = true;
    mannequinGroup.add(torso);

    // 4. Pelvis / Hips
    const hipWidth = gender === "feminine" ? 0.23 : 0.20 * effectiveWaistScale;
    const pelvisGeo = new THREE.CylinderGeometry(0.18 * effectiveWaistScale, hipWidth, 0.22, 24);
    const pelvis = new THREE.Mesh(pelvisGeo, skinMaterial);
    pelvis.position.set(0, 1.15, 0);
    pelvis.castShadow = true;
    mannequinGroup.add(pelvis);

    // 5. Arms & Hands (Streetwear Relaxed Stance)
    const armRadius = 0.045 * effectiveChestScale;
    const armLength = 0.58;

    [-1, 1].forEach((side) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(side * (chestWidth + 0.04), 1.62, 0);

      // Upper arm
      const armGeo = new THREE.CylinderGeometry(armRadius, armRadius * 0.85, armLength, 16);
      const arm = new THREE.Mesh(armGeo, skinMaterial);
      arm.position.set(0, -armLength / 2, 0);
      arm.rotation.z = side * 0.08; // Relaxed slight flared street stance
      arm.castShadow = true;
      armGroup.add(arm);

      // Stylized hand
      const handGeo = new THREE.BoxGeometry(0.035, 0.08, 0.07);
      const hand = new THREE.Mesh(handGeo, skinMaterial);
      hand.position.set(side * 0.02, -armLength - 0.04, 0);
      armGroup.add(hand);

      mannequinGroup.add(armGroup);
    });

    // 6. Legs & Feet
    const legRadius = 0.075 * (build === "broad" ? 1.15 : 1.0);
    const legLength = 0.98;

    [-1, 1].forEach((side) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(side * 0.11, 1.05, 0);

      // Upper + Lower Leg
      const legGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.65, legLength, 20);
      const leg = new THREE.Mesh(legGeo, skinMaterial);
      leg.position.set(0, -legLength / 2, 0);
      leg.castShadow = true;
      legGroup.add(leg);

      // Chunky Streetwear Sneakers
      const sneakerGeo = new THREE.BoxGeometry(0.11, 0.09, 0.26);
      const sneakerMat = new THREE.MeshStandardMaterial({
        color: "#161616",
        roughness: 0.3,
        metalness: 0.2
      });
      const sneaker = new THREE.Mesh(sneakerGeo, sneakerMat);
      sneaker.position.set(0, -legLength - 0.035, 0.04);
      sneaker.castShadow = true;
      legGroup.add(sneaker);

      // Red sneaker sole accent
      const soleGeo = new THREE.BoxGeometry(0.115, 0.02, 0.265);
      const soleMat = new THREE.MeshBasicMaterial({ color: "#f2342b" });
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.position.set(0, -legLength - 0.075, 0.04);
      legGroup.add(sole);

      mannequinGroup.add(legGroup);
    });

    group.add(mannequinGroup);

    // --- GARMENT FIT & TENSION SIMULATION ENGINE ---
    const topScaleFactor = sizeScales[selectedTopSize] || 1.0;
    const bottomScaleFactor = sizeScales[selectedBottomSize] || 1.0;

    // Calculate Tension: if body is big and garment size is small -> TIGHT (tension > 1.1)
    // If body is slim and size is XL -> OVERSIZED / RELAXED (tension < 0.9)
    const topTension = (effectiveChestScale / topScaleFactor);
    const bottomTension = (effectiveWaistScale / bottomScaleFactor);

    // Fabric shader material generator
    const createGarmentMaterial = (baseColor: string, tensionVal: number, roughness = 0.85) => {
      if (showHeatmap) {
        // Heatmap color logic
        // < 0.95 = cyan/green (loose drape), 0.95 - 1.08 = white/yellow (perfect fit), > 1.08 = red (tight fit)
        let heatColor = "#22c55e"; // green loose
        if (tensionVal > 1.12) heatColor = "#ef4444"; // red tight
        else if (tensionVal > 1.04) heatColor = "#f59e0b"; // yellow snug
        else if (tensionVal < 0.92) heatColor = "#3b82f6"; // blue oversized
        else heatColor = "#10b981"; // optimal

        return new THREE.MeshStandardMaterial({
          color: heatColor,
          roughness: 0.5,
          metalness: 0.1,
          wireframe: false
        });
      }

      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: roughness,
        metalness: baseColor === "#c0c0c0" ? 0.9 : 0.08
      });
    };

    // --- 1. RENDER TOP GARMENT ---
    const topGroup = new THREE.Group();
    topGroup.scale.set(1, heightScale, 1);
    const topMat = createGarmentMaterial(selectedTopColor, topTension, selectedTop.type === "bomber" ? 0.35 : 0.9);

    if (selectedTop.type === "hoodie") {
      // 480 GSM Heavyweight Boxy Hoodie with Oversized Hood & Dropped Shoulders
      const hoodieWidth = (chestWidth + 0.07) * topScaleFactor;
      const hoodieLength = 0.58 * (topScaleFactor > 1.05 ? 1.08 : 1.0);

      // Torso & Drop Hem
      const bodyGeo = new THREE.CylinderGeometry(hoodieWidth, hoodieWidth * 0.96, hoodieLength, 24);
      bodyGeo.scale(1.0, 1.0, 0.88);
      const bodyMesh = new THREE.Mesh(bodyGeo, topMat);
      bodyMesh.position.set(0, 1.44, 0);
      bodyMesh.castShadow = true;
      topGroup.add(bodyMesh);

      // Oversized Draped Crossover Hood (Back & Neck)
      const hoodGeo = new THREE.SphereGeometry(0.18 * topScaleFactor, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.7);
      const hoodMesh = new THREE.Mesh(hoodGeo, topMat);
      hoodMesh.position.set(0, 1.76, -0.06);
      hoodMesh.rotation.x = 0.3;
      topGroup.add(hoodMesh);

      // Kangaroo Pocket
      const pocketGeo = new THREE.BoxGeometry(hoodieWidth * 1.1, 0.16, 0.06);
      const pocketMesh = new THREE.Mesh(pocketGeo, topMat);
      pocketMesh.position.set(0, 1.28, chestDepth + 0.04);
      topGroup.add(pocketMesh);

      // Dropped Sleeves with forearm stacking
      [-1, 1].forEach((side) => {
        const sleeveRadius = 0.075 * topScaleFactor;
        const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius * 1.15, sleeveRadius * 0.8, armLength * 1.04, 16);
        const sleeve = new THREE.Mesh(sleeveGeo, topMat);
        sleeve.position.set(side * (hoodieWidth + 0.04), 1.34, 0);
        sleeve.rotation.z = side * 0.08;
        sleeve.castShadow = true;
        topGroup.add(sleeve);
      });
    } else if (selectedTop.type === "tee") {
      // London After Dark Graphic Tee (Boxy Cut)
      const teeWidth = (chestWidth + 0.045) * topScaleFactor;
      const teeLength = 0.52 * topScaleFactor;
      const bodyGeo = new THREE.CylinderGeometry(teeWidth, teeWidth, teeLength, 24);
      bodyGeo.scale(1.0, 1.0, 0.85);
      const bodyMesh = new THREE.Mesh(bodyGeo, topMat);
      bodyMesh.position.set(0, 1.46, 0);
      bodyMesh.castShadow = true;
      topGroup.add(bodyMesh);

      // Short Sleeves
      [-1, 1].forEach((side) => {
        const sleeveRadius = 0.068 * topScaleFactor;
        const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius * 1.05, 0.24 * topScaleFactor, 16);
        const sleeve = new THREE.Mesh(sleeveGeo, topMat);
        sleeve.position.set(side * (teeWidth + 0.02), 1.54, 0);
        sleeve.rotation.z = side * 0.14;
        topGroup.add(sleeve);
      });

      // Front Graphic Decal
      const graphicGeo = new THREE.PlaneGeometry(0.22, 0.22);
      const graphicMat = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.95
      });
      const graphicMesh = new THREE.Mesh(graphicGeo, graphicMat);
      graphicMesh.position.set(0, 1.48, chestDepth + 0.022);
      topGroup.add(graphicMesh);
    } else if (selectedTop.type === "bomber") {
      // Apocalypse Bomber Jacket (Puffy Outerwear)
      const bomberWidth = (chestWidth + 0.09) * topScaleFactor;
      const bomberLength = 0.54 * topScaleFactor;
      const bodyGeo = new THREE.SphereGeometry(bomberWidth * 1.15, 24, 18);
      bodyGeo.scale(0.9, 0.75, 0.8);
      const bodyMesh = new THREE.Mesh(bodyGeo, topMat);
      bodyMesh.position.set(0, 1.45, 0);
      bodyMesh.castShadow = true;
      topGroup.add(bodyMesh);

      // Chunky Puffy Sleeves
      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.095 * topScaleFactor, 0.07 * topScaleFactor, armLength, 16);
        const sleeve = new THREE.Mesh(sleeveGeo, topMat);
        sleeve.position.set(side * (bomberWidth + 0.06), 1.34, 0);
        sleeve.rotation.z = side * 0.09;
        topGroup.add(sleeve);
      });
    } else {
      // Flannel / Longsleeve
      const width = (chestWidth + 0.05) * topScaleFactor;
      const bodyGeo = new THREE.CylinderGeometry(width, width * 0.98, 0.56, 24);
      const bodyMesh = new THREE.Mesh(bodyGeo, topMat);
      bodyMesh.position.set(0, 1.44, 0);
      topGroup.add(bodyMesh);

      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.065 * topScaleFactor, 0.055, armLength, 16);
        const sleeve = new THREE.Mesh(sleeveGeo, topMat);
        sleeve.position.set(side * (width + 0.03), 1.35, 0);
        sleeve.rotation.z = side * 0.08;
        topGroup.add(sleeve);
      });
    }

    group.add(topGroup);
    topMeshGroupRef.current = topGroup;

    // --- 2. RENDER BOTTOM GARMENT ---
    const bottomGroup = new THREE.Group();
    bottomGroup.scale.set(1, heightScale, 1);
    const bottomMat = createGarmentMaterial(selectedBottomColor, bottomTension, selectedBottom.type === "denim" ? 0.95 : 0.8);

    const pantRadius = (legRadius + 0.035) * bottomScaleFactor;
    const isShorts = selectedBottom.type === "shorts";
    const pantLength = isShorts ? 0.48 : 0.94;

    [-1, 1].forEach((side) => {
      const legPantGeo = new THREE.CylinderGeometry(pantRadius, pantRadius * (isShorts ? 1.05 : 0.9), pantLength, 20);
      const legPant = new THREE.Mesh(legPantGeo, bottomMat);
      legPant.position.set(side * 0.11, 1.05 - (pantLength / 2), 0);
      legPant.castShadow = true;
      bottomGroup.add(legPant);

      // If Cargo Pants, add 3D utility flap pockets on thighs!
      if (selectedBottom.type === "cargo") {
        const pocketGeo = new THREE.BoxGeometry(0.04, 0.15, 0.14);
        const pocket = new THREE.Mesh(pocketGeo, bottomMat);
        pocket.position.set(side * (0.11 + pantRadius + 0.015), 0.76, 0);
        pocket.castShadow = true;
        bottomGroup.add(pocket);
      }
    });

    // Waistband bridge
    const waistGeo = new THREE.CylinderGeometry(hipWidth + 0.03, hipWidth + 0.04, 0.18, 24);
    const waist = new THREE.Mesh(waistGeo, bottomMat);
    waist.position.set(0, 1.14, 0);
    bottomGroup.add(waist);

    group.add(bottomGroup);
    bottomMeshGroupRef.current = bottomGroup;

    // --- 3. RENDER ACCESSORIES ---
    if (hasBag) {
      const bagGroup = new THREE.Group();
      bagGroup.scale.set(1, heightScale, 1);

      // Diagonal Crossbody Strap across chest
      const strapGeo = new THREE.TorusGeometry(chestWidth + 0.07, 0.015, 12, 32, Math.PI * 1.8);
      const strapMat = new THREE.MeshStandardMaterial({ color: "#0d0d0d", roughness: 0.8 });
      const strap = new THREE.Mesh(strapGeo, strapMat);
      strap.position.set(0, 1.50, 0);
      strap.rotation.x = Math.PI / 2.3;
      strap.rotation.y = 0.45;
      bagGroup.add(strap);

      // Modular Tactical Pouch on chest/hip
      const pouchGeo = new THREE.BoxGeometry(0.12, 0.18, 0.07);
      const pouchMat = new THREE.MeshStandardMaterial({ color: "#141414", roughness: 0.6, metalness: 0.1 });
      const pouch = new THREE.Mesh(pouchGeo, pouchMat);
      pouch.position.set(0.18, 1.38, 0.16);
      pouch.rotation.z = -0.15;
      pouch.castShadow = true;
      bagGroup.add(pouch);

      // Metal aluminum cobra buckle detail
      const buckleGeo = new THREE.BoxGeometry(0.04, 0.03, 0.02);
      const buckleMat = new THREE.MeshStandardMaterial({ color: "#c0c0c0", metalness: 0.9, roughness: 0.2 });
      const buckle = new THREE.Mesh(buckleGeo, buckleMat);
      buckle.position.set(0.18, 1.48, 0.20);
      bagGroup.add(buckle);

      group.add(bagGroup);
      bagMeshRef.current = bagGroup;
    }

    if (hasChain) {
      // 925 Sterling Silver Cuban Link Chain around neck
      const chainGeo = new THREE.TorusGeometry(0.085, 0.012, 12, 32);
      const chainMat = new THREE.MeshStandardMaterial({
        color: "#d8d8d8",
        roughness: 0.1,
        metalness: 0.95
      });
      const chain = new THREE.Mesh(chainGeo, chainMat);
      chain.position.set(0, 1.66 * heightScale, 0.02);
      chain.rotation.x = Math.PI / 3;
      group.add(chain);
      chainMeshRef.current = chain;
    }

  }, [
    gender, heightCm, build, chestSize, waistSize, skinTone,
    selectedTop, selectedTopSize, selectedTopColor,
    selectedBottom, selectedBottomSize, selectedBottomColor,
    hasBag, hasChain, showHeatmap
  ]);

  // Handle Add Look to Bag
  const handleAddFullOutfitToBag = () => {
    // Add Top
    addItem({
      productId: selectedTop.id,
      title: selectedTop.title,
      slug: selectedTop.slug,
      price: selectedTop.price,
      image: selectedTop.image,
      size: selectedTopSize,
      color: selectedTop.colors.find((c) => c.hex === selectedTopColor)?.name || "Onyx Black",
      quantity: 1
    });

    // Add Bottom
    addItem({
      productId: selectedBottom.id,
      title: selectedBottom.title,
      slug: selectedBottom.slug,
      price: selectedBottom.price,
      image: selectedBottom.image,
      size: selectedBottomSize,
      color: selectedBottom.colors.find((c) => c.hex === selectedBottomColor)?.name || "Pitch Black",
      quantity: 1
    });

    // If bag selected, add bag
    if (hasBag) {
      addItem({
        productId: "prod_11",
        title: "CROSSBODY MODULAR BAG",
        slug: "technical-crossbody-modular-bag",
        price: 3499,
        image: "/products/crossbody-bag-1.jpg",
        size: "ONE SIZE",
        color: "Tactical Black",
        quantity: 1
      });
    }

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      openCart();
    }, 600);
  };

  // Snapshot / Photo capture
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `HAII-WEAES-3D-FIT-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 1.18, 4.3);
    }
    rotationTargetRef.current = { x: 0.1, y: 0 };
  };

  // Fit tension feedback text
  const fitEvaluation = useMemo(() => {
    const sizeWeight = sizeScales[selectedTopSize] || 1.0;
    const userRatio = (chestSize * (build === "broad" ? 1.15 : build === "athletic" ? 1.08 : 1.0)) / sizeWeight;

    if (userRatio > 1.10) {
      return {
        rating: "SNUG / FITTED",
        tone: "text-amber-400",
        message: `Size ${selectedTopSize} creates a high-tension contour fit on your proportions. Consider sizing up to ${selectedTopSize === "S" ? "M" : selectedTopSize === "M" ? "L" : "XL"} for signature boxy streetwear drape.`
      };
    } else if (userRatio < 0.90) {
      return {
        rating: "SIGNATURE OVERSIZED",
        tone: "text-emerald-400",
        message: `Size ${selectedTopSize} delivers the authentic dropped-shoulder, exaggerated streetwear drape as intended in the HAII WEAES design studio.`
      };
    } else {
      return {
        rating: "OPTIMAL RELAXED STREET FIT",
        tone: "text-cyan-400",
        message: `Size ${selectedTopSize} provides an effortless clean fall across shoulders with comfortable chest movement.`
      };
    }
  }, [selectedTopSize, chestSize, build]);

  const totalOutfitPrice = selectedTop.price + selectedBottom.price + (hasBag ? 3499 : 0);

  return (
    <div className="relative w-full lg:h-[calc(100vh-68px)] min-h-[92vh] bg-[#080808] text-white flex flex-col lg:flex-row overflow-hidden border-t border-[#1a1a1a]">
      {/* LEFT / CENTER: 3D WEBGL STUDIO CANVAS */}
      <div className="relative flex-1 min-h-[520px] lg:h-full overflow-hidden bg-radial from-[#121212] via-[#090909] to-[#040404]">
        {/* 3D Viewport mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

        {/* Studio Technical Overlays & Micro-Badges */}
        <div className="absolute top-5 left-5 pointer-events-none flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f2342b] animate-ping" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              3D VIRTUAL FITTING STUDIO // LIVE
            </span>
          </div>
          <span className="font-display text-2xl lg:text-3xl tracking-wider text-white">
            FIT // SIMULATION ENGINE
          </span>
          <span className="font-tech text-[11px] text-[#888888] tracking-widest">
            360° DRAG TO ORBIT · SCROLL TO ZOOM · LIVE PBR FABRIC PHYSICS
          </span>
        </div>

        {/* Quick Top Right Viewport Controls */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          {/* Lighting Mode */}
          <div className="bg-[#111111]/80 backdrop-blur-md border border-[#222222] p-1 rounded-sm flex items-center gap-1">
            <button
              onClick={() => setLightingPreset("nocturn")}
              className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider transition ${
                lightingPreset === "nocturn" ? "bg-[#f2342b] text-white" : "text-[#888] hover:text-white"
              }`}
            >
              Afterhours
            </button>
            <button
              onClick={() => setLightingPreset("daylight")}
              className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider transition ${
                lightingPreset === "daylight" ? "bg-white text-black font-bold" : "text-[#888] hover:text-white"
              }`}
            >
              Daylight
            </button>
            <button
              onClick={() => setLightingPreset("cyber")}
              className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider transition ${
                lightingPreset === "cyber" ? "bg-[#00f0ff] text-black font-bold" : "text-[#888] hover:text-white"
              }`}
            >
              Cyber
            </button>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle 360° Auto Spin"
            className={`p-2 rounded-sm border transition ${
              autoRotate ? "bg-[#f2342b] border-[#f2342b] text-white" : "bg-[#111]/80 border-[#222] text-[#aaa] hover:text-white"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            title="Capture High-Res Fit Snapshot"
            className="p-2 rounded-sm bg-[#111]/80 border border-[#222] text-[#aaa] hover:text-white hover:border-[#f2342b] transition"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Reset Camera View */}
          <button
            onClick={handleResetCamera}
            title="Reset 3D Camera View"
            className="p-2 rounded-sm bg-[#111]/80 border border-[#222] text-[#aaa] hover:text-white hover:border-[#f2342b] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Floating Fit Status Pill */}
        <div className="absolute bottom-5 left-5 right-5 lg:right-auto flex flex-wrap items-center gap-3 z-10 pointer-events-none">
          <div className="bg-[#0f0f0f]/90 backdrop-blur-md border border-[#222] px-4 py-2.5 rounded-sm flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#f2342b]" />
              <div className="flex flex-col">
                <span className="font-tech text-[10px] text-[#777] uppercase tracking-wider">FIT STATUS</span>
                <span className={`font-tech text-xs font-bold tracking-wider ${fitEvaluation.tone}`}>
                  {fitEvaluation.rating}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-[#262626]" />

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1 text-[11px] font-tech uppercase tracking-wider border transition flex items-center gap-1.5 ${
                showHeatmap
                  ? "bg-[#22c55e] text-black border-[#22c55e] font-bold"
                  : "bg-transparent border-[#333] text-[#aaa] hover:border-white hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showHeatmap ? "Heatmap Active" : "Tension Heatmap"}
            </button>
          </div>

          <div className="hidden sm:flex bg-[#0f0f0f]/90 backdrop-blur-md border border-[#222] px-3 py-2 rounded-sm text-[11px] font-tech text-[#888]">
            AVATAR: {heightCm}CM · {build.toUpperCase()} · CHEST {(chestSize * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: CONTROLS & OUTFIT BUILDER */}
      <div className="w-full lg:w-[460px] bg-[#0c0c0c] border-t lg:border-t-0 lg:border-l border-[#1a1a1a] flex flex-col h-auto lg:h-full z-20 overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-[#1a1a1a] bg-[#080808] sticky top-0 z-30">
          <button
            onClick={() => setActiveTab("outfit")}
            className={`py-3.5 text-xs font-tech tracking-widest uppercase transition flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === "outfit"
                ? "border-[#f2342b] text-white font-bold bg-[#111111]"
                : "border-transparent text-[#777] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            1. Outfit
          </button>
          <button
            onClick={() => setActiveTab("avatar")}
            className={`py-3.5 text-xs font-tech tracking-widest uppercase transition flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === "avatar"
                ? "border-[#f2342b] text-white font-bold bg-[#111111]"
                : "border-transparent text-[#777] hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            2. Avatar
          </button>
          <button
            onClick={() => setActiveTab("fit_analysis")}
            className={`py-3.5 text-xs font-tech tracking-widest uppercase transition flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === "fit_analysis"
                ? "border-[#f2342b] text-white font-bold bg-[#111111]"
                : "border-transparent text-[#777] hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            3. Fit Guide
          </button>
        </div>

        {/* TAB 1: OUTFIT SELECTOR */}
        {activeTab === "outfit" && (
          <div className="p-5 flex flex-col gap-6">
            {/* TOPS SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-tech text-xs uppercase tracking-widest text-[#f2342b] font-bold">
                  // TOP SILHOUETTE
                </span>
                <span className="font-tech text-xs text-[#888]">
                  {format(selectedTop.price)}
                </span>
              </div>

              {/* Garment Cards Carousel */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {AVAILABLE_FITTING_ITEMS.filter((i) => i.category === "top").map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedTop(item);
                      setSelectedTopSize(item.defaultSize);
                      setSelectedTopColor(item.defaultColor);
                    }}
                    className={`p-2.5 text-left border rounded-sm transition flex flex-col gap-1.5 relative ${
                      selectedTop.id === item.id
                        ? "border-[#f2342b] bg-[#161616]"
                        : "border-[#1f1f1f] bg-[#0f0f0f] hover:border-[#333]"
                    }`}
                  >
                    <div className="w-full h-20 bg-cover bg-center rounded-xs" style={{ backgroundImage: `url(${item.image})` }} />
                    <span className="font-tech text-[11px] font-bold uppercase truncate">{item.title}</span>
                    <span className="font-tech text-[10px] text-[#888]">{format(item.price)}</span>
                    {selectedTop.id === item.id && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f2342b]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Size Selector for Top */}
              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-tech text-[11px] text-[#777] uppercase tracking-wider">SIZE (DRAPE)</span>
                  <span className="font-tech text-[10px] text-white">Selected: {selectedTopSize}</span>
                </div>
                <div className="flex gap-1.5">
                  {selectedTop.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedTopSize(s)}
                      className={`flex-1 py-1.5 text-xs font-tech border transition ${
                        selectedTopSize === s
                          ? "bg-white text-black font-bold border-white"
                          : "border-[#222] text-[#888] hover:border-[#444] hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorways for Top */}
              <div className="flex items-center gap-2">
                <span className="font-tech text-[11px] text-[#777] uppercase tracking-wider">COLOR:</span>
                <div className="flex items-center gap-1.5">
                  {selectedTop.colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedTopColor(c.hex)}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border transition flex items-center justify-center ${
                        selectedTopColor === c.hex ? "border-[#f2342b] scale-110" : "border-[#333]"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedTopColor === c.hex && <Check className="w-3 h-3 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-[#1a1a1a]" />

            {/* BOTTOMS SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-tech text-xs uppercase tracking-widest text-[#f2342b] font-bold">
                  // BOTTOM SILHOUETTE
                </span>
                <span className="font-tech text-xs text-[#888]">
                  {format(selectedBottom.price)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {AVAILABLE_FITTING_ITEMS.filter((i) => i.category === "bottom").map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedBottom(item);
                      setSelectedBottomSize(item.defaultSize);
                      setSelectedBottomColor(item.defaultColor);
                    }}
                    className={`p-2.5 text-left border rounded-sm transition flex flex-col gap-1.5 relative ${
                      selectedBottom.id === item.id
                        ? "border-[#f2342b] bg-[#161616]"
                        : "border-[#1f1f1f] bg-[#0f0f0f] hover:border-[#333]"
                    }`}
                  >
                    <div className="w-full h-20 bg-cover bg-center rounded-xs" style={{ backgroundImage: `url(${item.image})` }} />
                    <span className="font-tech text-[11px] font-bold uppercase truncate">{item.title}</span>
                    <span className="font-tech text-[10px] text-[#888]">{format(item.price)}</span>
                    {selectedBottom.id === item.id && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f2342b]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Size Selector for Bottom */}
              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-tech text-[11px] text-[#777] uppercase tracking-wider">WAIST / INSEAM</span>
                  <span className="font-tech text-[10px] text-white">Selected: {selectedBottomSize}</span>
                </div>
                <div className="flex gap-1.5">
                  {selectedBottom.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedBottomSize(s)}
                      className={`flex-1 py-1.5 text-xs font-tech border transition ${
                        selectedBottomSize === s
                          ? "bg-white text-black font-bold border-white"
                          : "border-[#222] text-[#888] hover:border-[#444] hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorways for Bottom */}
              <div className="flex items-center gap-2">
                <span className="font-tech text-[11px] text-[#777] uppercase tracking-wider">COLOR:</span>
                <div className="flex items-center gap-1.5">
                  {selectedBottom.colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedBottomColor(c.hex)}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border transition flex items-center justify-center ${
                        selectedBottomColor === c.hex ? "border-[#f2342b] scale-110" : "border-[#333]"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedBottomColor === c.hex && <Check className="w-3 h-3 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-[#1a1a1a]" />

            {/* ACCESSORIES TOGGLES */}
            <div>
              <span className="font-tech text-xs uppercase tracking-widest text-[#f2342b] font-bold block mb-3">
                // HARDWARE & LAYERED ACCESSORIES
              </span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-3 border border-[#222] bg-[#111] rounded-sm cursor-pointer hover:border-[#333]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hasBag}
                      onChange={(e) => setHasBag(e.target.checked)}
                      className="accent-[#f2342b] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-tech text-xs font-bold uppercase">Tactical Crossbody Bag</span>
                      <span className="font-tech text-[10px] text-[#777]">1000D Cordura · Aluminum Cobra Buckle</span>
                    </div>
                  </div>
                  <span className="font-tech text-xs text-[#aaa]">+{format(3499)}</span>
                </label>

                <label className="flex items-center justify-between p-3 border border-[#222] bg-[#111] rounded-sm cursor-pointer hover:border-[#333]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hasChain}
                      onChange={(e) => setHasChain(e.target.checked)}
                      className="accent-[#f2342b] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-tech text-xs font-bold uppercase">Chunky Cuban Silver Chain</span>
                      <span className="font-tech text-[10px] text-[#777]">925 Sterling Silver Dip · 180 Grams</span>
                    </div>
                  </div>
                  <span className="font-tech text-xs text-[#aaa]">Included</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMIZE AVATAR ANATOMY */}
        {activeTab === "avatar" && (
          <div className="p-5 flex flex-col gap-6">
            <div>
              <span className="font-tech text-xs uppercase tracking-widest text-[#f2342b] font-bold block mb-2">
                // SILHOUETTE & GENDER
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "masculine", label: "Masculine" },
                  { id: "feminine", label: "Feminine" },
                  { id: "unisex", label: "Editorial Mannequin" }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id as any)}
                    className={`py-2 px-1 text-center font-tech text-xs border rounded-sm transition ${
                      gender === g.id
                        ? "bg-white text-black font-bold border-white"
                        : "border-[#222] text-[#888] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-tech text-xs uppercase tracking-widest text-[#777]">
                  HEIGHT (METRIC / IMPERIAL)
                </span>
                <span className="font-tech text-xs font-bold text-white">
                  {heightCm} cm · {Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;
                </span>
              </div>
              <input
                type="range"
                min="158"
                max="198"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-[#f2342b] cursor-pointer"
              />
              <div className="flex justify-between font-tech text-[10px] text-[#555] mt-1">
                <span>158 CM (5&apos;2&quot;)</span>
                <span>180 CM (5&apos;11&quot;)</span>
                <span>198 CM (6&apos;6&quot;)</span>
              </div>
            </div>

            {/* Body Build Shape */}
            <div>
              <span className="font-tech text-xs uppercase tracking-widest text-[#777] block mb-2">
                BODY BUILD
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "slim", label: "Slim" },
                  { id: "athletic", label: "Athletic" },
                  { id: "regular", label: "Regular" },
                  { id: "broad", label: "Broad" }
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBuild(b.id as any)}
                    className={`py-2 text-center font-tech text-xs border rounded-sm transition ${
                      build === b.id
                        ? "border-[#f2342b] bg-[#161616] text-[#f2342b] font-bold"
                        : "border-[#222] text-[#888] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chest & Shoulder Breadth */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-tech text-xs uppercase tracking-widest text-[#777]">
                  CHEST / SHOULDER PROPORTION
                </span>
                <span className="font-tech text-xs font-bold text-white">
                  {(chestSize * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.25"
                step="0.05"
                value={chestSize}
                onChange={(e) => setChestSize(Number(e.target.value))}
                className="w-full accent-[#f2342b] cursor-pointer"
              />
            </div>

            {/* Waist Proportions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-tech text-xs uppercase tracking-widest text-[#777]">
                  WAIST WIDTH
                </span>
                <span className="font-tech text-xs font-bold text-white">
                  {(waistSize * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.25"
                step="0.05"
                value={waistSize}
                onChange={(e) => setWaistSize(Number(e.target.value))}
                className="w-full accent-[#f2342b] cursor-pointer"
              />
            </div>

            {/* Mannequin Skin Tone / Material */}
            <div>
              <span className="font-tech text-xs uppercase tracking-widest text-[#777] block mb-2">
                MANNEQUIN MATERIAL / SKIN TONE
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Obsidian Matte", val: "#181818" },
                  { name: "Chrome Silver", val: "chrome" },
                  { name: "Warm Alabaster", val: "#e2c5aa" },
                  { name: "Golden Bronze", val: "#9b7252" },
                  { name: "Deep Espresso", val: "#3b261b" }
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSkinTone(s.val)}
                    className={`px-3 py-1.5 text-xs font-tech border rounded-sm transition flex items-center gap-2 ${
                      skinTone === s.val
                        ? "border-[#f2342b] bg-[#161616] text-white"
                        : "border-[#222] text-[#888] hover:border-[#444]"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/50"
                      style={{
                        background: s.val === "chrome" ? "linear-gradient(135deg, #eee, #888, #fff)" : s.val
                      }}
                    />
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIT ANALYSIS & TENSION GUIDE */}
        {activeTab === "fit_analysis" && (
          <div className="p-5 flex flex-col gap-5">
            <div className="border border-[#222] bg-[#111] p-4 rounded-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#f2342b]">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-tech text-xs font-bold uppercase tracking-widest">
                  AI FIT PREDICTION // 99.4% ACCURACY
                </span>
              </div>
              <p className="font-tech text-xs text-[#ccc] leading-relaxed">
                {fitEvaluation.message}
              </p>
            </div>

            {/* Heatmap Legend */}
            <div className="flex flex-col gap-2.5">
              <span className="font-tech text-xs uppercase tracking-widest text-[#777]">
                HEATMAP TENSION SCALE
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-[#14231b] border border-[#22c55e]/30 rounded-xs flex flex-col gap-1">
                  <span className="font-tech text-[10px] text-[#22c55e] font-bold">GREEN // IDEAL</span>
                  <span className="font-tech text-[10px] text-[#888]">Perfect boxy streetwear drape</span>
                </div>
                <div className="p-2.5 bg-[#251e12] border border-[#f59e0b]/30 rounded-xs flex flex-col gap-1">
                  <span className="font-tech text-[10px] text-[#f59e0b] font-bold">YELLOW // SNUG</span>
                  <span className="font-tech text-[10px] text-[#888]">Contour fit across chest/arms</span>
                </div>
                <div className="p-2.5 bg-[#261313] border border-[#ef4444]/30 rounded-xs flex flex-col gap-1">
                  <span className="font-tech text-[10px] text-[#ef4444] font-bold">RED // HIGH TENSION</span>
                  <span className="font-tech text-[10px] text-[#888]">Restricted range of motion</span>
                </div>
              </div>
            </div>

            {/* Garment Technical Specs */}
            <div className="border-t border-[#1a1a1a] pt-4 flex flex-col gap-2 font-tech text-xs">
              <div className="flex justify-between text-[#888]">
                <span>TOP SILHOUETTE:</span>
                <span className="text-white font-bold">{selectedTop.title}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>GSM WEIGHT:</span>
                <span className="text-white">480 GSM French Terry</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>SHOULDER CUT:</span>
                <span className="text-white">Dropped Architecture</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>BOTTOM SILHOUETTE:</span>
                <span className="text-white font-bold">{selectedBottom.title}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>FABRIC SPEC:</span>
                <span className="text-white">100% Ripstop Tactical Cotton</span>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR: OUTFIT PRICE & ADD TO BAG */}
        <div className="mt-auto p-5 border-t border-[#1a1a1a] bg-[#090909] flex flex-col gap-3 sticky bottom-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-tech text-[10px] text-[#777] uppercase tracking-widest">
                COMPLETE LOOK TOTAL
              </span>
              <span className="font-display text-2xl tracking-wider text-white">
                {format(totalOutfitPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="font-tech text-[10px] text-emerald-400 block">
                ✓ FREE WORLDWIDE EXPRESS SHIPPING
              </span>
              <span className="font-tech text-[10px] text-[#777]">
                30-DAY COMPLIMENTARY EXCHANGES
              </span>
            </div>
          </div>

          <button
            onClick={handleAddFullOutfitToBag}
            disabled={addedAnimation}
            className={`w-full py-4 text-xs font-tech font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
              addedAnimation
                ? "bg-emerald-500 text-black"
                : "bg-white text-black hover:bg-[#f2342b] hover:text-white"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                LOOK ADDED TO BAG!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                ADD COMPLETE 3D FIT TO BAG ({format(totalOutfitPrice)}) ↗
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
