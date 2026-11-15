import type { Metadata } from "next";
import WishlistClient from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist | Three Uqab Luxury Fragrances",
  description: "View and manage your favorite fragrances and signature perfumes.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
