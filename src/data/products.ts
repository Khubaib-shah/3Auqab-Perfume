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
  bottleFinishes: { label: string; className: string }[];
}
