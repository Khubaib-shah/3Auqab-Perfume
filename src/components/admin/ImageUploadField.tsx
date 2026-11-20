"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { siteConfig } from "@/config";

export type UploadSubfolder =
  | "products"
  | "banners"
  | "blogs"
  | "categories"
  | "reviews"
  | "settings";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadSubfolder;
  fileName?: string;
  placeholder?: string;
  hideUrlInput?: boolean;
}

const DEFAULT_SEO_NAMES: Record<UploadSubfolder, string> = {
  products: `${siteConfig.brand.slug}-product`,
  banners: `${siteConfig.brand.slug}-banner`,
  blogs: `${siteConfig.brand.slug}-blog`,
  categories: `${siteConfig.brand.slug}-category`,
  reviews: `${siteConfig.brand.slug}-review`,
  settings: `${siteConfig.brand.slug}-logo`,
};

function formatSeoSlug(raw: string | undefined, folder: UploadSubfolder): string {
  const clean = (raw || "")
    .replace(/\.[^/.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return clean || DEFAULT_SEO_NAMES[folder];
}

async function convertImageFileToWebp(
  file: File,
  seoSlug: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1800;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const webpFile = new File([blob], `${seoSlug}.webp`, {
            type: "image/webp",
          });
          resolve(webpFile);
        },
        "image/webp",
        0.88
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

async function tryConvertUrlToWebpFile(
  url: string,
  seoSlug: string
): Promise<File | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 800;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            resolve(
              new File([blob], `${seoSlug}.webp`, {
                type: "image/webp",
              })
            );
          },
          "image/webp",
          0.88
        );
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  fileName,
  placeholder = "Paste image URL or click Upload...",
  hideUrlInput = false,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const seoSlug = formatSeoSlug(fileName, folder);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploading(true);
    try {
      const webpFile = await convertImageFileToWebp(rawFile, seoSlug);

      const formData = new FormData();
      formData.append("file", webpFile);
      formData.append("folder", folder);
      formData.append("fileName", seoSlug);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      toast.success(`Uploaded as ${seoSlug}.webp in 3uqab/${folder}!`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const convertAndUploadUrl = async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;

    setIsUploading(true);
    try {
      const webpFile = await tryConvertUrlToWebpFile(trimmed, seoSlug);
      if (webpFile) {
        const formData = new FormData();
        formData.append("file", webpFile);
        formData.append("folder", folder);
        formData.append("fileName", seoSlug);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          onChange(data.url);
          toast.success(`Saved as ${seoSlug}.webp in 3uqab/${folder}!`);
          setIsUploading(false);
          return;
        }
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmed,
          folder,
          fileName: seoSlug,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "URL conversion failed");
      }
      onChange(data.url);
      toast.success(`Saved as ${seoSlug}.webp in 3uqab/${folder}!`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not process image URL"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasteUrl = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (
      pasted &&
      (pasted.startsWith("http://") ||
        pasted.startsWith("https://") ||
        pasted.startsWith("/"))
    ) {
      e.preventDefault();
      onChange(pasted);
      convertAndUploadUrl(pasted);
    }
  };

  return (
    <div className="admin-form-group" style={{ marginBottom: 0 }}>
      {label && (
        <label
          className="admin-label"
          style={{ marginBottom: "5px", display: "block", fontSize: "11px", color: "#555" }}
        >
          {label}
        </label>
      )}

      {hideUrlInput ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          {value ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "85px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                overflow: "hidden",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={value}
                alt={seoSlug}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "4px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "4px",
                }}
              >
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-admin btn-admin-sm btn-admin-primary"
                  style={{
                    height: "28px",
                    padding: "0 10px",
                    fontSize: "11px",
                    borderRadius: "4px",
                    fontWeight: 600,
                  }}
                  title="Change image"
                >
                  <i className="fa fa-refresh"></i> {isUploading ? "..." : "Change"}
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  style={{
                    height: "28px",
                    padding: "0 8px",
                    fontSize: "11px",
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  title="Remove image"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                height: "85px",
                border: "1.5px dashed #cbd5e1",
                borderRadius: "6px",
                background: "#f8fafc",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "8px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-primary, #b79c5c)";
                e.currentTarget.style.background = "#fdfbf7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.background = "#f8fafc";
              }}
            >
              {isUploading ? (
                <>
                  <i
                    className="fa fa-spinner fa-spin"
                    style={{ fontSize: "18px", color: "var(--color-primary, #b79c5c)" }}
                  ></i>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <i
                    className="fa fa-cloud-upload"
                    style={{ fontSize: "20px", color: "var(--color-primary, #b79c5c)" }}
                  ></i>
                  <span style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>
                    Upload Image
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              border: "1px solid #e9e9e9",
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {value ? (
              <img
                src={value}
                alt={seoSlug}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "4px",
                }}
              />
            ) : (
              <i
                className="fa fa-picture-o"
                style={{ color: "#bbb", fontSize: "15px" }}
              ></i>
            )}
          </div>

          <input
            type="text"
            className="admin-input"
            style={{ flex: 1, minWidth: "160px" }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePasteUrl}
            placeholder={placeholder}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="btn-admin btn-admin-sm btn-admin-primary"
            style={{ height: "42px", padding: "0 16px" }}
            title="Pick image from gallery (renames & converts to WebP)"
          >
            <i className="fa fa-upload"></i>{" "}
            {isUploading ? "Uploading..." : "Upload"}
          </button>

          {value && !value.endsWith(".webp") && (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => convertAndUploadUrl(value)}
              className="btn-admin btn-admin-sm btn-admin-dark"
              style={{ height: "42px", padding: "0 14px" }}
              title="Convert URL to WebP with SEO name"
            >
              To WebP
            </button>
          )}
        </div>
      )}
    </div>
  );
}
