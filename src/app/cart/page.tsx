import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartPageClient from "./CartPageClient";


export const metadata = {
  title: "SHOPPING BAG // HAII WEAES",
  description: "Review your selected nocturnal streetwear pieces, apply promotional codes, and proceed to secure checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <CartPageClient />
      </main>
      <Footer />
    </div>
  );
}
