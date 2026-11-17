import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { readDbAsync } from "@/lib/db";

const ALLOWED_SUBFOLDERS = [
  "products",
  "banners",
  "blogs",
  "categories",
  "reviews",
  "settings",
] as const;

type AllowedSubfolder = (typeof ALLOWED_SUBFOLDERS)[number];

const DEFAULT_NAMES: Record<AllowedSubfolder, string> = {
  products: "3uqab-product",
  banners: "3uqab-banner",
  blogs: "3uqab-blog",
  categories: "3uqab-category",
  reviews: "3uqab-review",
  settings: "3uqab-logo",
};

function sanitizeSubfolder(folder?: string): AllowedSubfolder {
  const clean = (folder || "products").trim().toLowerCase();
  if ((ALLOWED_SUBFOLDERS as readonly string[]).includes(clean)) {
    return clean as AllowedSubfolder;
  }
  return "products";
}

function toSeoPublicId(rawName: string | undefined, subFolder: AllowedSubfolder): string {
  const fallback = DEFAULT_NAMES[subFolder];
  const cleaned = (rawName || "")
    .replace(/\.[^/.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

  return cleaned || fallback;
}

async function getCloudinaryCredentials() {
  const db = await readDbAsync();
  const saved = db.settings.cloudinary;

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    saved?.cloudName ||
    "";
  const apiKey = process.env.CLOUDINARY_API_KEY || saved?.apiKey || "";
  const apiSecret =
    process.env.CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_API_SECRET_KEY ||
    saved?.apiSecret ||
    "";
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET || saved?.uploadPreset || "";
  const rootFolder = (
    process.env.CLOUDINARY_ROOT_FOLDER ||
    saved?.rootFolder ||
    "3Uqab Perfume"
  ).replace(/^\/+|\/+$/g, "");

  return {
    cloudName: cloudName.trim(),
    apiKey: apiKey.trim(),
    apiSecret: apiSecret.trim(),
    uploadPreset: uploadPreset.trim(),
    rootFolder: rootFolder || "3uqab",
  };
}

async function uploadToCloudinary(
  fileDataUriOrUrl: string,
  targetFolder: string,
  publicId: string,
  creds: Awaited<ReturnType<typeof getCloudinaryCredentials>>
): Promise<string | null> {
  if (!creds.cloudName) return null;

  const endpoint = `https://api.cloudinary.com/v1_1/${creds.cloudName}/image/upload`;
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const form = new FormData();
  form.append("file", fileDataUriOrUrl);
  form.append("folder", targetFolder);
  form.append("format", "webp");
  form.append("overwrite", "true");
  form.append("public_id", publicId);

  if (creds.apiKey && creds.apiSecret) {
    // Alphabetical parameter signing for Cloudinary API
    const paramsToSign = `folder=${targetFolder}&format=webp&overwrite=true&public_id=${publicId}&timestamp=${timestamp}${creds.apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign)
      .digest("hex");

    form.append("api_key", creds.apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", signature);
  } else if (creds.uploadPreset) {
    form.append("upload_preset", creds.uploadPreset);
  } else {
    return null;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url.replace(/\.(png|jpg|jpeg|gif|bmp|avif)$/i, ".webp");
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const creds = await getCloudinaryCredentials();

    // Case 1: Multipart FormData (Gallery File Upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folderParam = String(formData.get("folder") || "products");
      const rawCustomName = String(formData.get("fileName") || "");

      const subFolder = sanitizeSubfolder(folderParam);
      const targetFolder = `${creds.rootFolder}/${subFolder}`;
      const seoPublicId = toSeoPublicId(rawCustomName, subFolder);

      if (!file) {
        return NextResponse.json(
          { error: "No image file provided" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary if configured
      if (
        creds.cloudName &&
        ((creds.apiKey && creds.apiSecret) || creds.uploadPreset)
      ) {
        const base64DataUri = `data:image/webp;base64,${buffer.toString(
          "base64"
        )}`;
        const cloudUrl = await uploadToCloudinary(
          base64DataUri,
          targetFolder,
          seoPublicId,
          creds
        );
        if (cloudUrl) {
          return NextResponse.json({
            url: cloudUrl,
            folder: targetFolder,
            fileName: `${seoPublicId}.webp`,
            provider: "cloudinary",
            format: "webp",
          });
        }
      }

      // Local fallback inside public/uploads/3uqab/<subFolder>/<seoPublicId>.webp
      const fileName = `${seoPublicId}.webp`;
      const relDir = path.join("uploads", creds.rootFolder, subFolder);
      const absDir = path.join(process.cwd(), "public", relDir);
      fs.mkdirSync(absDir, { recursive: true });
      fs.writeFileSync(path.join(absDir, fileName), buffer);

      const publicUrl = `/uploads/${creds.rootFolder}/${subFolder}/${fileName}`;
      return NextResponse.json({
        url: publicUrl,
        folder: targetFolder,
        fileName,
        provider: "local-webp",
        format: "webp",
      });
    }

    // Case 2: JSON body with pasted URL ({ url, folder, fileName })
    const body = await request.json();
    const rawUrl = String(body.url || "").trim();
    const subFolder = sanitizeSubfolder(body.folder);
    const targetFolder = `${creds.rootFolder}/${subFolder}`;
    const seoPublicId = toSeoPublicId(body.fileName, subFolder);

    if (!rawUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    if (
      creds.cloudName &&
      ((creds.apiKey && creds.apiSecret) || creds.uploadPreset)
    ) {
      const cloudUrl = await uploadToCloudinary(
        rawUrl,
        targetFolder,
        seoPublicId,
        creds
      );
      if (cloudUrl) {
        return NextResponse.json({
          url: cloudUrl,
          folder: targetFolder,
          fileName: `${seoPublicId}.webp`,
          provider: "cloudinary",
          format: "webp",
        });
      }
    }

    return NextResponse.json({
      url: rawUrl,
      folder: targetFolder,
      fileName: `${seoPublicId}.webp`,
      provider: "url",
      format: "webp",
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
