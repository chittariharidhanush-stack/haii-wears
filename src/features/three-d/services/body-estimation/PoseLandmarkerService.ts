import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { LandmarkPoint, PhotoValidationResult } from "../../types/MeasurementTypes";

export class PoseLandmarkerService {
  private static landmarkerInstance: PoseLandmarker | null = null;
  private static initPromise: Promise<PoseLandmarker> | null = null;

  static async initialize(): Promise<PoseLandmarker> {
    if (this.landmarkerInstance) {
      return this.landmarkerInstance;
    }

    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          console.log("[PoseLandmarkerService] Initializing MediaPipe Vision WASM resolver...");
          const vision = await FilesetResolver.forVisionTasks("/assets/3d/ai/wasm");

          console.log("[PoseLandmarkerService] Loading pose_landmarker_lite.task...");
          const landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "/assets/3d/ai/models/pose_landmarker_lite.task",
              delegate: "GPU"
            },
            runningMode: "IMAGE",
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          this.landmarkerInstance = landmarker;
          return landmarker;
        } catch (gpuError) {
          console.warn("[PoseLandmarkerService] GPU delegate failed, falling back to CPU:", gpuError);
          const vision = await FilesetResolver.forVisionTasks("/assets/3d/ai/wasm");
          const landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "/assets/3d/ai/models/pose_landmarker_lite.task",
              delegate: "CPU"
            },
            runningMode: "IMAGE",
            numPoses: 1
          });
          this.landmarkerInstance = landmarker;
          return landmarker;
        }
      })();
    }

    return this.initPromise;
  }

  static async detectPose(image: HTMLImageElement): Promise<{
    landmarks: LandmarkPoint[];
    validation: PhotoValidationResult;
  }> {
    const landmarker = await this.initialize();
    const result = landmarker.detect(image);

    const warnings: string[] = [];
    const errors: string[] = [];

    if (!result.landmarks || result.landmarks.length === 0 || result.landmarks[0].length === 0) {
      errors.push("No person detected in photograph. Please ensure you are standing upright in good lighting.");
      return {
        landmarks: [],
        validation: {
          isValid: false,
          warnings,
          errors,
          detectedLandmarksCount: 0,
          orientation: "unknown",
          postureGrade: "suboptimal"
        }
      };
    }

    const rawLandmarks = result.landmarks[0];
    const landmarks: LandmarkPoint[] = rawLandmarks.map((lm) => ({
      x: lm.x,
      y: lm.y,
      z: lm.z,
      visibility: lm.visibility
    }));

    // Critical Anatomical Keypoints:
    // 0: Nose (Head)
    // 11, 12: Left & Right Shoulders
    // 23, 24: Left & Right Hips
    // 27, 28: Left & Right Ankles (Feet)
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // Check full-body vertical visibility
    const headVisible = nose && (nose.visibility ?? 1) > 0.4 && nose.y > 0.02;
    const feetVisible =
      (leftAnkle && (leftAnkle.visibility ?? 1) > 0.3) ||
      (rightAnkle && (rightAnkle.visibility ?? 1) > 0.3);

    if (!headVisible) {
      warnings.push("Head is close to or partly cut off by the top edge of the frame.");
    }
    if (!feetVisible) {
      warnings.push("Feet/ankles are not fully visible. Step back slightly so your entire body is captured.");
    }

    // Determine Orientation (Front vs Side)
    // Front view has wide shoulder delta (x difference); Side view has small x delta but visible z/depth separation
    const shoulderBreadth = Math.abs(leftShoulder.x - rightShoulder.x);
    const hipBreadth = Math.abs(leftHip.x - rightHip.x);
    const orientation: "front" | "side" = shoulderBreadth > 0.12 && hipBreadth > 0.08 ? "front" : "side";

    const postureGrade =
      errors.length > 0 ? "suboptimal" : warnings.length > 0 ? "acceptable" : "optimal";

    return {
      landmarks,
      validation: {
        isValid: errors.length === 0,
        warnings,
        errors,
        detectedLandmarksCount: landmarks.length,
        orientation,
        postureGrade,
        landmarks
      }
    };
  }
}

