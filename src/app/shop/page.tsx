import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: siteConfig.seo.pages.shop.title,
  description: siteConfig.seo.pages.shop.description,
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container">Loading products...</div>}>
      <ShopClient />
    </Suspense>
  );
}
