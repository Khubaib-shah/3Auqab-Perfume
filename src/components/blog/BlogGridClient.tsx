"use client";

import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAdminStore } from "@/store/useAdminStore";

export default function BlogGridClient() {
  const blogs = useAdminStore((s) => s.blogs);
  const publishedBlogs = blogs.filter((b) => b.isPublished !== false);

  return (
    <div className="main-content main-content-blog grid no-sidebar">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb items={[{ label: "Our Blog" }]} />
          </div>
        </div>
        <div className="row">
          <div className="content-area content-blog col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="site-main">
              <h3 className="custom_blog_title capi">Our Perfume Journal</h3>
              <div className="blog-list grid-style">
                <div className="row">
                  {publishedBlogs.map((post) => (
                    <div
                      key={post.id}
                      className="col-lg-6 col-md-12 col-sm-12 col-xs-12"
                    >
                      <div className="blog-item">
                        <div className="post-format">
                          <Link href={`/blog/${post.slug}`}>
                            <img src={post.image} alt={post.title} />
                          </Link>
                        </div>
                        <div className="post-info">
                          <div className="category-blog">
                            <Link href={`/blog/${post.slug}`}>
                              {post.category}
                            </Link>
                          </div>
                          <h3 className="post-title">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <div className="main-info-post">
                            <p className="des">{post.excerpt}</p>
                          </div>
                          <div className="author-view">
                            <div className="author">
                              <div className="avt">
                                <img
                                  src={post.authorAvatar}
                                  alt={post.author}
                                />
                              </div>
                              <h3 className="name">{post.author}</h3>
                            </div>
                            <div className="review">
                              <div className="view">
                                <span className="icon-view">
                                  <i
                                    className="fa fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                                <span className="count">{post.views}</span>
                              </div>
                              <div className="s-comments">
                                <span className="icon-cmt">
                                  <i
                                    className="fa fa-commenting"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                                <span className="count">
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
              <div className="pagination clearfix style2">
                <div className="nav-link">
                  <Link href="/blog" className="page-numbers current">
                    1
                  </Link>
                  <Link href="/blog" className="page-numbers">
                    2
                  </Link>
                  <Link href="/blog" className="page-numbers">
                    <i
                      className="icon fa fa-angle-right"
                      aria-hidden="true"
                    ></i>
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
