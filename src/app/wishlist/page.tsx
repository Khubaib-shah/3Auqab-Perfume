import type { Metadata } from "next";
import WishlistClient from "@/components/wishlist/WishlistClient";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: `${siteConfig.seo.pages.wishlist.title} | ${siteConfig.brand.name}`,
  description: "View and manage your favorite products.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
