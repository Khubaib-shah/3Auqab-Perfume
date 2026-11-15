"use client";

import React, { memo } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";

function DualPromoBannersComponent() {
  const { card1, card2 } = siteConfig.dualPromoBanners;

  return (
    <div className="banner-wrapp rows-space-30">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div className="banner">
              <div className="item-banner style16">
                <div className="inner">
                  <div className="banner-content">
                    <h3 className="title" style={{ whiteSpace: "pre-line" }}>
                      {card1.title}
                    </h3>
                    <div className="description" style={{ whiteSpace: "pre-line" }}>
                      {card1.subtitle}
                    </div>
                    <Link href={card1.link || "/shop"} className="button btn-view-the-look">
                      {card1.buttonText || "Shop now"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <div className="banner">
              <div className="item-banner style15">
                <div className="inner">
                  <div className="banner-content">
                    <h3 className="title" style={{ whiteSpace: "pre-line" }}>
                      {card2.title}
                    </h3>
                    <div className="description" style={{ whiteSpace: "pre-line" }}>
                      {card2.subtitle}
                    </div>
                    <Link href={card2.link || "/shop"} className="button btn-view-the-look">
                      {card2.buttonText || "Shop now"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DualPromoBanners = memo(DualPromoBannersComponent);
