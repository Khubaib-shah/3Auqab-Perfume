"use client";

import React, { memo } from "react";

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
        <div className="stelina-instagram">
          <div className="instagram owl-slick equal-container">
            <div className="instagram-grid">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="item-instagram">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`3Uqab Perfume Instagram post ${num}`}
                  >
                    <img
                      src={`/assets/images/item-instagram-${num}.jpg`}
                      alt={`3Uqab Perfume Instagram ${num}`}
                    />
                  </a>
                  <span className="text">
                    <i
                      className="icon flaticon-instagram"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const InstagramFeed = memo(InstagramFeedComponent);
