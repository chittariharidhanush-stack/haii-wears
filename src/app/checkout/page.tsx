import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "./CheckoutClient";


export const metadata = {
  title: "SECURE CHECKOUT // HAII WEAES",
  description: "Complete your order with verified server-side payment encryption and global express dispatch.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <CheckoutClient />
      </main>
      <Footer />
    </div>
  );
}
