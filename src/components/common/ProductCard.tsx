"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingBag, Sparkles, Check, ArrowRight } from "lucide-react";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    sale_price?: number | null;
    category_name?: string;
    images: string[];
    sizes: { size: string; stock: number }[];
    colors: { name: string; hex: string }[];
    gsm?: number;
    fit?: string;
    is_new_drop?: boolean;
    in_stock?: boolean;
  };
  aspectRatio?: string;
}

export default function ProductCard({ product, aspectRatio = "aspect-[3/4]" }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const { format } = useCurrency();
  const { isWishlisted, toggleWishlist } = useAuth();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0]?.size || "M"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Black"
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const mainImage = product.images[0] || "/brand/icon.svg";
  const hoverImage = product.images[1] || product.images[0] || "/brand/icon.svg";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.sale_price,
      image: mainImage,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] transition-all duration-300 rounded-xs overflow-hidden"
    >
      {/* Top Media Container */}
      <Link href={`/shop/${product.slug}`} className={`relative w-full ${aspectRatio} overflow-hidden bg-[#111]`}>
        {/* Main image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
            isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          style={{ backgroundImage: `url(${mainImage})` }}
        />

        {/* Hover image (Back view or model campaign shot) */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ backgroundImage: `url(${hoverImage})` }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_new_drop && (
            <span className="font-tech text-[9px] px-2 py-0.5 bg-[#f2342b] text-white font-bold tracking-widest uppercase rounded-xs">
              NEW DROP
            </span>
          )}
          {product.sale_price && (
            <span className="font-tech text-[9px] px-2 py-0.5 bg-white text-black font-bold tracking-widest uppercase rounded-xs">
              SALE
            </span>
          )}
          {product.gsm && (
            <span className="font-tech text-[9px] px-2 py-0.5 bg-[#080808]/80 backdrop-blur-sm text-[#aaa] font-bold tracking-widest uppercase border border-[#222] rounded-xs">
              {product.gsm} GSM
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-[#080808]/75 backdrop-blur-md border border-[#262626] text-[#aaa] hover:text-white transition z-20 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition ${
              wishlisted ? "fill-[#f2342b] text-[#f2342b]" : "hover:text-[#f2342b]"
            }`}
          />
        </button>

        {/* 3D Try-On Floating Pill */}
        <Link
          href={`/fitting-room?item=${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#080808]/85 backdrop-blur-md border border-[#333] hover:border-[#f2342b] text-white hover:text-[#f2342b] text-[10px] font-tech uppercase tracking-wider transition opacity-90 group-hover:opacity-100"
        >
          <Sparkles className="w-3 h-3 text-[#f2342b]" />
          <span>3D TRY ON</span>
        </Link>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between bg-[#0a0a0a]">
        <div>
          {/* Category & Color dots */}
          <div className="flex items-center justify-between">
            <span className="font-tech text-[10px] uppercase tracking-widest text-[#777]">
              {product.category_name || "HAII WEAES"}
            </span>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className={`w-2.5 h-2.5 rounded-full border transition ${
                      selectedColor === c.name ? "border-[#f2342b] scale-125" : "border-[#333]"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/shop/${product.slug}`}
            className="font-display text-base tracking-wide text-white hover:text-[#f2342b] transition line-clamp-1 block mt-1"
          >
            {product.title}
          </Link>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-tech text-xs font-bold text-white">
              {format(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="font-tech text-[11px] text-[#666] line-through">
                {format(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Pill List */}
        <div className="pt-2 border-t border-[#141414] flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 4).map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s.size)}
                className={`px-1.5 py-0.5 text-[9px] font-tech border rounded-2xs transition ${
                  selectedSize === s.size
                    ? "bg-white text-black font-bold border-white"
                    : "border-[#222] text-[#777] hover:border-[#444] hover:text-white"
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="p-1.5 rounded-xs bg-[#141414] hover:bg-[#f2342b] text-white transition border border-[#222] hover:border-[#f2342b] cursor-pointer"
            title="Quick Add to Bag"
          >
            {isAdding ? <Check className="w-3.5 h-3.5 text-white" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

