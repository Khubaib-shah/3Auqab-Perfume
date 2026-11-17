import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Checkout",
  description: siteConfig.seo.pages.checkout.description,
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
