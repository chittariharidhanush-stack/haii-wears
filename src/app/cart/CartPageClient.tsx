"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowLeft
} from "lucide-react";

export default function CartPageClient() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shipping,
    total,
    promo,
    applyPromo,
    removePromo,
    itemCount
  } = useCart();

  const { format } = useCurrency();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) setPromoInput("");
  };

  const freeShippingThreshold = 2999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="w-16 h-16 text-[#333]" />
        <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-[#888]">
          YOUR BAG IS CURRENTLY EMPTY.
        </h1>
        <p className="font-tech text-xs text-[#666] max-w-md">
          Explore our latest collection drops or launch the 3D Virtual Fitting Room to build an outfit that matches your custom body proportions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link
            href="/shop"
            className="px-8 py-4 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest transition"
          >
            DISCOVER THE DROP ↗
          </Link>
          <Link
            href="/fitting-room"
            className="px-8 py-4 border border-[#f2342b] bg-[#f2342b]/10 text-white hover:bg-[#f2342b] font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#f2342b]" />
            <span>3D FITTING STUDIO</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-6">
        <div className="flex flex-col gap-1">
          <span className="font-tech text-xs text-[#f2342b] uppercase tracking-widest font-bold">
            CLIENT CHECKOUT PREVIEW
          </span>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight uppercase leading-none">
            SHOPPING BAG [{itemCount}]
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="font-tech text-xs text-[#777] hover:text-red-400 uppercase tracking-wider underline cursor-pointer"
        >
          CLEAR BAG
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="p-4 bg-[#111] border border-[#222] rounded-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-tech uppercase tracking-wider">
          <span className="flex items-center gap-2 text-white">
            <Truck className="w-4 h-4 text-[#f2342b]" />
            {freeShippingRemaining === 0 ? (
              <span className="text-emerald-400 font-bold">FREE WORLDWIDE EXPRESS SHIPPING UNLOCKED</span>
            ) : (
              <span>ADD {format(freeShippingRemaining)} MORE FOR COMPLIMENTARY EXPRESS SHIPPING</span>
            )}
          </span>
          <span className="text-white font-bold">{freeShippingPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
          <div className="h-full bg-[#f2342b] transition-all duration-300" style={{ width: `${freeShippingPercent}%` }} />
        </div>
      </div>

      {/* Main Grid: Items Left (7 cols), Summary Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 border border-[#1a1a1a] bg-[#0c0c0c] rounded-xs flex flex-col sm:flex-row gap-5 items-start justify-between"
            >
              {/* Image & Title */}
              <div className="flex gap-4">
                <Link
                  href={`/shop/${item.slug}`}
                  className="w-24 h-32 bg-cover bg-center rounded-xs shrink-0 border border-[#222]"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-display text-xl tracking-wide uppercase text-white hover:text-[#f2342b] transition"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 font-tech text-xs mt-1 text-[#aaa]">
                      <span>SIZE: {item.size}</span>
                      <span>·</span>
                      <span>COLOR: {item.color}</span>
                    </div>
                  </div>

                  <div className="font-display text-xl text-white mt-2">
                    {format(item.salePrice || item.price)}
                    {item.salePrice && (
                      <span className="font-tech text-xs text-[#666] line-through ml-2">
                        {format(item.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Counter & Actions */}
              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                <div className="flex items-center border border-[#262626] bg-[#141414] rounded-xs">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-[#888] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-tech text-xs px-3 font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-[#888] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/fitting-room?item=${item.productId}`}
                    className="text-[#888] hover:text-[#f2342b] text-[11px] font-tech uppercase tracking-wider flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#f2342b]" />
                    <span>TRY IN 3D</span>
                  </Link>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#888] hover:text-red-400 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-tech text-xs text-[#aaa] hover:text-white uppercase tracking-wider pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>CONTINUE BROWSING ARCHIVE</span>
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-6 sticky top-24">
          <span className="font-display text-2xl tracking-wide uppercase text-white border-b border-[#1a1a1a] pb-4">
            BAG SUMMARY
          </span>

          {/* Promo Code Form */}
          <div className="flex flex-col gap-2">
            <span className="font-tech text-xs text-[#777] uppercase tracking-wider">
              PROMOTIONAL CODE
            </span>
            {promo ? (
              <div className="p-2.5 bg-[#141414] border border-[#f2342b]/40 rounded-xs flex items-center justify-between text-xs font-tech">
                <span className="text-[#f2342b] font-bold">
                  {promo.code} ({promo.discountPercentage}% OFF)
                </span>
                <button onClick={removePromo} className="text-[#888] hover:text-white underline text-[10px]">
                  REMOVE
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="CODE (HAII10, DROP20)"
                  className="flex-1 bg-[#141414] border border-[#222] px-3 py-2 text-xs font-tech text-white uppercase focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#222] hover:bg-white hover:text-black font-tech text-xs uppercase font-bold transition rounded-xs"
                >
                  APPLY
                </button>
              </form>
            )}
            {promoMessage && (
              <span className={`font-tech text-[10px] ${promoMessage.error ? "text-red-400" : "text-emerald-400"}`}>
                {promoMessage.text}
              </span>
            )}
          </div>

          {/* Breakdown */}
          <div className="flex flex-col gap-2.5 font-tech text-xs pt-3 border-t border-[#1a1a1a]">
            <div className="flex justify-between text-[#888]">
              <span>SUBTOTAL:</span>
              <span className="text-white font-bold">{format(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#f2342b]">
                <span>DISCOUNT ({promo?.code}):</span>
                <span>-{format(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#888]">
              <span>SHIPPING:</span>
              <span className="text-white">{shipping === 0 ? "FREE" : format(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-[#1a1a1a]">
              <span>ESTIMATED TOTAL:</span>
              <span className="font-display text-2xl tracking-wider text-white">
                {format(total)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full py-4 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest text-center transition flex items-center justify-center gap-2 rounded-xs"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 font-tech text-[10px] text-[#666]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-BIT ENCRYPTED · NO CARDS STORED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

