import React from "react";
import db from "@/lib/db";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import HeroSection from "@/components/home/HeroSection";
import CollectionIntro from "@/components/home/CollectionIntro";
import FittingRoomTeaser from "@/components/home/FittingRoomTeaser";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandManifesto from "@/components/home/BrandManifesto";
import CampaignGallery from "@/components/home/CampaignGallery";
import DropCountdown from "@/components/home/DropCountdown";
import SocialLookbook from "@/components/home/SocialLookbook";
import NewsletterSection from "@/components/home/NewsletterSection";


export const metadata = {
  title: "HAII WEAES // NOT FOR EVERYONE. — Independent Streetwear Label",
  description: "Independent multi-category fashion label blending experimental streetwear, heavyweight architectural cuts and dark luxury aesthetics. Featuring 3D Virtual Fitting Studio.",
};

export default function HomePage() {
  // Fetch featured products from SQLite DB
  const rawProducts = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_featured = 1
    ORDER BY p.created_at DESC
    LIMIT 8
  `).all() as any[];

  const featuredProducts = rawProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images_json || "[]"),
    sizes: JSON.parse(p.sizes_json || "[]"),
    colors: JSON.parse(p.colors_json || "[]"),
    is_new_drop: Boolean(p.is_new_drop),
    is_featured: Boolean(p.is_featured),
    in_stock: Boolean(p.in_stock),
  }));

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <HeroSection />
        <CollectionIntro />
        <FittingRoomTeaser />
        <CategoryGrid />
        <FeaturedProducts products={featuredProducts} />
        <BrandManifesto />
        <CampaignGallery />
        <DropCountdown />
        <SocialLookbook />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
