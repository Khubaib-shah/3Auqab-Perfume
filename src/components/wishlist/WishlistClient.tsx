"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";

export default function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const { wishlist, addToCart, toggleWishlist } = useShopStore();
  const products = useAdminStore((s) => s.products);
  const settings = useAdminStore((s) => s.settings);

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlistedProducts = mounted
    ? products.filter((p) => wishlist.includes(p.id))
    : [];

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlist.length === 0) return;
    wishlist.forEach((id) => toggleWishlist(id));
    toast.success("Wishlist cleared");
  };

  return (
    <div className="main-content main-content-wishlist" style={{ minHeight: "65vh" }}>
      <div className="container">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

        <div className="wishlist-wrapper" style={{ padding: "20px 0 60px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
              marginBottom: "30px",
              paddingBottom: "15px",
              borderBottom: "1px solid #ebebeb",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#222",
                  fontFamily: "var(--font-heading, inherit)",
                }}
              >
                My Wishlist
              </h1>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                {mounted
                  ? `${wishlistedProducts.length} ${
                      wishlistedProducts.length === 1 ? "fragrance" : "fragrances"
                    } saved`
                  : "Loading your saved fragrances..."}
              </p>
            </div>

            {mounted && wishlistedProducts.length > 0 && (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{
                    background: "transparent",
                    border: "1px solid #e0e0e0",
                    color: "#666",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (typeof window !== "undefined" && window.innerWidth > 991) {
                      e.currentTarget.style.borderColor = "#e53e3e";
                      e.currentTarget.style.color = "#e53e3e";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.color = "#666";
                  }}
                >
                  <i className="fa fa-trash-o" style={{ marginRight: "6px" }} />
                  Clear All
                </button>

                <Link
                  href="/shop"
                  style={{
                    background: "#ab8e66",
                    color: "#fff",
                    padding: "8px 18px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Explore More
                </Link>
              </div>
            )}
          </div>

          {!mounted ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: "28px", color: "#ab8e66" }} />
              <p style={{ marginTop: "12px", color: "#777" }}>Loading wishlist...</p>
            </div>
          ) : wishlistedProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fafafa",
                borderRadius: "8px",
                border: "1px dashed #e5e5e5",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(171, 142, 102, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <i className="fa fa-heart-o" style={{ fontSize: "32px", color: "#ab8e66" }} />
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#222", marginBottom: "8px" }}>
                Your Wishlist is Empty
              </h2>
              <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                You have not added any perfumes to your favourites yet. Tap the heart icon on any
                fragrance to save it here for quick access.
              </p>
              <Link
                href="/shop"
                style={{
                  display: "inline-block",
                  background: "#ab8e66",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "4px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                }}
              >
                Discover Fragrances
              </Link>
            </div>
          ) : (
            <div className="row auto-clear equal-container better-height">
              {wishlistedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="product-item col-lg-3 col-md-4 col-sm-6 col-xs-6 col-ts-12 style-1"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
