import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact 3Uqab",
  description:
    "Get in touch with 3Uqab Perfume (Three Uqab) for fragrance consultations, orders, and wholesale inquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
