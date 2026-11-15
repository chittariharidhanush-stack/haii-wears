import * as THREE from "three";
import { AvatarConfig } from "../../types/AvatarTypes";

export interface FitEvaluationResult {
  rating: string;
  tone: string;
  ratio: number;
  message: string;
}

const SIZE_NORMALIZERS: Record<string, number> = {
  XS: 0.90,
  S: 0.95,
  M: 1.0,
  L: 1.07,
  XL: 1.15,
  XXL: 1.22,
  ONE_SIZE: 1.0
};

export class GarmentFittingService {
  /**
   * Fits a garment mesh to the personalized avatar proportions.
   */
  static fitGarmentToAvatar(
    garmentMesh: THREE.Group,
    avatarConfig: AvatarConfig,
    category: "top" | "bottom" | "accessory"
  ): void {
    const heightScale = avatarConfig.measurements.heightCm / 180;
    const chestRatio = avatarConfig.measurements.chestCm / 98;
    const waistRatio = avatarConfig.measurements.waistCm / 80;
    const hipRatio = avatarConfig.measurements.hipCm / 98;

    if (category === "top") {
      // Scale top to match torso height and chest expansion
      const lateralScale = Math.max(0.9, Math.min(1.25, chestRatio));
      garmentMesh.scale.set(lateralScale, heightScale, lateralScale);
      // Small outward bias (1.002) to prevent intersecting body surface
      garmentMesh.scale.multiplyScalar(1.004);
    } else if (category === "bottom") {
      // Scale bottom to match leg height and waist/hip expansion
      const lateralScale = Math.max(0.9, Math.min(1.25, Math.max(waistRatio, hipRatio)));
      garmentMesh.scale.set(lateralScale, heightScale, lateralScale);
      garmentMesh.scale.multiplyScalar(1.003);
    } else {
      // Accessories (bag, chain)
      garmentMesh.scale.set(1, heightScale, 1);
    }
  }

  /**
   * Evaluates fit tension and drape dynamics.
   */
  static evaluateFit(
    selectedSize: string,
    avatarConfig: AvatarConfig,
    category: "top" | "bottom"
  ): FitEvaluationResult {
    const sizeScale = SIZE_NORMALIZERS[selectedSize] || 1.0;
    const bodyGirth =
      category === "top"
        ? avatarConfig.measurements.chestCm / 98
        : avatarConfig.measurements.waistCm / 80;

    const buildMultiplier =
      avatarConfig.build === "broad" ? 1.12 : avatarConfig.build === "athletic" ? 1.05 : 1.0;

    const fitRatio = (bodyGirth * buildMultiplier) / sizeScale;

    if (fitRatio > 1.10) {
      return {
        rating: "SNUG / FITTED",
        tone: "text-amber-400",
        ratio: fitRatio,
        message: `Size ${selectedSize} creates a contour fit across your ${category === "top" ? "chest" : "waist"}. Consider sizing up for signature boxy drape.`
      };
    } else if (fitRatio < 0.90) {
      return {
        rating: "SIGNATURE OVERSIZED",
        tone: "text-emerald-400",
        ratio: fitRatio,
        message: `Size ${selectedSize} delivers the authentic dropped-shoulder, exaggerated streetwear drape as intended in the design studio.`
      };
    } else {
      return {
        rating: "OPTIMAL RELAXED STREET FIT",
        tone: "text-cyan-400",
        ratio: fitRatio,
        message: `Size ${selectedSize} provides an effortless relaxed fall across shoulders and waist with optimal movement.`
      };
    }
  }
}

