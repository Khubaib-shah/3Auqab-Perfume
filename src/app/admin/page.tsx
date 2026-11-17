import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { siteConfig } from "@/config";
import "./admin.css";

export const metadata: Metadata = {
  title: `${siteConfig.seo.pages.admin.title} | ${siteConfig.brand.name}`,
  description: siteConfig.seo.pages.admin.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
