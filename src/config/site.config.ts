export interface SiteContactConfig {
  address: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface SiteSocialsConfig {
  facebook: string;
  twitter: string;
  instagram: string;
  pinterest: string;
  linkedin: string;
  tiktok?: string;
  youtube?: string;
}

export interface SiteLocalizationConfig {
  defaultLocale: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  direction: "ltr" | "rtl";
  timezone: string;
}

export interface SiteBrandConfig {
  name: string;
  shortName: string;
  fullName: string;
  /** Lowercase, URL-safe id. Used for file names, storage folders, and sync channels. */
  slug: string;
  tagline: string;
  description: string;
  url: string;
  welcomeMessage: string;
  copyright: string;
  /** Used in generic copy, e.g. "Explore our most-loved {productNoun} this week". */
  productNoun: string;
}

export interface SiteSeoConfig {
  keywords: string[];
  alternateNames: string[];
  pages: {
    shop: { title: string; description: string };
    blog: { title: string; description: string };
    cart: { description: string };
    checkout: { description: string };
    login: { description: string };
    wishlist: { title: string };
    admin: { title: string; description: string };
  };
}

export interface SiteAdminConfig {
  dashboardTitle: string;
  emailPlaceholder: string;
}

export interface SiteConfig {
  brand: SiteBrandConfig;
  contact: SiteContactConfig;
  socials: SiteSocialsConfig;
  localization: SiteLocalizationConfig;
  seo: SiteSeoConfig;
  admin: SiteAdminConfig;
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "3Uqab Perfume",
    shortName: "3Uqab",
    fullName: "Three Uqab",
    slug: "3uqab",
    tagline: "Luxury Arabian Oud & Eau de Parfum",
    description:
      "Discover handcrafted luxury perfumes, authentic Arabian Oud, and long-lasting Eau de Parfum by 3Uqab Perfume (Three Uqab).",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://3uqab.com",
    welcomeMessage: "Welcome to 3Uqab Perfume Official Online Store!",
    copyright: `© ${new Date().getFullYear()} 3Uqab Perfume. All rights reserved.`,
    productNoun: "fragrances",
  },

  seo: {
    keywords: [
      "3Uqab",
      "3Uqab Perfume",
      "Three Uqab",
      "Three Uqab Perfume",
      "Uqab Eau de Parfum",
      "Arabian Oud",
      "Luxury Perfumes Karachi",
    ],
    alternateNames: ["3Uqab", "Three Uqab", "3Uqab Fragrances Karachi"],
    pages: {
      shop: {
        title: "Shop Luxury Perfumes & Arabian Oud",
        description:
          "Browse the complete 3Uqab Perfume catalog. Discover long-lasting Eau de Parfum, Arabian Oud, and unisex fragrances.",
      },
      blog: {
        title: "Perfume Journal & Fragrance Guides",
        description:
          "Read expert guides on Arabian Oud layering, fragrance notes, and luxury perfume care by 3Uqab Perfume.",
      },
      cart: { description: "Review your selected items before checkout." },
      checkout: { description: "Complete your order securely." },
      login: { description: "Sign in to track your orders and wishlist." },
      wishlist: { title: "My Wishlist" },
      admin: {
        title: "Admin Dashboard",
        description:
          "Manage orders, deliveries, products, categories, blogs, and storefront settings.",
      },
    },
  },

  admin: {
    dashboardTitle: "3Uqab Dashboard",
    emailPlaceholder: "owner@example.com",
  },

  contact: {
    address:
      "Shop # 70, Ground Floor, City Residency & Shopping Galleria, Aga Khan III Road (Garden Road), Garden East, Saddar, Karachi, Pakistan",
    streetAddress:
      "Shop # 70, Ground Floor, City Residency & Shopping Galleria, Aga Khan III Road (Garden Road)",
    addressLocality: "Garden East, Saddar, Karachi",
    addressRegion: "Sindh",
    postalCode: "74400",
    addressCountry: "PK",
    phone: "(+92) 344 2415083",
    email: "info@3uqab.com",
    whatsappNumber: "+923442415083",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6302.435736831678!2d67.02174945219986!3d24.870722126230422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f66e2e280b7%3A0xd1b6da56d974eac!2zQ2l0eSBSZXNpZGVuY3kgYW5kIFNob3BwaW5nIEdhbGxlcmlhINiz2bnbjCDYsduM2LLbjNqI2YbYs9uMINin24zZhtqIINi02KfZvtmG2q8g2q_bjNmE2LHbjNin!5e0!3m2!1sen!2s!4v1794864674866!5m2!1sen!2s",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=City+Residency+and+Shopping+Galleria+Karachi",
    coordinates: {
      latitude: 24.870722,
      longitude: 67.021749,
    },
  },

  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61584388492524",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    linkedin: "https://linkedin.com",
  },

  localization: {
    defaultLocale: "en-PK",
    currency: "Rs",
    currencyCode: "PKR",
    currencySymbol: "Rs",
    direction: "ltr",
    timezone: "Asia/Karachi",
  },
};
