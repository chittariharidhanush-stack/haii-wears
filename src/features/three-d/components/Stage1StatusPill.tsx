"use client";

import React, { useEffect, useState } from "react";
import { AssetManager } from "../services/asset-manager/AssetManager";
import { DownloadProgress } from "../types/AssetTypes";
import { Sparkles, Check, CloudDownload } from "lucide-react";

export default function Stage1StatusPill() {
  const [progress, setProgress] = useState<DownloadProgress>({
    totalFiles: 0,
    completedFiles: 0,
    totalBytes: 0,
    loadedBytes: 0,
    phase: "idle"
  });

  useEffect(() => {
    // Subscribe to AssetManager progress
    const unsubscribe = AssetManager.subscribeProgress((p) => {
      setProgress(p);
    });

    // Start Stage 1 background download after initial render during browser idle
    if (typeof window !== "undefined") {
      const startDownload = () => {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(() => {
            AssetManager.startStage1Background();
          });
        } else {
          setTimeout(() => {
            AssetManager.startStage1Background();
          }, 1500);
        }
      };

      if (document.readyState === "complete") {
        startDownload();
      } else {
        window.addEventListener("load", startDownload, { once: true });
      }
    }

    return () => {
      unsubscribe();
    };
  }, []);

  if (progress.phase === "stage1-background" && progress.totalFiles > 0) {
    return (
      <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#141414]/90 border border-[#262626] rounded-xs text-[10px] font-tech text-[#888] tracking-widest uppercase">
        <CloudDownload className="w-3 h-3 text-[#f2342b] animate-bounce" />
        <span>PREPARING 3D STUDIO ({progress.completedFiles}/{progress.totalFiles})</span>
      </div>
    );
  }

  if (progress.phase === "ready" || AssetManager.isStage1Ready()) {
    return (
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#121212]/80 border border-[#222222] rounded-xs text-[10px] font-tech text-[#777] tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>3D ENGINE READY</span>
      </div>
    );
  }

  return null;
}
