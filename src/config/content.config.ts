export interface HeroSlide {
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

export interface PromoBanners {
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
    image?: string;
  };
  shopSlide2: {
    title: string;
    description: string;
    priceLabel: string;
    priceValue: string;
    link: string;
    image?: string;
  };
}

export interface DualPromoBanners {
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

export interface FeatureBox {
  iconClass: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContentConfig {
  heroSlides: HeroSlide[];
  promoBanners: PromoBanners;
  dualPromoBanners: DualPromoBanners;
  about: {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerCta: string;
    features: FeatureBox[];
    storyTitle: string;
    storyParagraphs: string[];
    teamTitle: string;
    teamSubtitle: string;
    teamMembers: TeamMember[];
  };
  faqs: FaqItem[];
  faqSection: {
    subtitle: string;
    title: string;
    image: string;
    imageAlt: string;
    imageBadge: string;
    imageTitle: string;
    imageDescription: string;
    imageCta: string;
  };
  weeklyFeatured: { title: string; subtitle: string };
}

export const contentConfig: ContentConfig = {
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
  ],

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
      image: "/assets/images/banner-01_full_width.png",
    },
    shopSlide1: {
      subtitle: "Elevate Your Presence!",
      title: "Flash Sale Up To\n20% Off",
      code: "3UQAB20",
      link: "/shop",
      image: "/assets/images/banner-01_full_width.jpg",
    },
    shopSlide2: {
      title: "Royal Oud Collection",
      description: "Experience authentic Dubai & French perfumery craftsmanship",
      priceLabel: "Bundle Price:",
      priceValue: "Rs 8,500",
      link: "/shop",
      image: "/assets/images/banner-02_full_width.jpg",
    },
  },

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
  },

  about: {
    bannerTitle: "Pure Scents\nHandcrafted in Karachi",
    bannerSubtitle:
      "Mastering the royal legacy of pure Arabian Oud,\nconcentrated attars, and bespoke Eau de Parfum.",
    bannerCta: "Explore Collection",

    features: [
      {
        iconClass: "flaticon-rocket-ship",
        title: "Express Karachi Delivery",
        description:
          "Fast & reliable delivery exclusively across Karachi with Cash on Delivery (COD). Free delivery on orders above Rs 3,000.",
      },
      {
        iconClass: "flaticon-return",
        title: "100% Pure & Potent Oils",
        description:
          "Handcrafted concentrated attars, aged Dehn Al Oud, and luxury EDPs guaranteed for 12+ hours of lasting sillage.",
      },
      {
        iconClass: "flaticon-padlock",
        title: "Fragrance Concierge",
        description:
          "Direct consultation to help you discover your signature note or select an exclusive gift. We are here to assist you.",
      },
    ],

    storyTitle: "The 3Uqab Story",
    storyParagraphs: [
      "Rooted in Karachi, 3Uqab (Three Uqab Perfumes) brings the majesty of traditional Eastern perfumery to modern fragrance lovers. Inspired by the eagle (Uqab)—symbolizing regal strength and elevation—our atelier curates only the finest pure non-alcoholic attars, rare Dehn Al Oud, and contemporary Eau de Parfum formulations.",
      "Every blend is meticulously aged and bottled right here in Karachi, ensuring maximum longevity, rich scent development, and an unforgettable sillage.",
    ],

    teamTitle: "Meet Our Master Perfumers",
    teamSubtitle: "The Artisans Behind 3Uqab Fragrances",
    teamMembers: [
      {
        name: "Yahya",
        role: "Founder & Master Perfumer, 3Uqab",
        avatar: "/assets/images/yahya-3uqab-perfume-brand-owner.jpeg",
      },
      {
        name: "3 Uqab",
        role: "Head of Oud Sourcing & Distillation",
        avatar: "/assets/images/logo.webp",
      },
      {
        name: "Zakariya",
        role: "Creative Fragrance Director",
        avatar: "/assets/images/zakariya-3uqab-perfume-brand-owner.jpeg",
      },
    ],
  },

  faqs: [
    {
      id: "faq-1",
      question: "How long do 3Uqab perfumes last?",
      answer:
        "Our perfumes last 12 hours or more on both skin and clothes. We use strong, pure perfume oils made here in Karachi.",
    },
    {
      id: "faq-2",
      question: "Do you deliver all over Pakistan or only in Karachi?",
      answer:
        "Right now, we only deliver in Karachi. Orders arrive in 1 to 2 days with Cash on Delivery (COD). Delivery is free on orders above Rs 3,000.",
    },
    {
      id: "faq-3",
      question: "Are your attars alcohol-free?",
      answer:
        "Yes. All our attars and concentrated perfume oils are 100% alcohol-free, skin-safe, and suitable for daily prayers.",
    },
    {
      id: "faq-4",
      question: "Where is your shop in Karachi?",
      answer:
        "You can visit us at Shop # 70, Ground Floor, City Residency & Shopping Galleria, Garden East, Saddar, Karachi. You can test all our scents in person.",
    },
    {
      id: "faq-5",
      question: "Can I order or get advice on WhatsApp?",
      answer:
        "Yes. Message us on WhatsApp at +92 300 1234567. Tell us what kind of smell you like, and we will help you choose.",
    },
  ],

  faqSection: {
    subtitle: "Common Questions",
    title: "Frequently Asked Questions",
    image: "/assets/images/banner-home-13.png",
    imageAlt: "3Uqab Perfumes Karachi",
    imageBadge: "Made in Karachi",
    imageTitle: "Pure Perfumes & Oud",
    imageDescription: "Long-lasting scents crafted for everyday wear.",
    imageCta: "View Collection",
  },

  weeklyFeatured: {
    title: "Weekly Featured",
    subtitle: "Explore our most-loved 3Uqab fragrances this week",
  },
};
