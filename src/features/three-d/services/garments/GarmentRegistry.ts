import { GarmentManifestEntry } from "../../types/GarmentTypes";

export const GARMENT_REGISTRY: Record<string, GarmentManifestEntry> = {
  prod_01: {
    productId: "prod_01",
    garmentId: "nocturn-hoodie",
    title: "NOCTURN OVERSIZED HEAVYWEIGHT HOODIE",
    category: "top",
    defaultSize: "L",
    price: 4999,
    slug: "nocturn-oversized-heavyweight-hoodie",
    image: "/products/nocturn-hoodie-1.jpg",
    description: "480 GSM French Terry Cotton boxy cut with draped streetwear hood.",
    colors: [
      { name: "Onyx Black", hex: "#0c0c0c" },
      { name: "Washed Slate", hex: "#2b3038" },
      { name: "Crimson Red", hex: "#b81d18" }
    ],
    sizes: {
      S: { size: "S", modelUrl: "/assets/3d/garments/prod_01/S/model.glb", bytes: 44160 },
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_01/M/model.glb", bytes: 44184 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_01/L/model.glb", bytes: 44192 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_01/XL/model.glb", bytes: 44224 },
      XXL: { size: "XXL", modelUrl: "/assets/3d/garments/prod_01/XXL/model.glb", bytes: 44184 }
    }
  },
  prod_02: {
    productId: "prod_02",
    garmentId: "london-dark-tee",
    title: "LONDON AFTER DARK GRAPHIC TEE",
    category: "top",
    defaultSize: "L",
    price: 2499,
    slug: "london-after-dark-graphic-tee",
    image: "/products/london-dark-tee-1.jpg",
    description: "260 GSM single jersey boxy graphic tee with dropped shoulders.",
    colors: [
      { name: "Washed Phantom", hex: "#161616" },
      { name: "Chalk White", hex: "#e5e5e5" }
    ],
    sizes: {
      S: { size: "S", modelUrl: "/assets/3d/garments/prod_02/S/model.glb", bytes: 38056 },
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_02/M/model.glb", bytes: 38120 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_02/L/model.glb", bytes: 38096 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_02/XL/model.glb", bytes: 38060 }
    }
  },
  prod_03: {
    productId: "prod_03",
    garmentId: "tactical-cargo",
    title: "ARCHIVE TACTICAL CARGO TROUSERS",
    category: "bottom",
    defaultSize: "L",
    price: 6299,
    slug: "archive-tactical-cargo-trousers",
    image: "/products/tactical-cargo-1.jpg",
    description: "Heavyweight ripstop with 3D pleated accordion pockets and ankle cinches.",
    colors: [
      { name: "Obsidian Black", hex: "#121212" },
      { name: "Combat Olive", hex: "#283020" }
    ],
    sizes: {
      S: { size: "S", modelUrl: "/assets/3d/garments/prod_03/S/model.glb", bytes: 21396 },
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_03/M/model.glb", bytes: 21400 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_03/L/model.glb", bytes: 21428 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_03/XL/model.glb", bytes: 21428 }
    }
  },
  prod_04: {
    productId: "prod_04",
    garmentId: "apocalypse-bomber",
    title: "APOCALYPSE REVERSIBLE BOMBER JACKET",
    category: "top",
    defaultSize: "L",
    price: 9999,
    slug: "apocalypse-reversible-bomber-jacket",
    image: "/products/bomber-jacket-1.jpg",
    description: "Reversible heavyweight flight nylon with MA-1 sleeve utility pocket.",
    colors: [
      { name: "Matte Black", hex: "#111111" },
      { name: "Crimson Silk", hex: "#a11818" }
    ],
    sizes: {
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_04/M/model.glb", bytes: 18788 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_04/L/model.glb", bytes: 18800 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_04/XL/model.glb", bytes: 18840 }
    }
  },
  prod_05: {
    productId: "prod_05",
    garmentId: "selvedge-denim",
    title: "RAW SELVEDGE RELAXED DENIM",
    category: "bottom",
    defaultSize: "L",
    price: 5899,
    slug: "raw-selvedge-relaxed-denim",
    image: "/products/selvedge-denim-1.jpg",
    description: "14.5oz Japanese shuttle-loom raw selvedge denim with classic red-line ID.",
    colors: [
      { name: "Deep Indigo Raw", hex: "#141822" },
      { name: "Overdyed Jet Black", hex: "#0b0c0e" }
    ],
    sizes: {
      S: { size: "S", modelUrl: "/assets/3d/garments/prod_05/S/model.glb", bytes: 17776 },
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_05/M/model.glb", bytes: 17772 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_05/L/model.glb", bytes: 17788 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_05/XL/model.glb", bytes: 17800 }
    }
  },
  prod_06: {
    productId: "prod_06",
    garmentId: "boxy-flannel",
    title: "MONOLITH BOXY FLANNEL SHIRT",
    category: "top",
    defaultSize: "L",
    price: 3899,
    slug: "monolith-boxy-flannel-shirt",
    image: "/products/boxy-flannel-1.jpg",
    description: "Heavy brushed cotton flannel with camp collar and dual chest utility pockets.",
    colors: [
      { name: "Espresso Shadow", hex: "#221a16" },
      { name: "Ghost Grey Plaid", hex: "#32363a" }
    ],
    sizes: {
      S: { size: "S", modelUrl: "/assets/3d/garments/prod_06/S/model.glb", bytes: 22436 },
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_06/M/model.glb", bytes: 22464 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_06/L/model.glb", bytes: 22472 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_06/XL/model.glb", bytes: 22460 }
    }
  },
  prod_11: {
    productId: "prod_11",
    garmentId: "crossbody-bag",
    title: "TECHNICAL CROSSBODY MODULAR BAG",
    category: "accessory",
    defaultSize: "ONE_SIZE",
    price: 3499,
    slug: "technical-crossbody-modular-bag",
    image: "/products/crossbody-bag-1.jpg",
    description: "Cordura 500D nylon modular sling with aluminum quick-release cobra buckle.",
    colors: [{ name: "Stealth Black", hex: "#0a0a0a" }],
    sizes: {
      ONE_SIZE: { size: "ONE_SIZE", modelUrl: "/assets/3d/garments/prod_11/ONE_SIZE/model.glb", bytes: 8940 }
    }
  },
  prod_14: {
    productId: "prod_14",
    garmentId: "carpenter-shorts",
    title: "UTILITY HEAVY CARPENTER SHORTS",
    category: "bottom",
    defaultSize: "L",
    price: 3299,
    slug: "utility-heavy-carpenter-shorts",
    image: "/products/carpenter-shorts-1.jpg",
    description: "12oz duck canvas with hammer loop and reinforced tool pockets.",
    colors: [
      { name: "Raw Canvas Black", hex: "#1a1a1a" },
      { name: "Desert Sand", hex: "#544c3c" }
    ],
    sizes: {
      S: { size: "S", modelUrl: "/assets/3d/garments/prod_14/S/model.glb", bytes: 17768 },
      M: { size: "M", modelUrl: "/assets/3d/garments/prod_14/M/model.glb", bytes: 17772 },
      L: { size: "L", modelUrl: "/assets/3d/garments/prod_14/L/model.glb", bytes: 17772 },
      XL: { size: "XL", modelUrl: "/assets/3d/garments/prod_14/XL/model.glb", bytes: 17752 }
    }
  },
  prod_16: {
    productId: "prod_16",
    garmentId: "silver-chain",
    title: "STATEMENT CHUNKY SILVER CHAIN",
    category: "accessory",
    defaultSize: "ONE_SIZE",
    price: 3999,
    slug: "statement-chunky-silver-chain-carabiner",
    image: "/products/silver-chain-1.jpg",
    description: "12mm solid curb Cuban link chain with industrial carabiner closure.",
    colors: [{ name: "Polished Silver", hex: "#d8d8d8" }],
    sizes: {
      ONE_SIZE: { size: "ONE_SIZE", modelUrl: "/assets/3d/garments/prod_16/ONE_SIZE/model.glb", bytes: 31472 }
    }
  }
};

export function getGarmentByProductId(id: string): GarmentManifestEntry | undefined {
  return GARMENT_REGISTRY[id];
}

export function getAllGarments(): GarmentManifestEntry[] {
  return Object.values(GARMENT_REGISTRY);
}
