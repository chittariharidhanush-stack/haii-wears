export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  established: string;
  description: string;
  manifesto: {
    number: string;
    title: string;
    description: string;
  }[];
  announcements: {
    id: string;
    text: string;
    link?: string;
    active: boolean;
  }[];
  contact: {
    email: string;
    phone: string;
    address: string;
    studios: string[];
  };
  social: {
    instagram: string;
    tiktok: string;
    pinterest: string;
    twitter: string;
    youtube?: string;
  };
  shipping: {
    freeShippingThresholdINR: number;
    freeShippingThresholdUSD: number;
    domesticFlatRateINR: number;
    internationalFlatRateUSD: number;
    estimatedDeliveryIndia: string;
    estimatedDeliveryInternational: string;
  };
  currencies: {
    code: string;
    symbol: string;
    rateToINR: number; // 1 INR = rate
    label: string;
  }[];
  nextDrop: {
    name: string;
    tagline: string;
    date: string; // ISO date string
    description: string;
  };
}

export const brandConfig: BrandConfig = {
  name: "HAII WEAES",
  shortName: "HW",
  tagline: "NOT FOR EVERYONE.",
  subTagline: "LIMITED PIECES. UNLIMITED NIGHTS. STREETWEAR FOR THE ONES OUTSIDE THE LINES.",
  established: "2024",
  description: "Independent multi-category fashion label blending experimental streetwear, heavyweight architectural cuts and dark luxury aesthetics.",
  manifesto: [
    {
      number: "01",
      title: "NOT MASS. NOT MAINSTREAM.",
      description: "Small-batch releases with a point of view. We produce in limited runs so every piece carries true weight and individuality."
    },
    {
      number: "02",
      title: "A NEW CHAPTER. EVERY MONTH.",
      description: "The 23rd, 18:00 UTC. A focused edit of heavyweight outerwear, graphic tees, tailored cargo silhouettes and everyday carry."
    },
    {
      number: "03",
      title: "NO RESTOCKS. NO REPEATS.",
      description: "Every drop tells its own story. When an edition closes, we move forward. The archive stays. The pieces do not return."
    }
  ],
  announcements: [
    {
      id: "ann-1",
      text: "▪ INDEPENDENT STREETWEAR. LIMITED PRODUCTION RUNS.",
      active: true
    },
    {
      id: "ann-2",
      text: "NEXT DROP: THE 23RD 18:00 UTC — GET ON THE LIST ↗",
      link: "#newsletter",
      active: true
    },
    {
      id: "ann-3",
      text: "FREE WORLDWIDE EXPRESS SHIPPING OVER ₹4,999 / $150",
      active: true
    }
  ],
  contact: {
    email: "concierge@haiiweaes.com",
    phone: "+91 (0) 22 8940 3320",
    address: "HAII WEAES ATELIER, 14 MILL COMPOUND, LOWER PAREL, MUMBAI 400013",
    studios: ["MUMBAI", "LONDON", "TOKYO"]
  },
  social: {
    instagram: "https://instagram.com/haiiweaes",
    tiktok: "https://tiktok.com/@haiiweaes",
    pinterest: "https://pinterest.com/haiiweaes",
    twitter: "https://x.com/haiiweaes"
  },
  shipping: {
    freeShippingThresholdINR: 2999,
    freeShippingThresholdUSD: 100,
    domesticFlatRateINR: 150,
    internationalFlatRateUSD: 25,
    estimatedDeliveryIndia: "2-4 Business Days",
    estimatedDeliveryInternational: "4-7 Business Days (DHL Express)"
  },
  currencies: [
    { code: "INR", symbol: "₹", rateToINR: 1, label: "IN · ₹" },
    { code: "USD", symbol: "$", rateToINR: 0.012, label: "US · $" },
    { code: "EUR", symbol: "€", rateToINR: 0.011, label: "EU · €" },
    { code: "GBP", symbol: "£", rateToINR: 0.0095, label: "UK · £" }
  ],
  nextDrop: {
    name: "CHAPTER 04 // NO CURFEW",
    tagline: "HEAVYWEIGHT ESSENTIALS FOR LIFE AFTER THE LAST TRAIN",
    date: "2026-11-23T18:00:00.000Z",
    description: "Featuring 480 GSM double-faced terry hoodies, garment-dyed raw denim, and tactical modular accessories. Strict limitation of 120 units per silhouette."
  }
};
