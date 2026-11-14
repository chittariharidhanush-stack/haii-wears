import React from "react";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import AdminClient from "./AdminClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata = {
  title: "ADMIN STUDIO DASHBOARD // HAII WEAES",
  description: "Enterprise administration portal for orders, stock inventory, CMS and customer analytics.",
};

export default async function AdminPage() {
  const session = await getSessionUser();

  const categories = db.prepare("SELECT * FROM categories ORDER BY display_order ASC").all() as any[];

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <AdminClient initialUser={session} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
