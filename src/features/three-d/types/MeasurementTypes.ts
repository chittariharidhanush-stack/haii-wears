export interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PhotoValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  detectedLandmarksCount: number;
  orientation: "front" | "side" | "unknown";
  postureGrade: "optimal" | "acceptable" | "suboptimal";
  landmarks?: LandmarkPoint[];
}

export interface EstimatedMeasurements {
  heightCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  confidence: "calibrated" | "manual-review";
  method: "mediapipe-calibrated" | "anthropometric-ratio";
  notes: string;
}

export interface PhotoCaptureInput {
  frontFile?: File | Blob | null;
  sideFile?: File | Blob | null;
  backFile?: File | Blob | null;
  heightCm: number;
  weightKg?: number;
  unitSystem: "metric" | "imperial";
}

