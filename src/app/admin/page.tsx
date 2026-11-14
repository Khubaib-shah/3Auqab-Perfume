import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Atelier Dashboard | 3Auqab Perfume",
  description:
    "Manage 3Auqab Perfume (Three Auqab) orders, deliveries, WhatsApp notifications, products, categories, blogs, and storefront settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
