"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useShopStore } from "@/store/useShopStore";
import { siteConfig } from "@/data/siteConfig";
import { businessConfig } from "@/config";
import {
  getProductPriceForSize,
  getProductOldPriceForSize,
} from "@/data/products";

export default function QuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    wishlist,
  } = useShopStore();

  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("15ml");
  const [quantity, setQuantity] = useState<number>(1);

  const getPhotoForSize = (prod: typeof quickViewProduct, size: string) => {
    if (!prod) return "";
    if (prod.sizeImages && prod.sizeImages[size]) {
      return prod.sizeImages[size];
    }
    const sizeIdx = prod.sizes.indexOf(size);
    if (sizeIdx !== -1 && prod.gallery[sizeIdx]) {
      return prod.gallery[sizeIdx];
    }
    return prod.gallery[0] || prod.image;
  };

  useEffect(() => {
    if (quickViewProduct) {
      const initialSize = quickViewProduct.sizes[0] || "15ml";
      setSelectedSize(initialSize);
      setActiveImage(
        getPhotoForSize(quickViewProduct, initialSize) ||
          quickViewProduct.gallery[0] ||
          quickViewProduct.image
      );
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleSelectSize = (sz: string) => {
    setSelectedSize(sz);
    const targetImg = getPhotoForSize(quickViewProduct, sz);
    if (targetImg) {
      setActiveImage(targetImg);
    }
  };

  const handleSelectThumbnail = (imgUrl: string, index: number) => {
    setActiveImage(imgUrl);
    if (quickViewProduct.sizes[index]) {
      setSelectedSize(quickViewProduct.sizes[index]);
    }
  };

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const isOutOfStock =
    quickViewProduct.inStock === false ||
    (typeof (quickViewProduct as unknown as { stockQuantity?: number })
      .stockQuantity === "number" &&
      (quickViewProduct as unknown as { stockQuantity: number })
        .stockQuantity <= 0);

  const currentPrice = getProductPriceForSize(quickViewProduct, selectedSize);
  const currentOldPrice = getProductOldPriceForSize(
    quickViewProduct,
    selectedSize
  );

  const handleAdd = () => {
    if (isOutOfStock) {
      toast.error(`${quickViewProduct.name} is currently out of stock.`);
      return;
    }
    addToCart(quickViewProduct, quantity, selectedSize, "");
    toast.success(`${quickViewProduct.name} (${selectedSize}) added to bag!`);
    closeQuickView();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
      }}
      onClick={closeQuickView}
    >
      <div
        className="kt-popup-quickview"
        style={{
          position: "relative",
          background: "#fff",
          maxWidth: "860px",
          width: "100%",
          padding: "30px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeQuickView}
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid #e5e5e5",
            background: "#ffffff",
            color: "#222222",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontSize: "20px",
            lineHeight: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxSizing: "border-box",
            padding: 0,
            transition: "all 0.2s ease",
          }}
          aria-label="Close Quick View"
        >
          ×
        </button>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div className="details-thumb">
              <div
                style={{
                  marginBottom: "12px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={activeImage || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    opacity: isOutOfStock ? 0.88 : 1,
                  }}
                />
                {isOutOfStock && (
                  <div className="product-soldout-overlay">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                {quickViewProduct.gallery.map((img, i) => {
                  const mappedSize = quickViewProduct.sizes[i];
                  const isCurrent = activeImage === img;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectThumbnail(img, i)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: isCurrent
                          ? "2px solid var(--color-primary)"
                          : "1px solid #eee",
                        padding: "3px",
                        background: "#fff",
                        cursor: "pointer",
                        width: "68px",
                        borderRadius: "4px",
                      }}
                      title={
                        mappedSize
                          ? `${mappedSize} Bottle View`
                          : `View ${i + 1}`
                      }
                    >
                      <img
                        src={img}
                        alt={`${quickViewProduct.name} ${i + 1}`}
                        style={{ width: "100%", height: "auto" }}
                      />
                      {mappedSize && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? "var(--color-primary)" : "#666",
                            marginTop: "2px",
                          }}
                        >
                          {mappedSize}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div
              className="details-infor"
              style={{ width: "100%", paddingLeft: 0 }}
            >
              <h1 className="product-title">
                <Link
                  href={`/product/${quickViewProduct.slug}`}
                  onClick={closeQuickView}
                >
                  {quickViewProduct.name}
                </Link>
              </h1>
              <div className="stars-rating">
                <div className="star-rating">
                  <span className={`star-${quickViewProduct.rating}`}></span>
                </div>
                <div className="count-star">
                  ({quickViewProduct.reviewsCount})
                </div>
              </div>
              <div className="availability">
                Availability:{" "}
                <a href="#stock">
                  {quickViewProduct.inStock ? "In Stock" : "Out of Stock"}
                </a>
              </div>
              <div
                className="price"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "8px",
                  margin: "12px 0",
                }}
              >
                {currentOldPrice && (
                  <del style={{ color: "#999", fontSize: "15px" }}>
                    {siteConfig.currency} {currentOldPrice.toLocaleString()}
                  </del>
                )}
                <ins
                  style={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "24px",
                    textDecoration: "none",
                  }}
                >
                  {siteConfig.currency} {currentPrice.toLocaleString()}
                </ins>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    fontWeight: 500,
                  }}
                >
                  ({selectedSize} bottle)
                </span>
              </div>
              <div className="product-details-description">
                <ul>
                  {quickViewProduct.shortBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="variations">
                <div className="attribute attribute_size">
                  <div
                    className="size-text text-attribute"
                    style={{ marginBottom: "8px" }}
                  >
                    Select {businessConfig.variant.label}:{" "}
                    <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                      {selectedSize}
                    </span>
                  </div>
                  <div
                    className="list-size list-item"
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {quickViewProduct.sizes.map((sz) => {
                      const szPrice = getProductPriceForSize(
                        quickViewProduct,
                        sz
                      );
                      const isActive = selectedSize === sz;
                      return (
                        <a
                          key={sz}
                          href="#size"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectSize(sz);
                          }}
                          className={isActive ? "active" : ""}
                          style={{
                            padding: "6px 12px",
                            height: "auto",
                            borderRadius: "4px",
                            fontWeight: 600,
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            lineHeight: "1.3",
                            border: isActive
                              ? "2px solid var(--color-primary)"
                              : "1px solid #ddd",
                            background: isActive ? "#faf7f2" : "#fff",
                            color: isActive ? "var(--color-primary)" : "#333",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <span style={{ fontSize: "13px" }}>{sz}</span>
                          <span
                            style={{
                              fontSize: "10px",
                              opacity: 0.85,
                              fontWeight: 500,
                              marginTop: "2px",
                            }}
                          >
                            {siteConfig.currency} {szPrice.toLocaleString()}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="group-button">
                <div
                  className={`yith-wcwl-add-to-wishlist ${
                    isWishlisted ? "active in-wishlist" : ""
                  }`}
                >
                  <div className="yith-wcwl-add-button">
                    <a
                      href="#wishlist"
                      className={isWishlisted ? "active in-wishlist" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(quickViewProduct.id);
                        toast.success(
                          isWishlisted
                            ? "Removed from wishlist"
                            : "Added to wishlist!"
                        );
                      }}
                    >
                      {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                    </a>
                  </div>
                </div>
                {!isOutOfStock && (
                  <div className="quantity">
                    <div className="control">
                      <button
                        type="button"
                        className="btn-number qtyminus quantity-minus"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="input-qty qty"
                        size={4}
                      />
                      <button
                        type="button"
                        className="btn-number qtyplus quantity-plus"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className="single_add_to_cart_button button"
                  style={isOutOfStock ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Bag"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
