"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import ImageUploadField from "./ImageUploadField";

export default function SettingsModule() {
  const settings = useAdminStore((s) => s.settings);
  const saveStoreSlice = useAdminStore((s) => s.saveStoreSlice);

  const [formState, setFormState] = useState(settings);
  const [tagsInput, setTagsInput] = useState(settings.popularTags.join(", "));

  useEffect(() => {
    setFormState(settings);
    setTagsInput(settings.popularTags.join(", "));
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await saveStoreSlice({
      settings: {
        ...formState,
        popularTags: parsedTags,
      },
    });
    toast.success("Settings saved!");
  };

  const cloud = formState.cloudinary || {
    cloudName: "",
    apiKey: "",
    apiSecret: "",
    uploadPreset: "",
    rootFolder: "3uqab",
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Settings</h1>
          <p className="admin-section-subtitle">
            Update store name, currency, WhatsApp number, and Cloudinary folders
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="btn-admin btn-admin-primary"
        >
          <i className="fa fa-check"></i> Save Settings
        </button>
      </div>

      <form onSubmit={handleSaveSettings}>
        <div className="admin-grid-2" style={{ marginBottom: "20px" }}>
          <div className="admin-card">
            <h3 className="admin-card-title">Brand Details</h3>
            <ImageUploadField
              label="Store Logo"
              value={formState.logo || "/assets/images/logo.webp"}
              onChange={(url) => setFormState({ ...formState, logo: url })}
              folder="settings"
              fileName="3uqab-logo"
            />
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Store Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Short Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.shortName}
                  onChange={(e) =>
                    setFormState({ ...formState, shortName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({ ...formState, fullName: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Tagline</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.tagline}
                  onChange={(e) =>
                    setFormState({ ...formState, tagline: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">SEO Description</label>
              <textarea
                className="admin-textarea"
                style={{ minHeight: "80px" }}
                value={formState.description}
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Shop Filter Tags</label>
              <input
                type="text"
                className="admin-input"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title">Currency & Contact Info</h3>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Currency *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={formState.currency}
                  onChange={(e) =>
                    setFormState({ ...formState, currency: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Promo Code</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.promoCode}
                  onChange={(e) =>
                    setFormState({ ...formState, promoCode: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                WhatsApp Number (With Country Code, e.g. 923001234567) *
              </label>
              <input
                type="text"
                className="admin-input"
                required
                value={formState.whatsappNumber}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    whatsappNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Phone Number</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.contact.phone}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      contact: { ...formState.contact, phone: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  value={formState.contact.email}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      contact: { ...formState.contact, email: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Store Address</label>
              <input
                type="text"
                className="admin-input"
                value={formState.contact.address}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    contact: { ...formState.contact, address: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Facebook Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.socials.facebook}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      socials: {
                        ...formState.socials,
                        facebook: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Instagram Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formState.socials.instagram}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      socials: {
                        ...formState.socials,
                        instagram: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cloudinary Setup & Subfolder Map */}
        <div className="admin-card">
          <h3 className="admin-card-title">
            <span>Cloudinary WebP Upload & Folders</span>
            <span className="admin-badge admin-badge-confirmed">
              Auto WebP Conversion Active
            </span>
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "16px" }}>
            All images (PNG, JPG, or pasted URLs) are converted to{" "}
            <strong>.webp</strong> and uploaded into subfolders inside{" "}
            <strong>{cloud.rootFolder || "3uqab"}/</strong>:{" "}
            <code>{cloud.rootFolder || "3uqab"}/products</code>,{" "}
            <code>{cloud.rootFolder || "3uqab"}/banners</code>,{" "}
            <code>{cloud.rootFolder || "3uqab"}/blogs</code>,{" "}
            <code>{cloud.rootFolder || "3uqab"}/categories</code>,{" "}
            <code>{cloud.rootFolder || "3uqab"}/reviews</code>.
          </p>

          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Cloudinary Cloud Name</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. dxyz12345"
                value={cloud.cloudName}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    cloudinary: { ...cloud, cloudName: e.target.value },
                  })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Root Folder Name</label>
              <input
                type="text"
                className="admin-input"
                placeholder="3uqab"
                value={cloud.rootFolder}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    cloudinary: { ...cloud, rootFolder: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-label">Cloudinary API Key</label>
              <input
                type="text"
                className="admin-input"
                placeholder="API Key"
                value={cloud.apiKey}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    cloudinary: { ...cloud, apiKey: e.target.value },
                  })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Cloudinary API Secret</label>
              <input
                type="password"
                className="admin-input"
                placeholder="API Secret"
                value={cloud.apiSecret}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    cloudinary: { ...cloud, apiSecret: e.target.value },
                  })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">
                Or Unsigned Upload Preset (Optional)
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. 3uqab_unsigned"
                value={cloud.uploadPreset}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    cloudinary: { ...cloud, uploadPreset: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
