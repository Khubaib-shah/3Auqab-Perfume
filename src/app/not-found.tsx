"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="main-content main-content-404 right-sidebar">
      <div className="container">
        <div className="row">
          <div className="content-area content-404 col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="site-main">
              <section className="error-404 not-found">
                <div className="images">
                  <img src="/assets/images/ui/3uqab-404-not-found.png" alt="404 Not Found" />
                </div>
                <div className="text-404">
                  <h1 className="page-title">Error 404 Not Found</h1>
                  <p className="page-content">
                    We are sorry, but the page you are looking for
                    does not exist. <br />
                    You can return to{" "}
                    <Link className="hightlight" href="/">
                      Home page
                    </Link>{" "}
                    or use{" "}
                    <span
                      className="hightlight toggle-hightlight"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSearchOpen(!searchOpen)}
                    >
                      search!
                    </span>
                  </p>
                  <form
                    role="search"
                    onSubmit={handleSearch}
                    className={`search-form ${searchOpen ? "open" : ""}`}
                  >
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="search-field"
                      placeholder="Search Three Oqab perfumes..."
                    />
                    <button type="submit">Search</button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
