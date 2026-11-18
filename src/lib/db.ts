import { neon } from "@neondatabase/serverless";
import {
  DatabaseSchema,
  StoreSettingsRecord,
  AnnouncementItem,
  HeroSlideItem,
  TestimonialItem,
  CategoryItem,
  AdminProduct,
  AdminBlogPost,
  OrderRecord,
  ContactMessageRecord,
  NewsletterSubscriberRecord,
  VoucherItem,
  PromoBannersRecord,
  getInitialDatabaseSeed,
} from "@/data/initialStoreSeed";

export * from "@/data/initialStoreSeed";

function getNeonClient() {
  const rawUrl = process.env.DATABASE_URL?.trim();
  if (!rawUrl) {
    throw new Error("DATABASE_URL is not configured in environment variables.");
  }
  const parsed = new URL(rawUrl);
  parsed.searchParams.delete("channel_binding");
  return neon(parsed.toString());
}

function parseJsonField<T>(val: unknown, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return val as T;
}

/**
 * Reads the live store state directly from individual Neon PostgreSQL tables.
 */
export async function readDbAsync(): Promise<DatabaseSchema> {
  const seed = getInitialDatabaseSeed();
  try {
    const sql = getNeonClient();
    const [
      settingsRows,
      announcementRows,
      heroRows,
      testimonialRows,
      categoryRows,
      productRows,
      blogRows,
      orderRows,
      messageRows,
      subscriberRows,
      voucherRows,
    ] = await Promise.all([
      sql`SELECT * FROM store_settings LIMIT 1;`,
      sql`SELECT * FROM announcements ORDER BY sort_order ASC;`,
      sql`SELECT * FROM hero_slides;`,
      sql`SELECT * FROM testimonials;`,
      sql`SELECT * FROM categories ORDER BY sort_order ASC;`,
      sql`SELECT * FROM products;`,
      sql`SELECT * FROM blogs;`,
      sql`SELECT * FROM orders ORDER BY created_at DESC;`,
      sql`SELECT * FROM contact_messages ORDER BY created_at DESC;`,
      sql`SELECT * FROM newsletter_subscribers ORDER BY created_at DESC;`,
      sql`SELECT * FROM vouchers;`,
    ]);

    let settings: StoreSettingsRecord = seed.settings;
    let promoBanners: PromoBannersRecord = seed.promoBanners;

    if (settingsRows.length > 0) {
      const r = settingsRows[0];
      const extra = parseJsonField<Record<string, unknown>>(r.extra_json, {});
      const seo = parseJsonField<Record<string, unknown>>(r.seo, {});
      const social = parseJsonField<StoreSettingsRecord["socials"]>(
        r.social,
        seed.settings.socials
      );
      const parsedBanners = parseJsonField<PromoBannersRecord>(
        r.promo_banners,
        seed.promoBanners
      );
      if (parsedBanners && Object.keys(parsedBanners).length > 0) {
        promoBanners = { ...seed.promoBanners, ...parsedBanners };
      }

      settings = {
        ...seed.settings,
        name: (r.name as string) || seed.settings.name,
        shortName: (r.short_name as string) || seed.settings.shortName,
        fullName: (r.full_name as string) || seed.settings.fullName,
        tagline: (r.tagline as string) || seed.settings.tagline,
        description: (r.description as string) || seed.settings.description,
        url: (r.url as string) || seed.settings.url,
        whatsappNumber: (r.whatsapp as string) || seed.settings.whatsappNumber,
        currency: (r.currency as string) || seed.settings.currency,
        logo: (r.logo as string) || seed.settings.logo,
        freeShippingThreshold: Number(
          r.free_shipping_threshold ?? seed.settings.freeShippingThreshold
        ),
        flatShippingRate: Number(
          r.flat_shipping_rate ?? seed.settings.flatShippingRate
        ),
        promoCode: (extra.promoCode as string) || seed.settings.promoCode,
        welcomeMessage:
          (extra.welcomeMessage as string) || seed.settings.welcomeMessage,
        popularTags:
          (extra.popularTags as string[]) ||
          (seo.popularTags as string[]) ||
          seed.settings.popularTags,
        cloudinary:
          (extra.cloudinary as StoreSettingsRecord["cloudinary"]) ||
          seed.settings.cloudinary,
        socials: { ...seed.settings.socials, ...social },
        contact: {
          ...seed.settings.contact,
          ...((extra.contact as Partial<StoreSettingsRecord["contact"]>) || {}),
          email: (r.email as string) || seed.settings.contact.email,
          phone: (r.phone as string) || seed.settings.contact.phone,
          address: (r.address as string) || seed.settings.contact.address,
        },
      };
    }

    const announcements: AnnouncementItem[] = announcementRows.map((a) => ({
      id: a.id as string,
      text: a.text as string,
      isActive: Boolean(a.is_active),
      sortOrder: Number(a.sort_order ?? 0),
    }));

    const heroSlides: HeroSlideItem[] = heroRows.map((h) => ({
      id: h.id as string,
      styleClass: (h.style_class as string) || "style4",
      subtitle: (h.subtitle as string) || "",
      titleLine1: (h.title_line_1 as string) || "",
      titleLine2: (h.title_line_2 as string) || "",
      priceLabel: (h.price_label as string) || undefined,
      priceValue: (h.price_value as string) || undefined,
      codeLabel: (h.code_label as string) || undefined,
      codeValue: (h.code_value as string) || undefined,
      btnClass: "btn-shop-the-look",
      bgImage: (h.bg_image as string) || undefined,
      link: (h.cta_link as string) || "/shop",
      isActive: h.is_active !== false,
    }));

    const testimonials: TestimonialItem[] = testimonialRows.map((t) => ({
      id: t.id as string,
      name: (t.name as string) || "",
      role: (t.role as string) || "",
      avatar: (t.avatar as string) || "",
      text: (t.text as string) || "",
      isActive: t.is_active !== false,
    }));

    const categories: CategoryItem[] = categoryRows.map((c) => ({
      id: c.id as string,
      name: c.name as string,
      slug: c.slug as string,
      description: (c.description as string) || "",
      image: (c.image as string) || undefined,
      showInNav: Boolean(c.show_in_nav),
      isActive: Boolean(c.is_active),
      sortOrder: Number(c.sort_order ?? 0),
    }));

    const products: AdminProduct[] = productRows.map((p) => {
      const full = parseJsonField<Partial<AdminProduct>>(p.data_json, {});
      return {
        ...full,
        id: p.id as string,
        sku: (p.sku as string) || full.sku || "",
        name: p.name as string,
        slug: p.slug as string,
        price: Number(p.price ?? full.price ?? 0),
        oldPrice:
          p.old_price !== null && p.old_price !== undefined
            ? Number(p.old_price)
            : full.oldPrice,
        category: (p.category as string) || full.category || "",
        isNew: Boolean(p.is_new),
        rating: Number(p.rating ?? full.rating ?? 5),
        reviewsCount: Number(p.reviews_count ?? full.reviewsCount ?? 0),
        image: (p.image as string) || full.image || "",
        gallery: parseJsonField<string[]>(p.images, full.gallery || []),
        blackCardImage:
          (p.black_card_image as string) || full.blackCardImage || undefined,
        shortBullets:
          full.shortBullets ||
          (p.short_description
            ? String(p.short_description).split(" | ").filter(Boolean)
            : []),
        description: parseJsonField<string[]>(
          p.description,
          full.description || []
        ),
        sizes: parseJsonField<string[]>(p.sizes, full.sizes || []),
        inStock: Boolean(p.in_stock),
        stockQuantity: Number(p.stock_quantity ?? full.stockQuantity ?? 0),
        isWeeklyFeatured: Boolean(p.is_weekly_featured),
        notes: parseJsonField(p.fragrance_notes, full.notes),
      } as AdminProduct;
    });

    const blogs: AdminBlogPost[] = blogRows.map((b) => {
      const full = parseJsonField<Partial<AdminBlogPost>>(b.data_json, {});
      return {
        ...full,
        id: b.id as string,
        slug: b.slug as string,
        title: b.title as string,
        category: (b.category as string) || full.category || "",
        author: (b.author as string) || full.author || "",
        authorRole: (b.author_bio as string) || full.authorRole || "",
        authorAvatar: (b.author_avatar as string) || full.authorAvatar || "",
        date: (b.date as string) || full.date || "",
        image: (b.image as string) || full.image || "",
        excerpt: (b.excerpt as string) || full.excerpt || "",
        content: parseJsonField<string[]>(b.content, full.content || []),
        quote: (b.quote as string) || full.quote || "",
        tags: parseJsonField<string[]>(b.tags, full.tags || []),
        commentsCount: Number(b.comments_count ?? full.commentsCount ?? 0),
        views: Number(b.views ?? full.views ?? 0),
        isPublished: Boolean(b.is_published),
      } as AdminBlogPost;
    });

    const orders: OrderRecord[] = orderRows.map((o) => ({
      id: o.id as string,
      orderNumber: o.order_number as string,
      firstName: (o.first_name as string) || "",
      lastName: (o.last_name as string) || "",
      email: (o.email as string) || "",
      phone: (o.phone as string) || "",
      whatsapp: (o.whatsapp as string) || "",
      country: (o.country as string) || undefined,
      state: (o.state as string) || "",
      city: (o.city as string) || "",
      zipCode: (o.zip_code as string) || undefined,
      address: (o.address as string) || "",
      items: parseJsonField(o.items, []),
      subtotal: Number(o.subtotal ?? 0),
      shippingCost: Number(o.shipping_cost ?? 0),
      discountAmount: Number(o.discount_amount ?? 0),
      totalAmount: Number(o.total_amount ?? 0),
      paymentMethod:
        o.payment_method === "CARD" ? "CARD" : "COD",
      paymentStatus:
        o.payment_status === "PAID" || o.payment_status === "REFUNDED"
          ? o.payment_status
          : "UNPAID",
      status: (o.status as OrderRecord["status"]) || "PENDING",
      courierName: (o.courier_name as string) || "",
      trackingNumber: (o.tracking_number as string) || "",
      trackingUrl: (o.tracking_url as string) || "",
      adminNotes: (o.admin_notes as string) || "",
      statusHistory: parseJsonField(o.status_history, []),
      createdAt: (o.created_at as string) || "",
      updatedAt: (o.updated_at as string) || "",
    }));

    const messages: ContactMessageRecord[] = messageRows.map((m) => ({
      id: m.id as string,
      name: (m.name as string) || "",
      email: (m.email as string) || "",
      phone: (m.phone as string) || "",
      subject: (m.subject as string) || "",
      message: (m.message as string) || "",
      status: (m.status as ContactMessageRecord["status"]) || "UNREAD",
      createdAt: (m.created_at as string) || "",
    }));

    const subscribers: NewsletterSubscriberRecord[] = subscriberRows.map(
      (sub) => ({
        id: sub.id as string,
        email: sub.email as string,
        source: (sub.source as string) || "Storefront",
        isActive: Boolean(sub.is_active),
        createdAt: (sub.created_at as string) || "",
      })
    );

    const vouchers: VoucherItem[] = voucherRows.map((v) => ({
      id: v.id as string,
      code: v.code as string,
      discountType:
        v.discount_type === "FIXED" ? "FIXED" : "PERCENTAGE",
      discountValue: Number(v.discount_value ?? 0),
      minOrderAmount: Number(v.min_order_amount ?? 0),
      isActive: Boolean(v.is_active),
      createdAt: (v.created_at as string) || "",
    }));

    return {
      settings,
      announcements,
      heroSlides,
      testimonials,
      categories,
      products,
      blogs,
      orders,
      messages,
      subscribers,
      vouchers,
      promoBanners,
    };
  } catch (err) {
    console.error("Neon readDbAsync error:", err);
    return seed;
  }
}

