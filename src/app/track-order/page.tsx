import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackOrderClient from "./TrackOrderClient";


export const metadata = {
  title: "TRACK ORDER // HAII WEAES",
  description: "Monitor real-time dispatch, transit scans, and carrier tracking for your HAII WEAES order.",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center font-tech text-xs text-[#888]">LOADING TRACKING TERMINAL...</div>}>
          <TrackOrderClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
