import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import { siteConfig } from "@/data/siteConfig";
import { siteConfig as brandConfig } from "@/config";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name}. Visit our store at ${siteConfig.contact.address} or contact us at ${siteConfig.contact.phone}.`,
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description: `Visit our store at ${siteConfig.contact.address}. Call ${siteConfig.contact.phone}.`,
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    alternateName: brandConfig.seo.alternateNames,
    image: `${siteConfig.url}${siteConfig.logo}`,
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
