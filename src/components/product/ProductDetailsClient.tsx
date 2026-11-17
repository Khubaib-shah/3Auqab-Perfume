"use client";

import React, { useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import {
  Product,
  getProductPriceForSize,
  getProductOldPriceForSize,
} from "@/data/products";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";
import { businessConfig } from "@/config";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({
  product: initialProduct,
}: ProductDetailsClientProps) {
  const storeProducts = useAdminStore((s) => s.products);
  const storeCategories = useAdminStore((s) => s.categories);
  const storeTestimonials = useAdminStore((s) => s.testimonials);
  const settings = useAdminStore((s) => s.settings);
  const product =
    storeProducts.find(
      (p) => p.slug === initialProduct.slug || p.id === initialProduct.id
    ) || initialProduct;
  const activeCategories = storeCategories.filter((c) => c.isActive);

  const { addToCart, toggleWishlist, wishlist } = useShopStore();
  const isWishlisted = wishlist.includes(product.id);

  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0] || "15ml"
  );
  const activeImage = product.image;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);

  const handleSelectSize = (sz: string) => {
    setSelectedSize(sz);
  };

  const currentPrice = getProductPriceForSize(product, selectedSize);
  const currentOldPrice = getProductOldPriceForSize(product, selectedSize);
  const [activeTab, setActiveTab] = useState<
    "descriptions" | "information" | "reviews"
  >("descriptions");

  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Hamza Al-Rashid",
      date: "October 14, 2026",
      rating: 5,
      comment:
        "Exceptional longevity and projection! The scent profile feels genuinely luxurious and lasts all day.",
    },
  ]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");

  const isOutOfStock =
    product.inStock === false ||
    (typeof (product as unknown as { stockQuantity?: number }).stockQuantity === "number" &&
      (product as unknown as { stockQuantity: number }).stockQuantity <= 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
    );
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }
    addToCart(product, quantity, selectedSize, "");
    toast.success(`${product.name} (${selectedSize}) added to your bag!`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewName.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    setReviews((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: reviewName,
        date: "Just now",
        rating: reviewRating,
        comment: reviewText,
      },
    ]);
    setReviewText("");
    setReviewName("");
    setReviewEmail("");
    toast.success("Thank you! Your review has been published.");
  };

  const relatedProducts = storeProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);
  const sidebarRelated = storeProducts
    .filter((p) => p.id !== product.id)
    .slice(3, 5);

  return (
    <div className="main-content main-content-details single left-sidebar">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb
              items={[
                { label: product.category, href: "/shop" },
                { label: product.name },
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="content-area content-details col-lg-9 col-md-8 col-sm-12 col-xs-12">
            <div className="site-main">
              <div className="details-product">
                <div className="details-thumd">
                  <div
                    className="image-preview-container image-thick-box image_preview_container"
                    onMouseEnter={() => {
                      if (typeof window !== "undefined" && window.innerWidth > 991) {
                        setIsZoomed(true);
                      }
                    }}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={(e) => {
                      if (typeof window !== "undefined" && window.innerWidth > 991) {
                        handleMouseMove(e);
                      }
                    }}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      cursor: isZoomed ? "crosshair" : "zoom-in",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <img
                      id="img_zoom"
                      src={activeImage}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: isZoomed ? "scale(2.2)" : "scale(1)",
                        transition: isZoomed
                          ? "transform 0.08s ease-out"
                          : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                        willChange: "transform, transform-origin",
                        userSelect: "none",
                        opacity: isOutOfStock ? 0.88 : 1,
                      }}
                    />
                    {isOutOfStock && (
                      <div className="product-soldout-overlay">
                        <span>Out of Stock</span>
                      </div>
                    )}
                    <a
                      href="#zoom"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLightboxOpen(true);
                      }}
                      className="btn-zoom open_qv"
                      title="Fullscreen preview"
                      style={{ zIndex: 10 }}
                    >
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>

                <div className="details-infor">
                  <h1 className="product-title">{product.name}</h1>
                  <div className="stars-rating">
                    <div className="star-rating">
                      <span className={`star-${product.rating}`}></span>
                    </div>
                    <div className="count-star">({product.reviewsCount})</div>
                  </div>
                  <div className="availability">
                    Availability:{" "}
                    <a href="#stock">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </a>
                  </div>
                  <div
                    className="price"
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: "8px",
                      margin: "14px 0",
                    }}
                  >
                    {currentOldPrice && (
                      <del style={{ color: "#999", fontSize: "16px" }}>
                        {settings.currency} {currentOldPrice.toLocaleString()}
                      </del>
                    )}
                    <ins
                      style={{
                        color: "var(--color-primary)",
                        fontWeight: 700,
                        fontSize: "26px",
                        textDecoration: "none",
                      }}
                    >
                      {settings.currency} {currentPrice.toLocaleString()}
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
                      {product.shortBullets.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                      <li>SKU: {product.sku}</li>
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
                        {product.sizes.map((sz) => {
                          const szPrice = getProductPriceForSize(product, sz);
                          const isActive = selectedSize === sz;
                          return (
                            <a
                              key={sz}
                              href="#size"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelectSize(sz);
                              }}
                              className={`bottle-size-btn ${isActive ? "active" : ""}`}
                            >
                              <span style={{ fontSize: "14px" }}>{sz}</span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  opacity: 0.85,
                                  fontWeight: 500,
                                  marginTop: "2px",
                                }}
                              >
                                {settings.currency} {szPrice.toLocaleString()}
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
                            toggleWishlist(product.id);
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
                    <div className="size-chart-wrapp">
                      <div className="btn-size-chart">
                        <a
                          id="size_chart"
                          href="#notes"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("information");
                          }}
                        >
                          {businessConfig.labels.specsLinkText}
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
                        onClick={handleAddToCart}
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

              {/* Product Details Tabs (Always in one row) */}
              <div className="tab-details-product">
                <ul className="tab-link single-row-tabs">
                  <li className={activeTab === "descriptions" ? "active" : ""}>
                    <a
                      href="#product-descriptions"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("descriptions");
                      }}
                    >
                      Descriptions
                    </a>
                  </li>
                  <li className={activeTab === "information" ? "active" : ""}>
                    <a
                      href="#information"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("information");
                      }}
                    >
                      {businessConfig.specifications.tabTitle}
                    </a>
                  </li>
                  <li className={activeTab === "reviews" ? "active" : ""}>
                    <a
                      href="#reviews"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("reviews");
                      }}
                    >
                      Reviews ({reviews.length})
                    </a>
                  </li>
                </ul>
                <div className="tab-container">
                  <div
                    id="product-descriptions"
                    className={`tab-panel ${
                      activeTab === "descriptions" ? "active" : ""
                    }`}
                  >
                    {product.description.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                  <div
                    id="information"
                    className={`tab-panel ${
                      activeTab === "information" ? "active" : ""
                    }`}
                  >
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td>Available {businessConfig.variant.label}s</td>
                          <td>{product.sizes.join(" / ")}</td>
                        </tr>
                        {product.specifications ? (
                          Object.entries(product.specifications).map(
                            ([key, val]) => (
                              <tr key={key}>
                                <td style={{ textTransform: "capitalize" }}>
                                  {key.replace(/([A-Z])/g, " $1")}
                                </td>
                                <td>{val}</td>
                              </tr>
                            )
                          )
                        ) : product.notes ? (
                          <>
                            {product.notes.top && (
                              <tr>
                                <td>Top Notes</td>
                                <td>{product.notes.top}</td>
                              </tr>
                            )}
                            {product.notes.heart && (
                              <tr>
                                <td>Heart (Middle) Notes</td>
                                <td>{product.notes.heart}</td>
                              </tr>
                            )}
                            {product.notes.base && (
                              <tr>
                                <td>Base Notes</td>
                                <td>{product.notes.base}</td>
                              </tr>
                            )}
                          </>
                        ) : null}
                        {businessConfig.specifications.staticRows.map((row) => (
                          <tr key={row.label}>
                            <td>{row.label}</td>
                            <td>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    id="reviews"
                    className={`tab-panel ${
                      activeTab === "reviews" ? "active" : ""
                    }`}
                  >
                    <div className="reviews-tab">
                      <div className="comments">
                        <h2 className="reviews-title">
                          {reviews.length} review(s) for{" "}
                          <span>{product.name}</span>
                        </h2>
                        <ol className="commentlist">
                          {reviews.map((rev) => (
                            <li key={rev.id} className="conment">
                              <div className="conment-container">
                                <a
                                  href="#avatar"
                                  onClick={(e) => e.preventDefault()}
                                  className="avatar"
                                >
                                  <img
                                    src="/assets/images/avartar.png"
                                    alt={rev.author}
                                  />
                                </a>
                                <div className="comment-text">
                                  <div className="stars-rating">
                                    <div className="star-rating">
                                      <span
                                        className={`star-${rev.rating}`}
                                      ></span>
                                    </div>
                                    <div className="count-star">
                                      ({rev.rating})
                                    </div>
                                  </div>
                                  <p className="meta">
                                    <strong className="author">
                                      {rev.author}
                                    </strong>{" "}
                                    <span>-</span>{" "}
                                    <span className="time">{rev.date}</span>
                                  </p>
                                  <div className="description">
                                    <p>{rev.comment}</p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="review_form_wrapper">
                        <div className="review_form">
                          <div className="comment-respond">
                            <span className="comment-reply-title">
                              Add a review
                            </span>
                            <form
                              onSubmit={handleReviewSubmit}
                              className="comment-form-review"
                            >
                              <p className="comment-notes">
                                <span className="email-notes">
                                  Your email address will not be published.
                                </span>{" "}
                                Required fields are marked{" "}
                                <span className="required">*</span>
                              </p>
                              <div className="comment-form-rating">
                                <label>Your rating</label>
                                <p className="stars">
                                  <span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <a
                                        key={star}
                                        className={`star-${star} ${
                                          reviewRating === star ? "active" : ""
                                        }`}
                                        href={`#star-${star}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setReviewRating(star);
                                        }}
                                      ></a>
                                    ))}
                                  </span>
                                </p>
                              </div>
                              <p className="comment-form-comment">
                                <label>
                                  Your review{" "}
                                  <span className="required">*</span>
                                </label>
                                <textarea
                                  title="review"
                                  id="comment"
                                  name="comment"
                                  cols={45}
                                  rows={6}
                                  value={reviewText}
                                  onChange={(e) =>
                                    setReviewText(e.target.value)
                                  }
                                ></textarea>
                              </p>
                              <p className="comment-form-author">
                                <label>
                                  Name <span>*</span>
                                </label>
                                <input
                                  title="author"
                                  id="author"
                                  name="author"
                                  type="text"
                                  value={reviewName}
                                  onChange={(e) =>
                                    setReviewName(e.target.value)
                                  }
                                />
                              </p>
                              <p className="comment-form-email">
                                <label>
                                  Email <span>*</span>
                                </label>
                                <input
                                  title="email"
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={reviewEmail}
                                  onChange={(e) =>
                                    setReviewEmail(e.target.value)
                                  }
                                />
                              </p>
                              <p className="form-submit">
                                <input
                                  name="submit"
                                  type="submit"
                                  id="submit"
                                  className="submit"
                                  value="Submit"
                                />
                              </p>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ clear: "left" }}></div>

              {/* Related Products */}
              <div className="related products product-grid">
                <h2 className="product-grid-title">You may also like</h2>
                <div className="owl-products owl-slick equal-container nav-center">
                  <div className="row">
                    {relatedProducts.map((rel) => (
                      <ProductCard
                        key={rel.id}
                        product={rel}
                        asListItem={false}
                        className="product-item style-1 col-lg-4 col-md-4 col-sm-6 col-xs-12"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Sidebar */}
          <div className="sidebar sidebar-details col-lg-3 col-md-4 col-sm-12 col-xs-12">
            <div className="wrapper-sidebar">
              <div className="widget widget-categories">
                <h3 className="widgettitle">Categories</h3>
                <ul className="list-categories">
                  {activeCategories.map((cat, idx) => (
                    <li key={cat.slug}>
                      <input type="checkbox" id={`det-cat-${idx}`} />
                      <label htmlFor={`det-cat-${idx}`} className="label-text">
                        <Link href={`/shop?category=${cat.slug}`}>
                          {cat.name}
                        </Link>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget widget-related-products">
                <h3 className="widgettitle">Related Perfumes</h3>
                <div className="slider-related-products owl-slick nav-top-right equal-container">
                  {sidebarRelated.map((rel) => (
                    <ProductCard
                      key={rel.id}
                      product={rel}
                      asListItem={false}
                      className="product-item style-1"
                    />
                  ))}
                </div>
              </div>

              <div className="widget widget-testimonials">
                <h3 className="widgettitle">Testimonials</h3>
                <div className="slider-related-products owl-slick nav-top-right">
                  <div className="testimonials-item">
                    <div className="Testimonial-inner">
                      <div className="comment">
                        {storeTestimonials[0]?.text ||
                          businessConfig.labels.reviewFallbackQuote}
                      </div>
                      <div className="author">
                        <div className="avt">
                          <img
                            src={
                              storeTestimonials[0]?.avatar ||
                              "/assets/images/member1.png"
                            }
                            alt={storeTestimonials[0]?.name || "Customer"}
                          />
                        </div>
                        <h3 className="name">
                          {storeTestimonials[0]?.name || "Tariq Al-Mansoor"}
                          <span className="position">
                            {storeTestimonials[0]?.role ||
                              businessConfig.labels.reviewerFallbackRole}
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: product.image }]}
      />
    </div>
  );
}
