"use client";

import React, { useState, useEffect } from "react";
import { brandConfig } from "@/config/brand";
import { Bell, Check, Clock, Sparkles } from "lucide-react";

export default function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const targetDate = new Date(brandConfig.nextDrop.date);
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/drop-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, dropName: brandConfig.nextDrop.name })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Priority drop access confirmed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to register.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Try again.");
    }
  };

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-20 px-4 md:px-8 border-b border-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
        <div className="flex flex-col items-center gap-2 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#222] rounded-xs">
            <Clock className="w-3.5 h-3.5 text-[#f2342b]" />
            <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
              UPCOMING CHAPTER // SYNCHRONIZED RELEASE
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl tracking-tight uppercase mt-2">
            {brandConfig.nextDrop.name}
          </h2>

          <p className="font-tech text-xs md:text-sm text-[#888] tracking-widest uppercase mt-1">
            {brandConfig.nextDrop.description}
          </p>
        </div>

        {/* Real Countdown Digits */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-2xl">
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HOURS", val: timeLeft.hours },
            { label: "MINUTES", val: timeLeft.minutes },
            { label: "SECONDS", val: timeLeft.seconds }
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 md:p-8 bg-[#060606] border border-[#1f1f1f] rounded-xs flex flex-col items-center justify-center shadow-xl"
            >
              <span className="font-display text-4xl sm:text-6xl md:text-7xl tracking-wider text-white">
                {item.val < 10 ? `0${item.val}` : item.val}
              </span>
              <span className="font-tech text-[10px] md:text-xs text-[#666] tracking-widest uppercase mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Priority Access Waitlist Form */}
        <div className="w-full max-w-md flex flex-col gap-3">
          <form onSubmit={handleNotifySubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
              required
              className="flex-1 bg-[#141414] border border-[#262626] px-4 py-3 text-xs font-tech text-white placeholder-[#555] uppercase focus:outline-none focus:border-[#f2342b] rounded-xs"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 bg-[#f2342b] hover:bg-[#d62828] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center gap-1.5 rounded-xs cursor-pointer shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{status === "loading" ? "SAVING..." : "NOTIFY ME"}</span>
            </button>
          </form>

          {message && (
            <div
              className={`p-3 font-tech text-xs rounded-xs flex items-center justify-center gap-2 ${
                status === "success"
                  ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-400"
                  : "bg-red-950/40 border border-red-500/40 text-red-400"
              }`}
            >
              {status === "success" && <Check className="w-4 h-4" />}
              <span>{message}</span>
            </div>
          )}

          <span className="font-tech text-[10px] text-[#666] uppercase tracking-wider">
            NO SPAM. JUST THE NEXT CHAPTER PASSCODE 30 MINUTES BEFORE DROP.
          </span>
        </div>
      </div>
    </section>
  );
}
