"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, Printer, Truck, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export default function OrderSuccessClient({ order }: { order: any }) {
  const { format } = useCurrency();

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f2342b", "#ffffff", "#333333"]
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-10">
      {/* Confirmation Banner */}
      <div className="p-8 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CheckCircle2 className="w-12 h-12 text-[#f2342b] shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-tech text-xs text-[#f2342b] uppercase tracking-widest font-bold">
              ORDER CONFIRMED // ALLOCATED IN ARCHIVE
            </span>
            <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-white">
              THANK YOU, {order.customer_name.split(" ")[0]}
            </h1>
            <span className="font-tech text-xs text-[#888]">
              ORDER NO: <strong className="text-white">{order.order_number}</strong> · CONFIRMATION DISPATCHED TO {order.customer_email}
            </span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 border border-[#333] hover:border-white text-xs font-tech uppercase tracking-widest flex items-center gap-2 rounded-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT INVOICE</span>
        </button>
      </div>

      {/* Order Details & Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Purchased Items (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <span className="font-tech text-xs uppercase tracking-widest text-[#888] font-bold border-b border-[#1a1a1a] pb-2">
            PURCHASED ARCHIVAL PIECES
          </span>

          <div className="flex flex-col gap-3">
            {order.items.map((it: any) => (
              <div
                key={it.id}
                className="p-4 border border-[#1a1a1a] bg-[#0b0b0b] rounded-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-20 bg-cover bg-center rounded-2xs border border-[#222] shrink-0"
                    style={{ backgroundImage: `url(${it.product_image})` }}
                  />
                  <div className="flex flex-col">
                    <span className="font-display text-lg text-white uppercase tracking-wide">
                      {it.product_title}
                    </span>
                    <span className="font-tech text-xs text-[#777]">
                      SIZE: {it.size} · COLOR: {it.color} · QTY: {it.quantity}
                    </span>
                  </div>
                </div>

                <span className="font-tech text-xs font-bold text-white">
                  {format(it.total_price)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#111] border border-[#1f1f1f] rounded-xs flex flex-col gap-2 font-tech text-xs">
            <div className="flex justify-between text-[#888]">
              <span>SUBTOTAL:</span>
              <span className="text-white font-bold">{format(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#f2342b]">
                <span>DISCOUNT:</span>
                <span>-{format(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#888]">
              <span>SHIPPING:</span>
              <span className="text-white">{order.shipping_fee === 0 ? "FREE" : format(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#1a1a1a]">
              <span>PAID TOTAL:</span>
              <span className="font-display text-2xl text-white">{format(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4 font-tech text-xs">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold border-b border-[#1a1a1a] pb-2">
              DISPATCH DESTINATION
            </span>

            <div className="flex flex-col text-[#aaa] leading-relaxed">
              <span className="text-white font-bold">{order.customer_name}</span>
              <span>{order.shipping_address.address_line1}</span>
              {order.shipping_address.address_line2 && <span>{order.shipping_address.address_line2}</span>}
              <span>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</span>
              <span>{order.shipping_address.country}</span>
              <span className="text-[#666] mt-1">{order.customer_phone}</span>
            </div>

            <div className="pt-2 border-t border-[#1a1a1a] flex flex-col gap-1 text-[#888]">
              <div className="flex justify-between">
                <span>PAYMENT METHOD:</span>
                <span className="text-white font-bold">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT STATUS:</span>
                <span className="text-emerald-400 font-bold">{order.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span>FULFILMENT:</span>
                <span className="text-amber-400 font-bold">{order.fulfilment_status}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/track-order?order=${order.order_number}&email=${encodeURIComponent(order.customer_email)}`}
              className="w-full py-4 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest text-center transition flex items-center justify-center gap-2 rounded-xs"
            >
              <Truck className="w-4 h-4" />
              <span>LIVE CARGO TRACKING ↗</span>
            </Link>

            <Link
              href="/fitting-room"
              className="w-full py-3 border border-[#333] hover:border-[#f2342b] text-[#aaa] hover:text-white font-tech text-xs uppercase tracking-widest text-center transition flex items-center justify-center gap-2 rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f2342b]" />
              <span>EXPLORE 3D VIRTUAL FITTING STUDIO</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

