"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CurrencyCode, CURRENCIES, formatPrice, convertFromINR } from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountInINR: number) => string;
  convert: (amountInINR: number) => number;
  availableCurrencies: typeof CURRENCIES;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("hw_currency") as CurrencyCode;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("hw_currency", code);
  };

  const format = (amountInINR: number) => formatPrice(amountInINR, currency);
  const convert = (amountInINR: number) => convertFromINR(amountInINR, currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert, availableCurrencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
