"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { user, wishlistIds, isAdmin } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "SHOP THE DROP", href: "/shop" },
    {
      name: "3D TRY-ON",
      href: "/fitting-room",
      badge: "LIVE 3D",
      special: true
    },
    { name: "COLLECTIONS", href: "/shop?category=hoodies" },
    { name: "LOOKBOOK", href: "/lookbook" },
    { name: "THE MINDSET", href: "/about" }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#080808]/92 backdrop-blur-md border-b border-[#1a1a1a] py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-[#080808]/90 via-[#080808]/50 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* LEFT: BRAND LOGO */}
          <Link href="/" className="group flex items-center gap-2 select-none">
            <span className="font-display text-2xl md:text-3xl tracking-wider text-white group-hover:text-neutral-200 transition">
              HAII WEAES
            </span>
            {/* Superscript dots from authentic screencast */}
            <div className="flex items-center gap-1 -translate-y-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2342b]" />
            </div>
          </Link>

          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-tech text-xs tracking-widest uppercase transition flex items-center gap-1.5 py-1 relative ${
                    isActive ? "text-white font-bold" : "text-[#999999] hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-[#f2342b] text-white font-bold tracking-wider animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#f2342b]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: ACTIONS (CURRENCY, SEARCH, WISHLIST, ACCOUNT, BAG) */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Currency Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="font-tech text-[11px] text-[#aaa] hover:text-white uppercase tracking-wider flex items-center gap-1 py-1 px-2 rounded-xs border border-[#222] bg-[#111] hover:border-[#333] transition"
              >
                <span>{availableCurrencies[currency].label}</span>
                <ChevronDown className="w-3 h-3 text-[#666]" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#111111] border border-[#262626] rounded-sm py-1 shadow-2xl z-50">
                  {Object.values(availableCurrencies).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as any);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 font-tech text-xs flex items-center justify-between transition ${
                        currency === c.code ? "bg-[#f2342b] text-white font-bold" : "text-[#aaa] hover:bg-[#1a1a1a] hover:text-white"
                      }`}
                    >
                      <span>{c.code}</span>
                      <span>{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search Catalog"
              className="p-1.5 text-[#aaa] hover:text-white transition"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account#wishlist"
              aria-label="Wishlist"
              className="p-1.5 text-[#aaa] hover:text-white transition relative"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f2342b] text-white text-[9px] font-tech font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Customer Account / Admin Icon */}
            <Link
              href={user ? (isAdmin ? "/admin" : "/account") : "/account/login"}
              aria-label="Account"
              className="p-1.5 text-[#aaa] hover:text-white transition relative flex items-center gap-1"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
              {isAdmin && (
                <span className="hidden md:inline-block text-[9px] font-tech text-[#f2342b] uppercase font-bold tracking-wider">
                  ADMIN
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart Drawer Button */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="flex items-center gap-1.5 bg-[#141414] hover:bg-white hover:text-black border border-[#262626] py-1.5 px-3 rounded-xs transition text-white group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white group-hover:text-black transition" />
              <span className="font-tech text-xs tracking-widest font-bold">
                [{itemCount < 10 ? `0${itemCount}` : itemCount}]
              </span>
            </button>

            {/* Mobile Burger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="p-1.5 text-[#aaa] hover:text-white lg:hidden transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[70px] bg-[#080808]/98 backdrop-blur-xl z-50 lg:hidden flex flex-col p-6 overflow-y-auto border-t border-[#1a1a1a]">
          <div className="flex flex-col gap-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-display text-3xl tracking-wider text-white hover:text-[#f2342b] transition flex items-center justify-between border-b border-[#161616] pb-3"
              >
                <span>{link.name}</span>
                {link.badge ? (
                  <span className="font-tech text-xs px-2 py-0.5 bg-[#f2342b] text-white rounded-xs">
                    {link.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-[#666]" />
                )}
              </Link>
            ))}

            <Link
              href="/cart"
              className="font-display text-3xl tracking-wider text-white hover:text-[#f2342b] transition flex items-center justify-between border-b border-[#161616] pb-3"
            >
              <span>SHOPPING BAG</span>
              <span className="font-tech text-xs text-[#aaa]">[{itemCount} ITEMS]</span>
            </Link>

            <Link
              href={user ? (isAdmin ? "/admin" : "/account") : "/account/login"}
              className="font-display text-3xl tracking-wider text-white hover:text-[#f2342b] transition flex items-center justify-between border-b border-[#161616] pb-3"
            >
              <span>{user ? `ACCOUNT (${user.name})` : "LOGIN / REGISTER"}</span>
              <ArrowUpRight className="w-5 h-5 text-[#666]" />
            </Link>
          </div>

          {/* Mobile Currency Switcher */}
          <div className="mt-6 pt-6 border-t border-[#1a1a1a] flex flex-col gap-3">
            <span className="font-tech text-xs uppercase tracking-widest text-[#777]">SELECT CURRENCY</span>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(availableCurrencies).map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code as any)}
                  className={`py-2 text-center font-tech text-xs border rounded-xs transition ${
                    currency === c.code
                      ? "bg-[#f2342b] text-white border-[#f2342b] font-bold"
                      : "border-[#222] text-[#888] bg-[#111]"
                  }`}
                >
                  {c.code} ({c.symbol})
                </button>
              ))}
            </div>
          </div>

          {/* Socials Footer in Mobile Drawer */}
          <div className="mt-auto pt-8 flex items-center justify-between font-tech text-xs text-[#777]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
              INSTAGRAM ↗
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white">
              TIKTOK ↗
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white">
              X // TWITTER ↗
            </a>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY MODAL */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
