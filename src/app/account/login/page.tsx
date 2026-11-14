"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect
  if (user) {
    if (user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/account");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Login failed");
        } else {
          router.push("/account");
        }
      } else {
        const res = await register(name, email, password, phone);
        if (!res.success) {
          setError(res.error || "Registration failed");
        } else {
          router.push("/account");
        }
      }
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail("customer@haiiweaes.com");
    setPassword("Customer@123");
    setMode("login");
  };

  const fillDemoAdmin = () => {
    setEmail("admin@haiiweaes.com");
    setPassword("Admin@12345");
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#f2342b] selection:text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-6 md:p-8 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-6 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col gap-1 text-center items-center">
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              // CLIENT AUTHENTICATION
            </span>
            <h1 className="font-display text-3xl uppercase tracking-wider text-white">
              {mode === "login" ? "ACCESS YOUR ACCOUNT" : "CREATE CLIENT PROFILE"}
            </h1>
            <p className="font-tech text-xs text-[#888]">
              Manage orders, track dispatch status and synchronize your 3D fitting preferences.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 border border-[#222] rounded-xs overflow-hidden">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-2.5 font-tech text-xs tracking-wider uppercase transition ${
                mode === "login"
                  ? "bg-white text-black font-bold"
                  : "bg-[#111] text-[#777] hover:text-white"
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-2.5 font-tech text-xs tracking-wider uppercase transition ${
                mode === "register"
                  ? "bg-white text-black font-bold"
                  : "bg-[#111] text-[#777] hover:text-white"
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Quick Demo Credentials Bar for Testing */}
          <div className="p-3 bg-[#141414] border border-[#262626] rounded-xs flex flex-col gap-1.5 font-tech text-[11px]">
            <span className="text-[#888] uppercase">QUICK DEMO CREDENTIALS:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-white rounded-xs transition"
              >
                Fill Customer
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-2.5 py-1 bg-[#222] hover:bg-[#f2342b] text-white rounded-xs transition"
              >
                Fill Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Arjun Kapoor"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>
            )}

            <div>
              <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@domain.com"
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            <div>
              <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                PASSWORD *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  PHONE NUMBER (OPTIONAL)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 font-tech text-xs rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black hover:bg-[#f2342b] hover:text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-xs cursor-pointer mt-2"
            >
              <span>{loading ? "AUTHENTICATING..." : mode === "login" ? "SIGN IN ↗" : "CREATE ACCOUNT ↗"}</span>
            </button>
          </form>

          <div className="text-center font-tech text-xs text-[#777]">
            GUEST CHECKOUT SUPPORTED DIRECTLY IN BAG.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

