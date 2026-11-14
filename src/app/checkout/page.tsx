import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your 3Auqab Perfume (Three Auqab) order securely.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
