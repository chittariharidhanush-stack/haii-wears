"use client";

import React from "react";
import Link from "next/link";
import { brandConfig } from "@/config/brand";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] text-[#888888] border-t border-[#1a1a1a] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-12">
        {/* Top Row: Brand & Main Statement */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-[#141414]">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-4xl md:text-5xl tracking-wider text-white">
                HAII WEAES
              </span>
              <div className="flex items-center gap-1 -translate-y-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="w-2 h-2 rounded-full bg-[#f2342b]" />
              </div>
            </Link>
            <p className="font-tech text-xs tracking-wider max-w-md text-[#777]">
              {brandConfig.subTagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/fitting-room"
              className="px-4 py-2.5 border border-[#f2342b] bg-[#f2342b]/10 text-white font-tech text-xs tracking-widest uppercase hover:bg-[#f2342b] transition flex items-center gap-2 rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f2342b]" />
              <span>3D VIRTUAL FITTING STUDIO</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/track-order"
              className="px-4 py-2.5 border border-[#222] bg-[#111] text-[#aaa] hover:text-white hover:border-[#444] font-tech text-xs tracking-widest uppercase transition rounded-xs"
            >
              TRACK ORDER
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Shop Collections */}
          <div className="flex flex-col gap-3">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold">
              // EXPLORE
            </span>
            <div className="flex flex-col gap-2 font-tech text-xs">
              <Link href="/shop" className="hover:text-white transition">All Silhouettes</Link>
              <Link href="/shop?category=hoodies" className="hover:text-white transition">Heavyweight Hoodies</Link>
              <Link href="/shop?category=oversized-t-shirts" className="hover:text-white transition">Graphic Oversized Tees</Link>
              <Link href="/shop?category=jackets" className="hover:text-white transition">Technical Outerwear</Link>
              <Link href="/shop?category=trousers" className="hover:text-white transition">Tactical Cargo Pants</Link>
              <Link href="/shop?category=accessories" className="hover:text-white transition">Modular Accessories</Link>
              <Link href="/lookbook" className="hover:text-white transition">Campaign Lookbook</Link>
            </div>
          </div>

          {/* Column 2: The Studio & Brand */}
          <div className="flex flex-col gap-3">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold">
              // THE LABEL
            </span>
            <div className="flex flex-col gap-2 font-tech text-xs">
              <Link href="/about" className="hover:text-white transition">The Mindset & Manifesto</Link>
              <Link href="/fitting-room" className="hover:text-white transition flex items-center gap-1.5">
                <span>Virtual 3D Fitting Room</span>
                <span className="text-[9px] px-1 bg-[#f2342b] text-white">3D</span>
              </Link>
              <Link href="/about#fabric" className="hover:text-white transition">480 GSM Cotton Architecture</Link>
              <Link href="/about#studios" className="hover:text-white transition">Ateliers: Mumbai · London · Tokyo</Link>
              <Link href="/account" className="hover:text-white transition">Customer Portal</Link>
              <Link href="/admin" className="hover:text-white transition text-[#555]">Studio Admin Portal</Link>
            </div>
          </div>

          {/* Column 3: Customer Concierge */}
          <div className="flex flex-col gap-3">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold">
              // CLIENT SERVICE
            </span>
            <div className="flex flex-col gap-2 font-tech text-xs">
              <Link href="/track-order" className="hover:text-white transition">Order Dispatch Tracking</Link>
              <Link href="/about#shipping" className="hover:text-white transition">Shipping Zones & Rates</Link>
              <Link href="/about#returns" className="hover:text-white transition">Complimentary Exchanges</Link>
              <Link href="/about#size-guide" className="hover:text-white transition">Garment Measurements</Link>
              <a href="mailto:concierge@haiiweaes.com" className="hover:text-white transition">
                concierge@haiiweaes.com
              </a>
              <span className="text-[#555]">+91 (0) 22 8940 3320</span>
            </div>
          </div>

          {/* Column 4: Find Us After Dark */}
          <div className="flex flex-col gap-3">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold">
              // FIND US AFTER DARK
            </span>
            <div className="flex flex-col gap-2 font-tech text-xs">
              <a href={brandConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between">
                <span>INSTAGRAM</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555]" />
              </a>
              <a href={brandConfig.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between">
                <span>TIKTOK</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555]" />
              </a>
              <a href={brandConfig.social.pinterest} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between">
                <span>PINTEREST</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555]" />
              </a>
              <a href={brandConfig.social.twitter} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between">
                <span>X // TWITTER</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 border-t border-[#141414] flex flex-col md:flex-row items-center justify-between gap-4 font-tech text-[11px] text-[#666]">
          <div>
            © 2026 HAII WEAES. ALL RIGHTS RESERVED. NOT FOR EVERYONE.
          </div>

          <div className="flex items-center gap-5">
            <Link href="/about#privacy" className="hover:text-white transition">Privacy Policy</Link>
            <span>·</span>
            <Link href="/about#terms" className="hover:text-white transition">Terms of Service</Link>
            <span>·</span>
            <Link href="/about#accessibility" className="hover:text-white transition">Accessibility</Link>
          </div>

          <div className="flex items-center gap-2 text-[#555]">
            <span>MUMBAI</span>
            <span>·</span>
            <span>LONDON</span>
            <span>·</span>
            <span>TOKYO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
