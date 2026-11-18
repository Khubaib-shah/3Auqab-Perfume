"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import { siteConfig, assetsConfig } from "@/config";
import OrdersModule, { getStatusBadgeClass } from "./OrdersModule";
import ProductsModule from "./ProductsModule";
import CategoriesModule from "./CategoriesModule";
import ContentModule from "./ContentModule";
import BlogsModule from "./BlogsModule";
import InboxModule from "./InboxModule";
import SettingsModule from "./SettingsModule";

export type AdminModuleKey =
  | "overview"
  | "orders"
  | "products"
  | "categories"
  | "content"
  | "blogs"
  | "inbox"
  | "settings";

export default function AdminDashboardClient() {
  const settings = useAdminStore((s) => s.settings);
  const orders = useAdminStore((s) => s.orders);
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const announcements = useAdminStore((s) => s.announcements);
  const blogs = useAdminStore((s) => s.blogs);
  const messages = useAdminStore((s) => s.messages);
  const subscribers = useAdminStore((s) => s.subscribers);
  const isSaving = useAdminStore((s) => s.isSaving);
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const loginAdmin = useAdminStore((s) => s.loginAdmin);
  const logoutAdmin = useAdminStore((s) => s.logoutAdmin);

  const [activeModule, setActiveModule] = useState<AdminModuleKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login Gate state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(loginEmail, loginPassword)) {
      toast.success(`Logged in to ${siteConfig.admin.dashboardTitle}!`);
    } else {
      toast.error("Invalid email or password.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="admin-shell"
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="admin-card"
          style={{ width: "100%", maxWidth: "420px", padding: "32px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#111111",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 6px 0",
              }}
            >
              <span style={{ color: "var(--color-primary)" }}>
                {siteConfig.brand.shortName}
              </span>{" "}
              ADMIN
            </h2>
            <p style={{ fontSize: "13px", color: "#888888", margin: 0 }}>
              Sign in with owner email and password
            </p>
          </div>

          <form onSubmit={handleGateLogin}>
            <div className="admin-form-group">
              <label className="admin-label">Email</label>
              <input
                type="email"
                className="admin-input"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={siteConfig.admin.emailPlaceholder}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <input
                type="password"
                className="admin-input"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="btn-admin btn-admin-primary"
              style={{ width: "100%", marginTop: "8px" }}
            >
              Login to Dashboard
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <Link
              href="/"
              style={{ fontSize: "12px", color: "#888888", textDecoration: "none" }}
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Simple KPI stats
  const totalSales = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED"
  ).length;

  const unreadMessagesCount = messages.filter(
    (m) => m.status === "UNREAD"
  ).length;

  const lowStockProducts = products.filter(
    (p) => (p.stockQuantity ?? 20) <= 5
  );

  const navItems: {
    key: AdminModuleKey;
    label: string;
    icon: string;
    badge?: number;
  }[] = [
      {
        key: "overview",
        label: "Overview",
        icon: "fa-th-large",
      },
      {
        key: "orders",
        label: "Orders",
        icon: "fa-shopping-bag",
        badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      },
      {
        key: "products",
        label: "Products",
        icon: "fa-flask",
        badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined,
      },
      {
        key: "categories",
        label: "Categories",
        icon: "fa-tags",
      },
      {
        key: "content",
        label: "Banners & Bar",
        icon: "fa-bullhorn",
      },
      {
        key: "blogs",
        label: "Blogs",
        icon: "fa-book",
      },
      {
        key: "inbox",
        label: "Messages",
        icon: "fa-envelope-o",
        badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      },
      {
        key: "settings",
        label: "Settings",
        icon: "fa-sliders",
      },
    ];

  const selectModule = (key: AdminModuleKey) => {
    setActiveModule(key);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-shell">
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/" style={{ display: "inline-block" }}>
              <img
                src={settings.logo}
                alt={siteConfig.brand.name}
                style={{
                  height: "44px",
                  width: "auto",
                  maxWidth: "160px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Link>
          </div>
          <button
            type="button"
            className="admin-mobile-toggle"
            style={{ color: "#fff", borderColor: "#333" }}
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <ul className="admin-nav-list">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => selectModule(item.key)}
                className={`admin-nav-item ${activeModule === item.key ? "active" : ""
                  }`}
              >
                <span className="admin-nav-left">
                  <i
                    className={`fa ${item.icon} admin-nav-icon`}
                    aria-hidden="true"
                  ></i>
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="admin-nav-badge">{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="admin-sidebar-footer">
          <Link
            href="/"
            className="btn-admin btn-admin-sm btn-admin-primary"
            style={{ width: "100%" }}
          >
            <i className="fa fa-external-link"></i> View Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <div className="admin-breadcrumb">
              {siteConfig.brand.shortName} /{" "}
              <strong>
                {navItems.find((n) => n.key === activeModule)?.label}
              </strong>
            </div>
          </div>

          <div className="admin-topbar-right">
            {isSaving && (
              <span className="admin-badge admin-badge-confirmed">
                Saving...
              </span>
            )}
            <Link href="/" className="btn-admin btn-admin-sm btn-admin-outline">
              Storefront
            </Link>
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                toast.success("Logged out.");
              }}
              className="btn-admin btn-admin-sm btn-admin-danger"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="admin-canvas-body">
          {activeModule === "overview" && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-section-title">Overview</h1>
                  <p className="admin-section-subtitle">
                    Quick summary of your orders, products, and messages
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => selectModule("orders")}
                    className="btn-admin btn-admin-primary"
                  >
                    View Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => selectModule("products")}
                    className="btn-admin btn-admin-dark"
                  >
                    Products ({products.length})
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="admin-kpi-grid">
                <div
                  className="admin-kpi-card"
                  onClick={() => selectModule("orders")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="admin-kpi-label">
                    <span>Total Sales</span>
                    <i className="fa fa-line-chart admin-kpi-icon"></i>
                  </div>
                  <div className="admin-kpi-value">
                    {settings.currency} {totalSales.toLocaleString()}
                  </div>
                  <div className="admin-kpi-meta">
                    {orders.filter((o) => o.status !== "CANCELLED").length} orders
                  </div>
                </div>

                <div
                  className="admin-kpi-card"
                  onClick={() => selectModule("orders")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="admin-kpi-label">
                    <span>New Orders</span>
                    <i className="fa fa-shopping-bag admin-kpi-icon"></i>
                  </div>
                  <div className="admin-kpi-value">{pendingOrdersCount}</div>
                  <div className="admin-kpi-meta">Need confirmation</div>
                </div>

                <div
                  className="admin-kpi-card"
                  onClick={() => selectModule("products")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="admin-kpi-label">
                    <span>Products</span>
                    <i className="fa fa-flask admin-kpi-icon"></i>
                  </div>
                  <div className="admin-kpi-value">{products.length}</div>
                  <div className="admin-kpi-meta">
                    {categories.length} categories
                  </div>
                </div>

                <div
                  className="admin-kpi-card"
                  onClick={() => selectModule("inbox")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="admin-kpi-label">
                    <span>Messages</span>
                    <i className="fa fa-envelope-o admin-kpi-icon"></i>
                  </div>
                  <div className="admin-kpi-value">{unreadMessagesCount}</div>
                  <div className="admin-kpi-meta">
                    Unread | {subscribers.length} subscribers
                  </div>
                </div>
              </div>

              {/* Recent Orders & Low Stock */}
              <div className="admin-overview-split">
                <div className="admin-card">
                  <h3 className="admin-card-title">
                    <span>Recent Orders</span>
                    <button
                      type="button"
                      onClick={() => selectModule("orders")}
                      className="btn-admin btn-admin-sm btn-admin-outline"
                    >
                      All Orders
                    </button>
                  </h3>
                  <div className="admin-table-wrap" style={{ border: "none" }}>
                    <table className="admin-table" style={{ minWidth: "520px" }}>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>City</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>WhatsApp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((ord) => {
                          const cleanPhone = (
                            ord.whatsapp || ord.phone
                          ).replace(/[^0-9]/g, "");
                          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Assalam o Alaikum ${ord.firstName}! Thank you for your ${settings.name} order #${ord.orderNumber} (${settings.currency} ${ord.totalAmount}).`
                          )}`;
                          return (
                            <tr key={ord.id}>
                              <td style={{ whiteSpace: "nowrap" }}>
                                <strong style={{ color: "#222" }}>
                                  #{ord.orderNumber}
                                </strong>
                              </td>
                              <td>
                                {ord.firstName} {ord.lastName}
                              </td>
                              <td>{ord.city}</td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                <strong>
                                  {settings.currency} {ord.totalAmount}
                                </strong>
                              </td>
                              <td>
                                <span
                                  className={getStatusBadgeClass(ord.status)}
                                >
                                  {ord.status}
                                </span>
                              </td>
                              <td>
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-admin btn-admin-sm btn-admin-whatsapp"
                                >
                                  <i className="fa fa-whatsapp"></i> Chat
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div className="admin-card">
                    <h3 className="admin-card-title">
                      <span>Low Stock</span>
                      <span className="admin-badge admin-badge-pending">
                        {lowStockProducts.length}
                      </span>
                    </h3>
                    {lowStockProducts.length === 0 ? (
                      <div style={{ fontSize: "13px", color: "#1f7a4c" }}>
                        All products are in stock.
                      </div>
                    ) : (
                      lowStockProducts.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 0",
                            borderBottom: "1px solid #f1f1f1",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#222",
                              fontSize: "13px",
                            }}
                          >
                            {p.name}
                          </div>
                          <span className="admin-badge admin-badge-pending">
                            {p.stockQuantity} left
                          </span>
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={() => selectModule("products")}
                      className="btn-admin btn-admin-sm btn-admin-outline"
                      style={{ width: "100%", marginTop: "12px" }}
                    >
                      Update Stock
                    </button>
                  </div>

                  <div className="admin-card">
                    <h3 className="admin-card-title">
                      <span>Top Bar Text</span>
                      <span className="admin-badge admin-badge-delivered">
                        {announcements.filter((a) => a.isActive).length} Active
                      </span>
                    </h3>
                    <ul
                      style={{
                        paddingLeft: "18px",
                        margin: "0 0 12px 0",
                        fontSize: "12px",
                        lineHeight: 1.6,
                      }}
                    >
                      {announcements
                        .filter((a) => a.isActive)
                        .slice(0, 3)
                        .map((a) => (
                          <li key={a.id}>{a.text}</li>
                        ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => selectModule("content")}
                      className="btn-admin btn-admin-sm btn-admin-outline"
                      style={{ width: "100%" }}
                    >
                      Edit Top Bar
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="admin-grid-3">
                <div className="admin-card">
                  <h4 className="admin-card-title">
                    <span>Blogs ({blogs.length})</span>
                    <i className="fa fa-book" style={{ color: "var(--color-primary)" }}></i>
                  </h4>
                  <button
                    type="button"
                    onClick={() => selectModule("blogs")}
                    className="btn-admin btn-admin-sm btn-admin-outline"
                    style={{ width: "100%" }}
                  >
                    Manage Blogs
                  </button>
                </div>

                <div className="admin-card">
                  <h4 className="admin-card-title">
                    <span>Messages ({messages.length})</span>
                    <i
                      className="fa fa-envelope-o"
                      style={{ color: "var(--color-primary)" }}
                    ></i>
                  </h4>
                  <button
                    type="button"
                    onClick={() => selectModule("inbox")}
                    className="btn-admin btn-admin-sm btn-admin-outline"
                    style={{ width: "100%" }}
                  >
                    Open Messages
                  </button>
                </div>

                <div className="admin-card">
                  <h4 className="admin-card-title">
                    <span>Settings</span>
                    <i
                      className="fa fa-sliders"
                      style={{ color: "var(--color-primary)" }}
                    ></i>
                  </h4>
                  <button
                    type="button"
                    onClick={() => selectModule("settings")}
                    className="btn-admin btn-admin-sm btn-admin-outline"
                    style={{ width: "100%" }}
                  >
                    Open Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModule === "orders" && <OrdersModule />}
          {activeModule === "products" && <ProductsModule />}
          {activeModule === "categories" && <CategoriesModule />}
          {activeModule === "content" && <ContentModule />}
          {activeModule === "blogs" && <BlogsModule />}
          {activeModule === "inbox" && <InboxModule />}
          {activeModule === "settings" && <SettingsModule />}
        </main>
      </div>
    </div>
  );
}
