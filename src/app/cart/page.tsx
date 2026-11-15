import type { Metadata } from "next";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your selected 3Uqab Perfumes before checkout.",
};

export default function CartPage() {
  return <CartClient />;
}