/**
 * Persists only the provided slices into their respective Neon PostgreSQL tables.
 */
export async function writeSliceAsync(
  partial: Partial<DatabaseSchema>,
  currentFull?: DatabaseSchema
): Promise<void> {
  const sql = getNeonClient();

  if (partial.settings !== undefined || partial.promoBanners !== undefined) {
    const base = currentFull || (await readDbAsync());
    const s = partial.settings ?? base.settings;
    const banners = partial.promoBanners ?? base.promoBanners;
    await sql`DELETE FROM store_settings;`;
    await sql`
      INSERT INTO store_settings (
        id, name, short_name, full_name, tagline, description, url,
        email, phone, whatsapp, address, currency, logo,
        free_shipping_threshold, flat_shipping_rate, social, seo,
        promo_banners, extra_json, updated_at
      ) VALUES (
        'default',
        ${s.name}, ${s.shortName}, ${s.fullName}, ${s.tagline},
        ${s.description}, ${s.url}, ${s.contact.email}, ${s.contact.phone},
        ${s.whatsappNumber}, ${s.contact.address}, ${s.currency}, ${s.logo || ""},
        ${Number(s.freeShippingThreshold ?? 3000)},
        ${Number(s.flatShippingRate ?? 250)},
        ${JSON.stringify(s.socials)}::jsonb,
        ${JSON.stringify({ popularTags: s.popularTags })}::jsonb,
        ${JSON.stringify(banners)}::jsonb,
        ${JSON.stringify({
          promoCode: s.promoCode,
          welcomeMessage: s.welcomeMessage,
          contact: s.contact,
          cloudinary: s.cloudinary,
          popularTags: s.popularTags,
        })}::jsonb,
        NOW()
      );
    `;
  }

  if (partial.announcements !== undefined) {
    await sql`DELETE FROM announcements;`;
    for (const a of partial.announcements) {
      await sql`
        INSERT INTO announcements (id, text, is_active, sort_order)
        VALUES (${a.id}, ${a.text}, ${Boolean(a.isActive)}, ${Number(a.sortOrder ?? 0)});
      `;
    }
  }

  if (partial.heroSlides !== undefined) {
    await sql`DELETE FROM hero_slides;`;
    for (const h of partial.heroSlides) {
      await sql`
        INSERT INTO hero_slides (
          id, subtitle, title_line_1, title_line_2,
          price_label, price_value, code_label, code_value,
          cta_text, cta_link, bg_image, style_class, is_active
        ) VALUES (
          ${h.id}, ${h.subtitle || ""}, ${h.titleLine1 || ""}, ${h.titleLine2 || ""},
          ${h.priceLabel || null}, ${h.priceValue || null},
          ${h.codeLabel || null}, ${h.codeValue || null},
          ${"Shop now"}, ${h.link || "/shop"}, ${h.bgImage || ""},
          ${h.styleClass || "style4"}, ${h.isActive !== false}
        );
      `;
    }
  }

  if (partial.testimonials !== undefined) {
    await sql`DELETE FROM testimonials;`;
    for (const t of partial.testimonials) {
      await sql`
        INSERT INTO testimonials (id, name, role, avatar, text, is_active)
        VALUES (${t.id}, ${t.name}, ${t.role}, ${t.avatar}, ${t.text}, ${t.isActive !== false});
      `;
    }
  }

  if (partial.categories !== undefined) {
    await sql`DELETE FROM categories;`;
    for (const c of partial.categories) {
      await sql`
        INSERT INTO categories (id, name, slug, description, image, show_in_nav, is_active, sort_order)
        VALUES (
          ${c.id}, ${c.name}, ${c.slug}, ${c.description || ""},
          ${c.image || null}, ${Boolean(c.showInNav)}, ${Boolean(c.isActive)}, ${Number(c.sortOrder ?? 0)}
        );
      `;
    }
  }

  if (partial.products !== undefined) {
    await sql`DELETE FROM products;`;
    for (const p of partial.products) {
      await sql`
        INSERT INTO products (
          id, sku, name, slug, price, old_price, category, is_new,
          rating, reviews_count, image, images, black_card_image,
          short_description, description, sizes, in_stock, stock_quantity,
          is_weekly_featured, fragrance_notes, data_json
        ) VALUES (
          ${p.id}, ${p.sku || ""}, ${p.name}, ${p.slug},
          ${Number(p.price || 0)}, ${p.oldPrice != null ? Number(p.oldPrice) : null},
          ${p.category || ""}, ${Boolean(p.isNew)},
          ${Number(p.rating ?? 5)}, ${Number(p.reviewsCount ?? 0)},
          ${p.image || ""}, ${JSON.stringify(p.gallery || [])}::jsonb,
          ${p.blackCardImage || null},
          ${(p.shortBullets || []).join(" | ")},
          ${JSON.stringify(p.description || [])}::jsonb,
          ${JSON.stringify(p.sizes || [])}::jsonb,
          ${Boolean(p.inStock)}, ${Number(p.stockQuantity ?? 0)},
          ${Boolean(p.isWeeklyFeatured)},
          ${JSON.stringify(p.notes || {})}::jsonb,
          ${JSON.stringify(p)}::jsonb
        );
      `;
    }
  }

  if (partial.blogs !== undefined) {
    await sql`DELETE FROM blogs;`;
    for (const b of partial.blogs) {
      await sql`
        INSERT INTO blogs (
          id, slug, title, category, author, author_avatar, author_bio,
          date, image, excerpt, content, quote, quote_author, tags,
          comments_count, views, is_published, data_json
        ) VALUES (
          ${b.id}, ${b.slug}, ${b.title}, ${b.category || ""},
          ${b.author || ""}, ${b.authorAvatar || ""}, ${b.authorRole || ""},
          ${b.date || ""}, ${b.image || ""}, ${b.excerpt || ""},
          ${JSON.stringify(b.content || [])}::jsonb,
          ${b.quote || null}, ${b.author || null},
          ${JSON.stringify(b.tags || [])}::jsonb,
          ${Number(b.commentsCount ?? 0)}, ${Number(b.views ?? 0)},
          ${Boolean(b.isPublished)},
          ${JSON.stringify(b)}::jsonb
        );
      `;
    }
  }

  if (partial.orders !== undefined) {
    await sql`DELETE FROM orders;`;
    for (const o of partial.orders) {
      await sql`
        INSERT INTO orders (
          id, order_number, first_name, last_name, email, phone, whatsapp,
          country, state, city, zip_code, address, items,
          subtotal, shipping_cost, discount_amount, total_amount,
          payment_method, payment_status, status, courier_name,
          tracking_number, tracking_url, admin_notes, status_history,
          created_at, updated_at
        ) VALUES (
          ${o.id}, ${o.orderNumber}, ${o.firstName || ""}, ${o.lastName || ""},
          ${o.email || ""}, ${o.phone || ""}, ${o.whatsapp || ""},
          ${o.country || "Pakistan"}, ${o.state || ""}, ${o.city || ""},
          ${o.zipCode || ""}, ${o.address || ""},
          ${JSON.stringify(o.items || [])}::jsonb,
          ${Number(o.subtotal ?? 0)}, ${Number(o.shippingCost ?? 0)},
          ${Number(o.discountAmount ?? 0)}, ${Number(o.totalAmount ?? 0)},
          ${o.paymentMethod || "COD"}, ${o.paymentStatus || "UNPAID"},
          ${o.status || "PENDING"}, ${o.courierName || ""},
          ${o.trackingNumber || ""}, ${o.trackingUrl || ""},
          ${o.adminNotes || ""}, ${JSON.stringify(o.statusHistory || [])}::jsonb,
          ${o.createdAt || ""}, ${o.updatedAt || ""}
        );
      `;
    }
  }

  if (partial.messages !== undefined) {
    await sql`DELETE FROM contact_messages;`;
    for (const m of partial.messages) {
      await sql`
        INSERT INTO contact_messages (id, name, email, phone, subject, message, status, created_at)
        VALUES (
          ${m.id}, ${m.name || ""}, ${m.email || ""}, ${m.phone || ""},
          ${m.subject || ""}, ${m.message || ""}, ${m.status || "UNREAD"},
          ${m.createdAt || ""}
        );
      `;
    }
  }

  if (partial.subscribers !== undefined) {
    await sql`DELETE FROM newsletter_subscribers;`;
    for (const sub of partial.subscribers) {
      await sql`
        INSERT INTO newsletter_subscribers (id, email, source, is_active, created_at)
        VALUES (
          ${sub.id}, ${sub.email}, ${sub.source || "Storefront"},
          ${Boolean(sub.isActive)}, ${sub.createdAt || ""}
        );
      `;
    }
  }

  if (partial.vouchers !== undefined) {
    await sql`DELETE FROM vouchers;`;
    for (const v of partial.vouchers) {
      await sql`
        INSERT INTO vouchers (id, code, discount_type, discount_value, min_order_amount, is_active, created_at)
        VALUES (
          ${v.id}, ${v.code}, ${v.discountType || "PERCENTAGE"},
          ${Number(v.discountValue ?? 0)}, ${Number(v.minOrderAmount ?? 0)},
          ${Boolean(v.isActive)}, ${v.createdAt || ""}
        );
      `;
    }
  }
}

/**
 * Writes the full store state across all Neon PostgreSQL relational tables.
 */
export async function writeDbAsync(
  data: DatabaseSchema
): Promise<DatabaseSchema> {
  await writeSliceAsync(data, data);
  return data;
}
