export interface BodyMeasurements {
  heightCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  weightKg?: number;
  shoulderWidthCm?: number;
  inseamCm?: number;
}

export interface ConfirmedMeasurements extends BodyMeasurements {
  confirmedAt: number;
  source: "photo-estimated" | "manual" | "preset";
}

export interface AvatarConfig {
  id: string;
  gender: "masculine" | "feminine" | "unisex";
  measurements: ConfirmedMeasurements;
  build: "slim" | "athletic" | "regular" | "broad";
  skinTone: string;
  createdAt: number;
  updatedAt: number;
  engineVersion: string;
  serializedMesh?: string; // Optional compact representation
}
