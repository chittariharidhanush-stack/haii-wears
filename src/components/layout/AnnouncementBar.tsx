"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { brandConfig } from "@/config/brand";

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState(brandConfig.announcements);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Check if CMS has updated announcements
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          if (data.config?.announcements) {
            setAnnouncements(data.config.announcements.filter((a: any) => a.active));
          }
        }
      } catch {}
    }
    fetchAnnouncements();
  }, []);

  const activeItems = announcements.filter((a) => a.active);

  useEffect(() => {
    if (activeItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeItems.length]);

  if (activeItems.length === 0) return null;

  const current = activeItems[currentIndex];

  return (
    <div className="w-full bg-[#050505] text-[#b0b0b0] border-b border-[#1a1a1a] py-2 px-4 text-center text-[10px] md:text-[11px] font-tech uppercase tracking-widest relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#666]">
          <span className="w-1.5 h-1.5 bg-[#f2342b] rounded-full inline-block animate-pulse" />
          <span>EST. AFTER DARK // EDITION 2026</span>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {current.link ? (
            <Link
              href={current.link}
              className="hover:text-white transition flex items-center gap-1.5 text-white"
            >
              <span>{current.text}</span>
            </Link>
          ) : (
            <span className="text-white">{current.text}</span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3 text-[#666]">
          <span>WORLDWIDE DISPATCH</span>
        </div>
      </div>
    </div>
  );
}

