import type { Metadata } from "next";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { initialPerfumeCatalog } from "@/data/perfumeCatalog";
import { siteConfig } from "@/data/siteConfig";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return initialPerfumeCatalog.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product =
    initialPerfumeCatalog.find((p) => p.slug === slug) ||
    initialPerfumeCatalog[0];

  return {
    title: `${product.name} - ${product.category}`,
    description: product.description?.[0] || siteConfig.description,
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description?.[0] || siteConfig.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const product =
    initialPerfumeCatalog.find((p) => p.slug === slug) ||
    initialPerfumeCatalog[0];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: (product.description || []).join(" "),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
}
