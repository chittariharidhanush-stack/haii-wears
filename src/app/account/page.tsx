import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountClient from "./AccountClient";


export const metadata = {
  title: "CLIENT PORTAL // HAII WEAES",
  description: "Manage your profile, order history, tracking updates and wishlist.",
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <AccountClient />
      </main>
      <Footer />
    </div>
  );
}
