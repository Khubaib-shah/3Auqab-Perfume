import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { readDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = await readDbAsync();
  const post = db.blogs.find((b) => b.slug === slug);

  if (!post) {
    return {
      title: `Article Not Found | ${db.settings.name}`,
    };
  }

  const baseUrl = db.settings.url || "https://3uqab.com";
  const articleUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${db.settings.name}`,
    description: post.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: `${post.title} | ${db.settings.name}`,
      description: post.excerpt,
      url: articleUrl,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const db = await readDbAsync();
  const post = db.blogs.find((b) => b.slug === slug);

  if (!post) {
    notFound();
  }

  const baseUrl = db.settings.url || "https://3uqab.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : [],
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: db.settings.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/assets/images/logo/3uqab-perfume-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="container">Loading article...</div>}>
        <BlogPostClient post={post} />
      </Suspense>
    </>
  );
}
