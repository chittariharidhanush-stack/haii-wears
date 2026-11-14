import React, { Suspense } from "react";
import FittingRoomClient from "./FittingRoomClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartDrawer from "@/components/layout/CartDrawer";


export const metadata = {
  title: "3D Virtual Fitting Room // HAII WEAES",
  description: "Experience your personalized 3D avatar fitting room. Customize height, build and silhouette to visualize garment draping, tension heatmaps and oversized streetwear cuts in real-time WebGL.",
};

export default function FittingRoomPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div className="p-20 text-center font-tech text-xs text-[#888]">INITIALIZING 3D WEBGL STUDIO ENGINE...</div>}>
          <FittingRoomClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
