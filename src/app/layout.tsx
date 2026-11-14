import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haiiweaes.com"),
  title: "HAII WEAES // NOT FOR EVERYONE. — Independent Luxury Streetwear",
  description: "Independent multi-category fashion label blending experimental streetwear, heavyweight architectural cuts and dark luxury aesthetics. Featuring 3D Virtual Fitting Studio.",
  icons: {
    icon: "/brand/icon.svg",
    shortcut: "/brand/icon.svg",
    apple: "/brand/icon.svg",
  },
  openGraph: {
    title: "HAII WEAES // NOT FOR EVERYONE.",
    description: "Independent multi-category streetwear label. Small-batch releases. 3D Virtual Fitting Studio.",
    url: "https://haiiweaes.com",
    siteName: "HAII WEAES",
    images: [
      {
        url: "/campaign/hero-garage-model.jpg",
        width: 1200,
        height: 630,
        alt: "HAII WEAES Campaign",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080808] text-white">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
