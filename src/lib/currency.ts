import { brandConfig } from "@/config/brand";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rateToINR: number;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: "INR", symbol: "₹", rateToINR: 1, label: "IN · ₹" },
  USD: { code: "USD", symbol: "$", rateToINR: 0.012, label: "US · $" },
  EUR: { code: "EUR", symbol: "€", rateToINR: 0.011, label: "EU · €" },
  GBP: { code: "GBP", symbol: "£", rateToINR: 0.0095, label: "UK · £" },
};

export function convertFromINR(amountInINR: number, targetCurrency: CurrencyCode): number {
  const currency = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  return Math.round(amountInINR * currency.rateToINR);
}

export function formatPrice(amountInINR: number, currencyCode: CurrencyCode = "INR"): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = convertFromINR(amountInINR, currencyCode);

  if (currencyCode === "INR") {
    return `₹${amountInINR.toLocaleString("en-IN")}`;
  } else if (currencyCode === "USD") {
    return `$${converted.toLocaleString("en-US")}`;
  } else if (currencyCode === "EUR") {
    return `€${converted.toLocaleString("de-DE")}`;
  } else if (currencyCode === "GBP") {
    return `£${converted.toLocaleString("en-GB")}`;
  }

  return `${currency.symbol}${converted}`;
}
