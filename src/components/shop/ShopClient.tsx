"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import { useAdminStore } from "@/store/useAdminStore";
import { siteConfig } from "@/data/siteConfig";

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const settings = useAdminStore((s) => s.settings);
  const promoBanners = useAdminStore((s) => s.promoBanners);
  const subscribeNewsletterOnServer = useAdminStore(
    (s) => s.subscribeNewsletterOnServer
  );

  const shopSlide1 = siteConfig.promoBanners.shopSlide1;
  const shopSlide2 = siteConfig.promoBanners.shopSlide2;

  const [bannerSlide, setBannerSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedFinish, setSelectedFinish] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [sidebarEmail, setSidebarEmail] = useState("");

  // Drawer / Bottom sheet state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState(initialQuery);

  useEffect(() => {
    setDrawerSearch(initialQuery);
  }, [initialQuery]);

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleNote = (note: string) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  // Full matching list before pagination
  const allMatchingProducts = useMemo(() => {
    let list = [...products];

    const activeQuery = drawerSearch.trim() || initialQuery.trim();
    if (activeQuery) {
      const q = activeQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.notes?.top?.toLowerCase().includes(q) ||
          p.notes?.heart?.toLowerCase().includes(q) ||
          p.notes?.base?.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.sizes.some((sz) => selectedSizes.includes(sz))
      );
    }

    if (selectedNotes.length > 0) {
      list = list.filter((p) =>
        selectedNotes.some((n) => {
          const q = n.toLowerCase();
          return (
            p.notes?.top?.toLowerCase().includes(q) ||
            p.notes?.heart?.toLowerCase().includes(q) ||
            p.notes?.base?.toLowerCase().includes(q) ||
            p.name?.toLowerCase().includes(q)
          );
        })
      );
    }

    if (selectedTag) {
      list = list.filter(
        (p) =>
          p.category.toLowerCase().includes(selectedTag.toLowerCase()) ||
          p.name.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [
    products,
    drawerSearch,
    initialQuery,
    selectedCategories,
    selectedSizes,
    selectedNotes,
    selectedTag,
    maxPrice,
    sortBy,
  ]);

  const totalMatchingCount = allMatchingProducts.length;

  const nonSearchFiltersCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedNotes.length +
    (selectedTag ? 1 : 0) +
    (maxPrice < 10000 ? 1 : 0);

  const activeFiltersCount =
    (initialQuery ? 1 : 0) + nonSearchFiltersCount;

  const handleClearSearch = () => {
    setDrawerSearch("");
    router.push("/shop");
  };

  const handleResetAllFilters = () => {
    setDrawerSearch("");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedNotes([]);
    setSelectedFinish("ALL");
    setSelectedTag("");
    setMaxPrice(10000);
    router.push("/shop");
    toast.success("Filters reset to default.");
  };

  const handleApplyDrawerFilters = () => {
    if (drawerSearch.trim()) {
      router.push(`/shop?q=${encodeURIComponent(drawerSearch.trim())}`);
    } else if (initialQuery) {
      router.push("/shop");
    }
    setFilterDrawerOpen(false);
  };

  const handleSidebarSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail.trim()) return;
    await subscribeNewsletterOnServer(sidebarEmail.trim(), "Shop Sidebar");
    toast.success(`Subscribed to ${siteConfig.name} updates!`);
    setSidebarEmail("");
  };

  return (
    <div className="main-content main-content-product left-sidebar">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb items={[{ label: "Perfume Collection" }]} />
          </div>
        </div>
        <div className="row">
          <div className="content-area shop-grid-content no-banner col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <div className="site-main">
              {/* Shop Banner Slider with Smooth Sliding Track */}
              <div
                className="banner-shop banner-slider slick-slider"
                style={{ overflow: "hidden", position: "relative" }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    transition:
                      "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                    transform: `translate3d(-${bannerSlide * 100}%, 0, 0)`,
                    willChange: "transform",
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 100%",
                      width: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <div className="item-banner style1">
                      <div className="inner equal-element">
                        <div className="banner-content style1">
                          <h4 className="stelina-subtitle">
                            {shopSlide1.subtitle}
                          </h4>
                          <h3
                            className="title"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {shopSlide1.title}
                          </h3>
                          <span className="when-code">
                            When Use Code:{" "}
                            <span className="code">{shopSlide1.code}</span>
                          </span>
                          <Link
                            href={shopSlide1.link || "/shop"}
                            className="button button-now"
                          >
                            Shop now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: "0 0 100%",
                      width: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <div className="item-banner style2">
                      <div className="inner equal-element">
                        <div className="banner-content style2">
                          <h3 className="title">{shopSlide2.title}</h3>
                          <span
                            className="description"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {shopSlide2.description}
                          </span>
                          <span className="hot-price">
                            {shopSlide2.priceLabel}{" "}
                            <span className="price-number">
                              {shopSlide2.priceValue}
                            </span>
                          </span>
                          <Link
                            href={shopSlide2.link || "/shop"}
                            className="button button-now"
                          >
                            Shop now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="slick-dots" style={{ marginTop: "15px" }}>
                  {[0, 1].map((idx) => (
                    <li
                      key={idx}
                      className={bannerSlide === idx ? "slick-active" : ""}
                      onClick={() => setBannerSlide(idx)}
                    >
                      <button type="button">{idx + 1}</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shop-title-row">
                <div className="shop-title-with-clear">
                  <h3 className="custom_blog_title">
                    {initialQuery
                      ? `Search Results for "${initialQuery}"`
                      : "Three Uqab Fragrances"}
                  </h3>
                  {initialQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="btn-title-clear-cross"
                      title="Clear Search"
                      aria-label="Clear Search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filter Pills Bar (Only shown for non-search filters like categories, notes, size, price) */}
              {nonSearchFiltersCount > 0 && (
                <div className="shop-active-filters-bar">
                  <div className="active-filters-list">
                    {selectedCategories.map((cat) => (
                      <span key={cat} className="active-filter-pill">
                        Category: {cat}
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          title="Remove category"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedSizes.map((sz) => (
                      <span key={sz} className="active-filter-pill">
                        Size: {sz}
                        <button
                          type="button"
                          onClick={() => toggleSize(sz)}
                          title="Remove size"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedNotes.map((note) => (
                      <span key={note} className="active-filter-pill">
                        Note: {note}
                        <button
                          type="button"
                          onClick={() => toggleNote(note)}
                          title="Remove note"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedTag && (
                      <span className="active-filter-pill">
                        Tag: {selectedTag}
                        <button
                          type="button"
                          onClick={() => setSelectedTag("")}
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {maxPrice < 10000 && (
                      <span className="active-filter-pill">
                        Max Price: {siteConfig.currency} {maxPrice}
                        <button
                          type="button"
                          onClick={() => setMaxPrice(10000)}
                          title="Reset max price"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-clear-all-filters"
                    onClick={handleResetAllFilters}
                  >
                    <i className="fa fa-refresh"></i> Reset All
                  </button>
                </div>
              )}

              <div className="shop-top-control">
                {/* Advance Filters Button (Mobile only, white background, brand color icon) */}
                <button
                  type="button"
                  className="btn-open-filter-drawer"
                  onClick={() => setFilterDrawerOpen(true)}
                  title="Filter Fragrances"
                  aria-label="Filter"
                >
                  <i className="fa fa-sliders" aria-hidden="true"></i>
                  <span className="filter-btn-label">Filter</span>
                  {nonSearchFiltersCount > 0 && (
                    <span className="filter-badge">{nonSearchFiltersCount}</span>
                  )}
                </button>

                <div className="shop-matching-count-text">
                  Showing all <strong>{allMatchingProducts.length}</strong> Fragrances
                </div>

                <div className="shop-top-right-controls">
                  <div className="filter-choice select-form shop-control-inline">
                    <span className="title label-text">Sort</span>
                    <span className="icon-indicator" title="Sort options">
                      <i className="fa fa-sort-amount-desc"></i>
                    </span>
                    <select
                      title="Sort by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="chosen-select"
                    >
                      <option value="default">Featured Selection</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Most Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              {allMatchingProducts.length === 0 ? (
                <div className="shop-no-results">
                  <div className="no-results-icon">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </div>
                  <h4>No Fragrances Found</h4>
                  <p>
                    No perfumes matched your current filters or search query.
                  </p>
                  <button
                    type="button"
                    className="btn-admin btn-admin-primary"
                    onClick={handleResetAllFilters}
                  >
                    Clear All Filters & Show All
                  </button>
                </div>
              ) : (
                <ul className="row list-products auto-clear equal-container product-grid">
                  {allMatchingProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      asListItem={true}
                      className="product-item col-lg-4 col-md-6 col-sm-6 col-xs-6 col-ts-12 style-1"
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Left/Right Filter Sidebar */}
          <div className="sidebar col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <div className="wrapper-sidebar shop-sidebar">
              <div className="widget woof_Widget">
                <div className="widget widget-categories">
                  <h3 className="widgettitle">Categories</h3>
                  <ul className="list-categories">
                    {categories
                      .filter((c) => c.isActive)
                      .map((cat, idx) => (
                        <li key={cat.slug}>
                          <input
                            type="checkbox"
                            id={`cat-cb-${idx}`}
                            checked={selectedCategories.includes(cat.name)}
                            onChange={() => toggleCategory(cat.name)}
                          />
                          <label htmlFor={`cat-cb-${idx}`} className="label-text">
                            {cat.name}
                          </label>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="widget widget_filter_price">
                  <h4 className="widgettitle">Price Filter</h4>
                  <div className="price-slider-wrapper">
                    <input
                      type="range"
                      min={200}
                      max={10000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#ab8e66" }}
                    />
                    <div className="price-slider-amount">
                      <span className="from">{siteConfig.currency}200</span>
                      <span className="to">{siteConfig.currency}{maxPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="widget widget-brand">
                  <h3 className="widgettitle">Fragrance Notes</h3>
                  <ul className="list-brand">
                    {[
                      "Arabian Oud",
                      "Madagascar Vanilla",
                      "Damask Rose",
                      "Calabrian Bergamot",
                      "White Musk",
                      "Saffron & Amber",
                    ].map((note, idx) => (
                      <li key={note}>
                        <input
                          id={`note-cb-${idx}`}
                          type="checkbox"
                          checked={selectedNotes.includes(note)}
                          onChange={() => toggleNote(note)}
                        />
                        <label
                          htmlFor={`note-cb-${idx}`}
                          className="label-text"
                        >
                          {note}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="widget widget_filter_size">
                  <h4 className="widgettitle">Bottle Size</h4>
                  <ul className="list-brand">
                    {["30ml", "50ml", "100ml"].map((sz, idx) => (
                      <li key={sz}>
                        <input
                          id={`sz-cb-${idx}`}
                          type="checkbox"
                          checked={selectedSizes.includes(sz)}
                          onChange={() => toggleSize(sz)}
                        />
                        <label htmlFor={`sz-cb-${idx}`} className="label-text">
                          {sz} Eau de Parfum
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="widget widget-color">
                  <h4 className="widgettitle">Bottle Finish</h4>
                  <div className="list-color">
                    {[
                      "color1",
                      "color2",
                      "color3",
                      "color4",
                      "color5",
                      "color6",
                      "color7",
                    ].map((c) => (
                      <a
                        key={c}
                        href="#color"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFinish(c);
                        }}
                        className={`${c} ${selectedFinish === c ? "active" : ""
                          }`}
                      ></a>
                    ))}
                  </div>
                </div>

                <div className="widget widget-tags">
                  <h3 className="widgettitle">Popular Tags</h3>
                  <ul className="tagcloud">
                    {settings.popularTags.map((tag) => (
                      <li
                        key={tag}
                        className={`tag-cloud-link ${selectedTag === tag ? "active" : ""
                          }`}
                      >
                        <a
                          href="#tag"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTag(tag);
                          }}
                        >
                          {tag}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="widget newsletter-widget">
                <form
                  onSubmit={handleSidebarSub}
                  className="newsletter-form-wrap"
                >
                  <h3 className="title">Subscribe to Our Newsletter</h3>
                  <div className="subtitle">
                    More special Deals, Events & Promotions
                  </div>
                  <input
                    type="email"
                    value={sidebarEmail}
                    onChange={(e) => setSidebarEmail(e.target.value)}
                    className="email"
                    placeholder="Your email address"
                  />
                  <button type="submit" className="button submit-newsletter">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADVANCE FILTER BOTTOM SHEET / DRAWER */}
      {filterDrawerOpen && (
        <div
          className="filter-drawer-backdrop"
          onClick={() => setFilterDrawerOpen(false)}
        >
          <div
            className="filter-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-drawer-header">
              <div>
                <h3 className="filter-drawer-title">Filter & Refine</h3>
                <span className="filter-drawer-subtitle">
                  {totalMatchingCount}{" "}
                  {totalMatchingCount === 1 ? "perfume" : "perfumes"} match
                </span>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setFilterDrawerOpen(false)}
                title="Close Filters"
              >
                ×
              </button>
            </div>

            <div className="filter-drawer-body">
              {/* Keyword Search inside drawer */}
              <div className="drawer-filter-group">
                <label className="drawer-group-label">Keyword Search</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Search perfumes, oud, notes..."
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                  />
                  {drawerSearch && (
                    <button
                      type="button"
                      className="btn-search-clear-inline"
                      onClick={() => setDrawerSearch("")}
                      title="Clear keyword"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="drawer-filter-group">
                <label className="drawer-group-label">Categories</label>
                <div className="drawer-chips-wrap">
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => {
                      const isSel = selectedCategories.includes(cat.name);
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          className={`drawer-chip ${isSel ? "active" : ""}`}
                          onClick={() => toggleCategory(cat.name)}
                        >
                          {isSel && (
                            <i
                              className="fa fa-check"
                              style={{ marginRight: "4px" }}
                            ></i>
                          )}
                          {cat.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="drawer-filter-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label className="drawer-group-label" style={{ margin: 0 }}>
                    Max Price
                  </label>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#ab8e66",
                      fontSize: "14px",
                    }}
                  >
                    {siteConfig.currency} {maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#ab8e66" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#888",
                    marginTop: "4px",
                  }}
                >
                  <span>{siteConfig.currency} 200</span>
                  <span>{siteConfig.currency} 10,000</span>
                </div>
              </div>

              {/* Fragrance Notes */}
              <div className="drawer-filter-group">
                <label className="drawer-group-label">Fragrance Notes</label>
                <div className="drawer-chips-wrap">
                  {[
                    "Arabian Oud",
                    "Madagascar Vanilla",
                    "Damask Rose",
                    "Calabrian Bergamot",
                    "White Musk",
                    "Saffron & Amber",
                  ].map((note) => {
                    const isSel = selectedNotes.includes(note);
                    return (
                      <button
                        key={note}
                        type="button"
                        className={`drawer-chip ${isSel ? "active" : ""}`}
                        onClick={() => toggleNote(note)}
                      >
                        {isSel && (
                          <i
                            className="fa fa-check"
                            style={{ marginRight: "4px" }}
                          ></i>
                        )}
                        {note}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottle Sizes */}
              <div className="drawer-filter-group">
                <label className="drawer-group-label">Bottle Volume</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["30ml", "50ml", "100ml"].map((sz) => {
                    const isSel = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        className={`drawer-chip ${isSel ? "active" : ""}`}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => toggleSize(sz)}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STICKY FOOTER WITH REAL-TIME MATCHING COUNT */}
            <div className="filter-drawer-footer">
              <button
                type="button"
                className="btn-apply-filters-count"
                disabled={totalMatchingCount === 0}
                onClick={handleApplyDrawerFilters}
              >
                {totalMatchingCount === 0
                  ? "No Perfumes Match (0)"
                  : `Show ${totalMatchingCount} ${totalMatchingCount === 1 ? "Perfume" : "Perfumes"
                  }`}
              </button>
              <button
                type="button"
                className="btn-drawer-reset"
                onClick={handleResetAllFilters}
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
