"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BrandManifesto() {
  return (
    <section className="w-full bg-[#080808] text-white py-24 px-4 md:px-8 border-b border-[#141414] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: SCREENCAST SIGNATURE KINETIC HEADLINE */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-tech text-xs tracking-widest text-[#888] uppercase">
                04 // THE MINDSET
              </span>
            </div>

            {/* Screencast headline: MADE FOR / THE OUTSIDE (with outline text!) */}
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.88] uppercase select-none">
              MADE FOR<br />
              <span className="text-stroke-outline text-transparent">THE OUTSIDE.</span>
            </h2>

            {/* Oversized Red Plus Accent from Screencast */}
            <div className="text-7xl font-light text-[#f2342b] mt-6 select-none">
              +
            </div>
          </div>

          <div className="mt-12 hidden lg:block">
            <span className="font-tech text-xs text-[#555] tracking-widest uppercase block mb-1">
              HAII WEAES ARCHIVE
            </span>
            <span className="font-tech text-xs text-[#888]">
              INDEPENDENT. UNFILTERED. NEVER RESTOCKED.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: MANIFESTO STATEMENTS & NUMBERED POINTS */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Main Prose from Screencast */}
          <p className="font-tech text-base md:text-lg text-[#ccc] leading-relaxed max-w-2xl border-l-2 border-[#f2342b] pl-5">
            HAII WEAES is for the late ones. The wrong turns. The nights that become stories. Independent streetwear with nothing to prove and no permission to ask.
          </p>

          {/* 3 Technical Rows from Screencast */}
          <div className="flex flex-col border-t border-[#1a1a1a]">
            {/* Point 01 */}
            <div className="py-6 border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 group">
              <span className="font-tech text-xs text-[#f2342b] font-bold tracking-widest shrink-0">
                01
              </span>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="font-tech text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#f2342b] transition">
                  NOT MASS. NOT MAINSTREAM.
                </span>
                <p className="font-tech text-xs text-[#888] leading-relaxed">
                  Small-batch releases with a point of view. We produce in limited runs so every piece carries true weight and individuality.
                </p>
              </div>
            </div>

            {/* Point 02 */}
            <div className="py-6 border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 group">
              <span className="font-tech text-xs text-[#f2342b] font-bold tracking-widest shrink-0">
                02
              </span>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="font-tech text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#f2342b] transition">
                  A NEW CHAPTER. EVERY MONTH.
                </span>
                <p className="font-tech text-xs text-[#888] leading-relaxed">
                  The 23rd, 18:00 UTC. A fresh edit of heavyweight hoodies, graphic tees and everyday modular carry. Set your reminder.
                </p>
              </div>
            </div>

            {/* Point 03 */}
            <div className="py-6 border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 group">
              <span className="font-tech text-xs text-[#f2342b] font-bold tracking-widest shrink-0">
                03
              </span>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="font-tech text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#f2342b] transition">
                  NO RESTOCKS. NO REPEATS.
                </span>
                <p className="font-tech text-xs text-[#888] leading-relaxed">
                  Every drop has its own story. When a chapter closes, we move forward. The archive stays. The pieces don&apos;t return.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="font-tech text-xs tracking-widest uppercase text-white hover:text-[#f2342b] transition inline-flex items-center gap-2"
            >
              <span>READ THE FULL ARCHIVE ESSAY</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

