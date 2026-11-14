"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface FeaturedProductsProps {
  products: any[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filterTabs = [
    { label: "ALL PIECES", cat: "ALL" },
    { label: "HOODIES", cat: "hoodies" },
    { label: "GRAPHIC TEES", cat: "oversized-t-shirts" },
    { label: "OUTERWEAR", cat: "jackets" },
    { label: "TROUSERS", cat: "trousers" },
    { label: "ACCESSORIES", cat: "accessories" }
  ];

  const filtered = activeFilter === "ALL"
    ? products
    : products.filter((p) => p.category_slug === activeFilter || p.category_name?.toLowerCase().includes(activeFilter));

  const displayProducts = filtered.slice(0, 8);

  return (
    <section className="w-full bg-[#080808] text-white py-20 px-4 md:px-8 border-b border-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#f2342b]" />
              <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
                02 // FEATURED SILHOUETTES
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight uppercase leading-none">
              THE NOCTURNAL DROP
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filterTabs.map((t) => (
              <button
                key={t.cat}
                onClick={() => setActiveFilter(t.cat)}
                className={`px-3 py-1.5 text-xs font-tech tracking-wider uppercase transition rounded-xs ${
                  activeFilter === t.cat
                    ? "bg-white text-black font-bold"
                    : "border border-[#222] bg-[#111] text-[#888] hover:border-[#444] hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((prod, idx) => (
            <ProductCard
              key={prod.id}
              product={prod}
              aspectRatio={idx % 3 === 0 ? "aspect-[3/4]" : "aspect-[3/4]"}
            />
          ))}
        </div>

        {/* Bottom Bar: View All & 3D Fitting Room Callout */}
        <div className="pt-8 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/fitting-room"
            className="flex items-center gap-2 font-tech text-xs text-[#aaa] hover:text-[#f2342b] transition uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-[#f2342b]" />
            <span>UNSURE ABOUT SIZING? LAUNCH OUR 3D AVATAR FITTING ENGINE ↗</span>
          </Link>

          <Link
            href="/shop"
            className="px-6 py-3 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 rounded-xs"
          >
            <span>VIEW ALL 16 ARCHIVE SILHOUETTES</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

