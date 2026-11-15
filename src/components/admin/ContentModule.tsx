"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import {
  AnnouncementItem,
  HeroSlideItem,
  TestimonialItem,
  VoucherItem,
  PromoBannersRecord,
} from "@/data/initialStoreSeed";
import ImageUploadField from "./ImageUploadField";

export default function ContentModule() {
  const announcements = useAdminStore((s) => s.announcements);
  const heroSlides = useAdminStore((s) => s.heroSlides);
  const testimonials = useAdminStore((s) => s.testimonials);
  const vouchers = useAdminStore((s) => s.vouchers) || [];
  const promoBanners = useAdminStore((s) => s.promoBanners);
  const settings = useAdminStore((s) => s.settings);
  const saveStoreSlice = useAdminStore((s) => s.saveStoreSlice);

  const [activeTab, setActiveTab] = useState<
    "announcements" | "hero" | "promos" | "vouchers" | "testimonials"
  >("announcements");

  // Announcement Modal state
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annText, setAnnText] = useState("");

  // Hero Slide Modal state
  const [editingHero, setEditingHero] = useState<HeroSlideItem | null>(null);

  // Voucher Modal state
  const [vouchModalOpen, setVouchModalOpen] = useState(false);
  const [editingVouchId, setEditingVouchId] = useState<string | null>(null);
  const [vouchCode, setVouchCode] = useState("");
  const [vouchType, setVouchType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [vouchValue, setVouchValue] = useState<number>(20);
  const [vouchMinOrder, setVouchMinOrder] = useState<number>(0);
  const [vouchActive, setVouchActive] = useState<boolean>(true);

  // Promo Banners State
  const [promosState, setPromosState] = useState<PromoBannersRecord>(
    promoBanners || {
      homeCard1: {
        subtitle: "Limited Edition",
        title: "Oud & Attar\n30% Off",
        code: "3UQAB",
        link: "/shop",
      },
      homeCard2: {
        subtitle: "Luxury Gift Bundles",
        title: "Signature\nScents",
        code: "3UQAB",
        link: "/shop",
      },
      homeFullwidth: {
        subtitle: "3Uqab Exclusive",
        title: "Royal Collection Sale",
        highlightText: "20%",
        tagline: "Handcrafted 100ml Eau de Parfum",
        link: "/shop",
      },
      shopSlide1: {
        subtitle: "Elevate Your Presence!",
        title: "Flash Sale Up To\n20% Off",
        code: "3UQAB",
        link: "/shop",
      },
      shopSlide2: {
        title: "Royal Oud Collection",
        description:
          "Experience authentic Dubai & French perfumery craftsmanship",
        priceLabel: "Bundle Price:",
        priceValue: "Rs 8,500",
        link: "/shop",
      },
    }
  );

  useEffect(() => {
    if (promoBanners) {
      setPromosState(promoBanners);
    }
  }, [promoBanners]);

  // Testimonial Modal state
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testAvatar, setTestAvatar] = useState(
    "/assets/images/testimonial-1.png"
  );
  const [testText, setTestText] = useState("");

  // Announcement handlers
  const openCreateAnn = () => {
    setEditingAnnId(null);
    setAnnText("");
    setAnnModalOpen(true);
  };

  const openEditAnn = (ann: AnnouncementItem) => {
    setEditingAnnId(ann.id);
    setAnnText(ann.text);
    setAnnModalOpen(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annText.trim()) return;

    if (editingAnnId) {
      const next = announcements.map((a) =>
        a.id === editingAnnId ? { ...a, text: annText.trim() } : a
      );
      await saveStoreSlice({ announcements: next });
      toast.success("Top bar text updated!");
    } else {
      const item: AnnouncementItem = {
        id: `ann-${Date.now()}`,
        text: annText.trim(),
        isActive: true,
        sortOrder: announcements.length + 1,
      };
      await saveStoreSlice({ announcements: [...announcements, item] });
      toast.success("Added to Top Bar!");
    }
    setAnnModalOpen(false);
  };

  const toggleAnnouncement = async (ann: AnnouncementItem) => {
    const next = announcements.map((a) =>
      a.id === ann.id ? { ...a, isActive: !a.isActive } : a
    );
    await saveStoreSlice({ announcements: next });
  };

  const deleteAnnouncement = async (id: string) => {
    const next = announcements.filter((a) => a.id !== id);
    await saveStoreSlice({ announcements: next });
    toast.success("Removed.");
  };

  // Hero Slide handlers
  const handleSaveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHero) return;
    const exists = heroSlides.some((h) => h.id === editingHero.id);
    const next = exists
      ? heroSlides.map((h) => (h.id === editingHero.id ? editingHero : h))
      : [...heroSlides, editingHero];
    await saveStoreSlice({ heroSlides: next });
    setEditingHero(null);
    toast.success("Hero banner saved!");
  };

  // Voucher Handlers
  const openCreateVoucher = () => {
    setEditingVouchId(null);
    setVouchCode("");
    setVouchType("PERCENTAGE");
    setVouchValue(20);
    setVouchMinOrder(0);
    setVouchActive(true);
    setVouchModalOpen(true);
  };

  const openEditVoucher = (v: VoucherItem) => {
    setEditingVouchId(v.id);
    setVouchCode(v.code);
    setVouchType(v.discountType);
    setVouchValue(v.discountValue);
    setVouchMinOrder(v.minOrderAmount || 0);
    setVouchActive(v.isActive !== false);
    setVouchModalOpen(true);
  };

  const handleSaveVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = vouchCode.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a voucher code.");
      return;
    }

    if (editingVouchId) {
      const next = vouchers.map((v) =>
        v.id === editingVouchId
          ? {
              ...v,
              code: cleanCode,
              discountType: vouchType,
              discountValue: Number(vouchValue) || 0,
              minOrderAmount: Number(vouchMinOrder) || 0,
              isActive: vouchActive,
            }
          : v
      );
      await saveStoreSlice({ vouchers: next });
      toast.success(`Voucher "${cleanCode}" updated!`);
    } else {
      const newV: VoucherItem = {
        id: `vouch-${Date.now()}`,
        code: cleanCode,
        discountType: vouchType,
        discountValue: Number(vouchValue) || 0,
        minOrderAmount: Number(vouchMinOrder) || 0,
        isActive: vouchActive,
        createdAt: new Date().toISOString().split("T")[0],
      };
      await saveStoreSlice({ vouchers: [newV, ...vouchers] });
      toast.success(`Voucher "${cleanCode}" created!`);
    }
    setVouchModalOpen(false);
  };

  const toggleVoucher = async (v: VoucherItem) => {
    const next = vouchers.map((item) =>
      item.id === v.id ? { ...item, isActive: !item.isActive } : item
    );
    await saveStoreSlice({ vouchers: next });
  };

  const deleteVoucher = async (id: string) => {
    const next = vouchers.filter((v) => v.id !== id);
    await saveStoreSlice({ vouchers: next });
    toast.success("Voucher deleted.");
  };

  // Promo Banners Handler
  const handleSavePromos = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStoreSlice({ promoBanners: promosState });
    toast.success("Promo banners updated successfully!");
  };

  // Testimonial handlers
  const openCreateTest = () => {
    setEditingTestId(null);
    setTestName("");
    setTestRole("");
    setTestAvatar("/assets/images/testimonial-1.png");
    setTestText("");
    setTestModalOpen(true);
  };

  const openEditTest = (t: TestimonialItem) => {
    setEditingTestId(t.id);
    setTestName(t.name);
    setTestRole(t.role);
    setTestAvatar(t.avatar);
    setTestText(t.text);
    setTestModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testText.trim()) return;

    if (editingTestId) {
      const next = testimonials.map((t) =>
        t.id === editingTestId
          ? {
              ...t,
              name: testName.trim(),
              role: testRole.trim() || "Buyer",
              avatar: testAvatar.trim() || "/assets/images/testimonial-1.png",
              text: testText.trim(),
            }
          : t
      );
      await saveStoreSlice({ testimonials: next });
      toast.success("Review updated!");
    } else {
      const newItem: TestimonialItem = {
        id: `test-${Date.now()}`,
        name: testName.trim(),
        role: testRole.trim() || "Buyer",
        avatar: testAvatar.trim() || "/assets/images/testimonial-1.png",
        text: testText.trim(),
        isActive: true,
      };
      await saveStoreSlice({ testimonials: [...testimonials, newItem] });
      toast.success("Review added!");
    }
    setTestModalOpen(false);
  };

  const deleteTestimonial = async (id: string) => {
    const next = testimonials.filter((t) => t.id !== id);
    await saveStoreSlice({ testimonials: next });
    toast.success("Review removed.");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Banners & Top Bar</h1>
          <p className="admin-section-subtitle">
            Manage top moving bar text, homepage hero slides, and customer
            reviews
          </p>
        </div>

        {activeTab === "announcements" && (
          <button
            type="button"
            onClick={openCreateAnn}
            className="btn-admin btn-admin-primary"
          >
            <i className="fa fa-plus"></i> Add Top Bar Text
          </button>
        )}

        {activeTab === "promos" && (
          <button
            type="button"
            onClick={handleSavePromos}
            className="btn-admin btn-admin-primary"
          >
            <i className="fa fa-check"></i> Save Promo Banners
          </button>
        )}

        {activeTab === "vouchers" && (
          <button
            type="button"
            onClick={openCreateVoucher}
            className="btn-admin btn-admin-primary"
          >
            <i className="fa fa-plus"></i> Add Voucher
          </button>
        )}

        {activeTab === "testimonials" && (
          <button
            type="button"
            onClick={openCreateTest}
            className="btn-admin btn-admin-primary"
          >
            <i className="fa fa-plus"></i> Add Review
          </button>
        )}
      </div>

      <div className="admin-toolbar">
        <div className="admin-pill-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("announcements")}
            className={`admin-pill-tab ${
              activeTab === "announcements" ? "active" : ""
            }`}
          >
            Top Bar Text ({announcements.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`admin-pill-tab ${activeTab === "hero" ? "active" : ""}`}
          >
            Hero Slides ({heroSlides.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("promos")}
            className={`admin-pill-tab ${activeTab === "promos" ? "active" : ""}`}
          >
            Promo Banners
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vouchers")}
            className={`admin-pill-tab ${
              activeTab === "vouchers" ? "active" : ""
            }`}
          >
            Vouchers ({vouchers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("testimonials")}
            className={`admin-pill-tab ${
              activeTab === "testimonials" ? "active" : ""
            }`}
          >
            Reviews ({testimonials.length})
          </button>
        </div>
      </div>

      {/* TAB 1: TOP BAR TEXT (FULL-WIDTH TABLE + MODAL) */}
      {activeTab === "announcements" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Top Bar Moving Text</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((ann, idx) => (
                <tr key={ann.id}>
                  <td style={{ width: "50px" }}>{idx + 1}</td>
                  <td style={{ color: "#222222", fontWeight: 500 }}>
                    {ann.text}
                  </td>
                  <td style={{ width: "130px" }}>
                    <button
                      type="button"
                      onClick={() => toggleAnnouncement(ann)}
                      className={
                        ann.isActive
                          ? "admin-badge admin-badge-delivered"
                          : "admin-badge admin-badge-cancelled"
                      }
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {ann.isActive ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td style={{ width: "140px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openEditAnn(ann)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAnnouncement(ann.id)}
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
      )}

      {/* TAB 2: HERO SLIDES */}
      {activeTab === "hero" && (
        <div className="admin-grid-3">
          {heroSlides.map((slide, idx) => (
            <div key={slide.id} className="admin-card">
              <h4 className="admin-card-title">
                <span>Slide #{idx + 1}</span>
                <span className="admin-badge admin-badge-confirmed">Active</span>
              </h4>
              <div style={{ marginBottom: "16px", lineHeight: 1.6 }}>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#ab8e66",
                    fontWeight: 600,
                  }}
                >
                  {slide.subtitle}
                </div>
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: 700,
                    color: "#222222",
                    margin: "6px 0",
                  }}
                >
                  {slide.titleLine1} — {slide.titleLine2}
                </div>
                <div style={{ fontSize: "13px", color: "#666666" }}>
                  {slide.priceValue
                    ? `${slide.priceLabel} ${slide.priceValue}`
                    : `${slide.codeLabel} ${slide.codeValue}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingHero({ ...slide })}
                className="btn-admin btn-admin-sm btn-admin-outline"
                style={{ width: "100%" }}
              >
                Edit Slide
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB: PROMO BANNERS */}
      {activeTab === "promos" && (
        <form onSubmit={handleSavePromos}>
          {/* Section 1: Home Two Promo Cards */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#222",
                marginBottom: "12px",
              }}
            >
              1. Homepage Two Promo Cards (Under Hero Slider)
            </h3>
            <div className="admin-grid-2">
              <div className="admin-card">
                <h4 className="admin-card-title">Card 1 (Left Card)</h4>
                <div className="admin-form-group">
                  <label className="admin-label">Small Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeCard1.subtitle}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeCard1: {
                          ...promosState.homeCard1,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeCard1.title}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeCard1: {
                          ...promosState.homeCard1,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Promo Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.homeCard1.code}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          homeCard1: {
                            ...promosState.homeCard1,
                            code: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.homeCard1.link}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          homeCard1: {
                            ...promosState.homeCard1,
                            link: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <ImageUploadField
                  label="Card Background / Bottle Photo"
                  value={promosState.homeCard1.image || ""}
                  onChange={(url) =>
                    setPromosState({
                      ...promosState,
                      homeCard1: { ...promosState.homeCard1, image: url },
                    })
                  }
                  folder="banners"
                  fileName="3uqab-promo-card-1"
                />
              </div>

              <div className="admin-card">
                <h4 className="admin-card-title">Card 2 (Right Card)</h4>
                <div className="admin-form-group">
                  <label className="admin-label">Small Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeCard2.subtitle}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeCard2: {
                          ...promosState.homeCard2,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeCard2.title}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeCard2: {
                          ...promosState.homeCard2,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Promo Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.homeCard2.code}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          homeCard2: {
                            ...promosState.homeCard2,
                            code: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.homeCard2.link}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          homeCard2: {
                            ...promosState.homeCard2,
                            link: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <ImageUploadField
                  label="Card Background / Bottle Photo"
                  value={promosState.homeCard2.image || ""}
                  onChange={(url) =>
                    setPromosState({
                      ...promosState,
                      homeCard2: { ...promosState.homeCard2, image: url },
                    })
                  }
                  folder="banners"
                  fileName="3uqab-promo-card-2"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Home Fullwidth Collection Banner */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#222",
                marginBottom: "12px",
              }}
            >
              2. Homepage Fullwidth Collection Banner (Under New Arrivals)
            </h3>
            <div className="admin-card">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeFullwidth.subtitle}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeFullwidth: {
                          ...promosState.homeFullwidth,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeFullwidth.title}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeFullwidth: {
                          ...promosState.homeFullwidth,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Highlight Tag (e.g. 20%)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeFullwidth.highlightText}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeFullwidth: {
                          ...promosState.homeFullwidth,
                          highlightText: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tagline / Volume</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeFullwidth.tagline}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeFullwidth: {
                          ...promosState.homeFullwidth,
                          tagline: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Button Link</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.homeFullwidth.link}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        homeFullwidth: {
                          ...promosState.homeFullwidth,
                          link: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <ImageUploadField
                label="Fullwidth Banner Background Image"
                value={promosState.homeFullwidth.image || ""}
                onChange={(url) =>
                  setPromosState({
                    ...promosState,
                    homeFullwidth: {
                      ...promosState.homeFullwidth,
                      image: url,
                    },
                  })
                }
                folder="banners"
                fileName="3uqab-promo-fullwidth"
              />
            </div>
          </div>

          {/* Section 3: Shop Page Slider */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#222",
                marginBottom: "12px",
              }}
            >
              3. Shop Page Header Banner Slides (/shop)
            </h3>
            <div className="admin-grid-2">
              <div className="admin-card">
                <h4 className="admin-card-title">Shop Slide 1 (Flash Sale)</h4>
                <div className="admin-form-group">
                  <label className="admin-label">Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.shopSlide1.subtitle}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        shopSlide1: {
                          ...promosState.shopSlide1,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.shopSlide1.title}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        shopSlide1: {
                          ...promosState.shopSlide1,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Promo Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.shopSlide1.code}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          shopSlide1: {
                            ...promosState.shopSlide1,
                            code: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.shopSlide1.link}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          shopSlide1: {
                            ...promosState.shopSlide1,
                            link: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h4 className="admin-card-title">Shop Slide 2 (Bundle Deal)</h4>
                <div className="admin-form-group">
                  <label className="admin-label">Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.shopSlide2.title}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        shopSlide2: {
                          ...promosState.shopSlide2,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={promosState.shopSlide2.description}
                    onChange={(e) =>
                      setPromosState({
                        ...promosState,
                        shopSlide2: {
                          ...promosState.shopSlide2,
                          description: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Price Label & Value</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.shopSlide2.priceValue}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          shopSlide2: {
                            ...promosState.shopSlide2,
                            priceValue: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promosState.shopSlide2.link}
                      onChange={(e) =>
                        setPromosState({
                          ...promosState,
                          shopSlide2: {
                            ...promosState.shopSlide2,
                            link: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-admin btn-admin-primary"
            style={{ width: "100%", padding: "12px", fontSize: "14px" }}
          >
            <i className="fa fa-check"></i> Save All Promo Banners
          </button>
        </form>
      )}

      {/* TAB: VOUCHERS / COUPONS */}
      {activeTab === "vouchers" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Voucher Code</th>
                <th>Discount</th>
                <th>Min. Order</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v, idx) => (
                <tr key={v.id}>
                  <td style={{ width: "40px" }}>{idx + 1}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <code
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        backgroundColor: "#f4ede4",
                        color: "#ab8e66",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {v.code}
                    </code>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <strong style={{ color: "#222" }}>
                      {v.discountType === "PERCENTAGE"
                        ? `${v.discountValue}% OFF`
                        : `${settings.currency} ${v.discountValue} OFF`}
                    </strong>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {v.minOrderAmount > 0
                      ? `${settings.currency} ${v.minOrderAmount}`
                      : "No minimum"}
                  </td>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    {v.createdAt}
                  </td>
                  <td style={{ width: "120px" }}>
                    <button
                      type="button"
                      onClick={() => toggleVoucher(v)}
                      className={
                        v.isActive !== false
                          ? "admin-badge admin-badge-delivered"
                          : "admin-badge admin-badge-cancelled"
                      }
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {v.isActive !== false ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td style={{ width: "140px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openEditVoucher(v)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVoucher(v.id)}
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
      )}

      {/* TAB 3: REVIEWS (FULL-WIDTH TABLE + MODAL) */}
      {activeTab === "testimonials" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Role / Tag</th>
                <th>Review Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={t.avatar}
                        alt={t.name}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <strong style={{ color: "#222222" }}>{t.name}</strong>
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap", color: "#ab8e66" }}>
                    {t.role}
                  </td>
                  <td style={{ maxWidth: "520px", fontSize: "13px" }}>
                    &ldquo;{t.text}&rdquo;
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openEditTest(t)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTestimonial(t.id)}
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
      )}

      {/* MODAL: ADD / EDIT TOP BAR TEXT */}
      {annModalOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setAnnModalOpen(false)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingAnnId ? "Edit Top Bar Text" : "Add Top Bar Text"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setAnnModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveAnnouncement} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Announcement Text *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  placeholder="e.g. Free Delivery on Orders Over Rs 5,000"
                />
              </div>
              <div
                className="admin-modal-footer"
                style={{ padding: "14px 0 0" }}
              >
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setAnnModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  Save Text
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT HERO SLIDE */}
      {editingHero && (
        <div
          className="admin-backdrop"
          onClick={() => setEditingHero(null)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Edit Hero Slide</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingHero(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveHeroSlide} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Small Top Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingHero.subtitle}
                  onChange={(e) =>
                    setEditingHero({
                      ...editingHero,
                      subtitle: e.target.value,
                    })
                  }
                />
              </div>
              <ImageUploadField
                label="Banner Background Image"
                value={editingHero.bgImage || ""}
                onChange={(url) =>
                  setEditingHero({ ...editingHero, bgImage: url })
                }
                folder="banners"
                fileName={
                  editingHero.titleLine1
                    ? `3uqab-banner-${editingHero.titleLine1}-${editingHero.titleLine2}`
                    : "3uqab-banner"
                }
              />
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Main Title (Line 1)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingHero.titleLine1}
                    onChange={(e) =>
                      setEditingHero({
                        ...editingHero,
                        titleLine1: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Title (Line 2)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingHero.titleLine2}
                    onChange={(e) =>
                      setEditingHero({
                        ...editingHero,
                        titleLine2: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Price / Code Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={
                      editingHero.priceLabel || editingHero.codeLabel || ""
                    }
                    onChange={(e) =>
                      setEditingHero({
                        ...editingHero,
                        priceLabel: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Price / Code Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={
                      editingHero.priceValue || editingHero.codeValue || ""
                    }
                    onChange={(e) =>
                      setEditingHero({
                        ...editingHero,
                        priceValue: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div
                className="admin-modal-footer"
                style={{ padding: "14px 0 0" }}
              >
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setEditingHero(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT REVIEW */}
      {testModalOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setTestModalOpen(false)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingTestId ? "Edit Review" : "Add Review"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setTestModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Customer Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Tag / Role</label>
                <input
                  type="text"
                  className="admin-input"
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value)}
                  placeholder="e.g. Verified Buyer"
                />
              </div>
              <ImageUploadField
                label="Customer Photo"
                value={testAvatar}
                onChange={setTestAvatar}
                folder="reviews"
                fileName={testName ? `3uqab-review-${testName}` : "3uqab-review"}
              />
              <div className="admin-form-group">
                <label className="admin-label">Review Text *</label>
                <textarea
                  className="admin-textarea"
                  required
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Write customer feedback..."
                />
              </div>
              <div
                className="admin-modal-footer"
                style={{ padding: "14px 0 0" }}
              >
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setTestModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT VOUCHER */}
      {vouchModalOpen && (
        <div className="admin-backdrop" onClick={() => setVouchModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingVouchId ? "Edit Voucher" : "Create New Voucher"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setVouchModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveVoucher} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Voucher Code *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="e.g. SUMMER30"
                  value={vouchCode}
                  onChange={(e) => setVouchCode(e.target.value.toUpperCase())}
                  style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Discount Type</label>
                  <select
                    className="admin-select"
                    value={vouchType}
                    onChange={(e) =>
                      setVouchType(e.target.value as "PERCENTAGE" | "FIXED")
                    }
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ({settings.currency})</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">
                    Discount Value ({vouchType === "PERCENTAGE" ? "%" : settings.currency}) *
                  </label>
                  <input
                    type="number"
                    className="admin-input"
                    required
                    min={1}
                    value={vouchValue}
                    onChange={(e) => setVouchValue(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Minimum Order Amount ({settings.currency})
                </label>
                <input
                  type="number"
                  className="admin-input"
                  min={0}
                  value={vouchMinOrder}
                  onChange={(e) => setVouchMinOrder(Number(e.target.value))}
                  placeholder="0 for no minimum"
                />
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
                  checked={vouchActive}
                  onChange={(e) => setVouchActive(e.target.checked)}
                />
                Active (Can be applied by customers at checkout)
              </label>

              <div
                className="admin-modal-footer"
                style={{ padding: "14px 0 0" }}
              >
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setVouchModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  {editingVouchId ? "Save Changes" : "Create Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
