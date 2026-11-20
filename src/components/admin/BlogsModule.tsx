"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminBlogPost } from "@/data/initialStoreSeed";
import { assetsConfig } from "@/config";
import { generateSlug } from "@/lib/slug";
import ImageUploadField from "./ImageUploadField";

export default function BlogsModule() {
  const blogs = useAdminStore((s) => s.blogs);
  const saveStoreSlice = useAdminStore((s) => s.saveStoreSlice);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState("FRAGRANCE GUIDE");
  const [author, setAuthor] = useState("Tariq Al-Mansoor");
  const [authorRole, setAuthorRole] = useState("Perfumer");
  const [authorAvatar, setAuthorAvatar] = useState(assetsConfig.placeholders.avatar);
  const [image, setImage] = useState(assetsConfig.placeholders.banner);
  const [excerpt, setExcerpt] = useState("");
  const [quote, setQuote] = useState("");
  const [tagsText, setTagsText] = useState("3Uqab, Oud, Eau de Parfum");
  const [contentText, setContentText] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setIsSlugManual(false);
    setCategory("FRAGRANCE GUIDE");
    setAuthor("Tariq Al-Mansoor");
    setAuthorRole("Perfumer");
    setAuthorAvatar(assetsConfig.placeholders.avatar);
    setImage(assetsConfig.placeholders.banner);
    setExcerpt("");
    setQuote("A great perfume leaves a lasting memory.");
    setTagsText("3Uqab, Three Uqab, Oud");
    setContentText("");
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (post: AdminBlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setIsSlugManual(true);
    setCategory(post.category);
    setAuthor(post.author);
    setAuthorRole(post.authorRole);
    setAuthorAvatar(post.authorAvatar || assetsConfig.placeholders.avatar);
    setImage(post.image);
    setExcerpt(post.excerpt);
    setQuote(post.quote);
    setTagsText(post.tags.join(", "));
    setContentText(post.content.join("\n\n"));
    setIsPublished(post.isPublished !== false);
    setModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const existing = blogs.find((b) => b.id === editingId);

    const newPost: AdminBlogPost = {
      id: editingId || `blog-${Date.now()}`,
      slug: generatedSlug,
      title: title.trim(),
      category: category.trim().toUpperCase(),
      date: existing?.date || "November 14, 10:00 am",
      author: author.trim() || "Tariq Al-Mansoor",
      authorRole: authorRole.trim() || "Perfumer",
      authorAvatar: authorAvatar.trim() || assetsConfig.placeholders.avatar,
      views: existing?.views ?? 120,
      commentsCount: existing?.commentsCount ?? 14,
      image: image.trim() || assetsConfig.placeholders.banner,
      sliderThumb: image.trim() || assetsConfig.placeholders.banner,
      sidebarThumb: image.trim() || assetsConfig.placeholders.banner,
      excerpt: excerpt.trim(),
      content: contentText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
      quote: quote.trim(),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isPublished,
    };

    const next = editingId
      ? blogs.map((b) => (b.id === editingId ? newPost : b))
      : [newPost, ...blogs];

    await saveStoreSlice({ blogs: next });
    setModalOpen(false);
    toast.success(editingId ? "Blog updated!" : "Blog published!");
  };

  const handleDeleteBlog = async (post: AdminBlogPost) => {
    const next = blogs.filter((b) => b.id !== post.id);
    await saveStoreSlice({ blogs: next });
    toast.success(`Deleted "${post.title}".`);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Blogs</h1>
          <p className="admin-section-subtitle">
            Write and edit blog posts for the /blog page
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-admin btn-admin-primary"
        >
          <i className="fa fa-plus"></i> Add Blog
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Blog Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((post) => (
              <tr key={post.id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                        border: "1px solid #eee",
                      }}
                    />
                    <div>
                      <strong style={{ color: "#222222", display: "block" }}>
                        {post.title}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#888888" }}>
                        /blog/{post.slug}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <span className="admin-badge admin-badge-confirmed">
                    {post.category}
                  </span>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <div style={{ fontWeight: 600, color: "#222" }}>
                    {post.author}
                  </div>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{post.views}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {post.isPublished !== false ? (
                    <span className="admin-badge admin-badge-delivered">
                      Published
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge-pending">
                      Draft
                    </span>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(post)}
                      className="btn-admin btn-admin-sm btn-admin-outline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(post)}
                      className="btn-admin btn-admin-sm btn-admin-danger"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? "Edit Blog" : "Add Blog"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="admin-modal-body">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTitle(val);
                      if (!isSlugManual) {
                        setSlug(generateSlug(val));
                      }
                    }}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Slug (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val.trim()) {
                        setIsSlugManual(false);
                        setSlug(generateSlug(title));
                      } else {
                        setIsSlugManual(true);
                        setSlug(val);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Author Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Author Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Perfumer / Fragrance Specialist"
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <ImageUploadField
                  label="Blog Cover Image *"
                  value={image}
                  onChange={setImage}
                  folder="blogs"
                  fileName={title || slug || "3uqab-blog"}
                />
                <ImageUploadField
                  label="Author Avatar / Photo"
                  value={authorAvatar}
                  onChange={setAuthorAvatar}
                  folder="blogs"
                  fileName={
                    author
                      ? `${author.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-avatar`
                      : "author-avatar"
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Summary *</label>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: "70px" }}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Blog Content *</label>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: "140px" }}
                  required
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Highlight Quote</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tags</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#222",
                  marginBottom: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                Published
              </label>

              <div className="admin-modal-footer" style={{ padding: "14px 0 0" }}>
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  {editingId ? "Save Changes" : "Publish Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
