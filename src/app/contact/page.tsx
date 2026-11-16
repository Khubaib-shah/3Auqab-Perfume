import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Visit Our Karachi Store & Contact Us | 3Uqab Perfume",
  description:
    "Visit 3Uqab Perfume at Shop # 17, Ground Floor, City Residency & Shopping Galleria, Aga Khan III Road (Garden Road), Garden East, Saddar, Karachi. Handcrafted Arabian Oud, luxury Eau de Parfum & attars.",
  keywords: [
    "3Uqab Perfume Karachi",
    "3Uqab Perfume store",
    "Shop # 17 City Residency Karachi",
    "Perfume shop Garden East Saddar",
    "Aga Khan III Road perfume store",
    "Arabian Oud Karachi",
    "Luxury fragrance store Karachi",
  ],
  openGraph: {
    title: "Visit Our Karachi Store & Contact Us | 3Uqab Perfume",
    description:
      "Shop # 17, Ground Floor, City Residency & Shopping Galleria, Aga Khan III Road (Garden Road), Garden East, Saddar, Karachi. Call (+92) 300 1234567.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    alternateName: [siteConfig.fullName, "3Uqab Fragrances Karachi"],
    image: `${siteConfig.url}/assets/images/logo.webp`,
    url: `${siteConfig.url}/contact`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    hasMap: siteConfig.contact.mapEmbedUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.streetAddress,
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      postalCode: siteConfig.contact.postalCode,
      addressCountry: siteConfig.contact.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.contact.coordinates.latitude,
      longitude: siteConfig.contact.coordinates.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "22:00",
      },
    ],
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
