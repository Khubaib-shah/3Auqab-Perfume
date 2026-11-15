import type { Metadata } from "next";
import BlogGridClient from "@/components/blog/BlogGridClient";

export const metadata: Metadata = {
  title: "3Uqab Perfume Journal & Fragrance Guides",
  description:
    "Read expert guides on Arabian Oud layering, fragrance notes, and luxury perfume care by 3Uqab Perfume (Three Uqab).",
};

export default function BlogGridPage() {
  return <BlogGridClient />;
}
