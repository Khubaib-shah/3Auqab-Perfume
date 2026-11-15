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
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  sizes: string[];
  bottleFinishes?: { label: string; className: string }[];
  sizePrices?: Record<string, number>;
  sizeImages?: Record<string, string>;
}

export const BOTTLE_SIZES = ["15ml", "30ml", "50ml", "100ml"] as const;

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
