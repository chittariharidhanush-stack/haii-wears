"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import Link from "next/link";
import { Filter, Sparkles, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category match
      if (selectedCategory !== "all") {
        const matchesCategory =
          product.category_slug === selectedCategory ||
          product.category_id === selectedCategory ||
          product.category_name?.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      // Size match
      if (selectedSize !== "all") {
        const hasSize = product.sizes.some((s: any) => s.size === selectedSize && s.stock > 0);
        if (!hasSize) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.fit?.toLowerCase().includes(query) ||
          product.category_name?.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price || a.price;
      const priceB = b.sale_price || b.price;
      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      return 0; // default newest
    });
  }, [initialProducts, selectedCategory, selectedSize, searchQuery, sortBy]);

  const allSizes = ["S", "M", "L", "XL", "XXL", "ONE SIZE"];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1a1a1a]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f2342b]" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              THE NOCTURNAL CATALOGUE
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight uppercase leading-none">
            ALL SILHOUETTES
          </h1>
          <p className="font-tech text-xs text-[#888] tracking-widest uppercase mt-2">
            SHOWING {filteredProducts.length} OF {initialProducts.length} ARCHIVAL PIECES
          </p>
        </div>

        {/* 3D Fitting Room Banner Pill */}
        <Link
          href="/fitting-room"
          className="flex items-center gap-2 px-5 py-3 border border-[#f2342b] bg-[#f2342b]/10 hover:bg-[#f2342b] text-white font-tech text-xs font-bold uppercase tracking-widest transition rounded-xs"
        >
          <Sparkles className="w-4 h-4 text-[#f2342b] hover:text-white" />
          <span>OPEN 3D VIRTUAL FITTING STUDIO ↗</span>
        </Link>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER SILHOUETTES..."
            className="w-full bg-[#111] border border-[#222] px-3.5 py-2.5 text-xs font-tech text-white placeholder-[#555] uppercase focus:outline-none focus:border-[#f2342b] rounded-xs"
          />
        </div>

        {/* Categories Horizontal Scroller */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 text-xs font-tech tracking-wider uppercase rounded-xs transition shrink-0 ${
              selectedCategory === "all"
                ? "bg-white text-black font-bold"
                : "border border-[#222] bg-[#111] text-[#888] hover:border-[#444] hover:text-white"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 text-xs font-tech tracking-wider uppercase rounded-xs transition shrink-0 ${
                selectedCategory === c.slug
                  ? "bg-white text-black font-bold"
                  : "border border-[#222] bg-[#111] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Right Controls: Size & Sort */}
        <div className="flex items-center gap-3">
          {/* Size Filter Dropdown */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-[#111] border border-[#222] px-3 py-2 text-xs font-tech text-white uppercase focus:outline-none focus:border-[#f2342b] rounded-xs"
          >
            <option value="all">SIZE: ALL</option>
            {allSizes.map((s) => (
              <option key={s} value={s}>
                SIZE: {s}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#111] border border-[#222] px-3 py-2 text-xs font-tech text-white uppercase focus:outline-none focus:border-[#f2342b] rounded-xs"
          >
            <option value="newest">SORT: NEWEST</option>
            <option value="price_asc">PRICE: LOW TO HIGH</option>
            <option value="price_desc">PRICE: HIGH TO LOW</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2 bg-[#111] border border-[#222] text-[#aaa] rounded-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Categories Accordion */}
      {mobileFilterOpen && (
        <div className="lg:hidden p-4 border border-[#222] bg-[#111] rounded-xs flex flex-wrap gap-1.5 animate-in fade-in">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setMobileFilterOpen(false);
            }}
            className={`px-2.5 py-1 text-xs font-tech uppercase ${
              selectedCategory === "all" ? "bg-white text-black font-bold" : "text-[#888]"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.slug);
                setMobileFilterOpen(false);
              }}
              className={`px-2.5 py-1 text-xs font-tech uppercase ${
                selectedCategory === c.slug ? "bg-white text-black font-bold" : "text-[#888]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Active Filter Tags */}
      {(selectedCategory !== "all" || selectedSize !== "all" || searchQuery.trim()) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-tech text-[10px] text-[#666] uppercase tracking-widest">ACTIVE FILTERS:</span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-2.5 py-0.5 text-[11px] font-tech bg-[#1a1a1a] text-white flex items-center gap-1.5 rounded-xs"
            >
              <span>CATEGORY: {selectedCategory}</span>
              <X className="w-3 h-3 text-[#888]" />
            </button>
          )}
          {selectedSize !== "all" && (
            <button
              onClick={() => setSelectedSize("all")}
              className="px-2.5 py-0.5 text-[11px] font-tech bg-[#1a1a1a] text-white flex items-center gap-1.5 rounded-xs"
            >
              <span>SIZE: {selectedSize}</span>
              <X className="w-3 h-3 text-[#888]" />
            </button>
          )}
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-2.5 py-0.5 text-[11px] font-tech bg-[#1a1a1a] text-white flex items-center gap-1.5 rounded-xs"
            >
              <span>QUERY: {searchQuery}</span>
              <X className="w-3 h-3 text-[#888]" />
            </button>
          )}
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSize("all");
              setSearchQuery("");
            }}
            className="text-[10px] font-tech text-[#f2342b] underline uppercase ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
          <span className="font-display text-3xl tracking-wider text-[#666]">
            NO PIECES MATCH YOUR FILTER CRITERIA.
          </span>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSize("all");
              setSearchQuery("");
            }}
            className="px-6 py-3 bg-white text-black font-tech text-xs uppercase font-bold tracking-widest hover:bg-[#f2342b] hover:text-white transition"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

