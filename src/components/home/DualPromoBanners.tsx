"use client";

import React, { memo } from "react";
import Link from "next/link";

function DualPromoBannersComponent() {
  return (
    <div className="banner-wrapp rows-space-30">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div className="banner">
              <div className="item-banner style16">
                <div className="inner">
                  <div className="banner-content">
                    <h3 className="title">
                      Scents for <br />
                      Every Mood
                    </h3>
                    <div className="description">
                      Unisex & Oriental <br />
                      New Arrivals
                    </div>
                    <Link href="/shop" className="button btn-view-the-look">
                      Shop now
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
                    <h3 className="title">Signature Oud Sale</h3>
                    <div className="description">
                      3Auqab luxury, all-day <br />
                      long-lasting projection!
                    </div>
                    <Link href="/shop" className="button btn-view-the-look">
                      Shop now
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
