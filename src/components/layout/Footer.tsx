"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { siteConfig } from "@/data/siteConfig";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";

export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { cart, wishlist } = useShopStore();
  const settings = useAdminStore((s) => s.settings);
  const categories = useAdminStore((s) => s.categories);
  const products = useAdminStore((s) => s.products);
  const subscribeNewsletterOnServer = useAdminStore(
    (s) => s.subscribeNewsletterOnServer
  );
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = mounted
    ? products.filter((p) => wishlist.includes(p.id)).length
    : 0;
  const [email, setEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    await subscribeNewsletterOnServer(email.trim(), "Footer Newsletter");
    toast.success(`Thank you for subscribing to ${siteConfig.name}!`);
    setEmail("");
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-mobile-search"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="footer style7">
        <div className="container">
          <div className="container-wapper">
            <div className="row">
              <div className="box-footer col-xs-12 col-sm-4 col-md-4 col-lg-4 hidden-sm hidden-md hidden-lg">
                <div className="app-newsletter style1">
                  <div className="newsletter-head">
                    <h3 className="title">Newsletter</h3>
                  </div>
                  <form
                    onSubmit={handleSubscribe}
                    className="newsletter-form-wrap"
                  >
                    <div className="list">
                      Sign up for exclusive Arabian Oud launches and <br />{" "}
                      private member fragrance offers
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-text email email-newsletter"
                      placeholder="Your email address"
                    />
                    <button
                      type="submit"
                      className="button btn-submit submit-newsletter"
                    >
                      SUBSCRIBE
                    </button>
                  </form>
                </div>
              </div>
              <div className="box-footer col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <div className="app-custommenu default">
                  <h2 className="widgettitle">Quick Menu</h2>
                  <ul className="menu">
                    {categories
                      .filter((c) => c.isActive)
                      .slice(0, 5)
                      .map((cat) => (
                        <li key={cat.slug} className="menu-item">
                          <Link href={`/shop?category=${cat.slug}`}>
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="box-footer col-xs-12 col-sm-4 col-md-4 col-lg-4 hidden-xs">
                <div className="app-newsletter style1">
                  <div className="newsletter-head">
                    <h3 className="title">Newsletter</h3>
                  </div>
                  <form
                    onSubmit={handleSubscribe}
                    className="newsletter-form-wrap"
                  >
                    <div className="list">
                      Subscribe for exclusive Arabian Oud launches and <br />{" "}
                      private member fragrance offers
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-text email email-newsletter"
                      placeholder="Your email address"
                    />
                    <button
                      type="submit"
                      className="button btn-submit submit-newsletter"
                    >
                      SUBSCRIBE
                    </button>
                  </form>
                </div>
              </div>
              <div className="box-footer col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <div className="app-custommenu default">
                  <h2 className="widgettitle">Information</h2>
                  <ul className="menu">
                    <li className="menu-item">
                      <Link href="/about">About {siteConfig.name}</Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/shop">Track Order</Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/checkout">Delivery & Shipping</Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/contact">Contact Us</Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/login">My Account</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-end">
              <div className="row">
                <div className="col-sm-12 col-xs-12">
                  <div className="app-socials">
                    <ul className="socials">
                      <li>
                        <a
                          href={siteConfig.socials.facebook}
                          className="social-item"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href={siteConfig.socials.twitter}
                          className="social-item"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href={siteConfig.socials.instagram}
                          className="social-item"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon fa fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="coppyright">
                    Copyright © {2026}{" "}
                    <Link href="/">{siteConfig.name}</Link>. All rights reserved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer-device-mobile">
        <div className="wapper">
          {/* 1. Home */}
          <div
            className={`footer-device-mobile-item device-home ${pathname === "/" ? "active" : ""
              }`}
          >
            <Link href="/">
              <span className="icon">
                <i className="fa fa-home" aria-hidden="true"></i>
              </span>
              Home
            </Link>
          </div>

          {/* 2. Shop */}
          <div
            className={`footer-device-mobile-item device-shop ${pathname.startsWith("/shop") ? "active" : ""
              }`}
          >
            <Link href="/shop">
              <span className="icon">
                <i className="fa fa-shopping-bag" aria-hidden="true"></i>
              </span>
              Shop
            </Link>
          </div>

          {/* 3. Search */}
          <div className="footer-device-mobile-item device-search">
            <a href="#search" onClick={handleSearchClick} title="Search Fragrances">
              <span className="icon">
                <i className="fa fa-search" aria-hidden="true"></i>
              </span>
              Search
            </a>
          </div>

          {/* 4. Wishlist */}
          <div
            className={`footer-device-mobile-item device-wishlist ${pathname.startsWith("/wishlist") ? "active" : ""
              }`}
          >
            <Link href="/wishlist">
              <span className="icon">
                <i className="fa fa-heart" aria-hidden="true"></i>
                {wishlistCount > 0 && (
                  <span className="count-icon">{wishlistCount}</span>
                )}
              </span>
              Wishlist
            </Link>
          </div>

          {/* 5. Cart */}
          <div
            className={`footer-device-mobile-item device-cart ${pathname.startsWith("/cart") ? "active" : ""
              }`}
          >
            <Link href="/cart">
              <span className="icon">
                <i className="fa fa-shopping-basket" aria-hidden="true"></i>
                <span className="count-icon">{totalCount}</span>
              </span>
              <span className="text">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#top"
        onClick={scrollToTop}
        className={`backtotop ${showBackToTop ? "show" : ""}`}
      >
        <i className="fa fa-angle-double-up"></i>
      </a>
    </>
  );
}
