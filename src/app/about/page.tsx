import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { brandConfig } from "@/config/brand";
import { Sparkles, ArrowUpRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const metadata = {
  title: "THE MINDSET // HAII WEAES",
  description: "The philosophy, fabric architecture, and nocturnal manifesto of HAII WEAES.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-20">
        {/* Hero Section */}
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f2342b]" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              // THE HAII WEAES MANIFESTO
            </span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl tracking-tight uppercase leading-[0.88]">
            FASHION WITHOUT<br />
            <span className="text-[#f2342b]">PERMISSION.</span>
          </h1>

          <p className="font-tech text-base md:text-xl text-[#ccc] leading-relaxed max-w-2xl mt-4">
            HAII WEAES was founded on a singular premise: contemporary fashion has grown polite, safe, and disposable. We engineer heavyweight, architectural silhouettes made for life outside the lines.
          </p>
        </div>

        {/* 3 Pillar Statements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-[#1a1a1a] py-12">
          {brandConfig.manifesto.map((item) => (
            <div key={item.number} className="flex flex-col gap-3 p-6 bg-[#0c0c0c] border border-[#1f1f1f] rounded-xs">
              <span className="font-tech text-sm text-[#f2342b] font-bold tracking-widest">
                {item.number}
              </span>
              <span className="font-display text-2xl uppercase tracking-wider text-white">
                {item.title}
              </span>
              <p className="font-tech text-xs text-[#888] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Fabric Architecture & Craftsmanship Section */}
        <div id="fabric" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              // TEXTILE ENGINEERING
            </span>
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight">
              480 GSM COTTON ARCHITECTURE
            </h2>
            <p className="font-tech text-xs md:text-sm text-[#999] leading-relaxed">
              We reject lightweight fast-fashion fabrics. Our core hoodies are woven from custom 480 GSM combed ringspun loopback cotton terry — knit with high tension on vintage circular knitting cylinders to achieve an unmistakable sculptural drape.
            </p>
            <p className="font-tech text-xs md:text-sm text-[#999] leading-relaxed">
              Every garment undergoes enzyme garment bio-washing to neutralize shrinkage and impart a broken-in patina that matures with wear.
            </p>
            <div className="pt-2">
              <Link
                href="/fitting-room"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest transition rounded-xs"
              >
                <Sparkles className="w-4 h-4 text-[#f2342b]" />
                <span>EXPERIENCE 3D FIT DRAPE ↗</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[4/3] bg-cover bg-center border border-[#222] rounded-xs grayscale hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: "url(/campaign/campaign-stairs.jpg)" }} />
        </div>

        {/* Atelier Locations */}
        <div id="studios" className="flex flex-col gap-8 border-t border-[#1a1a1a] pt-12">
          <div className="flex flex-col gap-1">
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              // GLOBAL PRESENCE
            </span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight">
              ATELIER FOOTPRINT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-2">
              <span className="font-display text-2xl uppercase tracking-wider text-white">MUMBAI</span>
              <span className="font-tech text-xs text-[#f2342b]">FLAGSHIP ATELIER & DESIGN LAB</span>
              <p className="font-tech text-xs text-[#888] mt-2">
                14 Mill Compound, Lower Parel, Mumbai 400013. Full tailoring workshop and experimental print studio.
              </p>
            </div>

            <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-2">
              <span className="font-display text-2xl uppercase tracking-wider text-white">LONDON</span>
              <span className="font-tech text-xs text-[#f2342b]">CAMPAIGN STUDIO & DISPATCH</span>
              <p className="font-tech text-xs text-[#888] mt-2">
                Redchurch Street, Shoreditch, London E2. Editorial photography space and European logistics center.
              </p>
            </div>

            <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-2">
              <span className="font-display text-2xl uppercase tracking-wider text-white">TOKYO</span>
              <span className="font-tech text-xs text-[#f2342b]">TEXTILE PROCUREMENT & SELVEDGE</span>
              <p className="font-tech text-xs text-[#888] mt-2">
                Daikanyama, Shibuya-ku, Tokyo. Japanese denim mills and technical hardware engineering.
              </p>
            </div>
          </div>
        </div>

        {/* Policies: Shipping & Exchanges */}
        <div id="shipping" className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#1a1a1a] pt-12">
          <div className="p-6 border border-[#1f1f1f] bg-[#0c0c0c] rounded-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white">
              <Truck className="w-5 h-5 text-[#f2342b]" />
              <span className="font-tech text-xs uppercase tracking-widest font-bold">
                SHIPPING & WORLDWIDE DISPATCH
              </span>
            </div>
            <p className="font-tech text-xs text-[#888] leading-relaxed">
              We dispatch orders worldwide in signature discrete, biodegradable matte black packaging. Free shipping applies on all Indian orders over ₹2,999 and international orders over $100.
            </p>
          </div>

          <div id="returns" className="p-6 border border-[#1f1f1f] bg-[#0c0c0c] rounded-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white">
              <RotateCcw className="w-5 h-5 text-[#f2342b]" />
              <span className="font-tech text-xs uppercase tracking-widest font-bold">
                COMPLIMENTARY 30-DAY EXCHANGES
              </span>
            </div>
            <p className="font-tech text-xs text-[#888] leading-relaxed">
              If an item doesn&apos;t fit your desired silhouette, exchange it within 30 days of delivery. Pieces must be unworn with original tags attached.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
