import { Suspense } from "react";
import type { Metadata } from "next";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { readDbAsync } from "@/lib/db";
import { BlogPost } from "@/data/blogs";
import { siteConfig } from "@/config";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackBlog: BlogPost = {
  id: "blog-1",
  slug: "journal",
  title: `${siteConfig.brand.name} Journal`,
  category: "GUIDE",
  date: "August 17",
  author: siteConfig.brand.name,
  authorRole: "Editor",
  authorAvatar: "/assets/images/avt-blog1.png",
  views: 100,
  commentsCount: 5,
  image: "/assets/images/blog2.jpg",
  excerpt: siteConfig.brand.description,
  content: [siteConfig.brand.description],
  quote: siteConfig.brand.tagline,
  tags: siteConfig.seo.keywords.slice(0, 3),
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = await readDbAsync();
  const post =
    db.blogs.find((b) => b.slug === slug) ||
    db.blogs[0] || { ...fallbackBlog, slug };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ${db.settings.name}`,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const db = await readDbAsync();
  const post =
    db.blogs.find((b) => b.slug === slug) ||
    db.blogs[0] || { ...fallbackBlog, slug };

  return (
    <Suspense fallback={<div className="container">Loading article...</div>}>
      <BlogPostClient post={post} />
    </Suspense>
  );
}
