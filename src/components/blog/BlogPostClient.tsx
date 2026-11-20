"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BlogPost } from "@/data/blogs";
import { siteConfig } from "@/data/siteConfig";
import { assetsConfig } from "@/config";
import { useAdminStore } from "@/store/useAdminStore";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({
  post: initialPost,
}: BlogPostClientProps) {
  const searchParams = useSearchParams();
  const sidebarSide =
    searchParams.get("sidebar") === "right" ? "right-sidebar" : "left-sidebar";

  const storeBlogs = useAdminStore((s) => s.blogs);
  const storeCategories = useAdminStore((s) => s.categories);
  const settings = useAdminStore((s) => s.settings);
  const subscribeNewsletterOnServer = useAdminStore(
    (s) => s.subscribeNewsletterOnServer
  );

  const post =
    storeBlogs.find(
      (b) => b.slug === initialPost.slug || b.id === initialPost.id
    ) || initialPost;
  const activeCategories = storeCategories.filter((c) => c.isActive);
  const publishedBlogs = storeBlogs.filter((b) => b.isPublished !== false);

  const [commentText, setCommentText] = useState("");
  const [sidebarEmail, setSidebarEmail] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Zainab Al-Mansoor",
      date: "2 days ago",
      text: "Very helpful guide! Layering 3Uqab Signature EDP over a drop of pure oud oil makes the fragrance last all day long.",
      likes: 12,
    },
    {
      id: 2,
      author: "Bilal Ahmed",
      date: "4 days ago",
      text: "3Uqab Perfumes have become my daily go-to. Looking forward to trying Ambre Royal next.",
      likes: 9,
    },
  ]);

  const relatedArticles = publishedBlogs
    .filter((b) => b.id !== post.id)
    .slice(0, 2);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Please write a comment before posting.");
      return;
    }
    setComments((prev) => [
      {
        id: Date.now(),
        author: "Guest Reader",
        date: "Just now",
        text: commentText,
        likes: 1,
      },
      ...prev,
    ]);
    setCommentText("");
    toast.success("Comment posted!");
  };

  const handleSidebarSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail.trim()) return;
    await subscribeNewsletterOnServer(sidebarEmail, "Blog Sidebar");
    toast.success("Subscribed to 3Uqab Perfume Journal!");
    setSidebarEmail("");
  };

  return (
    <div className={`main-content main-content-blog single ${sidebarSide}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb
              items={[
                { label: "Our Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="content-area content-blog col-lg-9 col-md-8 col-sm-12 col-xs-12">
            <div className="site-main">
              <div className="post-item">
                <div className="post-format">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="post-infor">
                  <div className="category-blog">
                    <Link href="/blog">{post.category}</Link>
                  </div>
                  <h1 className="post-title" style={{ fontSize: "26px" }}>
                    {post.title}
                  </h1>
                  <div className="main-info-post">
                    {post.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    <blockquote>
                      <p>{post.quote}</p>
                      <div className="author">
                        <span className="name">{post.author}</span>
                        <span className="desc">{post.authorRole}</span>
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>

              <div className="blog-articles related-articles">
                <h3 className="custom_blog_title">Related Articles</h3>
                <div className="related-articles-wrapper">
                  <div className="row related-articles-row">
                    {relatedArticles.map((rel) => (
                      <div key={rel.id} className="col-md-6 col-sm-12">
                        <div className="blog-item related-blog-card">
                          <div className="post-format">
                            <Link href={`/blog/${rel.slug}`}>
                              <img src={rel.image} alt={rel.title} />
                            </Link>
                          </div>
                          <div className="post-info">
                            <div className="category-blog">
                              <Link href={`/blog/${rel.slug}`}>
                                {rel.category}
                              </Link>
                            </div>
                            <h3 className="post-title">
                              <Link href={`/blog/${rel.slug}`}>
                                {rel.title}
                              </Link>
                            </h3>
                            <div className="main-info-post">
                              <p className="des">{rel.excerpt}</p>
                            </div>
                            <div className="author-view">
                              <div className="author">
                                <div className="avt">
                                  <img
                                    src={rel.authorAvatar}
                                    alt={rel.author}
                                  />
                                </div>
                                <h3 className="name">{rel.author}</h3>
                              </div>
                              <div className="review">
                                <div className="view">
                                  <span className="icon-view">
                                    <i
                                      className="fa fa-eye"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <span className="count">{rel.views}</span>
                                </div>
                                <div className="s-comments">
                                  <span className="icon-cmt">
                                    <i
                                      className="fa fa-commenting"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <span className="count">
                                    {rel.commentsCount}
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
              </div>

              <div className="tags tags-blog">
                <h3 className="widgettitle">Tags:</h3>
                <ul className="tagcloud">
                  {post.tags.map((tag, idx) => (
                    <li
                      key={tag}
                      className={`tag-cloud-link ${idx === 0 ? "active" : ""}`}
                    >
                      <Link href={`/shop?q=${encodeURIComponent(tag)}`}>
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="view-share">
                <div className="author-view">
                  <div className="author">
                    <div className="avt">
                      <img src={post.authorAvatar} alt={post.author} />
                    </div>
                    <h3 className="name">{post.author}</h3>
                  </div>
                  <div className="review">
                    <div className="view">
                      <span className="icon-view">
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      </span>
                      <span className="count">{post.views}</span>
                    </div>
                    <div className="s-comments">
                      <span className="icon-cmt">
                        <i className="fa fa-commenting" aria-hidden="true"></i>
                      </span>
                      <span className="count">{comments.length}</span>
                    </div>
                  </div>
                </div>
                <div className="share">
                  <h3 className="title">Share</h3>
                  <a
                    href={siteConfig.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i
                      className="icon fa fa-facebook-square"
                      aria-hidden="true"
                    ></i>
                  </a>
                  <a
                    href={siteConfig.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="icon fa fa-linkedin" aria-hidden="true"></i>
                  </a>
                  <a
                    href={siteConfig.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="icon fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </div>
              </div>

              <div className="comments-area">
                <h3 className="custom_blog_title">
                  Comments <span className="count">({comments.length})</span>
                </h3>
                <form onSubmit={handlePostComment} className="comment-form">
                  <p className="comment-reply-content">
                    <textarea
                      rows={6}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write your comment about this fragrance guide..."
                      className="input-form"
                    ></textarea>
                  </p>
                  <p className="form-submit">
                    <span className="controll">
                      <i
                        className="icon fa fa-file-image-o"
                        aria-hidden="true"
                      ></i>
                      <i
                        className="icon fa fa-paperclip"
                        aria-hidden="true"
                      ></i>
                      <i className="icon fa fa-smile-o" aria-hidden="true"></i>
                      <button type="submit" className="submit button">
                        POST A COMMENT
                      </button>
                    </span>
                  </p>
                </form>
                <ul className="comment-list">
                  {comments.map((c) => (
                    <li key={c.id} className="comment">
                      <div className="comment-item">
                        <div className="author-view">
                          <div className="author">
                            <div className="avt">
                              <img
                                src={assetsConfig.placeholders.avatar}
                                alt={c.author}
                              />
                            </div>
                            <h3 className="name">{c.author}</h3>
                          </div>
                          <div className="date-reply-comment">
                            <span className="date-comment">{c.date}</span>
                          </div>
                        </div>
                        <div className="comment-body">
                          <div className="comment-content">
                            <p>{c.text}</p>
                          </div>
                          <div className="comment-reply-link">
                            <span className="Comment">
                              <i
                                className="icon fa fa-commenting"
                                aria-hidden="true"
                              ></i>{" "}
                              Reply
                            </span>
                            <span className="like">
                              <i
                                className="icon fa fa-thumbs-o-up"
                                aria-hidden="true"
                              ></i>{" "}
                              {c.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Blog Sidebar */}
          <div className="sidebar sidebar-single-blog col-lg-3 col-md-4 col-sm-12 col-xs-12">
            <div className="wrapper-sidebar">
              <div className="widget widget-socials">
                <h3 className="widgettitle">Follow us</h3>
                <div className="content-socials">
                  <div className="social-list">
                    <a
                      href={settings.socials?.facebook || siteConfig.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="social-item"
                      aria-label="Share on Facebook"
                    >
                      <i
                        className="fa fa-facebook-square"
                        aria-hidden="true"
                      ></i>
                    </a>
                    <a
                      href={settings.socials?.twitter || siteConfig.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="social-item"
                      aria-label="Share on Twitter"
                    >
                      <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a
                      href={settings.socials?.instagram || siteConfig.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="social-item"
                      aria-label="Share on Instagram"
                    >
                      <i className="fa fa-instagram" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="widget widget-categories">
                <h3 className="widgettitle">Categories</h3>
                <ul className="list-categories">
                  {activeCategories.map((cat, idx) => (
                    <li key={cat.slug}>
                      <input type="checkbox" id={`blog-cat-${idx}`} />
                      <label htmlFor={`blog-cat-${idx}`} className="label-text">
                        <Link href={`/shop?category=${cat.slug}`}>
                          {cat.name}
                        </Link>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget widget-post">
                <h3 className="widgettitle">Popular Articles</h3>
                <ul className="app-posts">
                  {publishedBlogs.slice(0, 3).map((art) => (
                    <li key={art.id} className="widget-post-item">
                      <div className="thumb-blog">
                        <Link href={`/blog/${art.slug}`}>
                          <img
                            src={art.sidebarThumb || art.image}
                            alt={art.title}
                          />
                        </Link>
                      </div>
                      <div className="post-content">
                        <div className="cat">
                          <Link href={`/blog/${art.slug}`}>{art.category}</Link>
                        </div>
                        <h5 className="post-title">
                          <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                        </h5>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget widget-tags">
                <h3 className="widgettitle">Popular Tags</h3>
                <ul className="tagcloud">
                  {siteConfig.popularTags.map((tag, i) => (
                    <li
                      key={tag}
                      className={`tag-cloud-link ${i === 1 ? "active" : ""}`}
                    >
                      <Link href={`/shop?q=${encodeURIComponent(tag)}`}>
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget newsletter-widget">
                <form
                  onSubmit={handleSidebarSubscribe}
                  className="newsletter-form-wrap"
                >
                  <h3 className="title">Subscribe to Our Newsletter</h3>
                  <div className="subtitle">
                    More special Deals, Events & Promotions
                  </div>
                  <input
                    type="email"
                    value={sidebarEmail}
                    onChange={(e) => setSidebarEmail(e.target.value)}
                    className="email"
                    placeholder="Your email address"
                  />
                  <button type="submit" className="button submit-newsletter">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
