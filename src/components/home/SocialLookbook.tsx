"use client";

import React from "react";
import { ArrowUpRight, Camera } from "lucide-react";
import { brandConfig } from "@/config/brand";

const LOOKBOOK_ITEMS = [
  { img: "/campaign/hero-garage-model.jpg", tag: "@haiiweaes", piece: "Nocturn Hoodie / 480 GSM" },
  { img: "/products/tactical-cargo-1.jpg", tag: "@afterdark.mumbai", piece: "Archive Cargo Trousers" },
  { img: "/campaign/hero-graphic-tee-model.jpg", tag: "@haiiweaes", piece: "London After Dark Tee" },
  { img: "/products/bomber-jacket-1.jpg", tag: "@nocturn_tokyo", piece: "Apocalypse Bomber Jacket" },
  { img: "/products/selvedge-denim-1.jpg", tag: "@haiiweaes", piece: "Raw Selvedge Denim" },
  { img: "/products/crossbody-bag-1.jpg", tag: "@atelier_london", piece: "Modular Crossbody Bag" }
];

export default function SocialLookbook() {
  return (
    <section className="w-full bg-[#080808] text-white py-20 px-4 md:px-8 border-b border-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold block mb-1">
              // NOCTURNAL ARCHIVE
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight uppercase leading-none">
              CURATED SOCIAL LOOKBOOK
            </h2>
          </div>

          <a
            href={brandConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="font-tech text-xs uppercase tracking-widest text-white hover:text-[#f2342b] transition flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-[#f2342b]" />
            <span>FOLLOW @HAIIWEAES ON INSTAGRAM</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Lookbook 6-image grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square border border-[#1f1f1f] overflow-hidden group bg-[#111] rounded-xs"
            >
              <div
                className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${item.img})` }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 to-transparent">
                <span className="font-tech text-[10px] text-[#f2342b] font-bold">{item.tag}</span>
                <span className="font-tech text-[9px] text-[#ddd] line-clamp-1">{item.piece}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
