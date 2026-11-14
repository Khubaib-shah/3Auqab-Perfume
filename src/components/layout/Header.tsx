"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { siteConfig } from "@/data/siteConfig";
import { Product } from "@/data/products";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";

type MobilePanel = "main" | "shop" | "pages";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { cart, removeFromCart } = useShopStore();
  const settings = useAdminStore((s) => s.settings);
  const announcements = useAdminStore((s) => s.announcements);
  const categories = useAdminStore((s) => s.categories);
  const products = useAdminStore((s) => s.products);
  const loginAdmin = useAdminStore((s) => s.loginAdmin);

  const [quickEmail, setQuickEmail] = useState("");
  const [quickPassword, setQuickPassword] = useState("");

  const activeAnnouncements = useMemo(
    () =>
      announcements
        .filter((a) => a.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((a) => a.text),
    [announcements]
  );

  const navCategories = useMemo(
    () =>
      categories
        .filter((c) => c.isActive && c.showInNav)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("main");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const suggestedProducts = useMemo<Product[]>(() => {
    if (!products || products.length === 0) return [];
    if (!searchQuery.trim()) {
      return products.slice(0, 4);
    }
    const q = searchQuery.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.notes?.top?.toLowerCase().includes(q) ||
          p.notes?.heart?.toLowerCase().includes(q) ||
          p.notes?.base?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  // Close dropdowns smoothly on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setCartOpen(false);
        setAccountOpen(false);
        setMobileSearchOpen(false);
      }
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset mobile panel when drawer closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      const t = setTimeout(() => setMobilePanel("main"), 300);
      return () => clearTimeout(t);
    }
  }, [mobileMenuOpen]);

  // Open mobile search on custom event from bottom navigation
  useEffect(() => {
    const handleOpenMobileSearch = () => {
      setMobileSearchOpen(true);
      setTimeout(() => {
        const input = document.querySelector(".header-searchform-box .search-input") as HTMLInputElement;
        input?.focus();
      }, 150);
    };
    window.addEventListener("open-mobile-search", handleOpenMobileSearch);
    return () => window.removeEventListener("open-mobile-search", handleOpenMobileSearch);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    } else {
      router.push("/shop");
    }
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(quickEmail, quickPassword)) {
      toast.success(`Welcome to ${siteConfig.shortName} Dashboard!`);
      setAccountOpen(false);
      router.push("/admin");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  const panelTitles: Record<MobilePanel, string> = {
    main: "Main Menu",
    shop: "Shop Categories",
    pages: "Store Pages",
  };

  const renderMainMenu = () => (
    <ul
      className="stelina-clone-mobile-menu stelina-nav main-menu"
      id="menu-main-menu"
    >
      <li className={`menu-item ${pathname === "/" ? "active" : ""}`}>
        <Link className="stelina-menu-item-title" href="/" title="Home">
          Home
        </Link>
      </li>
      <li
        className={`menu-item menu-item-has-children ${pathname.startsWith("/shop") || pathname.startsWith("/product")
          ? "active"
          : ""
          }`}
      >
        <Link className="stelina-menu-item-title" href="/shop" title="Shop">
          Shop
        </Link>
        <span className="toggle-submenu"></span>
        <ul className="submenu">
          {navCategories.map((cat) => (
            <li key={cat.slug} className="menu-item">
              <Link href={`/shop?category=${cat.slug}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      </li>
      <li className="menu-item menu-item-has-children item-megamenu">
        <Link
          href="/cart"
          className="stelina-menu-item-title"
          title="Pages"
        >
          Pages
        </Link>
        <span className="toggle-submenu"></span>
        <div className="submenu mega-menu menu-page">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 menu-page-item">
              <div className="stelina-custommenu default">
                <h2 className="widgettitle">Store Pages</h2>
                <ul className="menu">
                  <li className="menu-item">
                    <Link href="/cart">Shopping Cart</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/checkout">Checkout</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/login">Account Login</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/admin">Admin Dashboard</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 menu-page-item">
              <div className="stelina-custommenu default">
                <h2 className="widgettitle">Signature Fragrances</h2>
                <ul className="menu">
                  <li className="menu-item">
                    <Link href="/product/uqab-signature-edp">
                      3Auqab Signature EDP
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/product/uqab-rihla-edp">Auqab Rihla Eau</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/product/ambre-royal-extrait">
                      Ambre Royal Extrait
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/product/the-alchemist-elixir">
                      The Alchemist Elixir
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 menu-page-item"></div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 menu-page-item"></div>
          </div>
        </div>
      </li>
      <li
        className={`menu-item ${pathname.startsWith("/blog") ? "active" : ""
          }`}
      >
        <Link className="stelina-menu-item-title" href="/blog" title="Blogs">
          Blogs
        </Link>
      </li>
      <li className={`menu-item ${pathname === "/about" ? "active" : ""}`}>
        <Link className="stelina-menu-item-title" href="/about" title="About">
          About
        </Link>
      </li>
      <li className={`menu-item ${pathname === "/contact" ? "active" : ""}`}>
        <Link
          className="stelina-menu-item-title"
          href="/contact"
          title="Contact"
        >
          Contact
        </Link>
      </li>
    </ul>
  );

  const renderMiniCart = () => (
    <div
      className={`block-minicart stelina-mini-cart block-header stelina-dropdown ${cartOpen ? "open" : ""
        }`}
    >
      <a
        href="#cart"
        onClick={(e) => {
          e.preventDefault();
          setCartOpen(!cartOpen);
          setAccountOpen(false);
        }}
        className="shopcart-icon"
        data-stelina="stelina-dropdown"
      >
        Cart
        <span className="count">{totalCount}</span>
      </a>
      {cart.length === 0 ? (
        <div className="no-product stelina-submenu">
          <p className="text">
            You have <span>0 item(s)</span> in your bag
          </p>
        </div>
      ) : (
        <div
          className="stelina-submenu"
          style={{
            minWidth: "310px",
            padding: "20px",
            background: "#fff",
            boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
          }}
        >
          <div className="minicart-items-wrapper">
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 15px 0",
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              {cart.map((item) => (
                <li
                  key={item.product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "12px",
                    marginBottom: "12px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => setCartOpen(false)}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{
                          width: "55px",
                          height: "55px",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setCartOpen(false)}
                        style={{
                          fontWeight: 600,
                          color: "#222",
                          display: "block",
                          fontSize: "14px",
                        }}
                      >
                        {item.product.name}
                      </Link>
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        {item.selectedSize} | {item.quantity} x{" "}
                        {settings.currency}
                        {item.product.price}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    title="Remove item"
                  >
                    <i className="fa fa-trash-o"></i>
                  </button>
                </li>
              ))}
            </ul>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
                marginBottom: "15px",
                fontSize: "15px",
              }}
            >
              <span>Subtotal:</span>
              <span style={{ color: "#ab8e66" }}>
                {settings.currency}
                {totalPrice.toFixed(2)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="button"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 12px",
                  background: "#222",
                  color: "#fff",
                  fontSize: "12px",
                  textTransform: "uppercase",
                }}
              >
                View Bag
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="button"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 12px",
                  background: "#ab8e66",
                  color: "#fff",
                  fontSize: "12px",
                  textTransform: "uppercase",
                }}
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAccountDropdown = () => (
    <div
      className={`block-account block-header stelina-dropdown ${accountOpen ? "open" : ""
        }`}
    >
      <a
        href="#account"
        onClick={(e) => {
          e.preventDefault();
          setAccountOpen(!accountOpen);
          setCartOpen(false);
        }}
        data-stelina="stelina-dropdown"
        title="Account Login"
      >
        <span className="flaticon-user"></span>
      </a>
      <div className="header-account stelina-submenu">
        <div className="header-user-form-tabs">
          <ul className="tab-link">
            <li className="active">
              <a href="#header-tab-login" onClick={(e) => e.preventDefault()}>
                Login
              </a>
            </li>
          </ul>
          <div className="tab-container">
            <div id="header-tab-login" className="tab-panel active">
              <form onSubmit={handleQuickLogin} className="login form-login">
                <p className="form-row form-row-wide">
                  <input
                    type="email"
                    required
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    placeholder="Email"
                    className="input-text"
                  />
                </p>
                <p className="form-row form-row-wide">
                  <input
                    type="password"
                    required
                    value={quickPassword}
                    onChange={(e) => setQuickPassword(e.target.value)}
                    className="input-text"
                    placeholder="Password"
                  />
                </p>
                <p className="form-row">
                  <label className="form-checkbox">
                    <input type="checkbox" className="input-checkbox" />
                    <span>Remember me</span>
                  </label>
                  <input type="submit" className="button" value="Login" />
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={headerRef}>
      <header className="header style2">
        <div className="top-bar">
          <div className="announcement-marquee" aria-label="Store announcements">
            <div className="announcement-marquee-track">
              {[0, 1].map((copyIdx) => (
                <div
                  key={copyIdx}
                  className="announcement-marquee-group"
                  aria-hidden={copyIdx === 1}
                >
                  {(activeAnnouncements.length > 0
                    ? activeAnnouncements
                    : siteConfig.announcements
                  ).map((text, idx) => (
                    <span key={idx} className="announcement-item">
                      <span>{text}</span>
                      <span
                        className="announcement-separator"
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="main-header">
            <div className="row">
              <div className="col-lg-4 col-sm-6 col-md-4 col-xs-7 col-ts-12 header-element">
                <div className="block-search-block" ref={searchBoxRef} style={{ position: "relative" }}>
                  <form className="form-search" onSubmit={handleSearch}>
                    <div className="form-content">
                      <div className="inner" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          className="input"
                          name="s"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setSearchFocused(true)}
                          placeholder="Search perfumes, oud..."
                          autoComplete="off"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="btn-search-clear-inline"
                            title="Clear search"
                          >
                            ×
                          </button>
                        )}
                        <button className="btn-search" type="submit">
                          <span className="icon-search"></span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Pre-searched Items & Trending Suggestions Dropdown */}
                  {searchFocused && (
                    <div className="search-suggestions-dropdown">
                      <div className="search-suggestions-section">
                        <div className="search-suggestions-title">
                          <i className="fa fa-fire" style={{ color: "#ab8e66", marginRight: "6px" }}></i>
                          Popular Searches
                        </div>
                        <div className="search-tags-row">
                          {["Royal Oud", "Arabian Oud", "Signature Scents", "Rose & Oud", "Melody"].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className="search-tag-chip"
                              onClick={() => {
                                setSearchQuery(tag);
                                setSearchFocused(false);
                                router.push(`/shop?q=${encodeURIComponent(tag)}`);
                              }}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="search-suggestions-section" style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "10px" }}>
                        <div className="search-suggestions-title">
                          <i className="fa fa-star" style={{ color: "#ab8e66", marginRight: "6px" }}></i>
                          {searchQuery.trim() ? "Matching Fragrances" : "Pre-searched Picks"}
                        </div>
                        <div className="search-products-list">
                          {suggestedProducts.slice(0, 4).map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.slug}`}
                              className="search-product-item"
                              onClick={() => setSearchFocused(false)}
                            >
                              <img src={p.image} alt={p.name} className="search-prod-thumb" />
                              <div className="search-prod-info">
                                <span className="search-prod-name">{p.name}</span>
                                <span className="search-prod-category">{p.category}</span>
                              </div>
                              <span className="search-prod-price">
                                {siteConfig.currency} {p.price}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {searchQuery.trim() && (
                        <div className="search-suggestions-footer">
                          <button
                            type="button"
                            className="btn-view-all-results"
                            onClick={() => {
                              setSearchFocused(false);
                              router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                            }}
                          >
                            View all results for &quot;{searchQuery}&quot; →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-md-4 col-xs-5 col-ts-12">
                <div className="logo">
                  <Link href="/">
                    <img
                      src={siteConfig.logo}
                      alt={siteConfig.name}
                      style={{
                        maxWidth: "180px",
                        maxHeight: "52px",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        display: "inline-block",

                      }}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-sm-12 col-md-4 col-xs-12 col-ts-12">
                <div className="header-control">
                  {renderMiniCart()}
                  {renderAccountDropdown()}
                  <a
                    className="menu-bar mobile-navigation menu-toggle"
                    href="#menu"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(!mobileMenuOpen);
                    }}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-nav-container">
          <div className="container">
            <div className="header-nav-wapper main-menu-wapper">
              <div className="header-nav">
                <div className="container-wapper">{renderMainMenu()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header Bar */}
      <div className="header-device-mobile">
        <div className="wapper">
          <div className="item mobile-logo">
            <div className="logo">
              <Link href="/" title={siteConfig.name}>
                <img
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  className="mobile-emblem-logo"
                />
              </Link>
            </div>
          </div>
          <div className="mobile-actions-right">
            <div
              className={`item mobile-search-box has-sub ${mobileSearchOpen ? "open" : ""
                }`}
            >
              <a
                href="#search"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileSearchOpen(!mobileSearchOpen);
                }}
                title="Search"
              >
                <span className="icon">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </span>
              </a>
              <div className="block-sub">
                <a
                  href="#close"
                  className="close"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileSearchOpen(false);
                  }}
                  title="Close search"
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </a>
                <div className="header-searchform-box">
                  <form className="header-searchform" onSubmit={handleSearch}>
                    <div className="searchform-wrap" style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter keywords to search..."
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="btn-search-clear-inline"
                          style={{ right: "75px" }}
                          title="Clear search"
                        >
                          ×
                        </button>
                      )}
                      <input
                        type="submit"
                        className="submit button"
                        value="Search"
                      />
                    </div>
                  </form>

                  {/* Mobile Pre-searched Suggestions */}
                  <div style={{ marginTop: "14px", padding: "0 10px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: "8px" }}>
                      Popular Searches
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                      {["Royal Oud", "Arabian Oud", "Melody", "Damask Rose"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="search-tag-chip"
                          onClick={() => {
                            setSearchQuery(tag);
                            setMobileSearchOpen(false);
                            router.push(`/shop?q=${encodeURIComponent(tag)}`);
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {suggestedProducts.length > 0 && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: "8px" }}>
                          {searchQuery.trim() ? "Matching Fragrances" : "Pre-searched Picks"}
                        </div>
                        <div className="search-products-list" style={{ maxHeight: "240px", overflowY: "auto" }}>
                          {suggestedProducts.slice(0, 3).map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.slug}`}
                              className="search-product-item"
                              onClick={() => setMobileSearchOpen(false)}
                            >
                              <img src={p.image} alt={p.name} className="search-prod-thumb" />
                              <div className="search-prod-info">
                                <span className="search-prod-name">{p.name}</span>
                                <span className="search-prod-category">{p.category}</span>
                              </div>
                              <span className="search-prod-price">
                                {siteConfig.currency} {p.price}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="item menu-bar">
              <a
                className="mobile-navigation menu-toggle"
                href="#mobile-menu"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                title="Menu"
                aria-label="Menu"
              >
                <i className="fa fa-bars" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Original Template Mobile Menu Clone Wrap with Smooth 0.3s Slide & Sub-Panels */}
      <div
        className={`mobile-menu-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`stelina-menu-clone-wrap ${mobileMenuOpen ? "open" : ""}`}
      >
        <div className="stelina-menu-panels-actions-wrap">
          {mobilePanel !== "main" && (
            <a
              href="#prev"
              className="stelina-menu-prev-panel"
              onClick={(e) => {
                e.preventDefault();
                setMobilePanel("main");
              }}
            ></a>
          )}
          <span className="stelina-menu-current-panel-title">
            {panelTitles[mobilePanel]}
          </span>
          <a
            href="#close-menu"
            className="stelina-menu-close-btn stelina-menu-close-panels"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
            }}
          >
            x
          </a>
        </div>

        <div className="stelina-menu-panels">
          {/* Main Panel */}
          <div
            className={`stelina-menu-panel stelina-menu-panel-main ${mobilePanel === "main"
              ? "stelina-menu-panel-opened"
              : "stelina-menu-sub-opened"
              }`}
          >
            <ul className="stelina-nav main-menu">
              <li className="menu-item">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="menu-item menu-item-has-children">
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                  Shop
                </Link>
                <a
                  href="#shop-panel"
                  className="stelina-menu-next-panel"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobilePanel("shop");
                  }}
                ></a>
              </li>
              <li className="menu-item menu-item-has-children">
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                  Pages
                </Link>
                <a
                  href="#pages-panel"
                  className="stelina-menu-next-panel"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobilePanel("pages");
                  }}
                ></a>
              </li>
              <li className="menu-item">
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                  Blogs
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Account Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Sub-Panel */}
          <div
            className={`stelina-menu-panel stelina-menu-sub-panel ${mobilePanel === "shop" ? "stelina-menu-panel-opened" : ""
              }`}
          >
            <ul>
              {navCategories.map((cat) => (
                <li key={cat.slug} className="menu-item">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Sub-Panel */}
          <div
            className={`stelina-menu-panel stelina-menu-sub-panel ${mobilePanel === "pages" ? "stelina-menu-panel-opened" : ""
              }`}
          >
            <ul>
              <li className="menu-item">
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                  Shopping Cart
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>
                  Checkout
                </Link>
              </li>
              <li className="menu-item">
                <Link
                  href="/product/uqab-signature-edp"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  3Auqab Signature EDP
                </Link>
              </li>
              <li className="menu-item">
                <Link
                  href="/product/uqab-rihla-edp"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Auqab Rihla Eau
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
