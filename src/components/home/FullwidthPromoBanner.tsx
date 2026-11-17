"use client";

import React, { memo } from "react";
import Link from "next/link";
import { PromoBannersRecord } from "@/data/initialStoreSeed";

interface FullwidthPromoBannerProps {
  banner: PromoBannersRecord["homeFullwidth"];
}

function FullwidthPromoBannerComponent({ banner }: FullwidthPromoBannerProps) {
  return (
    <div className="banner-pinmap-wrapp rows-space-70">
      <div>
        <div className="banner">
          <div className="item-banner style21">
            <div
              className="inner"
              style={
                banner.image
                  ? {
                      backgroundImage: `url(${banner.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div className="banner-content container">
                <div className="banner-content-inner">
                  <h4 className="app-subtitle">{banner.subtitle}</h4>
                  <h3 className="title">
                    {banner.title}
                    <br />
                    Sale <span>{banner.highlightText}</span> Off
                  </h3>
                  <div className="start-from">{banner.tagline}</div>
                  <Link
                    href={banner.link || "/shop"}
                    className="button btn-shop-now"
                  >
                    Shop now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const FullwidthPromoBanner = memo(FullwidthPromoBannerComponent);
