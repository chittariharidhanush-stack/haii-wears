export type GarmentCategory = "top" | "bottom" | "accessory";

export interface GarmentSizeVariant {
  size: string;
  modelUrl: string;
  bytes: number;
}

export interface GarmentManifestEntry {
  productId: string;
  garmentId: string;
  title: string;
  category: GarmentCategory;
  defaultSize: string;
  sizes: Record<string, GarmentSizeVariant>;
  colors: { name: string; hex: string }[];
  price: number;
  slug: string;
  image: string;
  description?: string;
}

