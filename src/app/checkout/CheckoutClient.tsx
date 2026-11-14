"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Lock,
  Check,
  AlertCircle,
  ShoppingBag
} from "lucide-react";

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "United Arab Emirates",
  "Singapore",
  "Australia",
  "Canada",
  "Netherlands",
  "Italy",
  "South Korea"
];

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, total, promo, clearCart } = useCart();
  const { currency, format } = useCurrency();
  const { user } = useAuth();

  // Contact State
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "+91 ");
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");

  // Shipping Address State
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY_UPI" | "STRIPE_CARD" | "CASH_ON_DELIVERY">("RAZORPAY_UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isIndia = country.toLowerCase() === "india";

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="w-16 h-16 text-[#333]" />
        <h1 className="font-display text-4xl uppercase text-[#888]">
          CANNOT CHECKOUT: BAG IS EMPTY
        </h1>
        <Link
          href="/shop"
          className="px-8 py-4 bg-white text-black font-tech text-xs uppercase font-bold tracking-widest hover:bg-[#f2342b] hover:text-white transition"
        >
          EXPLORE CATALOGUE ↗
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !phone || !firstName || !addressLine1 || !city || !postalCode) {
      setErrorMessage("Please complete all required shipping fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone
        },
        shippingAddress: {
          address_line1: addressLine1,
          address_line2: addressLine2,
          city,
          state: stateRegion,
          postal_code: postalCode,
          country
        },
        billingAddress: {
          address_line1: addressLine1,
          city,
          country
        },
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          image: i.image,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
          salePrice: i.salePrice
        })),
        promoCode: promo?.code || null,
        paymentMethod,
        currency
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Order checkout encountered an issue.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully! Clear cart & redirect
      clearCart();
      router.push(`/order-success/${data.orderId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-10">
      {/* Top Header */}
      <div className="flex flex-col gap-1 border-b border-[#1a1a1a] pb-6">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#f2342b]" />
          <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
            ENCRYPTED ORDER PROCESSING
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight uppercase leading-none">
          SECURE CHECKOUT
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: CUSTOMER & ADDRESS DETAILS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Section 1: Contact Information */}
          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold border-b border-[#1a1a1a] pb-2">
              1. CONTACT INFORMATION
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alex@nocturn.com"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  PHONE NUMBER (SMS DISPATCH ALERTS) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 98200 12345"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold border-b border-[#1a1a1a] pb-2">
              2. SHIPPING DESTINATION
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  FIRST NAME *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Arjun"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  LAST NAME
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kapoor"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  STREET ADDRESS *
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                  placeholder="Flat / House Number, Apartment Complex, Street"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  APARTMENT, SUITE, LANDMARK (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Floor 4, Tower B"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  CITY *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Mumbai"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  STATE / PROVINCE
                </label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  POSTAL / PIN CODE *
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="400018"
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                />
              </div>

              <div>
                <label className="font-tech text-[11px] text-[#888] uppercase block mb-1">
                  COUNTRY / REGION *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs font-tech text-white focus:outline-none focus:border-[#f2342b] rounded-xs"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Architecture */}
          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-4">
            <span className="font-tech text-xs uppercase tracking-widest text-white font-bold border-b border-[#1a1a1a] pb-2">
              3. PAYMENT METHOD (SECURE SERVER VERIFICATION)
            </span>

            <div className="flex flex-col gap-2.5">
              {/* Option 1: Razorpay UPI (India) */}
              <label
                className={`p-4 border rounded-xs flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === "RAZORPAY_UPI"
                    ? "border-[#f2342b] bg-[#141414]"
                    : "border-[#222] bg-[#0e0e0e] hover:border-[#333]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="RAZORPAY_UPI"
                    checked={paymentMethod === "RAZORPAY_UPI"}
                    onChange={() => setPaymentMethod("RAZORPAY_UPI")}
                    className="accent-[#f2342b]"
                  />
                  <div className="flex flex-col">
                    <span className="font-tech text-xs font-bold uppercase text-white">
                      RAZORPAY // UPI, NETBANKING & RUPAY
                    </span>
                    <span className="font-tech text-[11px] text-[#777]">
                      Instant QR Code, Google Pay, PhonePe, Paytm, or Indian Cards
                    </span>
                  </div>
                </div>
                <span className="font-tech text-[10px] text-emerald-400 font-bold uppercase">ZERO FEES</span>
              </label>

              {/* Option 2: Stripe Global (Cards & Apple Pay) */}
              <label
                className={`p-4 border rounded-xs flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === "STRIPE_CARD"
                    ? "border-[#f2342b] bg-[#141414]"
                    : "border-[#222] bg-[#0e0e0e] hover:border-[#333]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="STRIPE_CARD"
                    checked={paymentMethod === "STRIPE_CARD"}
                    onChange={() => setPaymentMethod("STRIPE_CARD")}
                    className="accent-[#f2342b]"
                  />
                  <div className="flex flex-col">
                    <span className="font-tech text-xs font-bold uppercase text-white">
                      STRIPE // INTERNATIONAL CARDS & APPLE PAY
                    </span>
                    <span className="font-tech text-[11px] text-[#777]">
                      Visa, Mastercard, American Express with 3D Secure Verification
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#888]" />
              </label>

              {/* Option 3: Cash on Delivery (India only) */}
              {isIndia && (
                <label
                  className={`p-4 border rounded-xs flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-[#f2342b] bg-[#141414]"
                      : "border-[#222] bg-[#0e0e0e] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="accent-[#f2342b]"
                    />
                    <div className="flex flex-col">
                      <span className="font-tech text-xs font-bold uppercase text-white">
                        CASH ON DELIVERY (INDIA ONLY)
                      </span>
                      <span className="font-tech text-[11px] text-[#777]">
                        Pay cash upon delivery. Phone verification required.
                      </span>
                    </div>
                  </div>
                  <span className="font-tech text-[10px] text-[#888]">DOMESTIC</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & SUBMIT (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="p-6 border border-[#222] bg-[#0c0c0c] rounded-xs flex flex-col gap-6">
            <span className="font-display text-2xl tracking-wide uppercase text-white border-b border-[#1a1a1a] pb-4">
              ORDER SUMMARY
            </span>

            {/* Item Previews */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3 text-xs font-tech">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-14 bg-cover bg-center rounded-2xs border border-[#222] shrink-0"
                      style={{ backgroundImage: `url(${it.image})` }}
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-bold truncate max-w-[170px]">{it.title}</span>
                      <span className="text-[#777] text-[10px]">
                        SIZE: {it.size} · QTY: {it.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="text-white font-bold">{format((it.salePrice || it.price) * it.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-[#1a1a1a] pt-4 flex flex-col gap-2 font-tech text-xs">
              <div className="flex justify-between text-[#888]">
                <span>SUBTOTAL:</span>
                <span className="text-white font-bold">{format(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#f2342b]">
                  <span>DISCOUNT ({promo?.code}):</span>
                  <span>-{format(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888]">
                <span>ESTIMATED SHIPPING ({country}):</span>
                <span className="text-white">{shipping === 0 ? "FREE" : format(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-[#1a1a1a]">
                <span>FINAL TOTAL:</span>
                <span className="font-display text-2xl tracking-wider text-white">
                  {format(total)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 font-tech text-xs rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-xs font-tech font-bold uppercase tracking-widest text-center transition flex items-center justify-center gap-2 rounded-xs cursor-pointer ${
                isSubmitting
                  ? "bg-[#333] text-[#777] cursor-wait"
                  : "bg-white text-black hover:bg-[#f2342b] hover:text-white"
              }`}
            >
              <span>{isSubmitting ? "PROCESSING TRANSACTION..." : `PLACE ORDER & PAY (${format(total)})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex flex-col gap-1.5 text-[10px] font-tech text-[#666] text-center">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SERVER-SIDE VERIFIED & ENCRYPTED</span>
              </div>
              <span>Orders ship in signature discreet matte-black archival packaging.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
