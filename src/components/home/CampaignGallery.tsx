"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CampaignGallery() {
  return (
    <section className="w-full bg-[#080808] text-white py-20 px-4 md:px-8 border-b border-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header from Screencast */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-tech text-xs tracking-widest text-[#888] uppercase block mb-1">
              02 / THE CAMPAIGN
            </span>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight uppercase leading-none">
              NO CURFEW<span className="text-[#f2342b]">.</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="font-tech text-xs text-[#888] tracking-widest uppercase block">
              The city&apos;s quieter. We&apos;re not.
            </span>
            <span className="font-tech text-[10px] text-[#555] tracking-widest uppercase">
              AFTERHOURS / CAMPAIGN 010 / LONDON
            </span>
          </div>
        </div>

        {/* Dual Asymmetric Editorial Cards (from Screencast) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Stairs (7 cols) */}
          <div className="md:col-span-7 relative group overflow-hidden border border-[#222] bg-[#111] aspect-[4/3] rounded-xs">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              style={{ backgroundImage: "url(/campaign/campaign-stairs.jpg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <span className="font-display text-2xl md:text-3xl tracking-wider text-white">
                THE NIGHT BELONGS TO US.
              </span>
              <Link
                href="/shop/nocturn-oversized-heavyweight-hoodie"
                className="p-3 bg-[#111]/80 backdrop-blur-md border border-[#333] hover:bg-white hover:text-black transition rounded-xs"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Concrete Wall (5 cols) */}
          <div className="md:col-span-5 relative group overflow-hidden border border-[#222] bg-[#111] aspect-[4/3] md:aspect-auto rounded-xs">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              style={{ backgroundImage: "url(/campaign/campaign-model.jpg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="flex flex-col">
                <span className="font-tech text-[10px] text-[#888] uppercase tracking-widest">
                  03 / OUTSIDE THE LINES
                </span>
                <span className="font-display text-2xl tracking-wider text-white">
                  OUTSIDE THE LINES.
                </span>
              </div>
              <Link
                href="/shop/london-after-dark-graphic-tee"
                className="p-3 bg-[#111]/80 backdrop-blur-md border border-[#333] hover:bg-white hover:text-black transition rounded-xs"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Micro-text footer from screencast */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-tech text-xs text-[#888] pt-2">
          <span>UNFILTERED. UNPOSED. OUT HERE UNTIL THE LIGHTS COME ON.</span>
          <Link
            href="/lookbook"
            className="hover:text-white transition flex items-center gap-1.5 uppercase font-bold"
          >
            <span>OPEN THE LOOKBOOK</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
