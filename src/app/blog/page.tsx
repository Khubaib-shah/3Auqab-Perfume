import type { Metadata } from "next";
import BlogGridClient from "@/components/blog/BlogGridClient";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: siteConfig.seo.pages.blog.title,
  description: siteConfig.seo.pages.blog.description,
};

export default function BlogGridPage() {
  return <BlogGridClient />;
}
