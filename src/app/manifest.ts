import type { MetadataRoute } from "next";
import { siteConfig, themeConfig, assetsConfig } from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.name,
    short_name: siteConfig.brand.shortName,
    description: siteConfig.brand.description,
    start_url: "/",
    display: "standalone",
    background_color: themeConfig.colors.background,
    theme_color: themeConfig.colors.primary,
    icons: [
      {
        src: assetsConfig.favicons.android192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: assetsConfig.favicons.android512,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
