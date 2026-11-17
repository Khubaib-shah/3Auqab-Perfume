import type { Metadata } from "next";
import CartClient from "@/components/cart/CartClient";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: siteConfig.seo.pages.cart.description,
};

export default function CartPage() {
  return <CartClient />;
}
