export interface HeroSlideConfig {
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

export interface PromoBannersConfig {
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

export interface DualPromoBannersConfig {
  card1: {
    subtitle: string;
    title: string;
    link: string;
    buttonText: string;
  };
  card2: {
    subtitle: string;
    title: string;
    link: string;
    buttonText: string;
  };
}

export const siteConfig = {
  // Brand & Identity (Single Source of Truth)
  name: "3Uqab Perfume",
  shortName: "3Uqab",
  fullName: "Three Uqab",
  logo: "/assets/images/logo.webp",
  whatsappNumber: "+923001234567",
  tagline: "Luxury Arabian Oud & Eau de Parfum",
  description:
    "Discover handcrafted luxury perfumes, authentic Arabian Oud, and long-lasting Eau de Parfum by 3Uqab Perfume (Three Uqab).",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://3uqab.com",
  promoCode: "3UQAB20",
  currency: "Rs",
  welcomeMessage: "Welcome to 3Uqab Perfume Official Online Store!",

  // Announcement Marquee (Top of Header)
  announcements: [
    "✦ Free Shipping on All Orders Above Rs 5,000 Across Pakistan",
    "✦ Use Promo Code 3UQAB20 for 20% Off Your Entire Order",
    "✦ Pure Arabian Oud & Concentrated Attar — 100% Authentic & Long-Lasting",
    "✦ Fast Express Cash on Delivery (COD) Nationwide",
  ],

  // Contact Information
  contact: {
    address: "45 Al Wasl Road, Jumeirah, Dubai, UAE",
    phone: "(+971) 4 123 4567",
    email: "concierge@3uqab.com",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Jumeirah%20Dubai&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },

  // Social Channels
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61584388492524",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    linkedin: "https://linkedin.com",
  },

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

  // =========================================================================
  // STATIC BANNERS CONFIGURATION (Instant Load — Zero Backend Delay)
  // Edit here to customize homepage hero slides, cards, and promo banners.
  // Changes made in this file reflect immediately across the entire website.
  // =========================================================================
  heroSlides: [
    {
      id: "slide-1",
      styleClass: "style4",
      subtitle: "Luxury French & Arabian Attar",
      titleLine1: "Crafted For",
      titleLine2: "Elegance",
      codeLabel: "Use Promo Code:",
      codeValue: "3UQAB20",
      btnClass: "btn-shop-the-look",
      bgImage: "/assets/images/slider-thumb-full-1.jpg",
      link: "/shop",
      isActive: true,
    },
    {
      id: "slide-2",
      styleClass: "style5",
      subtitle: "Pure Concentrated Perfume",
      titleLine1: "Signature Oud",
      titleLine2: "Collection",
      priceLabel: "Starting from:",
      priceValue: "Rs 3,499",
      btnClass: "btn-shop-the-look",
      bgImage: "/assets/images/slider-thumb-full-2.jpg",
      link: "/shop",
      isActive: true,
    },
    {
      id: "slide-3",
      styleClass: "style6",
      subtitle: "Long-Lasting Projection",
      titleLine1: "Royal Amber &",
      titleLine2: "Smoky Woods",
      codeLabel: "Special Offer:",
      codeValue: "20% OFF",
      btnClass: "btn-shop-the-look",
      bgImage: "/assets/images/slider-thumb-full-3.jpg",
      link: "/shop",
      isActive: true,
    },
  ] as HeroSlideConfig[],

  promoBanners: {
    homeCard1: {
      subtitle: "Limited Edition",
      title: "Oud & Attar\n30% Off",
      code: "3UQAB20",
      link: "/shop",
      image: "/assets/images/banner-home-10.jpg",
    },
    homeCard2: {
      subtitle: "Luxury Gift Bundles",
      title: "Signature\nScents",
      code: "3UQAB20",
      link: "/shop",
      image: "/assets/images/banner-home-11.jpg",
    },
    homeFullwidth: {
      subtitle: "3Uqab Exclusive",
      title: "Royal Collection",
      highlightText: "20%",
      tagline: "Handcrafted 100ml Eau de Parfum",
      link: "/shop",
      image: "/assets/images/banner-01_full_width.jpg",
    },
    shopSlide1: {
      subtitle: "Elevate Your Presence!",
      title: "Flash Sale Up To\n20% Off",
      code: "3UQAB20",
      link: "/shop",
    },
    shopSlide2: {
      title: "Royal Oud Collection",
      description: "Experience authentic Dubai & French perfumery craftsmanship",
      priceLabel: "Bundle Price:",
      priceValue: "Rs 8,500",
      link: "/shop",
    },
  } as PromoBannersConfig,

  dualPromoBanners: {
    card1: {
      subtitle: "Unisex & Oriental \nNew Arrivals",
      title: "Scents for \nEvery Mood",
      link: "/shop",
      buttonText: "Shop now",
    },
    card2: {
      subtitle: "3Uqab luxury, all-day \nlong-lasting projection!",
      title: "Signature Oud Sale",
      link: "/shop",
      buttonText: "Shop now",
    },
  } as DualPromoBannersConfig,
};
