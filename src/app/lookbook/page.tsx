import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "EDITORIAL LOOKBOOK // HAII WEAES",
  description: "Campaign 010: London After Dark & Nocturnal street photography.",
};

const LOOKBOOK_SPREADS = [
  {
    title: "FRAME 01 // PARKING GARAGE REFLECTIONS",
    location: "LONDON, WHITECHAPEL",
    time: "02:40 AM",
    piece: "Nocturn Heavyweight Hoodie (480 GSM)",
    image: "/campaign/hero-garage-model.jpg",
    slug: "nocturn-oversized-heavyweight-hoodie",
    tall: true
  },
  {
    title: "FRAME 02 // RAW TEXTURE & CONCRETE",
    location: "LONDON, ELEPHANT & CASTLE",
    time: "03:15 AM",
    piece: "London After Dark Graphic Tee",
    image: "/campaign/hero-graphic-tee-model.jpg",
    slug: "london-after-dark-graphic-tee",
    tall: false
  },
  {
    title: "FRAME 03 // THE NIGHT BELONGS TO US",
    location: "LONDON, SHOREDITCH OVERPASS",
    time: "04:10 AM",
    piece: "Full Nocturnal Outerwear Capsule",
    image: "/campaign/campaign-stairs.jpg",
    slug: "apocalypse-reversible-bomber-jacket",
    tall: true
  },
  {
    title: "FRAME 04 // OUTSIDE THE LINES",
    location: "LONDON, BARBICAN COMPLEX",
    time: "04:45 AM",
    piece: "Archive Tactical Cargo Trousers",
    image: "/campaign/campaign-model.jpg",
    slug: "archive-tactical-cargo-trousers",
    tall: false
  },
  {
    title: "FRAME 05 // RAW SELVEDGE & HEAVYWEIGHT CUTS",
    location: "TOKYO, SHIBUYA ALLEYWAYS",
    time: "01:20 AM",
    piece: "14oz Selvedge Denim & Flannel",
    image: "/products/selvedge-denim-1.jpg",
    slug: "raw-selvedge-relaxed-denim",
    tall: true
  },
  {
    title: "FRAME 06 // MODULAR CROSSBODY CORDURA",
    location: "MUMBAI, DOCKYARD ROAD",
    time: "03:50 AM",
    piece: "1000D Ballistic Sling with Cobra Buckle",
    image: "/campaign/hero-sling-bag.jpg",
    slug: "technical-crossbody-modular-bag",
    tall: false
  }
];

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1a1a1a] pb-8">
          <div>
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold block mb-2">
              CAMPAIGN 010 // LONDON AFTER DARK
            </span>
            <h1 className="font-display text-5xl md:text-8xl tracking-tight uppercase leading-none">
              EDITORIAL ARCHIVE
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/fitting-room"
              className="px-5 py-3 border border-[#f2342b] bg-[#f2342b]/10 hover:bg-[#f2342b] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 rounded-xs"
            >
              <Sparkles className="w-4 h-4 text-[#f2342b] hover:text-white" />
              <span>3D VIRTUAL TRY-ON STUDIO ↗</span>
            </Link>
          </div>
        </div>

        {/* Masonry / Editorial Spreads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LOOKBOOK_SPREADS.map((spread, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-4 border border-[#1a1a1a] bg-[#0c0c0c] p-4 rounded-xs group ${
                spread.tall ? "md:row-span-2" : ""
              }`}
            >
              <div
                className={`w-full overflow-hidden relative bg-[#111] rounded-xs ${
                  spread.tall ? "aspect-[3/4]" : "aspect-[16/10]"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  style={{ backgroundImage: `url(${spread.image})` }}
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 font-tech text-[9px] tracking-widest uppercase text-[#aaa] border border-[#222]">
                  {spread.location} · {spread.time}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="font-display text-xl tracking-wide uppercase text-white group-hover:text-[#f2342b] transition">
                    {spread.title}
                  </span>
                  <span className="font-tech text-xs text-[#777]">
                    FEATURED: {spread.piece}
                  </span>
                </div>

                <Link
                  href={`/shop/${spread.slug}`}
                  className="p-3 bg-[#161616] border border-[#262626] hover:bg-white hover:text-black transition rounded-xs"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
