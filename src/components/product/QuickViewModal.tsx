"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useShopStore } from "@/store/useShopStore";
import { siteConfig } from "@/data/siteConfig";

export default function QuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    wishlist,
  } = useShopStore();

  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("100ml");
  const [selectedFinish, setSelectedFinish] = useState<string>("Amber Gold");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImage(
        quickViewProduct.gallery[0] || quickViewProduct.image
      );
      setSelectedSize(quickViewProduct.sizes[0] || "100ml");
      setSelectedFinish(
        quickViewProduct.bottleFinishes[0]?.label || "Amber Gold"
      );
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const isOutOfStock =
    quickViewProduct.inStock === false ||
    (typeof (quickViewProduct as unknown as { stockQuantity?: number }).stockQuantity === "number" &&
      (quickViewProduct as unknown as { stockQuantity: number }).stockQuantity <= 0);

  const handleAdd = () => {
    if (isOutOfStock) {
      toast.error(`${quickViewProduct.name} is currently out of stock.`);
      return;
    }
    addToCart(quickViewProduct, quantity, selectedSize, selectedFinish);
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
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
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
                {quickViewProduct.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      border:
                        activeImage === img
                          ? "2px solid #ab8e66"
                          : "1px solid #eee",
                      padding: "2px",
                      background: "#fff",
                      cursor: "pointer",
                      width: "68px",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${quickViewProduct.name} ${i + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="details-infor" style={{ width: "100%", paddingLeft: 0 }}>
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
              <div className="price">
                <span>
                  {siteConfig.currency}
                  {quickViewProduct.price}
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
                <div className="attribute attribute_color">
                  <div className="color-text text-attribute">
                    Bottle Finish: <span>{selectedFinish}</span>
                  </div>
                  <div className="list-color list-item">
                    {quickViewProduct.bottleFinishes.map((finish) => (
                      <a
                        key={finish.label}
                        href="#finish"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFinish(finish.label);
                        }}
                        className={`${finish.className} ${
                          selectedFinish === finish.label ? "active" : ""
                        }`}
                        title={finish.label}
                      ></a>
                    ))}
                  </div>
                </div>
                <div className="attribute attribute_size">
                  <div className="size-text text-attribute">Bottle Volume:</div>
                  <div className="list-size list-item">
                    {quickViewProduct.sizes.map((sz) => (
                      <a
                        key={sz}
                        href="#size"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedSize(sz);
                        }}
                        className={selectedSize === sz ? "active" : ""}
                      >
                        {sz}
                      </a>
                    ))}
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
                <div className="quantity-add-to-cart">
                  <div className="quantity">
                    <div className="control">
                      <a
                        className="btn-number qtyminus quantity-minus"
                        href="#minus"
                        onClick={(e) => {
                          e.preventDefault();
                          setQuantity((q) => Math.max(1, q - 1));
                        }}
                      >
                        -
                      </a>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        title="Qty"
                        className="input-qty qty"
                        size={4}
                      />
                      <a
                        className="btn-number qtyplus quantity-plus"
                        href="#plus"
                        onClick={(e) => {
                          e.preventDefault();
                          setQuantity((q) => q + 1);
                        }}
                      >
                        +
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className="single_add_to_cart_button button"
                    style={isOutOfStock ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
