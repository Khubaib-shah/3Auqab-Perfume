import { siteConfig } from "@/data/siteConfig";
import { Product } from "@/data/products";
import { BlogPost } from "@/data/blogs";
import { initialPerfumeCatalog } from "@/data/perfumeCatalog";

export interface AnnouncementItem {
  id: string;
  text: string;
  isActive: boolean;
  sortOrder: number;
}

export interface HeroSlideItem {
  id: string;
  styleClass: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  priceLabel?: string;
  priceValue?: string;
  codeLabel?: string;
  codeValue?: string;
  btnClass: string;
  bgImage?: string;
  link?: string;
  isActive: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  isActive: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  showInNav: boolean;
  sortOrder: number;
}

export interface AdminProduct extends Product {
  stockQuantity: number;
  isWeeklyFeatured?: boolean;
}

export interface AdminBlogPost extends BlogPost {
  isPublished: boolean;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "CARD";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export interface OrderLineItem {
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  variantSize: string;
  variantFinish: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface OrderStatusLogEntry {
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  items: OrderLineItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  courierName: string;
  trackingNumber: string;
  trackingUrl: string;
  adminNotes: string;
  statusHistory: OrderStatusLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED";
  createdAt: string;
}

export interface NewsletterSubscriberRecord {
  id: string;
  email: string;
  source: string;
  isActive: boolean;
  createdAt: string;
}

export interface StoreSettingsRecord {
  name: string;
  shortName: string;
  fullName: string;
  tagline: string;
  description: string;
  url: string;
  promoCode: string;
  currency: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  whatsappNumber: string;
  welcomeMessage: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    mapEmbedUrl: string;
  };
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    pinterest: string;
    linkedin: string;
  };
  popularTags: string[];
  logo?: string;
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset: string;
    rootFolder: string;
  };
}

export interface VoucherItem {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  createdAt: string;
}

export interface PromoBannersRecord {
  homeCard1: {
    subtitle: string;
    title: string;
    code: string;
    link: string;
    image?: string;
  };
  homeCard2: {
    subtitle: string;
    title: string;
    code: string;
    link: string;
    image?: string;
  };
  homeFullwidth: {
    subtitle: string;
    title: string;
    highlightText: string;
    tagline: string;
    link: string;
    image?: string;
  };
  shopSlide1: {
    subtitle: string;
    title: string;
    code: string;
    link: string;
  };
  shopSlide2: {
    title: string;
    description: string;
    priceLabel: string;
    priceValue: string;
    link: string;
  };
}

export interface DatabaseSchema {
  settings: StoreSettingsRecord;
  announcements: AnnouncementItem[];
  heroSlides: HeroSlideItem[];
  testimonials: TestimonialItem[];
  categories: CategoryItem[];
  products: AdminProduct[];
  blogs: AdminBlogPost[];
  orders: OrderRecord[];
  messages: ContactMessageRecord[];
  subscribers: NewsletterSubscriberRecord[];
  vouchers: VoucherItem[];
  promoBanners: PromoBannersRecord;
}

export function getInitialDatabaseSeed(): DatabaseSchema {
  return {
    settings: {
      name: siteConfig.name,
      shortName: siteConfig.shortName,
      fullName: siteConfig.fullName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      url: siteConfig.url,
      promoCode: siteConfig.promoCode,
      currency: siteConfig.currency,
      freeShippingThreshold: 5000,
      flatShippingRate: 250,
      whatsappNumber: "+923001234567",
      welcomeMessage: siteConfig.welcomeMessage,
      contact: { ...siteConfig.contact },
      socials: { ...siteConfig.socials },
      popularTags: [...siteConfig.popularTags],
      logo: "/assets/images/logo.webp",
    },
    announcements: (siteConfig.announcements || []).map((text, idx) => ({
      id: `ann-${idx + 1}`,
      text,
      isActive: true,
      sortOrder: idx + 1,
    })),
    heroSlides: [...siteConfig.heroSlides],
    testimonials: [],
    categories: [
      {
        id: "cat-1",
        name: "New Arrivals",
        slug: "new-arrivals",
        isActive: true,
        showInNav: true,
        sortOrder: 1,
        description: "Latest luxury fragrances crafted by 3Uqab Perfume (Three Uqab).",
      },
      {
        id: "cat-2",
        name: "Arabian Oud",
        slug: "arabian-oud",
        isActive: true,
        showInNav: true,
        sortOrder: 2,
        description: "Authentic Arabian Oud and precious attars crafted by 3Uqab Perfume (Three Uqab).",
      },
      {
        id: "cat-3",
        name: "Unisex Collection",
        slug: "unisex",
        isActive: true,
        showInNav: true,
        sortOrder: 3,
        description: "Versatile luxury Eau de Parfum crafted by 3Uqab Perfume (Three Uqab).",
      },
      {
        id: "cat-4",
        name: "Men's Fragrances",
        slug: "mens-fragrances",
        isActive: true,
        showInNav: true,
        sortOrder: 4,
        description: "Commanding and fresh masculine perfumes crafted by 3Uqab Perfume (Three Uqab).",
      },
      {
        id: "cat-5",
        name: "Women's Fragrances",
        slug: "womens-fragrances",
        isActive: true,
        showInNav: true,
        sortOrder: 5,
        description: "Enchanting floral and oriental perfumes crafted by 3Uqab Perfume (Three Uqab).",
      },
    ],
    products: [...initialPerfumeCatalog],
    blogs: [],
    orders: [],
    messages: [],
    subscribers: [],
    vouchers: [
      {
        id: "vouch-1",
        code: "3UQAB",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderAmount: 0,
        isActive: true,
        createdAt: "2026-01-01",
      },
      {
        id: "vouch-2",
        code: "OUD30",
        discountType: "PERCENTAGE",
        discountValue: 30,
        minOrderAmount: 4000,
        isActive: true,
        createdAt: "2026-01-01",
      },
    ],
    promoBanners: {
      homeCard1: { ...siteConfig.promoBanners.homeCard1 },
      homeCard2: { ...siteConfig.promoBanners.homeCard2 },
      homeFullwidth: { ...siteConfig.promoBanners.homeFullwidth },
      shopSlide1: { ...siteConfig.promoBanners.shopSlide1 },
      shopSlide2: { ...siteConfig.promoBanners.shopSlide2 },
    },
  };
}
