"use client";

import React from "react";
import { GARMENT_REGISTRY, getAllGarments } from "../services/garments/GarmentRegistry";
import { GarmentManifestEntry } from "../types/GarmentTypes";
import { FitEvaluationResult } from "../services/garments/GarmentFittingService";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { Layers, ShoppingBag, Check, Activity, ShieldCheck } from "lucide-react";

interface Props {
  selectedTop: GarmentManifestEntry;
  onSelectTop: (garment: GarmentManifestEntry) => void;
  selectedTopSize: string;
  onSelectTopSize: (size: string) => void;
  selectedTopColor: string;
  onSelectTopColor: (color: string) => void;

  selectedBottom: GarmentManifestEntry;
  onSelectBottom: (garment: GarmentManifestEntry) => void;
  selectedBottomSize: string;
  onSelectBottomSize: (size: string) => void;
  selectedBottomColor: string;
  onSelectBottomColor: (color: string) => void;

  hasBag: boolean;
  onToggleBag: () => void;
  hasChain: boolean;
  onToggleChain: () => void;

  topFitEvaluation: FitEvaluationResult;
  bottomFitEvaluation: FitEvaluationResult;
}

export default function GarmentSelector({
  selectedTop,
  onSelectTop,
  selectedTopSize,
  onSelectTopSize,
  selectedTopColor,
  onSelectTopColor,

  selectedBottom,
  onSelectBottom,
  selectedBottomSize,
  onSelectBottomSize,
  selectedBottomColor,
  onSelectBottomColor,

  hasBag,
  onToggleBag,
  hasChain,
  onToggleChain,

  topFitEvaluation,
  bottomFitEvaluation
}: Props) {
  const { format } = useCurrency();
  const { addItem, openCart } = useCart();
  const allGarments = getAllGarments();

  const tops = allGarments.filter((g) => g.category === "top");
  const bottoms = allGarments.filter((g) => g.category === "bottom");

  const totalLookPrice =
    selectedTop.price +
    selectedBottom.price +
    (hasBag ? 3499 : 0) +
    (hasChain ? 3999 : 0);

  const handleAddCompleteLook = () => {
    // Add Top
    addItem({
      productId: selectedTop.productId,
      title: selectedTop.title,
      slug: selectedTop.slug,
      price: selectedTop.price,
      size: selectedTopSize,
      color: selectedTop.colors.find((c: { name: string; hex: string }) => c.hex === selectedTopColor)?.name || "Default",
      image: selectedTop.image,
      quantity: 1
    });

    // Add Bottom
    addItem({
      productId: selectedBottom.productId,
      title: selectedBottom.title,
      slug: selectedBottom.slug,
      price: selectedBottom.price,
      size: selectedBottomSize,
      color: selectedBottom.colors.find((c: { name: string; hex: string }) => c.hex === selectedBottomColor)?.name || "Default",
      image: selectedBottom.image,
      quantity: 1
    });

    // Add Accessories if active
    if (hasBag) {
      const bag = GARMENT_REGISTRY["prod_11"];
      if (bag) {
        addItem({
          productId: bag.productId,
          title: bag.title,
          slug: bag.slug,
          price: bag.price,
          size: "ONE_SIZE",
          color: "Stealth Black",
          image: bag.image,
          quantity: 1
        });
      }
    }

    if (hasChain) {
      const chain = GARMENT_REGISTRY["prod_16"];
      if (chain) {
        addItem({
          productId: chain.productId,
          title: chain.title,
          slug: chain.slug,
          price: chain.price,
          size: "ONE_SIZE",
          color: "Polished Silver",
          image: chain.image,
          quantity: 1
        });
      }
    }

    openCart();
  };

  return (
    <div className="w-full lg:w-[460px] bg-[#0c0c0c] border-t lg:border-t-0 lg:border-l border-[#1a1a1a] flex flex-col h-auto lg:h-full z-20 overflow-y-auto">
      {/* Header Title */}
      <div className="p-4 border-b border-[#1a1a1a] bg-[#080808] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#f2342b]" />
          <span className="font-tech text-xs uppercase font-bold tracking-widest text-white">
            OUTFIT & SILHOUETTE SELECTOR
          </span>
        </div>
        <span className="font-tech text-xs text-[#888]">CATALOGUE FIT</span>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* --- TOP SILHOUETTE --- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs tracking-wider text-[#f2342b] uppercase font-bold">
              // TOP SILHOUETTE
            </span>
            <span className="font-tech text-xs text-white font-bold">{format(selectedTop.price)}</span>
          </div>

          {/* Top Products Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {tops.map((top) => {
              const isSelected = selectedTop.productId === top.productId;
              return (
                <button
                  key={top.productId}
                  type="button"
                  onClick={() => onSelectTop(top)}
                  className={`relative p-2 text-left rounded-xs border transition flex flex-col gap-2 ${
                    isSelected
                      ? "border-[#f2342b] bg-[#141414]"
                      : "border-[#1e1e1e] bg-[#0e0e0e] hover:border-[#333]"
                  }`}
                >
                  <div className="relative w-full h-24 bg-black rounded-xs overflow-hidden">
                    <img src={top.image} alt={top.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f2342b]" />
                    )}
                  </div>
                  <span className="font-tech text-[11px] font-bold text-white line-clamp-1">
                    {top.title}
                  </span>
                  <span className="font-tech text-[10px] text-[#888]">{format(top.price)}</span>
                </button>
              );
            })}
          </div>

          {/* Size Variants */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-tech">
              <span className="text-[#888] uppercase">Size Variant:</span>
              <span className="text-white font-bold">{selectedTopSize}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.keys(selectedTop.sizes).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectTopSize(sz)}
                  className={`py-1.5 text-xs font-tech font-bold uppercase tracking-wider rounded-xs transition ${
                    selectedTopSize === sz
                      ? "bg-white text-black font-bold"
                      : "bg-[#161616] border border-[#222] text-[#888] hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colorways */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-tech text-[#888] uppercase">Color:</span>
            <div className="flex items-center gap-1.5">
              {selectedTop.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSelectTopColor(c.hex)}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    selectedTopColor === c.hex ? "border-[#f2342b] scale-110" : "border-[#333]"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Live Drape / Fit Feedback Card */}
          <div className="p-3 bg-[#111] border border-[#222] rounded-xs flex flex-col gap-1 font-tech">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#777] uppercase tracking-wider">CHEST FIT EVALUATION</span>
              <span className={`text-[10px] font-bold ${topFitEvaluation.tone}`}>
                {topFitEvaluation.rating}
              </span>
            </div>
            <span className="text-[11px] text-[#aaa] leading-relaxed">
              {topFitEvaluation.message}
            </span>
          </div>
        </div>

        {/* --- BOTTOM SILHOUETTE --- */}
        <div className="flex flex-col gap-3 border-t border-[#1a1a1a] pt-5">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs tracking-wider text-[#f2342b] uppercase font-bold">
              // BOTTOM SILHOUETTE
            </span>
            <span className="font-tech text-xs text-white font-bold">{format(selectedBottom.price)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {bottoms.map((bottom) => {
              const isSelected = selectedBottom.productId === bottom.productId;
              return (
                <button
                  key={bottom.productId}
                  type="button"
                  onClick={() => onSelectBottom(bottom)}
                  className={`relative p-2 text-left rounded-xs border transition flex flex-col gap-2 ${
                    isSelected
                      ? "border-[#f2342b] bg-[#141414]"
                      : "border-[#1e1e1e] bg-[#0e0e0e] hover:border-[#333]"
                  }`}
                >
                  <div className="relative w-full h-24 bg-black rounded-xs overflow-hidden">
                    <img src={bottom.image} alt={bottom.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f2342b]" />
                    )}
                  </div>
                  <span className="font-tech text-[11px] font-bold text-white line-clamp-1">
                    {bottom.title}
                  </span>
                  <span className="font-tech text-[10px] text-[#888]">{format(bottom.price)}</span>
                </button>
              );
            })}
          </div>

          {/* Size Variants */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-tech">
              <span className="text-[#888] uppercase">Size Variant:</span>
              <span className="text-white font-bold">{selectedBottomSize}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.keys(selectedBottom.sizes).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectBottomSize(sz)}
                  className={`py-1.5 text-xs font-tech font-bold uppercase tracking-wider rounded-xs transition ${
                    selectedBottomSize === sz
                      ? "bg-white text-black font-bold"
                      : "bg-[#161616] border border-[#222] text-[#888] hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colorways */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-tech text-[#888] uppercase">Color:</span>
            <div className="flex items-center gap-1.5">
              {selectedBottom.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSelectBottomColor(c.hex)}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    selectedBottomColor === c.hex ? "border-[#f2342b] scale-110" : "border-[#333]"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Waist / Hip Fit Card */}
          <div className="p-3 bg-[#111] border border-[#222] rounded-xs flex flex-col gap-1 font-tech">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#777] uppercase tracking-wider">WAIST / HIP FIT</span>
              <span className={`text-[10px] font-bold ${bottomFitEvaluation.tone}`}>
                {bottomFitEvaluation.rating}
              </span>
            </div>
            <span className="text-[11px] text-[#aaa] leading-relaxed">
              {bottomFitEvaluation.message}
            </span>
          </div>
        </div>

        {/* --- ACCESSORIES --- */}
        <div className="flex flex-col gap-3 border-t border-[#1a1a1a] pt-5">
          <span className="font-tech text-xs tracking-wider text-[#f2342b] uppercase font-bold">
            // ACCESSORIES & HARDWARE
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onToggleBag}
              className={`p-2.5 rounded-xs border text-left font-tech text-xs flex flex-col gap-1 transition ${
                hasBag
                  ? "border-[#f2342b] bg-[#141414] text-white"
                  : "border-[#222] bg-[#0c0c0c] text-[#777] hover:text-white"
              }`}
            >
              <span className="font-bold uppercase">Crossbody Bag</span>
              <span className="text-[10px] text-[#888]">{hasBag ? "Equipped (+₹3,499)" : "Off"}</span>
            </button>

            <button
              type="button"
              onClick={onToggleChain}
              className={`p-2.5 rounded-xs border text-left font-tech text-xs flex flex-col gap-1 transition ${
                hasChain
                  ? "border-[#f2342b] bg-[#141414] text-white"
                  : "border-[#222] bg-[#0c0c0c] text-[#777] hover:text-white"
              }`}
            >
              <span className="font-bold uppercase">Cuban Chain</span>
              <span className="text-[10px] text-[#888]">{hasChain ? "Equipped (+₹3,999)" : "Off"}</span>
            </button>
          </div>
        </div>

        {/* --- ADD COMPLETE FIT TO BAG --- */}
        <div className="border-t border-[#1a1a1a] pt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between font-tech">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#777] uppercase tracking-wider">COMPLETE LOOK TOTAL</span>
              <span className="text-xl font-bold text-white tracking-wide">{format(totalLookPrice)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>FREE WORLDWIDE SHIPPING</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddCompleteLook}
            className="w-full py-3.5 bg-[#f2342b] hover:bg-[#d82a22] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs shadow-lg shadow-[#f2342b]/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ADD COMPLETE 3D FIT TO BAG ({format(totalLookPrice)}) ↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
