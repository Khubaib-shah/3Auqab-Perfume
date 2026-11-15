import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your 3Uqab Perfume (Three Uqab) order securely.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
