import type { MetadataRoute } from "next";
import { readDbAsync } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await readDbAsync();
  const baseUrl = db.settings.url || "https://3auqab.com";

  const staticPages = [
    "",
    "/shop",
    "/cart",
    "/checkout",
    "/blog",
    "/about",
    "/contact",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const productPages = db.products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogPages = db.blogs
    .filter((post) => post.isPublished !== false)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...productPages, ...blogPages];
}
