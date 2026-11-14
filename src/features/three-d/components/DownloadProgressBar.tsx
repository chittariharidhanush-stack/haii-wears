"use client";

import React from "react";
import { DownloadProgress } from "../types/AssetTypes";
import { CloudDownload, RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  progress: DownloadProgress;
  onRetry?: () => void;
}

export default function DownloadProgressBar({ progress, onRetry }: Props) {
  if (progress.phase === "idle" || progress.phase === "ready") {
    return null;
  }

  const percent =
    progress.totalFiles > 0
      ? Math.round((progress.completedFiles / progress.totalFiles) * 100)
      : 0;

  return (
    <div className="w-full bg-[#111111]/95 backdrop-blur-md border border-[#222222] p-4 rounded-xs flex flex-col gap-2.5 z-30">
      <div className="flex items-center justify-between text-xs font-tech">
        <div className="flex items-center gap-2">
          {progress.error ? (
            <AlertTriangle className="w-4 h-4 text-[#f2342b]" />
          ) : (
            <CloudDownload className="w-4 h-4 text-[#f2342b] animate-pulse" />
          )}
          <span className="text-white font-bold tracking-wider uppercase">
            {progress.phase === "stage2-priority"
              ? "DOWNLOADING 3D AI & AVATAR ENGINE"
              : progress.phase === "garment-download"
              ? "FETCHING GARMENT MESH"
              : "PREPARING 3D ASSETS"}
          </span>
        </div>

        <span className="text-[#888]">
          {progress.completedFiles} of {progress.totalFiles} assets ({percent}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            progress.error ? "bg-amber-500" : "bg-[#f2342b]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-tech text-[#777]">
        <span className="truncate max-w-[280px]">
          {progress.activeFile ? `Loading: ${progress.activeFile}` : "Synchronizing..."}
        </span>

        {progress.error && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-[#f2342b] hover:text-white uppercase font-bold transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}
