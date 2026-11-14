"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ThreeDLiveStudio from "@/features/three-d/components/ThreeDLiveStudio";

export default function FittingRoomClient() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("item") || undefined;

  return (
    <div className="w-full flex-1 flex flex-col">
      <ThreeDLiveStudio initialProductId={initialProductId} />
    </div>
  );
}

