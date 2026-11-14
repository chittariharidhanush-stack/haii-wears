"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  Truck,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Trash2
} from "lucide-react";

export default function AccountClient() {
  const router = useRouter();
  const { user, logout, wishlistIds, toggleWishlist } = useAuth();
  const { format } = useCurrency();
  const { addItem, openCart } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/account/login");
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchOrders();
  }, [user, router]);

  // Fetch wishlist product objects
  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlistIds.length === 0) {
        setWishlistProducts([]);
        return;
      }
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const matched = (data.products || []).filter((p: any) =>
            wishlistIds.includes(p.id)
          );
          setWishlistProducts(matched);
        }
      } catch {}
    }

    fetchWishlistProducts();
  }, [wishlistIds]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      {/* Header Profile Bar */}
      <div className="p-6 md:p-8 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center font-display text-2xl text-white">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-tech text-xs text-[#f2342b] uppercase font-bold tracking-widest">
              CLIENT PROFILE // {user.role}
            </span>
            <h1 className="font-display text-3xl md:text-4xl uppercase text-white">
              {user.name}
            </h1>
            <span className="font-tech text-xs text-[#888]">
              {user.email} {user.phone && `· ${user.phone}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-[#f2342b] text-white font-tech text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-[#d62828] transition"
            >
              ADMIN DASHBOARD ↗
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-[#333] hover:border-red-500 hover:text-red-400 font-tech text-xs uppercase tracking-wider flex items-center gap-2 rounded-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1a1a1a]">
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-3 px-6 font-tech text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition ${
            activeTab === "orders"
              ? "border-[#f2342b] text-white font-bold"
              : "border-transparent text-[#777] hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>ORDER HISTORY ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`py-3 px-6 font-tech text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition ${
            activeTab === "wishlist"
              ? "border-[#f2342b] text-white font-bold"
              : "border-transparent text-[#777] hover:text-white"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>WISHLIST ({wishlistIds.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-6">
          {loadingOrders ? (
            <div className="py-20 text-center font-tech text-xs text-[#888] tracking-widest">
              QUERYING ARCHIVE ORDERS...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-[#1a1a1a] rounded-xs p-8">
              <Package className="w-12 h-12 text-[#333]" />
              <span className="font-display text-2xl uppercase text-[#888]">
                NO ORDERS PLACED YET
              </span>
              <p className="font-tech text-xs text-[#666] max-w-sm">
                Your archive order history is currently empty. Explore our newest releases or test fits in 3D.
              </p>
              <Link
                href="/shop"
                className="px-6 py-3 bg-white text-black font-tech text-xs uppercase font-bold tracking-widest hover:bg-[#f2342b] hover:text-white transition mt-2"
              >
                BROWSE ARCHIVE ↗
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4 shadow-lg"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a] pb-4">
                  <div className="flex flex-col">
                    <span className="font-tech text-xs text-[#f2342b] font-bold">
                      ORDER: {o.order_number}
                    </span>
                    <span className="font-tech text-[11px] text-[#777]">
                      DATE: {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-tech text-xs px-2.5 py-1 bg-[#161616] border border-[#262626] text-white uppercase">
                      STATUS: {o.fulfilment_status}
                    </span>
                    <span className="font-display text-xl text-white">
                      {format(o.total)}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="flex flex-col gap-3">
                  {o.items?.map((it: any) => (
                    <div key={it.id} className="flex items-center justify-between gap-3 text-xs font-tech">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-14 bg-cover bg-center rounded-2xs border border-[#222] shrink-0"
                          style={{ backgroundImage: `url(${it.product_image})` }}
                        />
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{it.product_title}</span>
                          <span className="text-[#777] text-[10px]">
                            SIZE: {it.size} · COLOR: {it.color} · QTY: {it.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-white font-bold">{format(it.total_price)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Action */}
                <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3 font-tech text-xs">
                  <span className="text-[#777]">
                    DELIVERING TO: {o.shipping_address?.city}, {o.shipping_address?.country}
                  </span>
                  <Link
                    href={`/track-order?order=${o.order_number}&email=${encodeURIComponent(o.customer_email)}`}
                    className="text-white hover:text-[#f2342b] font-bold uppercase underline flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>TRACK SHIPMENT ↗</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: WISHLIST */}
      {activeTab === "wishlist" && (
        <div className="flex flex-col gap-6">
          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-[#1a1a1a] rounded-xs p-8">
              <Heart className="w-12 h-12 text-[#333]" />
              <span className="font-display text-2xl uppercase text-[#888]">
                YOUR WISHLIST IS EMPTY
              </span>
              <p className="font-tech text-xs text-[#666] max-w-sm">
                Save your favorite pieces by clicking the heart on any silhouette.
              </p>
              <Link
                href="/shop"
                className="px-6 py-3 bg-white text-black font-tech text-xs uppercase font-bold tracking-widest hover:bg-[#f2342b] hover:text-white transition mt-2"
              >
                EXPLORE CATALOGUE ↗
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="p-4 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-3">
                  <Link
                    href={`/shop/${p.slug}`}
                    className="w-full aspect-[3/4] bg-cover bg-center rounded-xs border border-[#222] relative group"
                    style={{ backgroundImage: `url(${p.images[0]})` }}
                  />
                  <div className="flex flex-col">
                    <span className="font-tech text-[10px] text-[#777] uppercase">{p.category_name}</span>
                    <Link href={`/shop/${p.slug}`} className="font-display text-base text-white hover:text-[#f2342b] truncate">
                      {p.title}
                    </Link>
                    <span className="font-tech text-xs font-bold text-white mt-1">
                      {format(p.sale_price || p.price)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#1a1a1a]">
                    <button
                      onClick={() => {
                        addItem({
                          productId: p.id,
                          title: p.title,
                          slug: p.slug,
                          price: p.price,
                          salePrice: p.sale_price,
                          image: p.images[0],
                          size: p.sizes[0]?.size || "M",
                          color: p.colors[0]?.name || "Black",
                          quantity: 1,
                        });
                        openCart();
                      }}
                      className="flex-1 py-2 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-[11px] font-bold uppercase tracking-wider rounded-xs transition"
                    >
                      ADD TO BAG
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 border border-[#333] text-[#888] hover:text-red-400 rounded-xs transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
