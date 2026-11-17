"use client";

import React, { memo } from "react";
import { siteConfig, assetsConfig } from "@/config";

interface InstagramFeedProps {
  facebookUrl?: string;
}

function InstagramFeedComponent({ facebookUrl = "#" }: InstagramFeedProps) {
  return (
    <div className="instagram-wrapp">
      <div>
        <h3 className="custommenu-title-blog">
          <i className="flaticon-instagram" aria-hidden="true" />
          Instagram Feed
        </h3>
        <div className="app-instagram">
          <div className="instagram owl-slick equal-container">
            <div className="instagram-grid">
              {assetsConfig.brandGallery.map((imgSrc, idx) => {
                const num = idx + 1;
                return (
                  <div
                    key={num}
                    className={`item-instagram ${num === 6 ? "item-instagram-extra" : ""}`}
                  >
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${siteConfig.brand.name} Instagram post ${num}`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${siteConfig.brand.name} Instagram ${num}`}
                        width={400}
                        height={400}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          aspectRatio: "1 / 1",
                        }}
                      />
                    </a>
                    <span className="text">
                      <i
                        className="icon flaticon-instagram"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const InstagramFeed = memo(InstagramFeedComponent);
