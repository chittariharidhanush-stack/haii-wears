"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, Copy, Check } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const TRACKING_STEPS = [
  { key: "PENDING", label: "ORDER PLACED", desc: "Silhouettes reserved in archive" },
  { key: "PROCESSING", label: "PACKED & INSPECTED", desc: "Hand-finished & barcode registered" },
  { key: "SHIPPED", label: "DISPATCHED / AIR TRANSIT", desc: "Transferred to international hub" },
  { key: "DELIVERED", label: "DELIVERED", desc: "Package signed & received" }
];

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";
  const initialEmail = searchParams.get("email") || "";

  const [orderQuery, setOrderQuery] = useState(initialOrder);
  const [emailQuery, setEmailQuery] = useState(initialEmail);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { format } = useCurrency();

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setError("No order matching this identifier was located in our database.");
        setOrderData(null);
      } else {
        setOrderData(data.order);
      }
    } catch {
      setError("Network error while connecting to tracking API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      handleLookup();
    }
  }, [initialOrder]);

  const getStepIndex = (status: string) => {
    if (status === "DELIVERED") return 3;
    if (status === "SHIPPED") return 2;
    if (status === "PROCESSING") return 1;
    return 0;
  };

  const copyTracking = () => {
    if (!orderData?.tracking_number) return;
    navigator.clipboard.writeText(orderData.tracking_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-14 flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center items-center">
        <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
          // LIVE DISPATCH RADAR
        </span>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight uppercase">
          TRACK SHIPMENT STATUS
        </h1>
        <p className="font-tech text-xs text-[#888] tracking-widest uppercase max-w-md">
          Enter your HAII WEAES order number (e.g. HW-ORD-78210) to access real-time courier telemetry.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto w-full">
        <input
          type="text"
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value)}
          placeholder="ENTER ORDER NUMBER (E.G. HW-ORD-78210)"
          required
          className="flex-1 bg-[#111] border border-[#222] px-4 py-3.5 text-xs font-tech text-white uppercase placeholder-[#555] focus:outline-none focus:border-[#f2342b] rounded-xs"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? "SEARCHING..." : "TRACK SHIPMENT"}</span>
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 text-red-400 font-tech text-xs rounded-xs flex items-center justify-center gap-2 max-w-xl mx-auto w-full">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {orderData && (
        <div className="p-6 md:p-8 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-8 shadow-2xl animate-in fade-in">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a1a] pb-6">
            <div className="flex flex-col gap-1">
              <span className="font-tech text-xs text-[#f2342b] uppercase font-bold">
                ORDER NO: {orderData.order_number}
              </span>
              <span className="font-display text-2xl md:text-3xl uppercase text-white">
                CURRENT STATUS: {orderData.fulfilment_status}
              </span>
              <span className="font-tech text-xs text-[#777]">
                DISPATCHED TO: {orderData.shipping_address?.city}, {orderData.shipping_address?.country}
              </span>
            </div>

            {orderData.tracking_number && (
              <div className="p-3 bg-[#141414] border border-[#262626] rounded-xs flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-tech text-[10px] text-[#777] uppercase">CARRIER: {orderData.carrier || "DHL"}</span>
                  <span className="font-tech text-xs text-white font-bold">{orderData.tracking_number}</span>
                </div>
                <button
                  onClick={copyTracking}
                  className="p-1.5 text-[#888] hover:text-white transition"
                  title="Copy Tracking Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Progress Timeline Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {TRACKING_STEPS.map((step, idx) => {
              const currentStepIdx = getStepIndex(orderData.fulfilment_status);
              const isPastOrCurrent = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={step.key}
                  className={`p-4 border rounded-xs flex flex-col gap-2 transition ${
                    isCurrent
                      ? "border-[#f2342b] bg-[#141414]"
                      : isPastOrCurrent
                      ? "border-[#333] bg-[#0f0f0f]"
                      : "border-[#1a1a1a] bg-[#080808] opacity-40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-[10px] text-[#f2342b] font-bold">
                      STAGE 0{idx + 1}
                    </span>
                    {isPastOrCurrent && <CheckCircle2 className="w-4 h-4 text-[#f2342b]" />}
                  </div>
                  <span className="font-tech text-xs font-bold text-white uppercase">
                    {step.label}
                  </span>
                  <span className="font-tech text-[10px] text-[#777]">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Purchased Items in This Shipment */}
          <div className="pt-4 border-t border-[#1a1a1a] flex flex-col gap-3">
            <span className="font-tech text-xs uppercase tracking-widest text-[#888] font-bold">
              PIECES IN THIS SHIPMENT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {orderData.items?.map((it: any) => (
                <div key={it.id} className="p-3 border border-[#1a1a1a] bg-[#111] rounded-xs flex items-center gap-3">
                  <div
                    className="w-12 h-14 bg-cover bg-center rounded-2xs border border-[#222] shrink-0"
                    style={{ backgroundImage: `url(${it.product_image})` }}
                  />
                  <div className="flex flex-col">
                    <span className="font-tech text-xs font-bold text-white uppercase truncate">{it.product_title}</span>
                    <span className="font-tech text-[10px] text-[#777]">
                      SIZE: {it.size} · COLOR: {it.color} · QTY: {it.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

