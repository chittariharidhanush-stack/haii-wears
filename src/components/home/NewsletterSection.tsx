"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    if (!agree) {
      setStatus("error");
      setMessage("Please consent to receive drop notifications.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You are on the priority drop list.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription error.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  };

  return (
    <section id="newsletter" className="w-full bg-[#f2342b] text-black py-24 px-4 md:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: SCREENCAST MASSIVE HEADLINE & SUBTEXT */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="font-tech text-xs tracking-widest uppercase font-bold text-black/80">
            03 // THE INNER CIRCLE
          </div>

          <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.88] uppercase text-black">
            DON&apos;T SLEEP<br />
            ON THE DROP<span className="text-white">.</span>
          </h2>

          <div className="font-tech text-xs md:text-sm text-black/90 tracking-wider uppercase max-w-md mt-4 leading-relaxed">
            <p>Once it&apos;s gone, it&apos;s gone. Get on the list for the next release.</p>
            <p className="mt-1">One drop a month. Nothing you don&apos;t need.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: SCREENCAST MINIMALIST UNDERLINE INPUT FORM */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <span className="font-tech text-[10px] tracking-widest uppercase font-bold text-black/70">
            YOUR EMAIL. YOUR EARLY WARNING.
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Minimalist Underline Input Row */}
            <div className="relative border-b-2 border-black pb-2 flex items-center justify-between">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@afterdark.com"
                required
                className="w-full bg-transparent text-xl md:text-2xl font-tech text-black placeholder-black/40 focus:outline-none lowercase"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="text-black hover:text-white transition p-1 cursor-pointer shrink-0"
                title="Subscribe to Priority Drop"
              >
                <ArrowUpRight className="w-7 h-7" />
              </button>
            </div>

            {/* Checkbox Consent */}
            <label className="flex items-center gap-2 cursor-pointer font-tech text-[11px] text-black/85">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-black w-4 h-4 cursor-pointer"
              />
              <span>
                I agree to receive NOCTURN drop updates.{" "}
                <span className="underline">Privacy policy</span>.
              </span>
            </label>

            {/* Status Message */}
            {message && (
              <div
                className={`p-3 font-tech text-xs font-bold ${
                  status === "success" ? "bg-black text-white" : "bg-black/20 text-black border border-black"
                }`}
              >
                {status === "success" && <Check className="w-4 h-4 inline-block mr-1.5" />}
                <span>{message}</span>
              </div>
            )}

            <span className="font-tech text-[10px] tracking-wider text-black/60 uppercase">
              NO SPAM. JUST THE NEXT CHAPTER.
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}
