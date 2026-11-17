import {
  siteConfig as newSiteConfig,
  themeConfig,
  assetsConfig,
  navigationConfig,
  businessConfig,
  contentConfig,
} from "@/config";

export type {
  HeroSlide as HeroSlideConfig,
  PromoBanners as PromoBannersConfig,
  DualPromoBanners as DualPromoBannersConfig,
} from "@/config/content.config";

/**
 * Backward-compatible facade for legacy imports from `@/data/siteConfig`.
 * Bridges legacy calls to the new white-label centralized config system in `@/config`.
 */
export const siteConfig = {
  // Brand & Identity
  name: newSiteConfig.brand.name,
  shortName: newSiteConfig.brand.shortName,
  fullName: newSiteConfig.brand.fullName,
  logo: assetsConfig.logo,
  whatsappNumber: newSiteConfig.contact.whatsappNumber,
  tagline: newSiteConfig.brand.tagline,
  description: newSiteConfig.brand.description,
  url: newSiteConfig.brand.url,
  promoCode: businessConfig.promo.defaultCode,
  currency: newSiteConfig.localization.currency,
  welcomeMessage: newSiteConfig.brand.welcomeMessage,

  // Announcements Marquee
  announcements: navigationConfig.announcements,

  // Contact Information
  contact: newSiteConfig.contact,

  // Social Channels
  socials: newSiteConfig.socials,

  // Categories & Tags
  categories: [] as { name: string; slug: string }[],
  popularTags: [
    "3Uqab",
    "Eau de Parfum",
    "Arabian Oud",
    "Amber & Musk",
    "Rose & Oud",
    "Unisex Scents",
    "Gift Sets",
  ],

  // Content & Banners
  heroSlides: contentConfig.heroSlides,
  promoBanners: contentConfig.promoBanners,
  dualPromoBanners: contentConfig.dualPromoBanners,

  // Theme & Assets
  theme: themeConfig,
  assets: assetsConfig,
  business: businessConfig,
};

export default siteConfig;
