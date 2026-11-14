"use client";

import React from "react";
import { CameraPreset } from "../services/viewer/CameraManager";
import { LightingPreset } from "../services/viewer/LightingManager";
import { AvatarConfig } from "../types/AvatarTypes";
import {
  RotateCcw,
  RefreshCw,
  Camera,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  UserCheck
} from "lucide-react";

interface Props {
  activeCameraPreset: CameraPreset;
  onSetCameraPreset: (preset: CameraPreset) => void;
  lightingPreset: LightingPreset;
  onSetLightingPreset: (preset: LightingPreset) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  onCaptureSnapshot: () => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  avatarConfig: AvatarConfig | null;
  onOpenAvatarCreator: () => void;
}

export default function ViewportControls({
  activeCameraPreset,
  onSetCameraPreset,
  lightingPreset,
  onSetLightingPreset,
  autoRotate,
  onToggleAutoRotate,
  onResetCamera,
  onCaptureSnapshot,
  showHeatmap,
  onToggleHeatmap,
  avatarConfig,
  onOpenAvatarCreator
}: Props) {
  return (
    <>
      {/* Top Left: Technical Engine Badge & Avatar Info */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1.5 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f2342b] animate-ping" />
          <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
            3D LIVE // AVATAR STUDIO
          </span>
        </div>
        <span className="font-display text-2xl lg:text-3xl tracking-wider text-white">
          PERSONALIZED FIT ENGINE
        </span>
        <div className="pointer-events-auto flex items-center gap-2 pt-1">
          {avatarConfig ? (
            <button
              onClick={onOpenAvatarCreator}
              className="px-2.5 py-1 bg-[#141414]/90 hover:bg-[#202020] border border-[#2a2a2a] rounded-xs text-[10px] font-tech text-[#aaa] hover:text-white transition flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AVATAR: {avatarConfig.measurements.heightCm}CM · {avatarConfig.build.toUpperCase()}</span>
              <span className="text-[#f2342b] font-bold underline ml-1">EDIT</span>
            </button>
          ) : (
            <button
              onClick={onOpenAvatarCreator}
              className="px-3 py-1 bg-[#f2342b] hover:bg-[#d82a22] text-white rounded-xs text-[11px] font-tech font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-[#f2342b]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CREATE PERSONAL AVATAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Right: Viewport Controls & Studio Lighting */}
      <div className="absolute top-4 right-4 flex flex-wrap items-center justify-end gap-2 z-20">
        {/* Lighting Mode Presets */}
        <div className="bg-[#111111]/85 backdrop-blur-md border border-[#222222] p-1 rounded-xs flex items-center gap-1">
          <button
            onClick={() => onSetLightingPreset("afterhours")}
            className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider transition rounded-xs ${
              lightingPreset === "afterhours"
                ? "bg-[#f2342b] text-white font-bold"
                : "text-[#888] hover:text-white"
            }`}
          >
            Afterhours
          </button>
          <button
            onClick={() => onSetLightingPreset("daylight")}
            className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider transition rounded-xs ${
              lightingPreset === "daylight"
                ? "bg-white text-black font-bold"
                : "text-[#888] hover:text-white"
            }`}
          >
            Daylight
          </button>
          <button
            onClick={() => onSetLightingPreset("cyber")}
            className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider transition rounded-xs ${
              lightingPreset === "cyber"
                ? "bg-[#00f0ff] text-black font-bold"
                : "text-[#888] hover:text-white"
            }`}
          >
            Cyber
          </button>
        </div>

        {/* 360 Auto-Rotate Toggle */}
        <button
          onClick={onToggleAutoRotate}
          title="Toggle 360° Auto-Spin"
          className={`p-2 rounded-xs border transition ${
            autoRotate
              ? "bg-[#f2342b] border-[#f2342b] text-white"
              : "bg-[#111]/85 border-[#222] text-[#aaa] hover:text-white"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
        </button>

        {/* Snapshot Capture */}
        <button
          onClick={onCaptureSnapshot}
          title="Capture High-Res Fit Snapshot"
          className="p-2 rounded-xs bg-[#111]/85 border border-[#222] text-[#aaa] hover:text-white hover:border-[#f2342b] transition"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Reset Camera View */}
        <button
          onClick={onResetCamera}
          title="Reset Camera View to Full Body"
          className="p-2 rounded-xs bg-[#111]/85 border border-[#222] text-[#aaa] hover:text-white hover:border-[#f2342b] transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Toolbar: Camera Angles & Heatmap */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 z-20 pointer-events-none">
        {/* Multi-Angle Inspection Presets */}
        <div className="pointer-events-auto bg-[#0e0e0e]/90 backdrop-blur-md border border-[#222] p-1 rounded-xs flex items-center gap-1">
          {(["full", "front", "back", "side", "closeup"] as CameraPreset[]).map((p) => (
            <button
              key={p}
              onClick={() => onSetCameraPreset(p)}
              className={`px-2.5 py-1 text-[10px] font-tech uppercase tracking-wider rounded-xs transition ${
                activeCameraPreset === p
                  ? "bg-[#f2342b] text-white font-bold"
                  : "text-[#888] hover:text-white"
              }`}
            >
              {p === "full"
                ? "Full Body"
                : p === "front"
                ? "Front"
                : p === "back"
                ? "Back"
                : p === "side"
                ? "Side"
                : "Close-Up"}
            </button>
          ))}
        </div>

        {/* Tension Heatmap Button */}
        <div className="pointer-events-auto">
          <button
            onClick={onToggleHeatmap}
            className={`px-3 py-1.5 text-[11px] font-tech uppercase tracking-wider border rounded-xs transition flex items-center gap-1.5 ${
              showHeatmap
                ? "bg-[#22c55e] text-black border-[#22c55e] font-bold"
                : "bg-[#0e0e0e]/90 backdrop-blur-md border-[#222] text-[#aaa] hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showHeatmap ? "Heatmap Active" : "Tension Heatmap"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
