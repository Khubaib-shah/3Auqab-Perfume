"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import { CategoryItem } from "@/data/initialStoreSeed";
import { generateSlug } from "@/lib/slug";
import ImageUploadField from "./ImageUploadField";

export default function CategoriesModule() {
  const categories = useAdminStore((s) => s.categories);
  const products = useAdminStore((s) => s.products);
  const saveStoreSlice = useAdminStore((s) => s.saveStoreSlice);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showInNav, setShowInNav] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setIsSlugManual(false);
    setDescription("");
    setImage("/assets/images/products/3uqab-perfume-product-placeholder-1.jpg");
    setShowInNav(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIsSlugManual(true);
    setDescription(cat.description);
    setImage(cat.image || "/assets/images/products/3uqab-perfume-product-placeholder-1.jpg");
    setShowInNav(cat.showInNav);
    setModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    const generatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (editingId) {
      const next = categories.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: name.trim(),
              slug: generatedSlug,
              description: description.trim(),
              image: image.trim(),
              showInNav,
            }
          : c
      );
      await saveStoreSlice({ categories: next });
      toast.success(`Updated "${name}"!`);
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug: generatedSlug,
        description:
          description.trim() || `3Uqab ${name.trim()} collection.`,
        image: image.trim(),
        isActive: true,
        showInNav,
        sortOrder: categories.length + 1,
      };
      await saveStoreSlice({ categories: [...categories, newCat] });
      toast.success(`Added "${name}"!`);
    }

    setModalOpen(false);
  };

  const toggleActive = async (cat: CategoryItem) => {
    const next = categories.map((c) =>
      c.id === cat.id ? { ...c, isActive: !c.isActive } : c
    );
    await saveStoreSlice({ categories: next });
    toast.success(`Updated "${cat.name}".`);
  };

  const handleDelete = async (cat: CategoryItem) => {
    const next = categories.filter((c) => c.id !== cat.id);
    await saveStoreSlice({ categories: next });
    toast.success(`Deleted "${cat.name}".`);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Categories</h1>
          <p className="admin-section-subtitle">
            Manage perfume categories and Shop menu links
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-admin btn-admin-primary"
        >
          <i className="fa fa-plus"></i> Add Category
        </button>
      </div>

      {/* Full-Width Categories Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Perfumes</th>
              <th>Shop Menu</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category === cat.name
              ).length;
              return (
                <tr key={cat.id}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <strong style={{ color: "#222222" }}>{cat.name}</strong>
                  </td>
                  <td style={{ whiteSpace: "nowrap", fontSize: "12px", color: "#888" }}>
                    /{cat.slug}
                  </td>
                  <td style={{ maxWidth: "360px", fontSize: "13px" }}>
                    {cat.description}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{count} items</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {cat.showInNav ? (
                      <span className="admin-badge admin-badge-confirmed">
                        Visible
                      </span>
                    ) : (
                      <span className="admin-badge admin-badge-packed">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button
                      type="button"
                      onClick={() => toggleActive(cat)}
                      className={
                        cat.isActive
                          ? "admin-badge admin-badge-delivered"
                          : "admin-badge admin-badge-cancelled"
                      }
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {cat.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="btn-admin btn-admin-sm btn-admin-danger"
                      >
                        <i className="fa fa-trash-o"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="admin-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Category Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    if (!isSlugManual) {
                      setSlug(generateSlug(val));
                    }
                  }}
                  placeholder="e.g. Arabian Oud"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">URL Slug (Optional)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={slug}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val.trim()) {
                      setIsSlugManual(false);
                      setSlug(generateSlug(name));
                    } else {
                      setIsSlugManual(true);
                      setSlug(val);
                    }
                  }}
                  placeholder="arabian-oud"
                />
              </div>
              <ImageUploadField
                label="Category Image"
                value={image}
                onChange={setImage}
                folder="categories"
                fileName={name || slug ? `3uqab-${name || slug}` : "3uqab-category"}
              />
              <div className="admin-form-group">
                <label className="admin-label">Short Description</label>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: "80px" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this category..."
                />
              </div>
              <div className="admin-form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#222",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showInNav}
                    onChange={(e) => setShowInNav(e.target.checked)}
                  />
                  Show in Header &quot;Shop&quot; Menu
                </label>
              </div>
              <div
                className="admin-modal-footer"
                style={{ padding: "14px 0 0" }}
              >
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  {editingId ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
