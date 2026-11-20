import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Toaster } from "react-hot-toast";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { siteConfig } from "@/data/siteConfig";
import {
  siteConfig as brandConfig,
  themeConfig,
  getThemeCssVariables,
} from "@/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} (${siteConfig.fullName}) | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: brandConfig.seo.keywords,
  openGraph: {
    title: `${siteConfig.name} (${siteConfig.fullName}) | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  icons: {
    icon: [
      { url: siteConfig.assets.favicons.ico },
      { url: siteConfig.assets.favicons.icon16, sizes: "16x16", type: "image/png" },
      { url: siteConfig.assets.favicons.icon32, sizes: "32x32", type: "image/png" },
    ],
    shortcut: siteConfig.assets.favicons.ico,
    apple: [
      { url: siteConfig.assets.favicons.appleTouchIcon, sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: siteConfig.assets.favicons.manifest,
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
    alternateName: brandConfig.seo.alternateNames,
    url: siteConfig.url,
    sameAs: [siteConfig.socials.facebook],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.streetAddress,
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      postalCode: siteConfig.contact.postalCode,
      addressCountry: siteConfig.contact.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      email: siteConfig.contact.email,
    },
  };

  return (
    <html
      lang={brandConfig.localization.defaultLocale.split("-")[0]}
      dir={brandConfig.localization.direction}
      style={getThemeCssVariables() as CSSProperties}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/assets/images/banners/3uqab-luxury-french-arabian-attar-hero-1.jpg"
          fetchPriority="high"
        />
        <link href={themeConfig.fonts.googleFontUrl} rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/assets/css/slick.css" />
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
