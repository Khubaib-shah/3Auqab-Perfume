"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Product,
  getDefaultProductSize,
  getProductPriceForSize,
  getProductOldPriceForSize,
  getProductPhotoForSize,
} from "@/data/products";
import { siteConfig } from "@/data/siteConfig";
import { useShopStore } from "@/store/useShopStore";

interface ProductCardProps {
  product: Product;
  asListItem?: boolean;
  className?: string;
  useBlackImage?: boolean;
}

function ProductCardComponent({
  product,
  asListItem = true,
  className = "product-item col-lg-3 col-md-4 col-sm-6 col-xs-6 col-ts-12 style-1",
  useBlackImage = false,
}: ProductCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useShopStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted && wishlist.includes(product.id);
  const isOutOfStock =
    product.inStock === false ||
    (typeof (product as unknown as { stockQuantity?: number }).stockQuantity === "number" &&
      (product as unknown as { stockQuantity: number }).stockQuantity <= 0);

  const defaultSize = getDefaultProductSize(product);
  const displayImage =
    useBlackImage && product.blackCardImage
      ? product.blackCardImage
      : (getProductPhotoForSize(product, defaultSize) || product.image);

  const displayPrice = getProductPriceForSize(product, defaultSize);
  const displayOldPrice = getProductOldPriceForSize(product, defaultSize);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }
    addToCart(product, 1);
    // toast.success(`${product.name} added to bag!`);
    router.push("/checkout");
  }, [isOutOfStock, addToCart, product, router]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(
      isWishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist!`
    );
  }, [toggleWishlist, product.id, product.name, isWishlisted]);

  const innerContent = (
    <div className="product-inner equal-element">
      <div className="product-top">
        {product.isNew && (
          <div className="flash">
            <span className="onnew">
              <span className="text">new</span>
            </span>
          </div>
        )}
      </div>
      <div className="product-thumb">
        <div className="thumb-inner">
          <Link
            href={`/product/${product.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              aspectRatio: "1 / 1",
              background: "#ffffff",
              overflow: "hidden",
            }}
          >
            <img
              src={displayImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "8px",
                opacity: isOutOfStock ? 0.88 : 1,
              }}
            />
          </Link>
          <button
            type="button"
            onClick={handleWishlist}
            className={`card-fav-btn ${isWishlisted ? "active in-wishlist" : ""}`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <i
              className={isWishlisted ? "fa fa-heart" : "fa fa-heart-o"}
              aria-hidden="true"
            />
          </button>
          {isOutOfStock && (
            <div className="product-soldout-overlay">
              <span>Out of Stock</span>
            </div>
          )}
          <div className="thumb-group">
            <div
              className={`yith-wcwl-add-to-wishlist ${
                isWishlisted ? "active in-wishlist" : ""
              }`}
            >
              <div className="yith-wcwl-add-button">
                <a
                  href="#wishlist"
                  onClick={handleWishlist}
                  className={isWishlisted ? "active in-wishlist" : ""}
                  title={
                    isWishlisted
                      ? "In Wishlist (Click to remove)"
                      : "Add to Wishlist"
                  }
                  aria-label="Wishlist"
                >
                  <i
                    className={isWishlisted ? "fa fa-heart" : "fa fa-heart-o"}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
            <Link
              href={`/product/${product.slug}`}
              className="button quick-wiew-button"
              title="View Details"
              aria-label={`View ${product.name} details`}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ display: "block" }}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
            {!isOutOfStock && (
              <div className="loop-form-add-to-cart">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="single_add_to_cart_button button"
                  title="Add to Bag"
                  aria-label="Add to Bag"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ display: "block" }}
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name product_title">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="group-info">
          <div className="stars-rating">
            <div className="star-rating">
              <span className={`star-${product.rating || 5}`}></span>
            </div>
            <div className="count-star">({product.reviewsCount})</div>
          </div>
          <div className="price">
            {displayOldPrice && displayOldPrice > displayPrice && (
              <del>
                {siteConfig.currency}
                {displayOldPrice}
              </del>
            )}
            <ins>
              {siteConfig.currency}
              {displayPrice}
            </ins>
          </div>
        </div>
      </div>
    </div>
  );

  const finalClassName = `${className} ${isOutOfStock ? "is-sold-out" : ""}`.trim();

  if (asListItem) {
    return <li className={finalClassName}>{innerContent}</li>;
  }

  return <div className={finalClassName}>{innerContent}</div>;
}

export default memo(ProductCardComponent);
