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

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ${db.settings.name}`,
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

  return (
    <Suspense fallback={<div className="container">Loading article...</div>}>
      <BlogPostClient post={post} />
    </Suspense>
  );
}
