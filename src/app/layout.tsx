import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { siteConfig } from "@/data/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} (${siteConfig.fullName}) | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "3Auqab",
    "3Auqab Perfume",
    "Three Auqab",
    "Three Auqab Perfume",
    "Auqab Eau de Parfum",
    "Auqab Rihla",
    "Arabian Oud",
    "Dubai Perfumes",
    "Luxury Perfumes",
  ],
  openGraph: {
    title: `${siteConfig.name} (${siteConfig.fullName}) | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  icons: {
    icon: "/assets/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: [siteConfig.shortName, siteConfig.fullName, "Three Auqab"],
    url: siteConfig.url,
    sameAs: [siteConfig.socials.facebook],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      email: siteConfig.contact.email,
    },
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/assets/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/jquery-ui.css" />
        <link rel="stylesheet" href="/assets/css/slick.css" />
        <link rel="stylesheet" href="/assets/css/chosen.min.css" />
        <link rel="stylesheet" href="/assets/css/pe-icon-7-stroke.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.min.css" />
        <link rel="stylesheet" href="/assets/css/lightbox.min.css" />
        <link rel="stylesheet" href="/assets/css/jquery.scrollbar.min.css" />
        <link rel="stylesheet" href="/assets/css/mobile-menu.css" />
        <link rel="stylesheet" href="/assets/fonts/flaticon/flaticon.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="home">
        <Toaster position="top-right" />
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
