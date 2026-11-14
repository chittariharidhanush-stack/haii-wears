"use client";

import React, { useRef, useState } from "react";
import { PhotoCaptureInput } from "../types/MeasurementTypes";
import { PrivacyManager } from "../services/body-estimation/PrivacyManager";
import { Camera, Upload, Trash2, ShieldCheck, Check, AlertCircle } from "lucide-react";

interface Props {
  onNext: (input: PhotoCaptureInput) => void;
  onCancel: () => void;
}

export default function PhotoUploadStep({ onNext, onCancel }: Props) {
  const [heightCm, setHeightCm] = useState(180);
  const [weightKg, setWeightKg] = useState<number | undefined>(75);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);

  const [sideFile, setSideFile] = useState<File | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);

  const [isUsingCamera, setIsUsingCamera] = useState<"front" | "side" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  // File Handlers
  const handleFrontSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontFile(file);
      PrivacyManager.revokeUrl(frontPreview || undefined);
      setFrontPreview(PrivacyManager.createLocalUrl(file));
    }
  };

  const handleSideSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSideFile(file);
      PrivacyManager.revokeUrl(sidePreview || undefined);
      setSidePreview(PrivacyManager.createLocalUrl(file));
    }
  };

  // Camera Capture
  const startCamera = async (target: "front" | "side") => {
    try {
      setIsUsingCamera(target);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      alert("Camera access was not permitted. Please upload a photo from your device.");
      setIsUsingCamera(null);
    }
  };

  const capturePhoto = (target: "front" | "side") => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${target}_capture.jpg`, { type: "image/jpeg" });
          if (target === "front") {
            setFrontFile(file);
            setFrontPreview(PrivacyManager.createLocalUrl(file));
          } else {
            setSideFile(file);
            setSidePreview(PrivacyManager.createLocalUrl(file));
          }
        }
      }, "image/jpeg", 0.95);
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsUsingCamera(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heightCm < 140 || heightCm > 220) {
      alert("Please enter a valid height between 140 cm and 220 cm.");
      return;
    }
    onNext({
      frontFile,
      sideFile,
      heightCm,
      weightKg,
      unitSystem
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-white">
      {/* Header Info */}
      <div className="flex flex-col gap-1 border-b border-[#222] pb-4">
        <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
          STEP 1 // PERSONALIZED 3D AVATAR CREATION
        </span>
        <h3 className="font-display text-2xl tracking-wide uppercase">
          PROVIDE YOUR PHOTOS & HEIGHT
        </h3>
        <p className="font-tech text-xs text-[#888] leading-relaxed">
          Upload front and side full-body photos to estimate your exact body shape and proportions.
          Stand upright, keep your complete body in frame from head to shoes, in good lighting.
        </p>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="flex items-center gap-3 p-3 bg-[#0d0d0d] border border-[#222] rounded-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="flex flex-col text-[11px] font-tech text-[#aaa]">
          <span className="text-white font-bold">100% Client-Side Privacy Guaranteed</span>
          <span>Your photos are processed entirely inside your browser's WebAssembly sandbox. They are NEVER uploaded to any server or external AI service.</span>
        </div>
      </div>

      {/* Height & Unit Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111] p-4 border border-[#222] rounded-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-tech text-xs uppercase tracking-wider text-[#aaa] flex justify-between">
            <span>Standing Height *</span>
            <span className="text-white font-bold">{heightCm} cm</span>
          </label>
          <input
            type="range"
            min={145}
            max={210}
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="accent-[#f2342b] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-tech text-[#666]">
            <span>145 cm</span>
            <span>180 cm (Avg)</span>
            <span>210 cm</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-tech text-xs uppercase tracking-wider text-[#aaa] flex justify-between">
            <span>Approx. Body Mass (Optional)</span>
            <span className="text-white font-bold">{weightKg || 70} kg</span>
          </label>
          <input
            type="range"
            min={45}
            max={130}
            value={weightKg || 70}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="accent-[#f2342b] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-tech text-[#666]">
            <span>45 kg</span>
            <span>75 kg</span>
            <span>130 kg</span>
          </div>
        </div>
      </div>

      {/* Live Camera Viewport Modal Overlay */}
      {isUsingCamera && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#111] border border-[#333] p-4 flex flex-col items-center gap-4">
            <span className="font-tech text-xs tracking-wider text-[#f2342b] uppercase font-bold">
              LIVE CAMERA // {isUsingCamera.toUpperCase()} PHOTO
            </span>
            <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover bg-black rounded-xs" />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => capturePhoto(isUsingCamera)}
                className="px-6 py-2.5 bg-[#f2342b] hover:bg-[#d82a22] text-white font-tech text-xs font-bold uppercase tracking-wider transition"
              >
                Snap Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 bg-[#222] hover:bg-[#333] text-white font-tech text-xs uppercase tracking-wider transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Photo Upload Grid (Front & Side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FRONT PHOTO */}
        <div className="border border-[#262626] bg-[#0c0c0c] p-4 rounded-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs uppercase tracking-wider font-bold text-white">
              1. Front Full-Body Photo *
            </span>
            {frontFile && <span className="text-[10px] font-tech text-emerald-400">✓ READY</span>}
          </div>

          {frontPreview ? (
            <div className="relative w-full h-52 bg-black rounded-xs overflow-hidden border border-[#333]">
              <img src={frontPreview} alt="Front Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => {
                  setFrontFile(null);
                  PrivacyManager.revokeUrl(frontPreview);
                  setFrontPreview(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-[#f2342b] text-white rounded-xs transition"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-full h-52 border border-dashed border-[#333] hover:border-[#666] transition rounded-xs flex flex-col items-center justify-center gap-3 p-4 text-center">
              <Camera className="w-8 h-8 text-[#555]" />
              <div className="flex flex-col text-[11px] font-tech text-[#888]">
                <span>Stand upright facing the camera</span>
                <span className="text-[10px] text-[#666]">Arms slightly away from torso</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] text-white font-tech text-[10px] uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCamera("front")}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] text-white font-tech text-[10px] uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <Camera className="w-3 h-3" />
                  <span>Camera</span>
                </button>
              </div>
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={handleFrontSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* SIDE PHOTO */}
        <div className="border border-[#262626] bg-[#0c0c0c] p-4 rounded-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs uppercase tracking-wider font-bold text-white">
              2. Side Profile Photo (Recommended)
            </span>
            {sideFile && <span className="text-[10px] font-tech text-emerald-400">✓ READY</span>}
          </div>

          {sidePreview ? (
            <div className="relative w-full h-52 bg-black rounded-xs overflow-hidden border border-[#333]">
              <img src={sidePreview} alt="Side Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => {
                  setSideFile(null);
                  PrivacyManager.revokeUrl(sidePreview);
                  setSidePreview(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-[#f2342b] text-white rounded-xs transition"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-full h-52 border border-dashed border-[#333] hover:border-[#666] transition rounded-xs flex flex-col items-center justify-center gap-3 p-4 text-center">
              <Camera className="w-8 h-8 text-[#555]" />
              <div className="flex flex-col text-[11px] font-tech text-[#888]">
                <span>Turn 90° sideways to the camera</span>
                <span className="text-[10px] text-[#666]">Improves chest & waist depth precision</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => sideInputRef.current?.click()}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] text-white font-tech text-[10px] uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCamera("side")}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] text-white font-tech text-[10px] uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <Camera className="w-3 h-3" />
                  <span>Camera</span>
                </button>
              </div>
              <input
                ref={sideInputRef}
                type="file"
                accept="image/*"
                onChange={handleSideSelect}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Manual Fallback Callout */}
      {!frontFile && (
        <div className="p-3 bg-[#111] border border-[#222] rounded-xs flex items-center gap-2 text-[11px] font-tech text-[#888]">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>No photos available? You can continue directly with manual measurement entry on the next step.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-[#222] pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-transparent border border-[#333] hover:border-white text-white font-tech text-xs uppercase tracking-wider transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#f2342b] hover:bg-[#d82a22] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center gap-2"
        >
          <span>CONTINUE TO BODY ANALYSIS</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
}
