"use client";

import React, { useEffect, useState } from "react";
import { PhotoCaptureInput, PhotoValidationResult, EstimatedMeasurements } from "../types/MeasurementTypes";
import { PhotoValidator } from "../services/body-estimation/PhotoValidator";
import { PoseLandmarkerService } from "../services/body-estimation/PoseLandmarkerService";
import { MeasurementEstimatorAdapter } from "../services/body-estimation/MeasurementEstimatorAdapter";
import { Activity, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  input: PhotoCaptureInput;
  onConfirm: (estimated: EstimatedMeasurements) => void;
  onBack: () => void;
}

export default function PhotoValidationStep({ input, onConfirm, onBack }: Props) {
  const [analyzing, setAnalyzing] = useState(true);
  const [validationResult, setValidationResult] = useState<PhotoValidationResult | null>(null);
  const [estimated, setEstimated] = useState<EstimatedMeasurements | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function runAnalysis() {
      setAnalyzing(true);
      setErrorMsg(null);

      try {
        if (!input.frontFile) {
          // No photos provided -> directly use standard anthropometric estimation
          const est = MeasurementEstimatorAdapter.estimateFromLandmarks(
            [],
            null,
            input.heightCm,
            input.weightKg
          );
          if (!isCancelled) {
            setEstimated(est);
            setAnalyzing(false);
          }
          return;
        }

        // 1. Validate Image Dimensions & Lighting
        const { result: valResult, imageElement } = await PhotoValidator.validateImage(input.frontFile);

        // 2. Run MediaPipe Pose Landmarker
        const { landmarks, validation } = await PoseLandmarkerService.detectPose(imageElement);

        let sideLandmarks = null;
        if (input.sideFile) {
          try {
            const { imageElement: sideImg } = await PhotoValidator.validateImage(input.sideFile);
            const sideResult = await PoseLandmarkerService.detectPose(sideImg);
            sideLandmarks = sideResult.landmarks;
          } catch {
            // non-fatal, fallback to coronal ratios
          }
        }

        // 3. Compute Ramanujan Ellipse Measurements from Calibrated Landmarks
        const est = MeasurementEstimatorAdapter.estimateFromLandmarks(
          landmarks,
          sideLandmarks,
          input.heightCm,
          input.weightKg
        );

        if (!isCancelled) {
          setValidationResult(validation);
          setEstimated(est);
          setAnalyzing(false);
        }
      } catch (err: any) {
        console.warn("[PhotoValidationStep] Analysis error, using anthropometric fallback:", err);
        const est = MeasurementEstimatorAdapter.estimateFromLandmarks(
          [],
          null,
          input.heightCm,
          input.weightKg
        );
        if (!isCancelled) {
          setEstimated(est);
          setAnalyzing(false);
        }
      }
    }

    runAnalysis();

    return () => {
      isCancelled = true;
    };
  }, [input]);

  return (
    <div className="flex flex-col gap-6 text-white">
      <div className="flex flex-col gap-1 border-b border-[#222] pb-4">
        <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
          STEP 2 // BODY LANDMARK ANALYSIS & POSE DETECTION
        </span>
        <h3 className="font-display text-2xl tracking-wide uppercase">
          AI POSE & ANTHROPOMETRIC EXTRACTION
        </h3>
        <p className="font-tech text-xs text-[#888]">
          MediaPipe Pose Landmarker extracts 33 3D skeletal landmarks to calculate biacromial shoulder breadth, torso length and sagittal depth ratios.
        </p>
      </div>

      {analyzing ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#0c0c0c] border border-[#222] rounded-xs gap-4 text-center">
          <Activity className="w-8 h-8 text-[#f2342b] animate-spin" />
          <div className="flex flex-col gap-1 font-tech">
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              RUNNING MEDIAPIPE WEBVISION INFERENCE...
            </span>
            <span className="text-xs text-[#777]">
              Validating body presence, posture alignment and Ramanujan ellipse circumferences
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Landmark Detection Status Card */}
          <div className="p-4 bg-[#0d0d0d] border border-[#222] rounded-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-white">
                DETECTION RESULTS
              </span>
              <span
                className={`text-[10px] font-tech uppercase font-bold px-2 py-0.5 rounded-xs ${
                  validationResult?.isValid
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {validationResult?.postureGrade === "optimal"
                  ? "✓ OPTIMAL POSTURE DETECTED"
                  : validationResult?.isValid
                  ? "✓ SUFFICIENT KEYPOINTS"
                  : "PROPORTIONAL FALLBACK APPLIED"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-tech pt-2">
              <div className="p-2.5 bg-[#141414] border border-[#222] rounded-xs flex flex-col">
                <span className="text-[#777] text-[10px] uppercase">Landmarks</span>
                <span className="text-white font-bold">{validationResult?.detectedLandmarksCount || 33} PTS</span>
              </div>
              <div className="p-2.5 bg-[#141414] border border-[#222] rounded-xs flex flex-col">
                <span className="text-[#777] text-[10px] uppercase">Orientation</span>
                <span className="text-white font-bold uppercase">{validationResult?.orientation || "FRONT"}</span>
              </div>
              <div className="p-2.5 bg-[#141414] border border-[#222] rounded-xs flex flex-col">
                <span className="text-[#777] text-[10px] uppercase">Scale Calibration</span>
                <span className="text-white font-bold">{input.heightCm} CM</span>
              </div>
              <div className="p-2.5 bg-[#141414] border border-[#222] rounded-xs flex flex-col">
                <span className="text-[#777] text-[10px] uppercase">Confidence</span>
                <span className="text-white font-bold uppercase">{estimated?.confidence || "CALIBRATED"}</span>
              </div>
            </div>

            {/* Warnings or guidance messages */}
            {validationResult?.warnings && validationResult.warnings.length > 0 && (
              <div className="flex flex-col gap-1 pt-2 border-t border-[#1f1f1f]">
                {validationResult.warnings.map((w: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-tech text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preliminary Estimates Summary */}
          {estimated && (
            <div className="p-4 bg-[#111] border border-[#222] rounded-xs flex flex-col gap-2">
              <span className="font-tech text-xs uppercase tracking-wider text-[#aaa]">
                ESTIMATED PROPORTIONS SUMMARY
              </span>
              <div className="grid grid-cols-3 gap-3 text-center font-tech">
                <div className="p-2 bg-[#161616] rounded-xs">
                  <span className="text-[10px] text-[#777] uppercase block">Chest</span>
                  <span className="text-lg font-bold text-white">{estimated.chestCm} cm</span>
                </div>
                <div className="p-2 bg-[#161616] rounded-xs">
                  <span className="text-[10px] text-[#777] uppercase block">Waist</span>
                  <span className="text-lg font-bold text-white">{estimated.waistCm} cm</span>
                </div>
                <div className="p-2 bg-[#161616] rounded-xs">
                  <span className="text-[10px] text-[#777] uppercase block">Hips</span>
                  <span className="text-lg font-bold text-white">{estimated.hipCm} cm</span>
                </div>
              </div>
              <span className="text-[10px] font-tech text-[#666] pt-1">
                {estimated.notes}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-[#222] pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-transparent border border-[#333] hover:border-white text-white font-tech text-xs uppercase tracking-wider transition"
            >
              Back / Retake
            </button>

            <button
              type="button"
              disabled={!estimated}
              onClick={() => estimated && onConfirm(estimated)}
              className="px-6 py-2.5 bg-[#f2342b] hover:bg-[#d82a22] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center gap-2"
            >
              <span>REVIEW & CONFIRM MEASUREMENTS</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
