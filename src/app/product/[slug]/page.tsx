import type { Metadata } from "next";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { readDbAsync } from "@/lib/db";
import { Product } from "@/data/products";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackProduct: Product = {
  id: "prod-1",
  slug: "uqab-signature-edp",
  name: "3Auqab Signature EDP",
  category: "Unisex Collection",
  price: 45,
  rating: 5,
  reviewsCount: 18,
  image: "/assets/images/product-item-1.jpg",
  gallery: ["/assets/images/product-item-1.jpg"],
  sku: "3AUQ-001",
  inStock: true,
  shortBullets: ["Handcrafted luxury fragrance by 3Auqab Perfume"],
  description: ["Handcrafted luxury fragrance by 3Auqab Perfume."],
  notes: { top: "Bergamot", heart: "Rose & Oud", base: "Amber & Musk" },
  sizes: ["50ml", "100ml"],
  bottleFinishes: [{ label: "Amber Gold", className: "color1" }],
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = await readDbAsync();
  const product =
    db.products.find((p) => p.slug === slug) ||
    db.products[0] || { ...fallbackProduct, slug };
  return {
    title: `${product.name} - ${product.category}`,
    description: product.description?.[0] || db.settings.description,
    openGraph: {
      title: `${product.name} | ${db.settings.name}`,
      description: product.description?.[0] || db.settings.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const db = await readDbAsync();
  const product =
    db.products.find((p) => p.slug === slug) ||
    db.products[0] || { ...fallbackProduct, slug };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: (product.description || []).join(" "),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: db.settings.name,
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
