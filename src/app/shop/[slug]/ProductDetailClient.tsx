"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/common/ProductCard";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  X,
  Maximize2,
  Share2
} from "lucide-react";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { format } = useCurrency();
  const { isWishlisted, toggleWishlist } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "Black");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("fabric");
  const [measurementUnit, setMeasurementUnit] = useState<"cm" | "in">("cm");

  const wishlisted = isWishlisted(product.id);

  const images = product.images.length > 0 ? product.images : ["/brand/icon.svg"];
  const currentImage = images[selectedImageIndex] || images[0];

  const currentSizeObj = product.sizes.find((s: any) => s.size === selectedSize);
  const currentStock = currentSizeObj?.stock ?? 10;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);

    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.sale_price,
      image: currentImage,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 400);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    setIsBuyingNow(true);

    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.sale_price,
      image: currentImage,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    setTimeout(() => {
      router.push("/checkout");
    }, 200);
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-tech text-xs text-[#666] uppercase tracking-wider">
        <Link href="/" className="hover:text-white transition">HOME</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
        <Link href="/shop" className="hover:text-white transition">SHOP</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
        <Link href={`/shop?category=${product.category_slug}`} className="hover:text-white transition">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
        <span className="text-white truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: MULTI-IMAGE GALLERY (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails Column */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 md:w-20 md:h-26 bg-cover bg-center rounded-xs border transition cursor-pointer shrink-0 ${
                    selectedImageIndex === idx ? "border-[#f2342b] opacity-100" : "border-[#222] opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          )}

          {/* Main Selected Image Viewport */}
          <div className="relative flex-1 aspect-[3/4] bg-[#0d0d0d] border border-[#1f1f1f] rounded-xs overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-500 cursor-zoom-in"
              style={{ backgroundImage: `url(${currentImage})` }}
              onClick={() => setZoomModalOpen(true)}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {product.is_new_drop && (
                <span className="font-tech text-[10px] px-2.5 py-1 bg-[#f2342b] text-white font-bold tracking-widest uppercase rounded-xs">
                  NEW DROP
                </span>
              )}
              {product.gsm && (
                <span className="font-tech text-[10px] px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#aaa] font-bold tracking-widest uppercase border border-[#333] rounded-xs">
                  {product.gsm} GSM
                </span>
              )}
            </div>

            {/* Zoom Button */}
            <button
              onClick={() => setZoomModalOpen(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 backdrop-blur-md border border-[#333] text-[#aaa] hover:text-white transition z-10 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* 3D Try-On Quick Callout Pill */}
            <Link
              href={`/fitting-room?item=${product.id}`}
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 bg-black/90 backdrop-blur-md border border-[#f2342b] text-white rounded-xs z-10 hover:bg-[#f2342b] transition group/pill"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f2342b] group-hover/pill:text-white" />
                <span className="font-tech text-xs font-bold tracking-widest uppercase">
                  SEE HOW THIS PIECE SUITS YOU IN 3D
                </span>
              </div>
              <span className="font-tech text-[10px] uppercase font-bold text-[#f2342b] group-hover/pill:text-white underline">
                LAUNCH 3D STUDIO ↗
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT SPECIFICATIONS & CHECKOUT ACTIONS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Header & Pricing */}
          <div className="flex flex-col gap-2 border-b border-[#1a1a1a] pb-6">
            <span className="font-tech text-xs text-[#f2342b] uppercase tracking-widest font-bold">
              {product.category_name} // HAII WEAES
            </span>

            <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mt-1">
              <span className="font-display text-3xl tracking-wider text-white">
                {format(product.sale_price || product.price)}
              </span>
              {product.sale_price && (
                <span className="font-tech text-sm text-[#777] line-through">
                  {format(product.price)}
                </span>
              )}
              {product.sale_price && (
                <span className="font-tech text-xs px-2 py-0.5 bg-[#f2342b]/20 border border-[#f2342b]/40 text-[#f2342b] font-bold">
                  SAVE {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                </span>
              )}
            </div>

            <p className="font-tech text-xs text-[#999] leading-relaxed mt-2">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-tech text-xs uppercase tracking-widest text-[#888]">COLORWAY</span>
                <span className="font-tech text-xs text-white font-bold">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c: any) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 border rounded-xs font-tech text-xs flex items-center gap-2 transition ${
                      selectedColor === c.name
                        ? "border-[#f2342b] bg-[#161616] text-white"
                        : "border-[#262626] text-[#888] hover:border-[#444]"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/50" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector & Size Guide */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-tech text-xs uppercase tracking-widest text-[#888]">
                SELECT SIZE
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="font-tech text-xs text-[#aaa] hover:text-[#f2342b] transition flex items-center gap-1 underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>SIZE GUIDE & MEASUREMENTS</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s: any) => {
                const isSelected = selectedSize === s.size;
                const isSoldOut = s.stock <= 0;

                return (
                  <button
                    key={s.size}
                    onClick={() => !isSoldOut && setSelectedSize(s.size)}
                    disabled={isSoldOut}
                    className={`py-3 text-center font-tech text-xs uppercase tracking-wider border rounded-xs transition relative ${
                      isSoldOut
                        ? "border-[#1c1c1c] text-[#444] bg-[#0c0c0c] cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-white text-black font-bold border-white"
                        : "border-[#262626] bg-[#111] text-[#aaa] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    {s.size}
                    {s.stock > 0 && s.stock <= 5 && (
                      <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-[#f2342b]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inventory Status Note */}
            <div className="font-tech text-[11px] text-[#888] pt-1">
              {isOutOfStock ? (
                <span className="text-red-400 font-bold">SOLD OUT IN SELECTED SIZE</span>
              ) : currentStock <= 5 ? (
                <span className="text-amber-400 font-bold">ONLY {currentStock} PIECES LEFT IN SIZE {selectedSize}</span>
              ) : (
                <span className="text-emerald-400">✓ IN STOCK · READY FOR IMMEDIATE DISPATCH</span>
              )}
            </div>
          </div>

          {/* 3D VIRTUAL TRY-ON CALLOUT BUTTON */}
          <Link
            href={`/fitting-room?item=${product.id}`}
            className="w-full py-3.5 px-4 bg-[#f2342b]/10 border border-[#f2342b] hover:bg-[#f2342b] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs group"
          >
            <Sparkles className="w-4 h-4 text-[#f2342b] group-hover:text-white" />
            <span>SEE HOW IT SUITS YOU IN 3D FITTING ROOM ↗</span>
          </Link>

          {/* Quantity Selector & Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#262626] bg-[#111] rounded-xs px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#888] hover:text-white"
                >
                  -
                </button>
                <span className="font-tech text-xs px-3 font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="p-2 text-[#888] hover:text-white"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`flex-1 py-4 font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs cursor-pointer ${
                  isOutOfStock
                    ? "bg-[#222] text-[#666] cursor-not-allowed"
                    : isAdding
                    ? "bg-emerald-500 text-black"
                    : "bg-white text-black hover:bg-[#f2342b] hover:text-white"
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? "OUT OF STOCK" : "ADD TO BAG"}
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-4 border border-[#262626] hover:border-[#f2342b] bg-[#111] rounded-xs text-[#aaa] hover:text-white transition"
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-[#f2342b] text-[#f2342b]" : ""}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="w-full py-3.5 border border-[#333] hover:border-white text-white font-tech text-xs uppercase tracking-widest transition text-center rounded-xs cursor-pointer"
              >
                {isBuyingNow ? "REDIRECTING TO CHECKOUT..." : "EXPRESS BUY NOW ↗"}
              </button>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1a1a1a] font-tech text-[11px] text-[#888]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#f2342b]" />
              <span>FREE SHIPPING OVER ₹2,999</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#f2342b]" />
              <span>30-DAY COMPLIMENTARY EXCHANGES</span>
            </div>
          </div>

          {/* Technical Spec Accordions */}
          <div className="border-t border-[#1a1a1a] flex flex-col">
            {/* Fabric & Architecture */}
            <div className="border-b border-[#1a1a1a]">
              <button
                onClick={() => toggleAccordion("fabric")}
                className="w-full py-4 flex items-center justify-between font-tech text-xs uppercase tracking-wider text-white hover:text-[#f2342b] transition"
              >
                <span>FABRIC & ARCHITECTURAL SPECS</span>
                <span>{activeAccordion === "fabric" ? "−" : "+"}</span>
              </button>
              {activeAccordion === "fabric" && (
                <div className="pb-4 font-tech text-xs text-[#999] flex flex-col gap-2">
                  <p>{product.fabric_details || "100% Combed Heavy Cotton."}</p>
                  <p>FIT: {product.fit || "Oversized Streetwear Silhouette"}</p>
                  {product.gsm && <p>WEIGHT: {product.gsm} GSM heavy loopback structure.</p>}
                  <p>CARE: Cold machine wash inside-out. Do not tumble dry. Iron on reverse.</p>
                </div>
              )}
            </div>

            {/* Worldwide Dispatch & Customs */}
            <div className="border-b border-[#1a1a1a]">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full py-4 flex items-center justify-between font-tech text-xs uppercase tracking-wider text-white hover:text-[#f2342b] transition"
              >
                <span>WORLDWIDE DISPATCH & SHIPPING</span>
                <span>{activeAccordion === "shipping" ? "−" : "+"}</span>
              </button>
              {activeAccordion === "shipping" && (
                <div className="pb-4 font-tech text-xs text-[#999] flex flex-col gap-2">
                  <p>DOMESTIC (INDIA): 2-4 Business Days via Blue Dart Air.</p>
                  <p>INTERNATIONAL: 4-7 Business Days via DHL Express Priority.</p>
                  <p>All international orders include duty prepaid and full cargo tracking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS / COMPLETE THE FIT */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#1a1a1a] pt-16 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-tech text-xs text-[#f2342b] uppercase tracking-widest font-bold block mb-1">
                // COMPLEMENTARY SILHOUETTES
              </span>
              <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
                COMPLETE THE FIT
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-tech text-xs text-[#aaa] hover:text-white uppercase tracking-widest underline"
            >
              VIEW ALL ARCHIVE
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-[#222] p-6 md:p-8 max-w-xl w-full rounded-xs flex flex-col gap-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#f2342b]" />
                <span className="font-display text-2xl tracking-wider uppercase text-white">
                  GARMENT SIZE GUIDE & SPECS
                </span>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Unit Switcher */}
            <div className="flex items-center justify-between font-tech text-xs">
              <span className="text-[#888]">MEASUREMENT UNITS:</span>
              <div className="flex border border-[#333] rounded-xs overflow-hidden">
                <button
                  onClick={() => setMeasurementUnit("cm")}
                  className={`px-3 py-1 ${measurementUnit === "cm" ? "bg-white text-black font-bold" : "text-[#888]"}`}
                >
                  CM
                </button>
                <button
                  onClick={() => setMeasurementUnit("in")}
                  className={`px-3 py-1 ${measurementUnit === "in" ? "bg-white text-black font-bold" : "text-[#888]"}`}
                >
                  INCHES
                </button>
              </div>
            </div>

            {/* Measurement Table */}
            <div className="overflow-x-auto">
              <table className="w-full font-tech text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222] text-[#888]">
                    <th className="py-2.5">SIZE</th>
                    <th className="py-2.5">CHEST</th>
                    <th className="py-2.5">LENGTH</th>
                    <th className="py-2.5">SHOULDER</th>
                    <th className="py-2.5">SLEEVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {[
                    { s: "S", chest: measurementUnit === "cm" ? "116" : '45.6"', len: measurementUnit === "cm" ? "70" : '27.5"', sh: measurementUnit === "cm" ? "56" : '22.0"', sl: measurementUnit === "cm" ? "62" : '24.4"' },
                    { s: "M", chest: measurementUnit === "cm" ? "122" : '48.0"', len: measurementUnit === "cm" ? "73" : '28.7"', sh: measurementUnit === "cm" ? "58" : '22.8"', sl: measurementUnit === "cm" ? "63" : '24.8"' },
                    { s: "L", chest: measurementUnit === "cm" ? "128" : '50.4"', len: measurementUnit === "cm" ? "76" : '29.9"', sh: measurementUnit === "cm" ? "61" : '24.0"', sl: measurementUnit === "cm" ? "64" : '25.2"' },
                    { s: "XL", chest: measurementUnit === "cm" ? "134" : '52.7"', len: measurementUnit === "cm" ? "78" : '30.7"', sh: measurementUnit === "cm" ? "64" : '25.1"', sl: measurementUnit === "cm" ? "65" : '25.6"' },
                    { s: "XXL", chest: measurementUnit === "cm" ? "140" : '55.1"', len: measurementUnit === "cm" ? "80" : '31.5"', sh: measurementUnit === "cm" ? "66" : '26.0"', sl: measurementUnit === "cm" ? "66" : '26.0"' }
                  ].map((row) => (
                    <tr key={row.s} className={selectedSize === row.s ? "text-[#f2342b] font-bold" : "text-[#ccc]"}>
                      <td className="py-2">{row.s}</td>
                      <td className="py-2">{row.chest}</td>
                      <td className="py-2">{row.len}</td>
                      <td className="py-2">{row.sh}</td>
                      <td className="py-2">{row.sl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#141414] p-3 rounded-xs font-tech text-[11px] text-[#aaa] flex items-center justify-between">
              <span>WANT TO VERIFY FIT DYNAMICS IN 3D?</span>
              <Link
                href={`/fitting-room?item=${product.id}`}
                onClick={() => setSizeGuideOpen(false)}
                className="text-[#f2342b] underline uppercase font-bold"
              >
                OPEN 3D STUDIO ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {zoomModalOpen && (
        <div
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 text-white bg-black/60 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={currentImage}
            alt={product.title}
            className="max-w-full max-h-[90vh] object-contain select-none"
          />
        </div>
      )}
    </div>
  );
}
