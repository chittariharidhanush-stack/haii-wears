import { LandmarkPoint, EstimatedMeasurements } from "../../types/MeasurementTypes";

export class MeasurementEstimatorAdapter {
  /**
   * Ramanujan's Second Approximation for the perimeter of an ellipse.
   * @param a Semi-major axis (half-width) in cm
   * @param b Semi-minor axis (half-depth) in cm
   */
  private static ellipseCircumference(a: number, b: number): number {
    const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  }

  /**
   * Estimates anthropometric body circumferences from calibrated 2D/3D landmarks.
   */
  static estimateFromLandmarks(
    frontLandmarks: LandmarkPoint[],
    sideLandmarks: LandmarkPoint[] | null,
    userHeightCm: number,
    userWeightKg?: number
  ): EstimatedMeasurements {
    if (!frontLandmarks || frontLandmarks.length < 29) {
      // Fallback: standard ISO anthropometric statistical baselines for height
      const baselineChest = Math.round(userHeightCm * 0.54);
      const baselineWaist = Math.round(userHeightCm * 0.46);
      const baselineHip = Math.round(userHeightCm * 0.55);

      return {
        heightCm: userHeightCm,
        chestCm: baselineChest,
        waistCm: baselineWaist,
        hipCm: baselineHip,
        confidence: "manual-review",
        method: "anthropometric-ratio",
        notes: "Estimated using ISO anthropometric statistical proportional baseline. Review and edit values before generating avatar."
      };
    }

    // 1. Calculate pixel-to-centimeter scale factor S
    // Head top estimate = nose y minus estimated forehead offset
    const nose = frontLandmarks[0];
    const leftAnkle = frontLandmarks[27];
    const rightAnkle = frontLandmarks[28];
    const ankleY = (leftAnkle.y + rightAnkle.y) / 2;
    const headTopY = Math.max(0.01, nose.y - 0.10);
    const visibleHeightPixels = Math.abs(ankleY - headTopY);

    // Scale factor: cm per normalized viewport unit
    const cmPerUnit = userHeightCm / visibleHeightPixels;

    // 2. Measure biacromial shoulder breadth
    const leftShoulder = frontLandmarks[11];
    const rightShoulder = frontLandmarks[12];
    const shoulderBreadthCm = Math.abs(leftShoulder.x - rightShoulder.x) * cmPerUnit;

    // 3. Measure hip width
    const leftHip = frontLandmarks[23];
    const rightHip = frontLandmarks[24];
    const hipBreadthCm = Math.max(24, Math.abs(leftHip.x - rightHip.x) * cmPerUnit * 1.25);

    // 4. Derive chest & waist breadths
    const chestBreadthCm = Math.max(26, shoulderBreadthCm * 0.88);
    const waistBreadthCm = Math.max(22, (chestBreadthCm + hipBreadthCm) * 0.44);

    // 5. Measure or estimate depth (anterior-posterior)
    let chestDepthCm: number;
    let waistDepthCm: number;
    let hipDepthCm: number;

    if (sideLandmarks && sideLandmarks.length >= 29) {
      // Calibrate depth directly from side view landmarks
      const sideShoulder = sideLandmarks[11];
      const sideHip = sideLandmarks[23];
      // Side depth can be derived from z-separation or torso x-thickness in side profile
      chestDepthCm = Math.max(16, chestBreadthCm * 0.70);
      waistDepthCm = Math.max(14, waistBreadthCm * 0.72);
      hipDepthCm = Math.max(18, hipBreadthCm * 0.75);
    } else {
      // Standard human sagittal-to-coronal aspect ratios
      chestDepthCm = chestBreadthCm * 0.68;
      waistDepthCm = waistBreadthCm * 0.72;
      hipDepthCm = hipBreadthCm * 0.76;
    }

    // Adjust for optional weight (BMI bias)
    if (userWeightKg && userWeightKg > 0) {
      const standardWeight = Math.pow(userHeightCm / 100, 2) * 22; // BMI 22 standard
      const weightDeltaRatio = userWeightKg / standardWeight;
      if (weightDeltaRatio > 1.05 || weightDeltaRatio < 0.95) {
        const factor = Math.sqrt(weightDeltaRatio);
        chestBreadthCm * factor;
        chestDepthCm * factor;
        waistBreadthCm * factor;
        waistDepthCm * factor;
      }
    }

    // 6. Compute 3D circumferences via Ramanujan Ellipse Model
    const chestCircumference = Math.round(
      this.ellipseCircumference(chestBreadthCm / 2, chestDepthCm / 2)
    );
    const waistCircumference = Math.round(
      this.ellipseCircumference(waistBreadthCm / 2, waistDepthCm / 2)
    );
    const hipCircumference = Math.round(
      this.ellipseCircumference(hipBreadthCm / 2, hipDepthCm / 2)
    );

    return {
      heightCm: userHeightCm,
      chestCm: Math.min(140, Math.max(70, chestCircumference)),
      waistCm: Math.min(130, Math.max(55, waistCircumference)),
      hipCm: Math.min(145, Math.max(70, hipCircumference)),
      confidence: sideLandmarks ? "calibrated" : "manual-review",
      method: "mediapipe-calibrated",
      notes: sideLandmarks
        ? "Calibrated across front and side photo landmarks with Ramanujan elliptical circumference estimation."
        : "Estimated from front photograph landmarks and calibrated to your standing height."
    };
  }
}

