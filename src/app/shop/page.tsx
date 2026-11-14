import React, { Suspense } from "react";
import db from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartDrawer from "@/components/layout/CartDrawer";
import ShopClient from "./ShopClient";


export const metadata = {
  title: "SHOP ALL SILHOUETTES // HAII WEAES",
  description: "Explore the full archive of heavyweight hoodies, graphic tees, tactical cargo trousers, and modular accessories. Fitted with 3D Virtual Try-On.",
};

export default function ShopPage() {
  const categories = db.prepare("SELECT * FROM categories ORDER BY display_order ASC").all() as any[];

  const rawProducts = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `).all() as any[];

  const products = rawProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images_json || "[]"),
    sizes: JSON.parse(p.sizes_json || "[]"),
    colors: JSON.parse(p.colors_json || "[]"),
    is_featured: Boolean(p.is_featured),
    is_new_drop: Boolean(p.is_new_drop),
    in_stock: Boolean(p.in_stock),
  }));

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center font-tech text-xs text-[#888]">LOADING ARCHIVE...</div>}>
          <ShopClient initialProducts={products} categories={categories} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
