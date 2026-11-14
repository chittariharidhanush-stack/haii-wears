"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateItemOptions,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-[#1a1a1a] text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f2342b]" />
              <span className="font-display text-2xl tracking-wider">
                SHOPPING BAG [{itemCount < 10 ? `0${itemCount}` : itemCount}]
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#888] hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#111111] border-b border-[#1f1f1f]">
            <div className="flex items-center justify-between text-[11px] font-tech uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5 text-[#aaa]">
                <Truck className="w-3.5 h-3.5 text-[#f2342b]" />
                {freeShippingRemaining === 0 ? (
                  <span className="text-emerald-400 font-bold">YOU UNLOCKED FREE WORLDWIDE EXPRESS SHIPPING</span>
                ) : (
                  <span>ADD {format(freeShippingRemaining)} FOR FREE SHIPPING</span>
                )}
              </span>
              <span className="text-white font-bold">{freeShippingPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f2342b] transition-all duration-300"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-4">
                <ShoppingBag className="w-12 h-12 text-[#333]" />
                <span className="font-display text-2xl tracking-wider text-[#888]">
                  YOUR BAG IS CURRENTLY EMPTY.
                </span>
                <p className="font-tech text-xs text-[#666] max-w-xs">
                  Discover our newest nocturnal collection drops or try on silhouettes in the 3D Fitting Room.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-xs">
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="flex-1 py-3 text-center text-xs font-tech font-bold uppercase tracking-widest bg-white text-black hover:bg-[#f2342b] hover:text-white transition"
                  >
                    SHOP THE DROP ↗
                  </Link>
                  <Link
                    href="/fitting-room"
                    onClick={closeCart}
                    className="flex-1 py-3 text-center text-xs font-tech font-bold uppercase tracking-widest border border-[#333] hover:border-[#f2342b] text-white transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#f2342b]" />
                    3D TRY-ON
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 border border-[#1a1a1a] bg-[#0e0e0e] rounded-xs flex gap-3.5 relative group"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="w-20 h-24 bg-cover bg-center rounded-xs shrink-0 border border-[#222]"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between pr-6">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-base tracking-wide text-white hover:text-[#f2342b] transition line-clamp-1"
                        >
                          {item.title}
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-tech text-xs font-bold text-white">
                          {format(item.salePrice || item.price)}
                        </span>
                        {item.salePrice && (
                          <span className="font-tech text-[10px] text-[#666] line-through">
                            {format(item.price)}
                          </span>
                        )}
                      </div>

                      {/* Size & Color Tags */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-tech text-[10px] px-1.5 py-0.5 bg-[#181818] border border-[#2a2a2a] text-[#ccc]">
                          SIZE: {item.size}
                        </span>
                        <span className="font-tech text-[10px] px-1.5 py-0.5 bg-[#181818] border border-[#2a2a2a] text-[#ccc]">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#262626] bg-[#141414] rounded-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#888] hover:text-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-tech text-xs px-2.5 text-white font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#888] hover:text-white transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/fitting-room?item=${item.productId}`}
                          onClick={closeCart}
                          title="Try this piece in 3D Fitting Room"
                          className="p-1.5 text-[#888] hover:text-[#f2342b] transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-[#888] hover:text-[#f2342b] transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#1a1a1a] bg-[#0c0c0c] flex flex-col gap-3">
              {/* Promo Code Input */}
              <div>
                {promo ? (
                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] border border-[#f2342b]/40 rounded-xs text-xs font-tech">
                    <span className="text-[#f2342b] font-bold">
                      PROMO: {promo.code} ({promo.discountPercentage}% OFF)
                    </span>
                    <button
                      onClick={removePromo}
                      className="text-[#888] hover:text-white text-[10px] uppercase underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="PROMO CODE (E.G. HAII10, AFTERDARK)"
                      className="flex-1 bg-[#141414] border border-[#222] px-3 py-2 text-xs font-tech text-white placeholder-[#555] uppercase focus:outline-none focus:border-[#f2342b]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#222] hover:bg-white hover:text-black text-xs font-tech font-bold uppercase transition"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <span
                    className={`font-tech text-[10px] block mt-1 ${
                      promoMessage.error ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {promoMessage.text}
                  </span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-1.5 font-tech text-xs pt-2 border-t border-[#1a1a1a]">
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
                  <span>ESTIMATED SHIPPING:</span>
                  <span className="text-white">
                    {shipping === 0 ? "FREE" : format(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#1a1a1a]">
                  <span>TOTAL:</span>
                  <span className="font-display text-xl text-white tracking-wider">
                    {format(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest text-center transition flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 border border-[#222] hover:border-[#444] text-[#888] hover:text-white font-tech text-xs uppercase tracking-widest text-center transition"
                >
                  VIEW FULL BAG DETAILS
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] font-tech text-[#666] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ENCRYPTED 256-BIT CHECKOUT
                </span>
                <span>·</span>
                <span>AUTHENTICITY GUARANTEED</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
