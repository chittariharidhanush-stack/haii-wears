import { AssetManifestEntry } from "../../types/AssetTypes";

export const ASSET_MANIFEST: Record<string, AssetManifestEntry> = {
  // -------------------------------------------------------------
  // STAGE 1: BACKGROUND DOWNLOAD WHILE BROWSING (Shared Infrastructure)
  // -------------------------------------------------------------
  "avatar-base-mesh": {
    id: "avatar-base-mesh",
    url: "/assets/3d/avatar/human_base.glb",
    version: "1.0.0",
    stage: "stage1",
    category: "avatar-engine",
    priority: "normal",
    expectedBytes: 83872,
    required: true,
    dependencies: [],
    cacheGroup: "haii-3d-avatar-v1"
  },
  "avatar-base-obj": {
    id: "avatar-base-obj",
    url: "/assets/3d/avatar/human_base.obj",
    version: "1.0.0",
    stage: "stage1",
    category: "avatar-engine",
    priority: "normal",
    expectedBytes: 74509,
    required: true,
    dependencies: [],
    cacheGroup: "haii-3d-avatar-v1"
  },
  "oxihuman-wasm": {
    id: "oxihuman-wasm",
    url: "/assets/3d/avatar/oxihuman_wasm_bg.wasm",
    version: "0.2.0",
    stage: "stage1",
    category: "avatar-engine",
    priority: "normal",
    expectedBytes: 431968,
    required: true,
    dependencies: [],
    cacheGroup: "haii-3d-avatar-v1"
  },
  "oxihuman-js": {
    id: "oxihuman-js",
    url: "/assets/3d/avatar/oxihuman_wasm_bg.js",
    version: "0.2.0",
    stage: "stage1",
    category: "avatar-engine",
    priority: "normal",
    expectedBytes: 42488,
    required: true,
    dependencies: [],
    cacheGroup: "haii-3d-avatar-v1"
  },

  // -------------------------------------------------------------
  // STAGE 2: DOWNLOAD ONLY WHEN CUSTOMER SELECTS 3D LIVE
  // -------------------------------------------------------------
  "mediapipe-pose-model": {
    id: "mediapipe-pose-model",
    url: "/assets/3d/ai/models/pose_landmarker_lite.task",
    version: "1.2.0",
    stage: "stage2",
    category: "ai-model",
    priority: "high",
    expectedBytes: 5777746,
    required: true,
    dependencies: ["mediapipe-wasm"],
    cacheGroup: "haii-3d-ai-v1"
  },
  "mediapipe-wasm": {
    id: "mediapipe-wasm",
    url: "/assets/3d/ai/wasm/vision_wasm_internal.wasm",
    version: "1.2.3",
    stage: "stage2",
    category: "ai-model",
    priority: "high",
    expectedBytes: 14665716,
    required: true,
    dependencies: [],
    cacheGroup: "haii-3d-ai-v1"
  },
  "mediapipe-js": {
    id: "mediapipe-js",
    url: "/assets/3d/ai/wasm/vision_wasm_internal.js",
    version: "1.2.3",
    stage: "stage2",
    category: "ai-model",
    priority: "high",
    expectedBytes: 336624,
    required: true,
    dependencies: [],
    cacheGroup: "haii-3d-ai-v1"
  },

  // -------------------------------------------------------------
  // ON-DEMAND GARMENT MODELS (Loaded Just-In-Time by Product & Size)
  // -------------------------------------------------------------
  // NOCTURN HOODIE (prod_01)
  "garment-prod_01-S": {
    id: "garment-prod_01-S",
    url: "/assets/3d/garments/prod_01/S/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 44160,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_01",
    size: "S"
  },
  "garment-prod_01-M": {
    id: "garment-prod_01-M",
    url: "/assets/3d/garments/prod_01/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 44184,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_01",
    size: "M"
  },
  "garment-prod_01-L": {
    id: "garment-prod_01-L",
    url: "/assets/3d/garments/prod_01/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 44192,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_01",
    size: "L"
  },
  "garment-prod_01-XL": {
    id: "garment-prod_01-XL",
    url: "/assets/3d/garments/prod_01/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 44224,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_01",
    size: "XL"
  },
  "garment-prod_01-XXL": {
    id: "garment-prod_01-XXL",
    url: "/assets/3d/garments/prod_01/XXL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 44184,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_01",
    size: "XXL"
  },

  // LONDON AFTER DARK TEE (prod_02)
  "garment-prod_02-S": {
    id: "garment-prod_02-S",
    url: "/assets/3d/garments/prod_02/S/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 38056,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_02",
    size: "S"
  },
  "garment-prod_02-M": {
    id: "garment-prod_02-M",
    url: "/assets/3d/garments/prod_02/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 38120,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_02",
    size: "M"
  },
  "garment-prod_02-L": {
    id: "garment-prod_02-L",
    url: "/assets/3d/garments/prod_02/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 38096,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_02",
    size: "L"
  },
  "garment-prod_02-XL": {
    id: "garment-prod_02-XL",
    url: "/assets/3d/garments/prod_02/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 38060,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_02",
    size: "XL"
  },

  // ARCHIVE TACTICAL CARGO (prod_03)
  "garment-prod_03-S": {
    id: "garment-prod_03-S",
    url: "/assets/3d/garments/prod_03/S/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 21396,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_03",
    size: "S"
  },
  "garment-prod_03-M": {
    id: "garment-prod_03-M",
    url: "/assets/3d/garments/prod_03/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 21400,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_03",
    size: "M"
  },
  "garment-prod_03-L": {
    id: "garment-prod_03-L",
    url: "/assets/3d/garments/prod_03/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 21428,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_03",
    size: "L"
  },
  "garment-prod_03-XL": {
    id: "garment-prod_03-XL",
    url: "/assets/3d/garments/prod_03/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 21428,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_03",
    size: "XL"
  },

  // APOCALYPSE BOMBER (prod_04)
  "garment-prod_04-M": {
    id: "garment-prod_04-M",
    url: "/assets/3d/garments/prod_04/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 18788,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_04",
    size: "M"
  },
  "garment-prod_04-L": {
    id: "garment-prod_04-L",
    url: "/assets/3d/garments/prod_04/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 18800,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_04",
    size: "L"
  },
  "garment-prod_04-XL": {
    id: "garment-prod_04-XL",
    url: "/assets/3d/garments/prod_04/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 18840,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_04",
    size: "XL"
  },

  // RAW SELVEDGE DENIM (prod_05)
  "garment-prod_05-S": {
    id: "garment-prod_05-S",
    url: "/assets/3d/garments/prod_05/S/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17776,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_05",
    size: "S"
  },
  "garment-prod_05-M": {
    id: "garment-prod_05-M",
    url: "/assets/3d/garments/prod_05/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17772,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_05",
    size: "M"
  },
  "garment-prod_05-L": {
    id: "garment-prod_05-L",
    url: "/assets/3d/garments/prod_05/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17788,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_05",
    size: "L"
  },
  "garment-prod_05-XL": {
    id: "garment-prod_05-XL",
    url: "/assets/3d/garments/prod_05/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17800,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_05",
    size: "XL"
  },

  // MONOLITH FLANNEL (prod_06)
  "garment-prod_06-S": {
    id: "garment-prod_06-S",
    url: "/assets/3d/garments/prod_06/S/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 22436,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_06",
    size: "S"
  },
  "garment-prod_06-M": {
    id: "garment-prod_06-M",
    url: "/assets/3d/garments/prod_06/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 22464,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_06",
    size: "M"
  },
  "garment-prod_06-L": {
    id: "garment-prod_06-L",
    url: "/assets/3d/garments/prod_06/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 22472,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_06",
    size: "L"
  },
  "garment-prod_06-XL": {
    id: "garment-prod_06-XL",
    url: "/assets/3d/garments/prod_06/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 22460,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_06",
    size: "XL"
  },

  // CROSSBODY BAG (prod_11)
  "garment-prod_11-ONE_SIZE": {
    id: "garment-prod_11-ONE_SIZE",
    url: "/assets/3d/garments/prod_11/ONE_SIZE/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 8940,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_11",
    size: "ONE_SIZE"
  },

  // CARPENTER SHORTS (prod_14)
  "garment-prod_14-S": {
    id: "garment-prod_14-S",
    url: "/assets/3d/garments/prod_14/S/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17768,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_14",
    size: "S"
  },
  "garment-prod_14-M": {
    id: "garment-prod_14-M",
    url: "/assets/3d/garments/prod_14/M/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17772,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_14",
    size: "M"
  },
  "garment-prod_14-L": {
    id: "garment-prod_14-L",
    url: "/assets/3d/garments/prod_14/L/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17772,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_14",
    size: "L"
  },
  "garment-prod_14-XL": {
    id: "garment-prod_14-XL",
    url: "/assets/3d/garments/prod_14/XL/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 17752,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_14",
    size: "XL"
  },

  // SILVER CUBAN CHAIN (prod_16)
  "garment-prod_16-ONE_SIZE": {
    id: "garment-prod_16-ONE_SIZE",
    url: "/assets/3d/garments/prod_16/ONE_SIZE/model.glb",
    version: "1.0.0",
    stage: "garment",
    category: "garment-model",
    priority: "critical",
    expectedBytes: 31472,
    required: false,
    dependencies: [],
    cacheGroup: "haii-3d-garments-v1",
    productId: "prod_16",
    size: "ONE_SIZE"
  }
};

export function getStageAssets(stage: "stage1" | "stage2"): AssetManifestEntry[] {
  return Object.values(ASSET_MANIFEST).filter((entry) => entry.stage === stage);
}

export function getGarmentAsset(productId: string, size: string): AssetManifestEntry | undefined {
  const key = `garment-${productId}-${size}`;
  return ASSET_MANIFEST[key];
}

