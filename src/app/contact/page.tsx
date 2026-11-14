import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact 3Auqab",
  description:
    "Get in touch with 3Auqab Perfume (Three Auqab) for fragrance consultations, orders, and wholesale inquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
