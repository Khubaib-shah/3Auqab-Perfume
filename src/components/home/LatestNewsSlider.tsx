"use client";

import React, { useState, useEffect, memo } from "react";
import Link from "next/link";
import { BlogPost } from "@/data/blogs";

interface LatestNewsSliderProps {
  posts: BlogPost[];
}

function LatestNewsSliderComponent({ posts }: LatestNewsSliderProps) {
  const [blogSlide, setBlogSlide] = useState(0);
  const [blogPerView, setBlogPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setBlogPerView(window.innerWidth < 992 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (posts.length === 0) return null;

  const maxBlogSlide = Math.max(
    0,
    blogPerView === 2 ? Math.ceil(posts.length / 2) - 1 : posts.length - 1
  );
  const clampedBlogSlide = Math.min(blogSlide, maxBlogSlide);

  const handleBlogPrev = () => {
    setBlogSlide((prev) => (prev <= 0 ? maxBlogSlide : prev - 1));
  };

  const handleBlogNext = () => {
    setBlogSlide((prev) => (prev >= maxBlogSlide ? 0 : prev + 1));
  };

  return (
    <div className="stelina-blog-wraap default">
      <div className="container">
        <h3 className="custommenu-title-blog">Our Latest News</h3>
        <div className="stelina-blog style2">
          <div className="owl-slick equal-container nav-center slick-slider">
            <span
              className="fa fa-angle-left slick-arrow"
              onClick={handleBlogPrev}
              title="Previous posts"
            />

            <div className="slick-list">
              <div
                className="blog-slick-track"
                style={{
                  transform: `translate3d(-${clampedBlogSlide * 100}%, 0, 0)`,
                }}
              >
                {posts.map((post) => (
                  <div key={post.id} className="blog-slide-item">
                    <div className="stelina-blog-item equal-element style2">
                      <div className="stelina-blog-inner">
                        <div className="post-thumb">
                          <Link href={`/blog/${post.slug}`}>
                            <img
                              src={post.sliderThumb || post.image}
                              alt={post.title}
                            />
                          </Link>
                        </div>
                        <div className="blog-info">
                          <div className="post-top">
                            <Link href={`/blog/${post.slug}`}>
                              {post.category}
                            </Link>
                          </div>
                          <div className="post-date">{post.date}</div>
                          <h2 className="blog-title">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          <div className="blog-meta">
                            <div className="blog-meta-wrapp">
                              <span className="author">
                                <img
                                  src={post.authorAvatar}
                                  alt={post.author}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    aspectRatio: "1/1",
                                    flexShrink: 0,
                                    display: "inline-block",
                                  }}
                                />
                                {post.author}
                              </span>
                              <span className="view">
                                <i
                                  className="icon fa fa-eye"
                                  aria-hidden="true"
                                />
                                {post.views}
                              </span>
                              <span className="comment">
                                <i
                                  className="icon fa fa-commenting"
                                  aria-hidden="true"
                                />
                                {post.commentsCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <span
              className="fa fa-angle-right slick-arrow"
              onClick={handleBlogNext}
              title="Next posts"
            />

            {maxBlogSlide > 0 && (
              <ul className="slick-dots">
                {Array.from({ length: maxBlogSlide + 1 }).map((_, idx) => (
                  <li
                    key={idx}
                    className={clampedBlogSlide === idx ? "slick-active" : ""}
                    onClick={() => setBlogSlide(idx)}
                  >
                    <button type="button">{idx + 1}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const LatestNewsSlider = memo(LatestNewsSliderComponent);
