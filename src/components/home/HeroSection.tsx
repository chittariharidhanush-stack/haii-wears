"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Play } from "lucide-react";

export default function HeroSection() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative w-full min-h-[94vh] bg-[#080808] text-white flex flex-col justify-center items-center overflow-hidden py-16 px-4 md:px-8 border-b border-[#141414]">
      {/* Subtle background glow & scanline grid */}
      <div className="absolute inset-0 bg-radial from-[#141414]/80 via-[#080808] to-[#080808] pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />

      {/* FLOATING ASYMMETRIC EDITORIAL PHOTOGRAPHS (Authentic Screencast Placement) */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[760px]">
        {/* PHOTO 1: LEFT TALL PORTRAIT (Model in parking garage / Afterhours 001) */}
        <div className="hidden lg:block absolute left-4 top-12 w-64 h-96 z-10 transition-transform duration-700 hover:scale-105 hover:z-30">
          <div className="w-full h-full relative border border-[#262626] shadow-2xl bg-[#111] overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: "url(/campaign/hero-garage-model.jpg)" }}
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#080808]/85 backdrop-blur-sm border border-[#222] font-tech text-[9px] tracking-widest text-[#aaa] uppercase">
              AFTERHOURS / 001
            </div>
          </div>
        </div>

        {/* PHOTO 2: TOP CENTER-LEFT (Tactical crossbody sling / detail texture) */}
        <div className="hidden lg:block absolute left-[30%] top-2 w-48 h-32 z-10 -rotate-3 transition-transform duration-700 hover:rotate-0 hover:scale-105 hover:z-30">
          <div className="w-full h-full relative border border-[#262626] shadow-2xl bg-[#111] overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: "url(/campaign/hero-sling-bag.jpg)" }}
            />
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#080808]/85 font-tech text-[8px] tracking-widest text-[#aaa] uppercase">
              MODULAR RIG // 04
            </div>
          </div>
        </div>

        {/* PHOTO 3: RIGHT EDITORIAL (Model in Nocturn graphic streetwear tee) */}
        <div className="hidden lg:block absolute right-6 top-8 w-68 h-[440px] z-10 rotate-1 transition-transform duration-700 hover:rotate-0 hover:scale-105 hover:z-30">
          <div className="w-full h-full relative border border-[#262626] shadow-2xl bg-[#111] overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: "url(/campaign/hero-graphic-tee-model.jpg)" }}
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#080808]/85 backdrop-blur-sm border border-[#222] font-tech text-[9px] tracking-widest text-[#aaa] uppercase">
              LONDON // AFTER DARK
            </div>
          </div>
        </div>

        {/* RED ANGLE BADGE: "NO CURFEW." (From Screencast!) */}
        <div className="hidden lg:block absolute right-[23%] top-20 z-20 rotate-[-6deg] animate-pulse">
          <div className="px-3.5 py-1.5 border-2 border-[#f2342b] bg-[#080808]/90 font-tech text-xs font-bold text-[#f2342b] tracking-widest uppercase shadow-lg">
            NO CURFEW.
          </div>
        </div>

        {/* PHOTO 4: BOTTOM LEFT (Back view of heavyweight hoodie) */}
        <div className="hidden lg:block absolute left-20 bottom-4 w-44 h-56 z-10 transition-transform duration-700 hover:scale-105 hover:z-30">
          <div className="w-full h-full relative border border-[#262626] shadow-2xl bg-[#111] overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: "url(/products/nocturn-hoodie-2.jpg)" }}
            />
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#080808]/85 font-tech text-[8px] tracking-widest text-[#aaa] uppercase">
              BACK REVEAL // 480 GSM
            </div>
          </div>
        </div>

        {/* PHOTO 5: BOTTOM RIGHT (Atmospheric texture / jacket closeup) */}
        <div className="hidden lg:block absolute right-16 bottom-2 w-52 h-44 z-10 transition-transform duration-700 hover:scale-105 hover:z-30">
          <div className="w-full h-full relative border border-[#262626] shadow-2xl bg-[#111] overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: "url(/products/bomber-jacket-1.jpg)" }}
            />
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#080808]/85 font-tech text-[8px] tracking-widest text-[#aaa] uppercase">
              BALLISTIC NYLON BOMBER
            </div>
          </div>
        </div>

        {/* CENTRAL MASSIVE TYPOGRAPHY & HERO CONTENT */}
        <div className="relative z-20 text-center flex flex-col items-center max-w-3xl mx-auto px-4">
          {/* Micro Header Label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f2342b]" />
            <span className="font-tech text-xs tracking-[0.25em] text-[#f2342b] uppercase font-bold">
              HAII WEAES — EST. AFTER DARK
            </span>
          </div>

          {/* Screencast Core Headline: NOT FOR EVERYONE. */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tight uppercase select-none text-white drop-shadow-2xl">
            NOT FOR<br />
            <span className="text-[#f2342b]">EVERYONE.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-tech text-xs md:text-sm tracking-widest text-[#a0a0a0] uppercase max-w-xl mt-6 leading-relaxed">
            LIMITED PIECES. UNLIMITED NIGHTS.<br className="hidden sm:inline" />
            STREETWEAR FOR THE ONES OUTSIDE THE LINES.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
            {/* Primary CTA */}
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs group"
            >
              <span>SHOP THE DROP</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* 3D Virtual Try-On CTA */}
            <Link
              href="/fitting-room"
              className="w-full sm:w-auto px-7 py-4 border border-[#f2342b] bg-[#f2342b]/10 text-white hover:bg-[#f2342b] font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs"
            >
              <Sparkles className="w-4 h-4 text-[#f2342b] group-hover:text-white" />
              <span>3D VIRTUAL TRY-ON</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#f2342b] text-white rounded-2xs">3D</span>
            </Link>

            {/* Secondary CTA */}
            <a
              href="#newsletter"
              className="w-full sm:w-auto px-7 py-4 border border-[#333] hover:border-white text-[#bbb] hover:text-white font-tech text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs"
            >
              <span>JOIN THE NEXT DROP</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Image Carousel Peek (Since absolute floats are hidden on mobile) */}
          <div className="grid grid-cols-2 gap-3 mt-10 w-full lg:hidden">
            <div className="aspect-[3/4] bg-cover bg-center border border-[#222] rounded-xs" style={{ backgroundImage: "url(/campaign/hero-garage-model.jpg)" }} />
            <div className="aspect-[3/4] bg-cover bg-center border border-[#222] rounded-xs" style={{ backgroundImage: "url(/campaign/hero-graphic-tee-model.jpg)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

