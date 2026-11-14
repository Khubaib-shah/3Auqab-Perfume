import type { Metadata } from "next";
import BlogGridClient from "@/components/blog/BlogGridClient";

export const metadata: Metadata = {
  title: "3Auqab Perfume Journal & Fragrance Guides",
  description:
    "Read expert guides on Arabian Oud layering, fragrance notes, and luxury perfume care by 3Auqab Perfume (Three Auqab).",
};

export default function BlogGridPage() {
  return <BlogGridClient />;
}
