"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminProduct } from "@/data/initialStoreSeed";
import ImageUploadField from "./ImageUploadField";

export default function ProductsModule() {
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const settings = useAdminStore((s) => s.settings);
  const saveStoreSlice = useAdminStore((s) => s.saveStoreSlice);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Unisex Collection");
  const [price, setPrice] = useState<number>(600);
  const [oldPrice, setOldPrice] = useState<number>(750);
  const [stockQuantity, setStockQuantity] = useState<number>(25);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isWeeklyFeatured, setIsWeeklyFeatured] = useState<boolean>(true);
  const [image, setImage] = useState("/assets/images/product-item-1.jpg");
  const [blackCardImage, setBlackCardImage] = useState(
    "/assets/images/product-item-black-1.jpg"
  );
  const [sizesText, setSizesText] = useState("15ml, 30ml, 50ml, 100ml");
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const handleAddGalleryPhoto = () => {
    setGallery((prev) => [
      ...prev,
      `/assets/images/details-item-${Math.min(4, prev.length + 1)}.jpg`,
    ]);
  };

  const handleUpdateGalleryPhoto = (index: number, newUrl: string) => {
    setGallery((prev) => {
      const copy = [...prev];
      copy[index] = newUrl;
      return copy;
    });
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, searchQuery]);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSku(`3UQ-${String(products.length + 1).padStart(2, "0")}-EDP`);
    setCategory(categories[0]?.name || "Unisex Collection");
    setPrice(600);
    setOldPrice(750);
    setStockQuantity(30);
    setInStock(true);
    setIsNew(true);
    setIsWeeklyFeatured(true);
    setImage("/assets/images/product-item-1.jpg");
    setBlackCardImage("/assets/images/product-item-black-1.jpg");
    setSizesText("15ml, 30ml, 50ml, 100ml");
    setTopNotes("Bergamot, Saffron, Pink Pepper");
    setHeartNotes("Damask Rose, Jasmine, Orris");
    setBaseNotes("Royal Oud, Vanilla, White Musk");
    setDescriptionText(
      "Long-lasting luxury Eau de Parfum by 3Uqab Perfume (Three Uqab)."
    );
    setGallery([
      "/assets/images/details-item-1.jpg",
      "/assets/images/details-item-2.jpg",
      "/assets/images/details-item-3.jpg",
      "/assets/images/details-item-4.jpg",
    ]);
    setModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setSku(prod.sku);
    setCategory(prod.category);
    setPrice(prod.price);
    setOldPrice(prod.oldPrice || 0);
    setStockQuantity(prod.stockQuantity ?? 20);
    setInStock(prod.inStock);
    setIsNew(Boolean(prod.isNew));
    setIsWeeklyFeatured(prod.isWeeklyFeatured !== false);
    setImage(prod.image);
    setBlackCardImage(prod.blackCardImage || prod.image);
    setSizesText(prod.sizes.join(", "));
    setTopNotes(prod.notes.top);
    setHeartNotes(prod.notes.heart);
    setBaseNotes(prod.notes.base);
    setDescriptionText(prod.description.join("\n\n"));
    setGallery(
      Array.isArray(prod.gallery) && prod.gallery.length > 0
        ? [...prod.gallery]
        : [prod.image]
    );
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    const generatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const parsedSizes = sizesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newProductObj: AdminProduct = {
      id: editingId || `prod-${Date.now()}`,
      slug: generatedSlug,
      name: name.trim(),
      sku: sku.trim() || "3AUQ-EDP",
      category,
      price: Number(price) || 0,
      oldPrice: Number(oldPrice) > 0 ? Number(oldPrice) : undefined,
      rating: 5,
      reviewsCount: 12,
      isNew,
      isWeeklyFeatured,
      inStock: inStock && Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity) || 0,
      image: image.trim() || "/assets/images/product-item-1.jpg",
      blackCardImage:
        blackCardImage.trim() || "/assets/images/product-item-black-1.jpg",
      orderThumb: "/assets/images/item-order1.jpg",
      cartThumb: "/assets/images/cart-item-1.jpg",
      gallery:
        gallery.filter((g) => Boolean(g && g.trim())).length > 0
          ? gallery.filter((g) => Boolean(g && g.trim()))
          : [image.trim() || "/assets/images/product-item-1.jpg"],
      shortBullets: [
        `Top Notes: ${topNotes}`,
        `Heart Notes: ${heartNotes}`,
        `Base Notes: ${baseNotes}`,
      ],
      description: descriptionText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
      notes: {
        top: topNotes,
        heart: heartNotes,
        base: baseNotes,
      },
      sizes: parsedSizes.length > 0 ? parsedSizes : ["15ml", "30ml", "50ml", "100ml"],
      sizePrices: {
        "15ml": 600,
        "30ml": 1200,
        "50ml": 2000,
        "100ml": 4000,
      },
      bottleFinishes: [],
    };

    const nextList = editingId
      ? products.map((p) => (p.id === editingId ? newProductObj : p))
      : [newProductObj, ...products];

    await saveStoreSlice({ products: nextList });
    setModalOpen(false);
    toast.success(
      editingId ? `Updated "${newProductObj.name}"!` : `Added "${newProductObj.name}"!`
    );
  };

  const handleDeleteProduct = async (prod: AdminProduct) => {
    const nextList = products.filter((p) => p.id !== prod.id);
    await saveStoreSlice({ products: nextList });
    toast.success(`Removed "${prod.name}".`);
  };

  const handleQuickStockAdjust = async (prod: AdminProduct, delta: number) => {
    const nextQty = Math.max(0, (prod.stockQuantity ?? 20) + delta);
    const nextList = products.map((p) =>
      p.id === prod.id
        ? { ...p, stockQuantity: nextQty, inStock: nextQty > 0 }
        : p
    );
    await saveStoreSlice({ products: nextList });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Products</h1>
          <p className="admin-section-subtitle">
            Manage perfumes, prices, notes, and stock
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-admin btn-admin-primary"
        >
          <i className="fa fa-plus"></i> Add Product
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-pill-tabs">
          <button
            type="button"
            onClick={() => setCategoryFilter("ALL")}
            className={`admin-pill-tab ${
              categoryFilter === "ALL" ? "active" : ""
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.name)}
              className={`admin-pill-tab ${
                categoryFilter === cat.name ? "active" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div style={{ minWidth: "250px" }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Search product or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Stock</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => {
              const qty = prod.stockQuantity ?? 20;
              return (
                <tr key={prod.id}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          border: "1px solid #eee",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "#222222" }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "#888888" }}>
                          /{prod.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <code style={{ fontSize: "12px", color: "#444" }}>
                      {prod.sku}
                    </code>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{prod.category}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <strong style={{ color: "#222222" }}>
                      {settings.currency} {prod.price}
                    </strong>
                    {prod.oldPrice && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "12px",
                          marginLeft: "6px",
                        }}
                      >
                        {settings.currency} {prod.oldPrice}
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                    {prod.sizes.join(", ")}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleQuickStockAdjust(prod, -1)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                        style={{ padding: "0 10px", height: "28px" }}
                      >
                        -
                      </button>
                      <span
                        className={
                          qty === 0
                            ? "admin-badge admin-badge-cancelled"
                            : qty <= 5
                            ? "admin-badge admin-badge-pending"
                            : "admin-badge admin-badge-delivered"
                        }
                      >
                        {qty} left
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickStockAdjust(prod, 1)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                        style={{ padding: "0 10px", height: "28px" }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {prod.isNew && (
                        <span className="admin-badge admin-badge-confirmed">
                          New
                        </span>
                      )}
                      {prod.isWeeklyFeatured !== false && (
                        <span className="admin-badge admin-badge-packed">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod)}
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="admin-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? "Edit Product" : "Add Product"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="admin-modal-body">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 3Uqab Royal Oudh"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">URL Slug (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="3uqab-royal-oudh"
                  />
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">SKU *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Sizes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={sizesText}
                    onChange={(e) => setSizesText(e.target.value)}
                    placeholder="30ml, 50ml, 100ml"
                  />
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">
                    Price ({settings.currency}) *
                  </label>
                  <input
                    type="number"
                    className="admin-input"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">
                    Old Price ({settings.currency})
                  </label>
                  <input
                    type="number"
                    className="admin-input"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(Number(e.target.value))}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Stock *</label>
                  <input
                    type="number"
                    className="admin-input"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <ImageUploadField
                  label="Main Image *"
                  value={image}
                  onChange={setImage}
                  folder="products"
                  fileName={name || slug || "3uqab-product"}
                />
                <ImageUploadField
                  label="Featured Image"
                  value={blackCardImage}
                  onChange={setBlackCardImage}
                  folder="products"
                  fileName={
                    name || slug
                      ? `${name || slug}-featured`
                      : "3uqab-product-featured"
                  }
                />
              </div>

              {/* Product Gallery Section */}
              <div
                style={{
                  background: "#fafafa",
                  padding: "16px 18px",
                  borderRadius: "14px",
                  border: "1px solid #e9ecef",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <label
                      className="admin-label"
                      style={{ margin: 0, fontWeight: 700, fontSize: "13px" }}
                    >
                      Product Gallery Photos ({gallery.length})
                    </label>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "12px",
                        color: "#777",
                      }}
                    >
                      Add multiple bottle angles, packaging, and detail photos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    className="btn-admin btn-admin-sm btn-admin-outline"
                    style={{ height: "32px", fontSize: "12px" }}
                  >
                    + Add More Photos
                  </button>
                </div>

                {gallery.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                      fontSize: "13px",
                      border: "1px dashed #ddd",
                      borderRadius: "10px",
                      background: "#fff",
                    }}
                  >
                    No extra gallery photos yet. Click &quot;+ Add More Photos&quot; to add photos.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {gallery.map((photoUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: "12px",
                          background: "#fff",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #e5e5e5",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#f5f5f5",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #eee",
                          }}
                        >
                          <img
                            src={photoUrl || "/assets/images/product-item-1.jpg"}
                            alt={`Gallery ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/assets/images/product-item-1.jpg";
                            }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <ImageUploadField
                            label={`Gallery Photo ${idx + 1}`}
                            value={photoUrl}
                            onChange={(newUrl) =>
                              handleUpdateGalleryPhoto(idx, newUrl)
                            }
                            folder="products"
                            fileName={
                              name || slug
                                ? `${name || slug}-gallery-${idx + 1}`
                                : `3uqab-product-gallery-${idx + 1}`
                            }
                            placeholder="Paste image URL or upload image"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          className="admin-modal-close"
                          style={{
                            width: "32px",
                            height: "32px",
                            minWidth: "32px",
                            minHeight: "32px",
                            fontSize: "18px",
                            color: "#c0392b",
                            borderColor: "#f5c6cb",
                            marginBottom: "16px",
                          }}
                          title="Remove Photo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Top Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={topNotes}
                    onChange={(e) => setTopNotes(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Heart Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={heartNotes}
                    onChange={(e) => setHeartNotes(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Base Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={baseNotes}
                    onChange={(e) => setBaseNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginBottom: "14px",
                }}
              >
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
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  In Stock
                </label>
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
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                  />
                  New Arrival Badge
                </label>
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
                    checked={isWeeklyFeatured}
                    onChange={(e) => setIsWeeklyFeatured(e.target.checked)}
                  />
                  Weekly Featured Slider
                </label>
              </div>

              <div className="admin-modal-footer" style={{ padding: "14px 0 0" }}>
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  {editingId ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
