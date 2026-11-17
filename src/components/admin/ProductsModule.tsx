"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminProduct } from "@/data/initialStoreSeed";
import { businessConfig, siteConfig, assetsConfig } from "@/config";
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
  const [oldPrice, setOldPrice] = useState<number>(750);
  const [size15Price, setSize15Price] = useState<number>(600);
  const [size30Price, setSize30Price] = useState<number>(1200);
  const [size50Price, setSize50Price] = useState<number>(2000);
  const [size100Price, setSize100Price] = useState<number>(4000);
  const [stockQuantity, setStockQuantity] = useState<number>(25);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isWeeklyFeatured, setIsWeeklyFeatured] = useState<boolean>(true);
  const [image, setImage] = useState("/assets/images/products/3uqab-perfume-product-placeholder-1.jpg");
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [reviewsCount, setReviewsCount] = useState<number>(12);

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
    setOldPrice(750);
    setSize15Price(600);
    setSize30Price(1200);
    setSize50Price(2000);
    setSize100Price(4000);
    setStockQuantity(30);
    setInStock(true);
    setIsNew(true);
    setIsWeeklyFeatured(true);
    setImage(assetsConfig.placeholders.product);
    setTopNotes("Bergamot, Saffron, Pink Pepper");
    setHeartNotes("Damask Rose, Jasmine, Orris");
    setBaseNotes("Royal Oud, Vanilla, White Musk");
    setDescriptionText(siteConfig.brand.description);
    setRating(5);
    setReviewsCount(12);
    setModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setSku(prod.sku);
    setCategory(prod.category);
    setOldPrice(prod.oldPrice || 0);
    setSize15Price(prod.sizePrices?.["15ml"] ?? prod.price ?? 600);
    setSize30Price(prod.sizePrices?.["30ml"] ?? 1200);
    setSize50Price(prod.sizePrices?.["50ml"] ?? 2000);
    setSize100Price(prod.sizePrices?.["100ml"] ?? 4000);
    setStockQuantity(prod.stockQuantity ?? 20);
    setInStock(prod.inStock);
    setIsNew(Boolean(prod.isNew));
    setIsWeeklyFeatured(prod.isWeeklyFeatured !== false);
    setImage(prod.image);
    setTopNotes(prod.notes?.top || "");
    setHeartNotes(prod.notes?.heart || "");
    setBaseNotes(prod.notes?.base || "");
    setDescriptionText(
      Array.isArray(prod.description) ? prod.description.join("\n\n") : ""
    );
    setRating(prod.rating || 5);
    setReviewsCount(prod.reviewsCount || 12);
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

    const activeSizes = ["15ml", "30ml", "50ml", "100ml"];
    const sizePricesMap: Record<string, number> = {
      "15ml": Number(size15Price) || 600,
      "30ml": Number(size30Price) || 1200,
      "50ml": Number(size50Price) || 2000,
      "100ml": Number(size100Price) || 4000,
    };

    const newProductObj: AdminProduct = {
      id: editingId || `prod-${Date.now()}`,
      slug: generatedSlug,
      name: name.trim(),
      sku: sku.trim() || `3UQ-${String(products.length + 1).padStart(2, "0")}-EDP`,
      category,
      price: Number(size15Price) || 600,
      oldPrice: Number(oldPrice) > 0 ? Number(oldPrice) : undefined,
      rating: Number(rating) || 5,
      reviewsCount: Number(reviewsCount) || 12,
      isNew,
      isWeeklyFeatured,
      inStock: inStock && Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity) || 0,
      image: image.trim() || "/assets/images/products/3uqab-perfume-product-placeholder-1.jpg",
      orderThumb: image.trim() || "/assets/images/products/item-order1.jpg",
      cartThumb: image.trim() || "/assets/images/products/cart-item-1.jpg",
      gallery: [image.trim() || "/assets/images/products/3uqab-perfume-product-placeholder-1.jpg"],
      shortBullets: [
        `Top Notes: ${topNotes.trim() || "Bergamot, Fresh Citrus"}`,
        `Heart Notes: ${heartNotes.trim() || "Floral Jasmine, Rose"}`,
        `Base Notes: ${baseNotes.trim() || "Amber, Musk, Cedarwood"}`,
      ],
      description: descriptionText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
      notes: {
        top: topNotes.trim(),
        heart: heartNotes.trim(),
        base: baseNotes.trim(),
      },
      sizes: activeSizes,
      sizePrices: sizePricesMap,
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
            Manage products, prices, variants, and stock
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
                    placeholder={`e.g. ${siteConfig.brand.shortName} Signature`}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">URL Slug (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder={`${siteConfig.brand.slug}-signature`}
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
                  <label className="admin-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="admin-input"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Bottle Sizes & Dynamic Size-Specific Pricing */}
              <div
                style={{
                  background: "#fafafa",
                  padding: "16px 18px",
                  borderRadius: "12px",
                  border: "1px solid #e9ecef",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  <label
                    className="admin-label"
                    style={{ fontWeight: 700, margin: 0, fontSize: "13px" }}
                  >
                    {businessConfig.variant.label}s & Prices ({settings.currency}) *
                  </label>
                  <span style={{ fontSize: "11px", color: "#888" }}>
                    Shown on product page size selectors & checkout
                  </span>
                </div>
                <div className="admin-grid-4">
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label
                      className="admin-label"
                      style={{ fontSize: "11px", color: "#555" }}
                    >
                      15ml Bottle Price ({settings.currency}) *
                    </label>
                    <input
                      type="number"
                      className="admin-input"
                      required
                      value={size15Price}
                      onChange={(e) => setSize15Price(Number(e.target.value))}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label
                      className="admin-label"
                      style={{ fontSize: "11px", color: "#555" }}
                    >
                      30ml Bottle Price ({settings.currency}) *
                    </label>
                    <input
                      type="number"
                      className="admin-input"
                      required
                      value={size30Price}
                      onChange={(e) => setSize30Price(Number(e.target.value))}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label
                      className="admin-label"
                      style={{ fontSize: "11px", color: "#555" }}
                    >
                      50ml Bottle Price ({settings.currency}) *
                    </label>
                    <input
                      type="number"
                      className="admin-input"
                      required
                      value={size50Price}
                      onChange={(e) => setSize50Price(Number(e.target.value))}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label
                      className="admin-label"
                      style={{ fontSize: "11px", color: "#555" }}
                    >
                      100ml Bottle Price ({settings.currency}) *
                    </label>
                    <input
                      type="number"
                      className="admin-input"
                      required
                      value={size100Price}
                      onChange={(e) => setSize100Price(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">
                    Old Price / Strike-through ({settings.currency})
                  </label>
                  <input
                    type="number"
                    className="admin-input"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(Number(e.target.value))}
                    placeholder="e.g. 750 (optional)"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Rating (1 to 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    className="admin-input"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Reviews Count</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={reviewsCount}
                    onChange={(e) => setReviewsCount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <ImageUploadField
                  label="Product Image *"
                  value={image}
                  onChange={setImage}
                  folder="products"
                  fileName={name || slug || `${siteConfig.brand.slug}-product`}
                />
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Top Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={topNotes}
                    onChange={(e) => setTopNotes(e.target.value)}
                    placeholder="e.g. Bergamot, Saffron"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Heart Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={heartNotes}
                    onChange={(e) => setHeartNotes(e.target.value)}
                    placeholder="e.g. Jasmine, Damask Rose"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Base Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={baseNotes}
                    onChange={(e) => setBaseNotes(e.target.value)}
                    placeholder="e.g. Oud, Amber, White Musk"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  placeholder="Fragrance description and story..."
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
