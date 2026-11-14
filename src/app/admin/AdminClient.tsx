"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Check,
  Search,
  ExternalLink,
  Truck,
  DollarSign,
  Clock,
  Sparkles,
  Save,
  Lock
} from "lucide-react";

interface AdminClientProps {
  initialUser: any;
  categories: any[];
}

export default function AdminClient({ initialUser, categories }: AdminClientProps) {
  const { user, login } = useAuth();
  const { format } = useCurrency();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "cms">("overview");

  // Admin Quick Login if not logged in
  const [adminEmail, setAdminEmail] = useState("admin@haiiweaes.com");
  const [adminPassword, setAdminPassword] = useState("Admin@12345");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Data States
  const [stats, setStats] = useState<any | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [cmsConfig, setCmsConfig] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Product Add / Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: 3999,
    sale_price: "",
    category_id: categories[0]?.id || "cat_1",
    fabric_details: "100% Combed Cotton",
    gsm: 400,
    fit: "Oversized Streetwear",
    stock_total: 50,
    imageUrl: "/products/nocturn-hoodie-1.jpg",
  });

  // Order Status Edit Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [newCarrier, setNewCarrier] = useState("");

  const isAdmin = user?.role === "ADMIN" || initialUser?.role === "ADMIN";

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch live stats
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setLowStockProducts(data.lowStockProducts || []);
      }

      // 2. Fetch all products
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setAllProducts(prodData.products || []);
      }

      // 3. Fetch all orders
      const orderRes = await fetch("/api/orders");
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setAllOrders(orderData.orders || []);
      }

      // 4. Fetch CMS
      const cmsRes = await fetch("/api/cms");
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json();
        setCmsConfig(cmsData.config);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");
    try {
      const res = await login(adminEmail, adminPassword);
      if (!res.success) {
        setAuthError(res.error || "Admin authentication failed.");
      } else {
        loadAdminData();
      }
    } catch {
      setAuthError("Network error.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Save / Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        category_id: formData.category_id,
        fabric_details: formData.fabric_details,
        gsm: Number(formData.gsm),
        fit: formData.fit,
        stock_total: Number(formData.stock_total),
        images: [formData.imageUrl, formData.imageUrl],
        sizes: [
          { size: "S", stock: Math.floor(Number(formData.stock_total) * 0.2) },
          { size: "M", stock: Math.floor(Number(formData.stock_total) * 0.3) },
          { size: "L", stock: Math.floor(Number(formData.stock_total) * 0.3) },
          { size: "XL", stock: Math.floor(Number(formData.stock_total) * 0.2) }
        ],
        colors: [{ name: "Onyx Black", hex: "#0c0c0c" }]
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setProductModalOpen(false);
        setEditingProduct(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this silhouette from the catalog?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfilment_status: newOrderStatus || selectedOrder.fulfilment_status,
          tracking_number: newTrackingNumber || selectedOrder.tracking_number,
          carrier: newCarrier || selectedOrder.carrier
        })
      });

      if (res.ok) {
        setSelectedOrder(null);
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save CMS Settings
  const handleSaveCMS = async () => {
    if (!cmsConfig) return;
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cmsConfig })
      });
      if (res.ok) {
        alert("CMS content updated and published live!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // IF NOT LOGGED IN AS ADMIN, SHOW SECURE ACCESS GATE
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col gap-6">
        <div className="p-8 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-2">
            <Lock className="w-10 h-10 text-[#f2342b]" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              // RESTRICTED ACCESS
            </span>
            <h1 className="font-display text-3xl uppercase text-white">
              STUDIO ADMIN CONSOLE
            </h1>
            <p className="font-tech text-xs text-[#888]">
              Enter administrator credentials to manage inventory, fulfill client orders, and modify CMS content.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div>
              <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            <div>
              <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                ADMIN PASSWORD
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 font-tech text-xs rounded-xs">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-4 bg-[#f2342b] hover:bg-[#d62828] text-white font-tech text-xs font-bold uppercase tracking-widest transition rounded-xs cursor-pointer"
            >
              {loggingIn ? "VERIFYING CREDENTIALS..." : "ACCESS ADMIN DASHBOARD ↗"}
            </button>
          </form>

          <div className="p-3 bg-[#111] border border-[#222] rounded-xs font-tech text-[11px] text-[#777] text-center">
            DEFAULT: admin@haiiweaes.com / Admin@12345
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">
      {/* Admin Top Header */}
      <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f2342b] animate-pulse" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              HAII WEAES STUDIO MANAGEMENT SUITE // v2.4
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl uppercase text-white">
            ADMINISTRATION CONSOLE
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/fitting-room"
            className="px-4 py-2 border border-[#f2342b] bg-[#f2342b]/10 text-white font-tech text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 hover:bg-[#f2342b] transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f2342b] hover:text-white" />
            <span>3D FITTING ENGINE</span>
          </Link>

          <Link
            href="/shop"
            className="px-4 py-2 border border-[#333] hover:border-white font-tech text-xs uppercase tracking-wider text-[#aaa] hover:text-white rounded-xs transition"
          >
            VIEW LIVE STORE ↗
          </Link>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#1a1a1a] overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-6 font-tech text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition shrink-0 ${
            activeTab === "overview"
              ? "border-[#f2342b] text-white font-bold bg-[#111]"
              : "border-transparent text-[#777] hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>OVERVIEW & KPIS</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`py-3 px-6 font-tech text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition shrink-0 ${
            activeTab === "products"
              ? "border-[#f2342b] text-white font-bold bg-[#111]"
              : "border-transparent text-[#777] hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>PRODUCTS ({allProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`py-3 px-6 font-tech text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition shrink-0 ${
            activeTab === "orders"
              ? "border-[#f2342b] text-white font-bold bg-[#111]"
              : "border-transparent text-[#777] hover:text-white"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ORDERS ({allOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("cms")}
          className={`py-3 px-6 font-tech text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition shrink-0 ${
            activeTab === "cms"
              ? "border-[#f2342b] text-white font-bold bg-[#111]"
              : "border-transparent text-[#777] hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>CMS & TICKER EDITOR</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && stats && (
        <div className="flex flex-col gap-8">
          {/* Real Database KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-1 shadow">
              <span className="font-tech text-[10px] text-[#777] uppercase tracking-widest">TOTAL REVENUE (INR)</span>
              <span className="font-display text-3xl md:text-4xl text-white">{format(stats.totalRevenue)}</span>
              <span className="font-tech text-[10px] text-emerald-400">DATABASE DERIVED</span>
            </div>

            <div className="p-5 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-1 shadow">
              <span className="font-tech text-[10px] text-[#777] uppercase tracking-widest">TOTAL ORDERS</span>
              <span className="font-display text-3xl md:text-4xl text-white">{stats.totalOrders}</span>
              <span className="font-tech text-[10px] text-[#888]">AVERAGE VALUE: {format(stats.avgOrderValue)}</span>
            </div>

            <div className="p-5 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-1 shadow">
              <span className="font-tech text-[10px] text-[#777] uppercase tracking-widest">ACTIVE CATALOGUE</span>
              <span className="font-display text-3xl md:text-4xl text-white">{stats.totalProducts}</span>
              <span className="font-tech text-[10px] text-[#888]">14 CLOTHING CATEGORIES</span>
            </div>

            <div className="p-5 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-1 shadow">
              <span className="font-tech text-[10px] text-[#777] uppercase tracking-widest">PENDING DISPATCH</span>
              <span className="font-display text-3xl md:text-4xl text-[#f2342b]">{stats.pendingOrders}</span>
              <span className="font-tech text-[10px] text-[#888]">LOW STOCK ALERTS: {stats.lowStockCount}</span>
            </div>
          </div>

          {/* Dual Tables: Recent Orders & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Recent Orders Table (8 cols) */}
            <div className="lg:col-span-8 p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                <span className="font-display text-xl uppercase text-white">
                  RECENT DISPATCH ORDERS
                </span>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="font-tech text-xs text-[#f2342b] uppercase underline"
                >
                  VIEW ALL ORDERS →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full font-tech text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1a1a] text-[#777]">
                      <th className="py-2.5">ORDER NO</th>
                      <th className="py-2.5">CLIENT</th>
                      <th className="py-2.5">TOTAL</th>
                      <th className="py-2.5">FULFILMENT</th>
                      <th className="py-2.5">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161616]">
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#111] transition">
                        <td className="py-3 font-bold text-white">{o.order_number}</td>
                        <td className="py-3 text-[#ccc]">{o.customer_name}</td>
                        <td className="py-3 text-white font-bold">{format(o.total)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[10px] rounded-xs ${
                            o.fulfilment_status === "DELIVERED"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : o.fulfilment_status === "SHIPPED"
                              ? "bg-blue-950 text-blue-400 border border-blue-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}>
                            {o.fulfilment_status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setNewOrderStatus(o.fulfilment_status);
                              setNewTrackingNumber(o.tracking_number || "");
                              setNewCarrier(o.carrier || "");
                            }}
                            className="text-[#aaa] hover:text-white underline text-[11px]"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alerts (4 cols) */}
            <div className="lg:col-span-4 p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4">
              <span className="font-display text-xl uppercase text-white border-b border-[#1a1a1a] pb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>INVENTORY WARNINGS</span>
              </span>

              <div className="flex flex-col gap-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="p-3 bg-[#111] border border-[#222] rounded-xs flex items-center justify-between text-xs font-tech">
                    <div className="flex flex-col">
                      <span className="text-white font-bold truncate max-w-[180px]">{p.title}</span>
                      <span className="text-[#888]">{format(p.price)}</span>
                    </div>
                    <span className="px-2 py-1 bg-red-950/60 border border-red-500/40 text-red-400 font-bold rounded-2xs text-[10px]">
                      {p.stock_total} UNITS LEFT
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === "products" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl uppercase text-white">
              PRODUCT ARCHIVE CATALOGUE
            </span>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  title: "",
                  slug: "",
                  description: "",
                  price: 3999,
                  sale_price: "",
                  category_id: categories[0]?.id || "cat_1",
                  fabric_details: "100% Combed Heavy Cotton",
                  gsm: 400,
                  fit: "Oversized Streetwear Silhouette",
                  stock_total: 50,
                  imageUrl: "/products/nocturn-hoodie-1.jpg",
                });
                setProductModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs uppercase font-bold tracking-wider rounded-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW PIECE</span>
            </button>
          </div>

          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs overflow-x-auto shadow">
            <table className="w-full font-tech text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-[#777]">
                  <th className="py-3">THUMB</th>
                  <th className="py-3">TITLE</th>
                  <th className="py-3">CATEGORY</th>
                  <th className="py-3">PRICE</th>
                  <th className="py-3">STOCK</th>
                  <th className="py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {allProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#111] transition">
                    <td className="py-3">
                      <div
                        className="w-12 h-14 bg-cover bg-center rounded-2xs border border-[#222]"
                        style={{ backgroundImage: `url(${p.images[0] || "/brand/icon.svg"})` }}
                      />
                    </td>
                    <td className="py-3 font-bold text-white max-w-xs truncate">
                      <Link href={`/shop/${p.slug}`} className="hover:text-[#f2342b]">
                        {p.title}
                      </Link>
                    </td>
                    <td className="py-3 text-[#aaa]">{p.category_name}</td>
                    <td className="py-3 text-white font-bold">{format(p.price)}</td>
                    <td className="py-3">
                      <span className={p.stock_total <= 15 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                        {p.stock_total} units
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setFormData({
                              title: p.title,
                              slug: p.slug,
                              description: p.description,
                              price: p.price,
                              sale_price: p.sale_price ? String(p.sale_price) : "",
                              category_id: p.category_id,
                              fabric_details: p.fabric_details || "",
                              gsm: p.gsm || 400,
                              fit: p.fit || "",
                              stock_total: p.stock_total,
                              imageUrl: p.images[0] || "/products/nocturn-hoodie-1.jpg",
                            });
                            setProductModalOpen(true);
                          }}
                          className="p-1.5 border border-[#333] hover:border-white rounded-xs text-[#aaa] hover:text-white transition"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 border border-[#333] hover:border-red-500 rounded-xs text-[#aaa] hover:text-red-400 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="font-display text-2xl uppercase text-white">
              ORDER DISPATCH DATABASE
            </span>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 text-xs font-tech uppercase rounded-xs transition ${
                    orderFilter === st
                      ? "bg-white text-black font-bold"
                      : "border border-[#222] bg-[#111] text-[#888] hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs overflow-x-auto shadow">
            <table className="w-full font-tech text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-[#777]">
                  <th className="py-3">ORDER NO</th>
                  <th className="py-3">CLIENT INFO</th>
                  <th className="py-3">ITEMS</th>
                  <th className="py-3">TOTAL</th>
                  <th className="py-3">PAYMENT</th>
                  <th className="py-3">FULFILMENT</th>
                  <th className="py-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {allOrders
                  .filter((o) => orderFilter === "ALL" || o.fulfilment_status === orderFilter)
                  .map((o) => (
                    <tr key={o.id} className="hover:bg-[#111] transition">
                      <td className="py-3 font-bold text-white">{o.order_number}</td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{o.customer_name}</span>
                          <span className="text-[#666] text-[10px]">{o.customer_email}</span>
                          <span className="text-[#666] text-[10px]">{o.shipping_address?.city}, {o.shipping_address?.country}</span>
                        </div>
                      </td>
                      <td className="py-3 text-[#aaa]">
                        {o.items?.length} piece(s)
                      </td>
                      <td className="py-3 font-bold text-white">{format(o.total)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] rounded-xs ${
                          o.payment_status === "PAID" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"
                        }`}>
                          {o.payment_status} ({o.payment_method})
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] rounded-xs font-bold ${
                          o.fulfilment_status === "DELIVERED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : o.fulfilment_status === "SHIPPED"
                            ? "bg-blue-950 text-blue-400 border border-blue-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}>
                          {o.fulfilment_status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setNewOrderStatus(o.fulfilment_status);
                            setNewTrackingNumber(o.tracking_number || "");
                            setNewCarrier(o.carrier || "Blue Dart Express");
                          }}
                          className="px-3 py-1.5 border border-[#333] hover:border-white text-white font-bold rounded-xs transition text-[11px]"
                        >
                          MANAGE STATUS
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CMS CONTENT MANAGEMENT */}
      {activeTab === "cms" && cmsConfig && (
        <div className="p-6 md:p-8 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
            <div>
              <span className="font-tech text-xs text-[#f2342b] uppercase font-bold">
                WEBSITE CONTENT & BRAND MANIFESTO
              </span>
              <h2 className="font-display text-2xl uppercase text-white">
                CMS CONFIGURATION
              </h2>
            </div>
            <button
              onClick={handleSaveCMS}
              className="px-6 py-3 bg-[#f2342b] hover:bg-[#d62828] text-white font-tech text-xs uppercase font-bold tracking-wider rounded-xs transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>PUBLISH UPDATES LIVE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-tech text-xs text-[#888] uppercase block mb-1">
                PRIMARY BRAND TAGLINE
              </label>
              <input
                type="text"
                value={cmsConfig.tagline}
                onChange={(e) => setCmsConfig({ ...cmsConfig, tagline: e.target.value })}
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            <div>
              <label className="font-tech text-xs text-[#888] uppercase block mb-1">
                NEXT DROP TITLE
              </label>
              <input
                type="text"
                value={cmsConfig.nextDrop.name}
                onChange={(e) =>
                  setCmsConfig({
                    ...cmsConfig,
                    nextDrop: { ...cmsConfig.nextDrop, name: e.target.value }
                  })
                }
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-tech text-xs text-[#888] uppercase block mb-1">
                NEXT DROP COUNTDOWN TARGET DATE (ISO TIMESTAMP)
              </label>
              <input
                type="text"
                value={cmsConfig.nextDrop.date}
                onChange={(e) =>
                  setCmsConfig({
                    ...cmsConfig,
                    nextDrop: { ...cmsConfig.nextDrop, date: e.target.value }
                  })
                }
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-tech text-xs text-[#888] uppercase block mb-1">
                SUB-TAGLINE / MANIFESTO INTRO
              </label>
              <textarea
                rows={3}
                value={cmsConfig.subTagline}
                onChange={(e) => setCmsConfig({ ...cmsConfig, subTagline: e.target.value })}
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-[#262626] p-6 max-w-lg w-full rounded-xs flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <span className="font-display text-2xl uppercase text-white border-b border-[#222] pb-3">
              {editingProduct ? "EDIT SILHOUETTE" : "ADD NEW SILHOUETTE TO ARCHIVE"}
            </span>

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 font-tech text-xs">
              <div>
                <label className="text-[#888] uppercase block mb-1">PRODUCT TITLE *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="NOCTURN OVERSIZED HOODIE"
                  className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white uppercase focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] uppercase block mb-1">CATEGORY *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white focus:border-[#f2342b] rounded-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#888] uppercase block mb-1">PRICE (INR) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white focus:border-[#f2342b] rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] uppercase block mb-1">SALE PRICE (INR)</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white focus:border-[#f2342b] rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-[#888] uppercase block mb-1">TOTAL INVENTORY STOCK</label>
                  <input
                    type="number"
                    value={formData.stock_total}
                    onChange={(e) => setFormData({ ...formData, stock_total: Number(e.target.value) })}
                    required
                    className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white focus:border-[#f2342b] rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#888] uppercase block mb-1">IMAGE PATH / URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/products/nocturn-hoodie-1.jpg"
                  className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="text-[#888] uppercase block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Architectural loopback terry garment..."
                  className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-3 border border-[#333] text-[#aaa] hover:text-white rounded-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#f2342b] hover:bg-[#d62828] text-white font-bold rounded-xs transition"
                >
                  SAVE PIECE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER STATUS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-[#262626] p-6 max-w-md w-full rounded-xs flex flex-col gap-4 shadow-2xl">
            <span className="font-display text-xl uppercase text-white border-b border-[#222] pb-2">
              UPDATE FULFILMENT: {selectedOrder.order_number}
            </span>

            <form onSubmit={handleUpdateOrderStatus} className="flex flex-col gap-3 font-tech text-xs">
              <div>
                <label className="text-[#888] uppercase block mb-1">FULFILMENT STATUS</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white rounded-xs focus:border-[#f2342b]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-[#888] uppercase block mb-1">CARRIER</label>
                <input
                  type="text"
                  value={newCarrier}
                  onChange={(e) => setNewCarrier(e.target.value)}
                  placeholder="Blue Dart Express / DHL"
                  className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white rounded-xs focus:border-[#f2342b]"
                />
              </div>

              <div>
                <label className="text-[#888] uppercase block mb-1">TRACKING NUMBER</label>
                <input
                  type="text"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  placeholder="BD-88291039"
                  className="w-full bg-[#161616] border border-[#262626] px-3 py-2 text-white rounded-xs focus:border-[#f2342b]"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 border border-[#333] text-[#aaa] rounded-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#f2342b] text-white font-bold rounded-xs transition"
                >
                  APPLY STATUS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

