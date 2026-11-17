export * from "./site.config";
export * from "./theme.config";
export * from "./assets.config";
export * from "./navigation.config";
export * from "./business.config";
export * from "./content.config";

import { siteConfig } from "./site.config";
import { themeConfig } from "./theme.config";
import { assetsConfig } from "./assets.config";
import { navigationConfig } from "./navigation.config";
import { businessConfig } from "./business.config";
import { contentConfig } from "./content.config";

/**
 * Unified application configuration object.
 * Single entry point for all white-label branding, visual styles, and business parameters.
 */
export const appConfig = {
  site: siteConfig,
  theme: themeConfig,
  assets: assetsConfig,
  navigation: navigationConfig,
  business: businessConfig,
  content: contentConfig,
};

export default appConfig;
