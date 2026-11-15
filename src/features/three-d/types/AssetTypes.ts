export type AssetStage = "stage1" | "stage2" | "garment";

export type AssetCategory =
  | "viewer-runtime"
  | "avatar-engine"
  | "ai-model"
  | "garment-model"
  | "material";

export type AssetPriority = "critical" | "high" | "normal" | "low" | "very-low";

export interface AssetManifestEntry {
  id: string;
  url: string;
  version: string;
  stage: AssetStage;
  category: AssetCategory;
  priority: AssetPriority;
  expectedBytes: number;
  sha256?: string | null;
  required: boolean;
  dependencies: string[];
  cacheGroup: "haii-3d-runtime-v1" | "haii-3d-avatar-v1" | "haii-3d-ai-v1" | "haii-3d-garments-v1";
  productId?: string;
  size?: string;
}

export interface DownloadProgress {
  totalFiles: number;
  completedFiles: number;
  activeFile?: string;
  totalBytes: number;
  loadedBytes: number;
  phase: "idle" | "stage1-background" | "stage2-priority" | "garment-download" | "ready" | "error";
  error?: string;
}

export interface CacheMetadata {
  id: string;
  version: string;
  size: number;
  lastUsed: number;
  cacheGroup: string;
  isEssential: boolean;
  usageCount: number;
}

