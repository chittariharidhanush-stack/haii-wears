"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { format } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-xl flex flex-col items-center p-4 md:p-12 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Search Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-6 h-6 text-[#f2342b]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH SILHOUETTE, FABRIC, HOODIE, CARGO, TEE..."
              className="w-full bg-transparent text-xl md:text-2xl font-tech tracking-wider text-white placeholder-[#555] focus:outline-none uppercase"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-tech text-[10px] text-[#666] uppercase tracking-widest mr-2">QUICK SUGGESTIONS:</span>
          {["HOODIES", "OVERSIZED T-SHIRTS", "TACTICAL CARGOS", "BOMBER JACKETS", "RAW SELVEDGE"].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 text-[11px] font-tech text-[#aaa] border border-[#222] bg-[#111] hover:border-[#f2342b] hover:text-white rounded-xs transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-3 pr-2">
          {loading && (
            <div className="py-12 text-center font-tech text-xs text-[#888] tracking-widest">
              SCANNING ARCHIVE DATABASE...
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-12 text-center font-tech text-xs text-[#888] tracking-widest">
              NO PIECES FOUND MATCHING &quot;{query}&quot;. TRY BROWSING BY CATEGORY.
            </div>
          )}

          {!loading && results.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#333] transition flex items-center justify-between group rounded-xs"
            >
              <Link
                href={`/shop/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 flex-1"
              >
                <div
                  className="w-16 h-20 bg-cover bg-center rounded-xs border border-[#222] shrink-0"
                  style={{ backgroundImage: `url(${item.images[0] || "/brand/icon.svg"})` }}
                />
                <div className="flex flex-col gap-1">
                  <span className="font-tech text-xs text-[#f2342b] tracking-widest uppercase">
                    {item.category_name || "HAII WEAES"}
                  </span>
                  <span className="font-display text-lg tracking-wide text-white group-hover:text-[#f2342b] transition">
                    {item.title}
                  </span>
                  <span className="font-tech text-xs text-[#aaa]">
                    {format(item.sale_price || item.price)}
                    {item.gsm && ` · ${item.gsm} GSM`}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/fitting-room?item=${item.id}`}
                  onClick={onClose}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-[#333] hover:border-[#f2342b] hover:text-[#f2342b] text-[10px] font-tech tracking-wider uppercase transition rounded-xs"
                >
                  <Sparkles className="w-3 h-3 text-[#f2342b]" />
                  <span>3D TRY ON</span>
                </Link>

                <Link
                  href={`/shop/${item.slug}`}
                  onClick={onClose}
                  className="p-2 text-[#666] group-hover:text-white transition"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

