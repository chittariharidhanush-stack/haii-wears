"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Activity, Sliders, ShieldCheck, Layers } from "lucide-react";

export default function FittingRoomTeaser() {
  return (
    <section className="w-full bg-[#050505] text-white py-24 px-4 md:px-8 border-b border-[#141414] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#f2342b]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Feature Narrative */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f2342b] animate-ping" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              INNOVATION // 3D VIRTUAL FITTING STUDIO
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl tracking-tight uppercase leading-[0.92]">
            SEE HOW IT FITS.<br />
            <span className="text-stroke-outline text-transparent">BEFORE IT SHIPS.</span>
          </h2>

          <p className="font-tech text-xs md:text-sm text-[#a0a0a0] leading-relaxed max-w-xl">
            Never second-guess oversized cuts again. Step into our WebGL 3D fitting engine, customize your exact body height, build and chest proportions, and watch 480 GSM terry cotton drape in real-time 360° physics with tension heatmaps.
          </p>

          {/* Key Feature Bullets */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 border border-[#1f1f1f] bg-[#0d0d0d] rounded-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#f2342b]">
                <Sliders className="w-4 h-4" />
                <span className="font-tech text-xs font-bold uppercase tracking-wider">CUSTOM ANATOMY</span>
              </div>
              <span className="font-tech text-[11px] text-[#777]">
                Configure height (155-198cm), chest volume, and waist proportions.
              </span>
            </div>

            <div className="p-3.5 border border-[#1f1f1f] bg-[#0d0d0d] rounded-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#22c55e]">
                <Activity className="w-4 h-4" />
                <span className="font-tech text-xs font-bold uppercase tracking-wider">TENSION HEATMAP</span>
              </div>
              <span className="font-tech text-[11px] text-[#777]">
                Color-coded drape analysis: relaxed street drape vs. high-tension contour.
              </span>
            </div>

            <div className="p-3.5 border border-[#1f1f1f] bg-[#0d0d0d] rounded-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-white">
                <Layers className="w-4 h-4" />
                <span className="font-tech text-xs font-bold uppercase tracking-wider">OUTFIT LAYERING</span>
              </div>
              <span className="font-tech text-[11px] text-[#777]">
                Layer hoodies, tees, tactical cargos, and modular crossbody bags.
              </span>
            </div>

            <div className="p-3.5 border border-[#1f1f1f] bg-[#0d0d0d] rounded-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#f2342b]">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-tech text-xs font-bold uppercase tracking-wider">1-CLICK BAG ADD</span>
              </div>
              <span className="font-tech text-[11px] text-[#777]">
                Add your fitted silhouette ensemble directly to cart in custom sizes.
              </span>
            </div>
          </div>

          <div className="pt-3">
            <Link
              href="/fitting-room"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#f2342b] hover:bg-[#d62828] text-white font-tech text-xs font-bold uppercase tracking-widest transition rounded-xs shadow-2xl"
            >
              <Sparkles className="w-4 h-4" />
              <span>LAUNCH 3D VIRTUAL FITTING STUDIO</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Visual 3D Studio Mockup / Teaser Portal */}
        <div className="lg:col-span-6 relative">
          <div className="relative border border-[#262626] bg-[#0a0a0a] rounded-sm p-4 shadow-2xl overflow-hidden group">
            {/* Visual Screen Preview */}
            <div className="aspect-[4/3] bg-gradient-to-b from-[#141414] to-[#040404] relative flex items-center justify-center overflow-hidden border border-[#1a1a1a]">
              {/* Grid lines */}
              <div className="absolute inset-0 film-grain opacity-30" />

              {/* Mannequin Silhouette Graphic */}
              <div className="w-48 h-80 bg-cover bg-center grayscale opacity-80 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url(/campaign/hero-garage-model.jpg)" }} />

              {/* Overlay HUD Graphics */}
              <div className="absolute top-4 left-4 font-tech text-[10px] text-[#f2342b] tracking-widest flex items-center gap-1.5 bg-black/80 px-2.5 py-1 border border-[#333]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2342b] animate-ping" />
                3D AVATAR MESH // ACTIVE
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-tech text-[10px] text-white bg-black/85 backdrop-blur-md p-3 border border-[#333]">
                <div className="flex flex-col">
                  <span className="text-[#888]">DRAPE ANALYSIS:</span>
                  <span className="text-emerald-400 font-bold">OPTIMAL 480 GSM BOXY FALL</span>
                </div>
                <Link
                  href="/fitting-room"
                  className="px-3 py-1.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-[#f2342b] hover:text-white transition"
                >
                  ENTER STUDIO ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
