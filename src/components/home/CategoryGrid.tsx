"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
  count: number;
}

const CATEGORIES: CategoryItem[] = [
  { name: "HOODIES", slug: "hoodies", image: "/categories/hoodies.jpg", count: 8 },
  { name: "OVERSIZED T-SHIRTS", slug: "oversized-t-shirts", image: "/categories/oversized-t-shirts.jpg", count: 12 },
  { name: "JACKETS & OUTERWEAR", slug: "jackets", image: "/categories/jackets.jpg", count: 6 },
  { name: "TACTICAL TROUSERS", slug: "trousers", image: "/categories/trousers.jpg", count: 9 },
  { name: "RAW SELVEDGE JEANS", slug: "jeans", image: "/categories/jeans.jpg", count: 5 },
  { name: "BOX-CUT SHIRTS", slug: "shirts", image: "/categories/shirts.jpg", count: 7 },
  { name: "SWEATSHIRTS", slug: "sweatshirts", image: "/categories/sweatshirts.jpg", count: 8 },
  { name: "CARPENTER SHORTS", slug: "shorts", image: "/categories/shorts.jpg", count: 4 },
  { name: "STRUCTURED DRESSES", slug: "dresses", image: "/categories/dresses.jpg", count: 6 },
  { name: "RIBBED TOPS", slug: "tops", image: "/categories/tops.jpg", count: 7 },
  { name: "CO-ORD SETS", slug: "co-ord-sets", image: "/categories/co-ord-sets.jpg", count: 5 },
  { name: "MODULAR ACCESSORIES", slug: "accessories", image: "/categories/accessories.jpg", count: 11 },
  { name: "CLASSIC TEES", slug: "t-shirts", image: "/categories/t-shirts.jpg", count: 9 },
  { name: "NEW ARRIVALS", slug: "new-arrivals", image: "/categories/new-arrivals.jpg", count: 14 }
];

export default function CategoryGrid() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#080808] text-white py-20 px-4 md:px-8 border-b border-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold block mb-1">
              // ARCHIVE TAXONOMY
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight uppercase leading-none">
              DISCOVER BY SILHOUETTE
            </h2>
          </div>
          <p className="font-tech text-xs text-[#888] tracking-widest uppercase max-w-sm">
            Unisex proportions engineered for drape, weight and longevity.
          </p>
        </div>

        {/* Dynamic Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              onMouseEnter={() => setHoveredSlug(cat.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className={`relative overflow-hidden group border border-[#1a1a1a] hover:border-[#444] transition-all duration-500 rounded-xs bg-[#111] ${
                idx === 0 || idx === 7 ? "md:col-span-2 aspect-[16/9]" : "aspect-[3/4]"
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${cat.image})` }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/75 transition-all" />

              {/* Category Info */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between z-10">
                <div className="flex flex-col">
                  <span className="font-tech text-[10px] text-[#888] uppercase tracking-widest">
                    [{cat.count < 10 ? `0${cat.count}` : cat.count} PIECES]
                  </span>
                  <span className="font-display text-xl md:text-2xl tracking-wider text-white group-hover:text-[#f2342b] transition">
                    {cat.name}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-white group-hover:bg-[#f2342b] group-hover:border-[#f2342b] transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
