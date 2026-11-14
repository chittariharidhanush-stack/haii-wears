import React from "react";
import db from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderSuccessClient from "./OrderSuccessClient";
import { notFound } from "next/navigation";


interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: `Order Confirmed // HAII WEAES`,
  };
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;

  const order = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?").get(id, id) as any;
  if (!order) {
    notFound();
  }

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id) as any[];

  const orderData = {
    ...order,
    shipping_address: JSON.parse(order.shipping_address_json || "{}"),
    items,
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <OrderSuccessClient order={orderData} />
      </main>
      <Footer />
    </div>
  );
}
