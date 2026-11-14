import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop 3Auqab Luxury Perfumes & Arabian Oud",
  description:
    "Browse the complete 3Auqab Perfume (Three Auqab) catalog. Discover long-lasting Eau de Parfum, Arabian Oud, and unisex fragrances.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container">Loading fragrances...</div>}>
      <ShopClient />
    </Suspense>
  );
}
