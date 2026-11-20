import { businessConfig } from "@/config";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isWeeklyFeatured?: boolean;
  image: string;
  blackCardImage?: string;
  orderThumb?: string;
  cartThumb?: string;
  gallery: string[];
  sku: string;
  inStock: boolean;
  shortBullets: string[];
  description: string[];
  notes?: {
    top: string;
    heart: string;
    base: string;
  };
  specifications?: Record<string, string>;
  sizes: string[];
  defaultSize?: string;
  bottleFinishes?: { label: string; className: string }[];
  sizePrices?: Record<string, number>;
  sizeImages?: Record<string, string>;
}

export const DEFAULT_VARIANTS = businessConfig.variant.options;
export const BOTTLE_SIZES = DEFAULT_VARIANTS;
export const DEFAULT_PRODUCT_SIZE = "50ml";

export function getDefaultProductSize(
  product?: Pick<Product, "sizes" | "defaultSize">
): string {
  if (product?.defaultSize && product.sizes?.includes(product.defaultSize)) {
    return product.defaultSize;
  }
  if (product?.sizes && product.sizes.length > 0) {
    if (product.sizes.includes(DEFAULT_PRODUCT_SIZE)) {
      return DEFAULT_PRODUCT_SIZE;
    }
    return product.sizes[0];
  }
  return DEFAULT_PRODUCT_SIZE;
}

export const DEFAULT_SIZE_PRICES: Record<string, number> = {
  "15ml": 600,
  "30ml": 1200,
  "50ml": 2000,
  "100ml": 4000,
};

export const DEFAULT_SIZE_OLD_PRICES: Record<string, number> = {
  "15ml": 750,
  "30ml": 1500,
  "50ml": 2500,
  "100ml": 5000,
};

export function getProductPriceForSize(product: Product, size?: string): number {
  if (size && product.sizePrices && product.sizePrices[size] !== undefined) {
    return product.sizePrices[size];
  }
  if (size && DEFAULT_SIZE_PRICES[size] !== undefined) {
    return DEFAULT_SIZE_PRICES[size];
  }
  return product.price || 600;
}

export function getProductOldPriceForSize(
  product: Product,
  size?: string
): number | undefined {
  if (size && DEFAULT_SIZE_OLD_PRICES[size] !== undefined) {
    return DEFAULT_SIZE_OLD_PRICES[size];
  }
  return product.oldPrice;
}

export function getProductPhotoForSize(
  product?: Product,
  size?: string
): string {
  if (!product) return "";
  if (size && product.sizeImages && product.sizeImages[size]) {
    return product.sizeImages[size];
  }
  if (size && product.sizes && product.gallery && product.gallery.length > 0) {
    const sizeIdx = product.sizes.indexOf(size);
    if (sizeIdx !== -1 && product.gallery[sizeIdx]) {
      return product.gallery[sizeIdx];
    }
  }
  return product.gallery?.[0] || product.image || "";
}
