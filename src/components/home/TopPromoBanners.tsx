"use client";

import React, { memo } from "react";
import Link from "next/link";
import { PromoBannersRecord } from "@/data/initialStoreSeed";

interface TopPromoBannersProps {
  card1: PromoBannersRecord["homeCard1"];
  card2: PromoBannersRecord["homeCard2"];
}

function TopPromoBannersComponent({ card1, card2 }: TopPromoBannersProps) {
  return (
    <div className="banner-video-wrapp rows-space-40 type2">
      <div className="container">
        <div className="row">
          {/* Promo Card 1 */}
          <div className="col-lg-6">
            <div className="banner">
              <div className="item-banner style9">
                <div
                  className="inner"
                  style={
                    card1.image
                      ? {
                          backgroundImage: `url(${card1.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <div className="banner-content">
                    <h4 className="app-subtitle">{card1.subtitle}</h4>
                    <h3 className="title" style={{ whiteSpace: "pre-line" }}>
                      {card1.title}
                    </h3>
                    <div className="code">
                      Use promo Code:{" "}
                      <span className="nummer-code">{card1.code}</span>
                    </div>
                    <Link
                      href={card1.link || "/shop"}
                      className="button btn-shop-now"
                    >
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="col-lg-6">
            <div className="banner">
              <div className="item-banner style9 type1">
                <div
                  className="inner"
                  style={
                    card2.image
                      ? {
                          backgroundImage: `url(${card2.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <div className="banner-content">
                    <h4 className="app-subtitle">{card2.subtitle}</h4>
                    <h3 className="title" style={{ whiteSpace: "pre-line" }}>
                      {card2.title}
                    </h3>
                    <div className="code">
                      Use promo Code:{" "}
                      <span className="nummer-code">{card2.code}</span>
                    </div>
                    <Link
                      href={card2.link || "/shop"}
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
    </div>
  );
}

export const TopPromoBanners = memo(TopPromoBannersComponent);
