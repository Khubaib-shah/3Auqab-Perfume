export interface AssetsConfig {
  logo: string;
  logoWhite?: string;
  favicon: string;
  favicons: {
    ico: string;
    icon16: string;
    icon32: string;
    appleTouchIcon: string;
    android192: string;
    android512: string;
    manifest: string;
  };
  placeholders: {
    product: string;
    avatar: string;
    banner: string;
  };
  brandGallery: string[];
}

export const assetsConfig: AssetsConfig = {
  logo: "/assets/images/logo/3uqab-perfume-logo.png",
  logoWhite: "/assets/images/logo/3uqab-perfume-logo.png",
  favicon: "/assets/images/favicon/favicon.ico",

  favicons: {
    ico: "/assets/images/favicon/favicon.ico",
    icon16: "/assets/images/favicon/favicon-16x16.png",
    icon32: "/assets/images/favicon/favicon-32x32.png",
    appleTouchIcon: "/assets/images/favicon/apple-touch-icon.png",
    android192: "/assets/images/favicon/android-chrome-192x192.png",
    android512: "/assets/images/favicon/android-chrome-512x512.png",
    manifest: "/manifest.webmanifest",
  },

  placeholders: {
    product: "/assets/images/products/3uqab-perfume-product-placeholder-1.jpg",
    avatar: "/assets/images/team/3uqab-default-customer-avatar.png",
    banner: "/assets/images/banners/3uqab-signature-oud-sale-banner.png",
  },

  brandGallery: [
    "/assets/images/instagram/3uqab-perfume-instagram-gallery-1.jpg",
    "/assets/images/instagram/3uqab-perfume-instagram-gallery-2.jpg",
    "/assets/images/instagram/3uqab-perfume-instagram-gallery-3.jpg",
    "/assets/images/instagram/3uqab-perfume-instagram-gallery-4.jpg",
    "/assets/images/instagram/3uqab-perfume-instagram-gallery-5.jpg",
    "/assets/images/instagram/3uqab-perfume-instagram-gallery-6.jpg",
  ],
};
