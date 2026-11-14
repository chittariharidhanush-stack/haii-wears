import React from "react";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartDrawer from "@/components/layout/CartDrawer";
import ProductDetailClient from "./ProductDetailClient";


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = db.prepare("SELECT title, description FROM products WHERE slug = ?").get(slug) as any;
  if (!product) return { title: "Product Not Found // HAII WEAES" };

  return {
    title: `${product.title} // HAII WEAES`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const rawProduct = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? OR p.id = ?
  `).get(slug, slug) as any;

  if (!rawProduct) {
    notFound();
  }

  const product = {
    ...rawProduct,
    images: JSON.parse(rawProduct.images_json || "[]"),
    sizes: JSON.parse(rawProduct.sizes_json || "[]"),
    colors: JSON.parse(rawProduct.colors_json || "[]"),
    is_featured: Boolean(rawProduct.is_featured),
    is_new_drop: Boolean(rawProduct.is_new_drop),
    in_stock: Boolean(rawProduct.in_stock),
  };

  // Fetch related products in same category or featured
  const rawRelated = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id != ?
    ORDER BY (p.category_id = ?) DESC, p.created_at DESC
    LIMIT 4
  `).all(product.id, product.category_id) as any[];

  const relatedProducts = rawRelated.map((p) => ({
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
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
