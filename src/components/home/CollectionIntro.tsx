"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function CollectionIntro() {
  return (
    <section className="w-full bg-[#080808] text-white py-20 px-4 md:px-8 border-b border-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top Header Row from Screencast */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
                01 // LATEST CAPSULE
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-none">
              AFTERHOURS<span className="text-[#f2342b]">.</span>
            </h2>
            <p className="font-tech text-xs md:text-sm text-[#888] tracking-widest uppercase max-w-lg mt-1">
              Heavyweight essentials. Made for life after the last train.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/fitting-room"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-[#333] hover:border-[#f2342b] font-tech text-xs uppercase tracking-widest text-[#aaa] hover:text-white transition rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f2342b]" />
              <span>TEST FIT IN 3D</span>
            </Link>

            <Link
              href="/shop?category=hoodies"
              className="font-tech text-xs uppercase tracking-widest text-white hover:text-[#f2342b] transition flex items-center gap-1.5"
            >
              <span>EXPLORE ALL PIECES</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Editorial Double Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Large Left Image Banner */}
          <div className="md:col-span-7 relative group overflow-hidden border border-[#222] bg-[#111] aspect-[16/10] rounded-xs">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              style={{ backgroundImage: "url(/campaign/campaign-stairs.jpg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="flex flex-col">
                <span className="font-tech text-[10px] text-[#f2342b] tracking-widest uppercase font-bold">
                  DROP 03 // LONDON AFTER DARK
                </span>
                <span className="font-display text-3xl md:text-4xl tracking-wider text-white">
                  THE NIGHT BELONGS TO US.
                </span>
              </div>
              <Link
                href="/shop/nocturn-oversized-heavyweight-hoodie"
                className="p-3 bg-white text-black hover:bg-[#f2342b] hover:text-white transition rounded-xs"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Editorial Spotlight */}
          <div className="md:col-span-5 flex flex-col gap-6 justify-center">
            <div className="p-8 border border-[#1f1f1f] bg-[#0c0c0c] rounded-xs flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
                <span className="font-tech text-xs tracking-widest text-[#888] uppercase">
                  ARCHIVAL SPECIFICATION
                </span>
                <span className="font-tech text-xs text-[#f2342b] font-bold">
                  480 GSM
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-display text-2xl md:text-3xl tracking-wide text-white">
                  QUIET BEFORE THE DROP.
                </span>
                <p className="font-tech text-xs text-[#888] leading-relaxed">
                  Every silhouette in the AFTERHOURS capsule is developed from zero. Double-faced loopback terry, ribbed stretch side gussets, and blind-stitched hems engineered to survive years of nocturnal life.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-tech text-xs pt-2">
                <div className="flex flex-col">
                  <span className="text-[#555] uppercase text-[10px]">EDITION SIZE</span>
                  <span className="text-white font-bold">120 UNITS WORLDWIDE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#555] uppercase text-[10px]">RESTOCKS</span>
                  <span className="text-[#f2342b] font-bold">ZERO RESTOCKS</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/fitting-room?item=prod_01"
                  className="flex-1 py-3 px-4 bg-[#f2342b] text-white hover:bg-[#d62828] text-center font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TRY ON IN 3D ↗</span>
                </Link>
                <Link
                  href="/shop/nocturn-oversized-heavyweight-hoodie"
                  className="flex-1 py-3 px-4 border border-[#333] hover:border-white text-center font-tech text-xs uppercase tracking-widest text-[#bbb] hover:text-white transition rounded-xs"
                >
                  VIEW SILHOUETTE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
