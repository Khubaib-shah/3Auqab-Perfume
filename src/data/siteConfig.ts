export const siteConfig = {
  name: "3Auqab Perfume",
  shortName: "3Auqab",
  fullName: "Three Auqab",
  logo: "/assets/images/logo.webp",
  whatsappNumber: "+923001234567",
  tagline: "Luxury Arabian Oud & Eau de Parfum",
  description:
    "Discover handcrafted luxury perfumes, authentic Arabian Oud, and long-lasting Eau de Parfum by 3Auqab Perfume (Three Auqab).",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://3auqab.com",
  promoCode: "3AUQAB20",
  currency: "Rs",
  welcomeMessage: "Welcome to 3Auqab Perfume Official Online Store!",
  announcements: [] as string[],
  contact: {
    address: "45 Al Wasl Road, Jumeirah, Dubai, UAE",
    phone: "(+971) 4 123 4567",
    email: "concierge@3auqab.com",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Jumeirah%20Dubai&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61584388492524",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    linkedin: "https://linkedin.com",
  },
  categories: [] as { name: string; slug: string }[],
  popularTags: [
    "3Auqab",
    "Eau de Parfum",
    "Arabian Oud",
    "Amber & Musk",
    "Rose & Oud",
    "Unisex Scents",
    "Gift Sets",
  ],
};
