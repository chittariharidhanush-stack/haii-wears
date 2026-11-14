"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FittingRoom3D from "@/components/fitting-room/FittingRoom3D";

export default function FittingRoomClient() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("item") || undefined;

  return (
    <div className="w-full flex-1 flex flex-col">
      <FittingRoom3D initialProductId={initialProductId} />
    </div>
  );
}
