export interface AssetsConfig {
  logo: string;
  logoWhite?: string;
  favicon: string;
  placeholders: {
    product: string;
    avatar: string;
    banner: string;
  };
  brandGallery: string[];
}

export const assetsConfig: AssetsConfig = {
  logo: "/assets/images/logo.png",
  logoWhite: "/assets/images/logo.webp",
  favicon: "/assets/images/favicon.png",

  placeholders: {
    product: "/assets/images/product-item-1.jpg",
    avatar: "/assets/images/author-avatar-default.png",
    banner: "/assets/images/banner-home-13.png",
  },

  brandGallery: [
    "/assets/images/item-instagram-1.jpg",
    "/assets/images/item-instagram-2.jpg",
    "/assets/images/item-instagram-3.jpg",
    "/assets/images/item-instagram-4.jpg",
    "/assets/images/item-instagram-5.jpg",
    "/assets/images/item-instagram-6.jpg",
  ],
};
