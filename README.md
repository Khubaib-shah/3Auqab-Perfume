<div align="center">
  <img src="public/uploads/3auqab/settings/3auqab-logo.webp" alt="3Auqab Luxury Perfumes Logo" width="100" />

  <h1>3Auqab Perfume (Three Auqab) — Luxury Fragrance & E-Commerce Platform</h1>

  <p>
    <strong>An enterprise-grade, mobile-first Next.js 16 luxury e-commerce boutique &amp; CMS platform for artisanal French &amp; Arabian perfumery, featuring serverless PostgreSQL state persistence, instant optimistic cart &amp; local-storage wishlist, interactive fragrance pyramid discovery, dynamic promotions, and full administrative commerce control.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.4-14161A?style=flat-square&logo=nextdotjs&logoColor=FFFFFF" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-14161A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-14161A?style=flat-square&logo=typescript&logoColor=A9C8FA" alt="TypeScript Strict" />
    <img src="https://img.shields.io/badge/Turbopack-Enabled-14161A?style=flat-square&logo=vercel&logoColor=FFFFFF" alt="Turbopack" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon_Serverless-14161A?style=flat-square&logo=postgresql&logoColor=C9C3F5" alt="PostgreSQL + Neon" />
    <img src="https://img.shields.io/badge/Prisma-ORM-14161A?style=flat-square&logo=prisma&logoColor=5A67D8" alt="Prisma ORM" />
    <img src="https://img.shields.io/badge/Zustand-Persist_Storage-14161A?style=flat-square" alt="Zustand Persist" />
    <img src="https://img.shields.io/badge/Theme-Gold_%26_Noir_Luxury-14161A?style=flat-square&logoColor=AB8E66" alt="Luxury Theme" />
  </p>

  <p>
    <a href="#-visual-tour">Visual Tour</a> •
    <a href="#-high-level-design-hld">High-Level Design (HLD)</a> •
    <a href="#-low-level-design-lld">Low-Level Design (LLD)</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-about-me">About Me</a>
  </p>
</div>

---

## ✨ Overview

High-end luxury perfumery demands more than a conventional shopping cart—it requires olfactory storytelling (Top, Heart, and Base notes), custom bottle finish selections, real-time inventory synchronizations, zero-delay mobile navigation, and resilient multi-environment database fallback.

**3Auqab Perfumes** solves this with a headless Next.js 16 architecture:

- **Artisanal Fragrance Pyramid:** Structured olfactory profile representation allowing connoisseurs to explore top, middle, and lingering base notes with seamless single-row tab transitions.
- **Dual-Storage Resilience Engine:** Instant hydration from Neon Serverless PostgreSQL with automatic graceful degradation to an in-memory seed ledger if database connections fluctuate, preventing storefront downtime.
- **Optimistic Wishlist & Cart Persistence:** Client-side Zustand store with `localStorage` synchronization (`three-oqab-shop-storage`), filled solid heart icons upon saving favourites, floating quick-actions, and live counter badges.
- **Native-App Mobile Ergonomics:** 5-item mobile bottom app bar (`Home` → `Shop` → `Search` → `Wishlist` → `Cart`), top search drawer with pre-searched tags, 68% width peek carousel for upcoming products, and a hanging seal emblem header.
- **Comprehensive Merchant CMS Dashboard:** Full back-office control over catalog products, pricing, stock levels, orders pipeline, voucher codes, announcement marquees, hero slides, blog posts, and customer inquiries.

---

## 📸 Visual Tour

### 1. Mobile Luxury Hero & Hanging Seal Emblem
Responsive mobile header with the signature 3Auqab golden seal overlapping the top navigation, seamless right-to-left marquee announcement loop, and high-impact hero slider with shop-the-look callouts.

<p align="center">
  <img src="docs/images/01-hero-home-mobile.png" alt="Mobile Hero & Seal Emblem" width="380" />
</p>

---

### 2. Live Catalog Search, Instant Tag Chips & Reset UX
Typeahead fragrance search with keyword highlights, pre-searched popular fragrance chips, active filter tags with cross-removal, and a dedicated mobile advance filter drawer.

<p align="center">
  <img src="docs/images/02-shop-catalog-search.png" alt="Shop Catalog & Search" width="750" />
</p>

---

### 3. Weekly Featured Fragrances Carousel
Custom horizontal 800ms cubic-bezier carousel with smooth swipe physics, right-aligned compact navigation controls, and a 68% viewport peek card width so the next signature bottle is always enticingly visible.

<p align="center">
  <img src="docs/images/03-weekly-featured.png" alt="Weekly Featured Slider" width="380" />
</p>

---

### 4. 5-Item Native Mobile Bottom Navigation Bar
Permanent thumb-accessible mobile navigation bar featuring brand-active gold highlights, live counter badges for Wishlist and Cart, and one-tap instant search drawer trigger.

<p align="center">
  <img src="docs/images/04-mobile-navigation.png" alt="Mobile Bottom Navigation" width="450" />
</p>

---

### 5. Heritage Storytelling & Fullwidth Promotional Banners
Immersive atelier background presentations and limited-edition promotional banners styled with French-Arabian typography, discount countdowns, and quick voucher redemption triggers.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/images/05-luxury-banner.jpg" alt="Luxury Banner" width="400" /><br/>
      <sub><strong>Seasonal Campaign Banner</strong> — Royal Collection Eau de Parfum promotion</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/images/06-about-atelier.jpg" alt="Atelier Heritage" width="400" /><br/>
      <sub><strong>Atelier Heritage</strong> — Handcrafted perfume creation process</sub>
    </td>
  </tr>
</table>

---

## 🏛 High-Level Design (HLD)

### System Architecture

```mermaid
flowchart TB
    subgraph Client["Client Layer — Next.js 16 + React 19"]
        UI["Pages & Components<br/>(Header · Home · Shop · Product · Wishlist · Cart · Checkout · Admin)"]
        ShopStore["useShopStore (Zustand)<br/>Cart + LocalStorage Wishlist Persist + QuickView"]
        AdminStore["useAdminStore (Zustand)<br/>Server Hydration + Optimistic Settings + Mutations"]
        BottomNav["Mobile 5-Item Navigation<br/>Home · Shop · Search · Wishlist · Cart"]
    end

    subgraph Server["Next.js Server Layer (Turbopack Engine)"]
        RSC["Server Components & Metadata<br/>Robots · Sitemap · OpenGraph · SSR"]
        APIRouter["API Route Handlers (/api/*)<br/>/api/store · /api/orders · /api/newsletter · /api/contact · /api/upload"]
        DBBridge["Database Adapter (src/lib/db.ts)<br/>Neon Postgres Client + In-Memory Fallback"]
    end

    subgraph Data["Persistence Layer"]
        PG[("Neon Serverless PostgreSQL<br/>store_kv Key-Value Snapshot + Prisma Tables")]
        StaticSeed[("Initial Database Seed<br/>High-Fidelity Store Fallback Ledger")]
    end

    UI --> ShopStore
    UI --> AdminStore
    UI --> BottomNav
    BottomNav -. "window.open-mobile-search" .-> UI
    AdminStore -- "GET /api/store" --> APIRouter
    AdminStore -- "PUT /api/store" --> APIRouter
    UI -- "POST /api/orders" --> APIRouter
    APIRouter --> DBBridge
    DBBridge --> PG
    DBBridge -. fallback .-> StaticSeed
```

### Core Architectural Decisions

| Concern | Architectural Choice | Rationale |
| :--- | :--- | :--- |
| **Instant Client Responsiveness** | **Zustand Client Stores** with `localStorage` persist (`three-oqab-shop-storage`) | Cart items and wishlisted fragrances survive browser reloads without requiring an upfront user account login. |
| **Server Resilience & Zero Cold Starts** | **Dual-Engine Database Layer** (`src/lib/db.ts` with Neon + Seed Fallback) | If the remote database experiences network latency, the storefront immediately serves the curated memory ledger without crashing. |
| **Component Performance & Re-render Isolation** | Decomposed **Memoized Subcomponents** (`React.memo` + `useMemo` / `useCallback`) | Dragging the weekly carousel or typing in newsletter inputs re-renders only the isolated child component, keeping the 700+ line tree untouched. |
| **Mobile-First UX** | **5-Item Fixed Bottom Nav** + Collapsible Top Search Drawer | Provides native mobile app UX on iOS Safari and Android Chrome with immediate access to cart, favourites, and catalog discovery. |
| **SEO & Crawlability** | Dynamic Next.js **`sitemap.ts`** and **`robots.ts`** with category & product deep links | Maximizes Google indexing speed for luxury perfume search queries across all product lines. |

---

## ⚙️ Low-Level Design (LLD)

### 1. Relational Database Schema

Defined in `prisma/schema.prisma` with typed relations:

```mermaid
erDiagram
    CATEGORY ||--o{ PRODUCT : contains
    ORDER ||--o{ ORDER_ITEM : includes
    ADMIN_USER ||--o{ AUDIT_LOG : generates

    PRODUCT {
        string id PK
        string slug UK
        string name
        string sku UK
        string category
        float price
        float oldPrice
        int stockQuantity
        boolean inStock
        boolean isNew
        boolean isWeeklyFeatured
        string topNotes
        string heartNotes
        string baseNotes
        string[] gallery
    }

    ORDER {
        string id PK
        string orderNumber UK
        string firstName
        string lastName
        string email
        string phone
        string address
        string city
        float subtotal
        float shippingCost
        float discountAmount
        float totalAmount
        string paymentMethod
        string paymentStatus
        string status
        json items
    }

    STORE_SETTING {
        string id PK
        string brandName
        string currencySymbol
        float freeShippingThreshold
        float flatShippingRate
        string phone
        string email
        string promoCode
    }

    BLOG_POST {
        string id PK
        string slug UK
        string title
        string category
        string author
        string date
        int views
        int commentsCount
    }
```

<details>
<summary><strong>Complete Entity Inventory (Prisma &amp; KV Store Models)</strong></summary>

1. **`AdminUser`** — Back-office credentials, password hash, and permission role (`SUPER_ADMIN`, `ORDER_MANAGER`, `CONTENT_EDITOR`).
2. **`StoreSetting`** — Brand identity, global currency symbol, shipping thresholds, promo codes, contact phone/email, and social links.
3. **`Product`** — Full luxury perfume specs: slug, SKU, category, sizes array (`30ml`, `50ml`, `100ml`), bottle finishes, olfactory notes pyramid (top/heart/base), and gallery images.
4. **`Category`** — Collection hierarchy (`New Arrivals`, `Eau de Parfum`, `Arabian Oud`, `Unisex Collection`, etc.).
5. **`Order`** — Multi-item customer orders, shipping destination, payment method (`COD` / `CARD`), discount voucher deductions, courier tracking numbers, and JSON item history.
6. **`BlogPost`** — Editorial perfume guides, fragrance layering tips, review counts, and view metrics.
7. **`HeroSlide`** — Dynamic homepage slider carousels with customizable headline lines, pricing accents, and action buttons.
8. **`Announcement`** — Marquee banner announcement items with custom sort orders and active toggles.
9. **`Voucher`** — Promotional discount coupon codes with minimum order amount validations (`PERCENTAGE` or `FIXED`).

</details>

---

### 2. Wishlist & Cart Persistence Flow

```mermaid
sequenceDiagram
    actor Customer as Shopper
    participant Card as ProductCard (.card-fav-btn)
    participant Store as useShopStore (Zustand)
    participant Local as LocalStorage
    participant Footer as Mobile Bottom Navigation

    Customer->>Card: Tap Heart Icon
    Card->>Store: toggleWishlist(product.id)
    Store->>Local: Write updated { cart, wishlist } array
    Store-->>Card: isWishlisted = true
    Card->>Card: Render solid filled heart (fa fa-heart, #e53e3e)
    Store-->>Footer: wishlistCount incremented
    Footer->>Footer: Render active counter badge (e.g. 1)

    Note over Customer,Footer: On page reload / revisit, state rehydrates instantly without login
```

---

### 3. REST API Surface (`src/app/api/*`)

| Method & Route | Domain | Description |
| :--- | :--- | :--- |
| `GET /api/store` | **Store State** | Retrieves global snapshot (products, categories, banners, settings, orders) from PostgreSQL with fallback. |
| `PUT /api/store` | **Store Mutations** | Saves modified slices (products catalog, settings, vouchers) into persistent database storage. |
| `POST /api/orders` | **Checkout** | Validates cart items, applies voucher discounts, generates unique order number, and persists order. |
| `POST /api/newsletter` | **Subscriptions** | Records customer email for seasonal campaigns and promotion deal alerts. |
| `POST /api/contact` | **Inquiries** | Stores contact form submissions, customer inquiries, and wholesale requests. |
| `POST /api/upload` | **Media Upload** | Handles product image and banner uploads with validation and storage. |

---

### 4. Project Directory Structure

```text
3Auqab/nextjs/
├── docs/images/                 # Showcase screenshots & high-resolution visual previews
├── prisma/
│   └── schema.prisma            # Production PostgreSQL relational schema (Prisma ORM)
├── public/
│   ├── assets/
│   │   ├── css/                 # Core stylesheets & third-party styles
│   │   ├── fonts/               # Flaticon & FontAwesome luxury typography icon fonts
│   │   └── images/              # Fragrance catalog pictures, banners & author avatars
│   └── uploads/3auqab/settings/ # Brand golden emblem logo & uploaded merchant assets
├── src/
│   ├── app/                     # Next.js 16 App Router pages & API handlers
│   │   ├── api/                 # REST endpoints (store, orders, newsletter, contact, upload)
│   │   ├── admin/               # Headless CMS merchant management portal
│   │   ├── blog/                # Blog article feeds & slug views
│   │   ├── cart/                # Shopping bag & voucher calculation page
│   │   ├── checkout/            # Checkout address, courier & order placement
│   │   ├── product/[slug]/      # Perfume details page with olfactory pyramid
│   │   ├── shop/                # Filterable catalog with instant typeahead search
│   │   ├── wishlist/            # Saved favourite fragrances page
│   │   ├── globals.css          # Comprehensive design system (20 audited sections)
│   │   ├── layout.tsx           # Root storefront layout wrapper
│   │   ├── robots.ts            # Dynamic search crawler directives
│   │   └── sitemap.ts           # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── admin/               # CMS modules (Products, Orders, Blogs, Settings, Inbox)
│   │   ├── home/                # Memoized subcomponents (Hero, Promo, Weekly, News, Instagram)
│   │   ├── layout/              # Header (Marquee, MegaMenu, Mobile Drawer) & Footer (5-item Bottom Bar)
│   │   ├── product/             # ProductCard, ProductDetailsClient, QuickViewModal
│   │   ├── shop/                # ShopClient with advance filter drawer & typeahead chips
│   │   └── wishlist/            # WishlistClient with empty state & direct cart actions
│   ├── data/                    # Seed catalogs, initial store state & siteConfig
│   ├── lib/                     # Database adapter (Neon PostgreSQL + memory fallback)
│   └── store/                   # Zustand client stores (useShopStore & useAdminStore)
├── next.config.ts               # Next.js build configuration & Turbopack settings
├── tsconfig.json                # Strict TypeScript compiler options
└── vercel.json                  # Vercel deployment & caching configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `20+` (LTS recommended)
- **npm**, **pnpm**, or **yarn**
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech) Serverless PostgreSQL or local PostgreSQL)

### 1. Clone & Install

```bash
git clone https://github.com/Khubaib-shah/3Auqab-Perfume.git
cd 3Auqab-Perfume
npm install
```

### 2. Configure Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Configure your credentials:

```env
# Application URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Neon Serverless PostgreSQL Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# Admin Authentication
ADMIN_DEFAULT_EMAIL="admin@3auqab.com"
ADMIN_DEFAULT_PASSWORD="YourSecurePasswordHere"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app runs on Turbopack with instant hot reloading.

### 4. Verify Build & Type Safety

```bash
# TypeScript strict type check
npx tsc --noEmit

# Production Next.js build
npm run build
npm start
```

### 5. Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in **Vercel** (`Framework Preset: Next.js`).
3. Add `DATABASE_URL` in **Project Settings → Environment Variables**.
4. Click **Deploy**. Vercel will build and distribute your storefront globally across edge regions with instant static page generation.

---

## 👨‍💻 About Me

Hi, I'm **Khubaib Shah** (`syedkhubaibshah@icloud.com`) — a software engineer passionate about architecting high-performance, visually captivating full-stack web applications and robust digital commerce platforms.

While building **3Auqab Perfume**, my focus was on crafting a true luxury digital experience that balances aesthetic grandeur with rigorous engineering standards:
- **Resilient Architectural Fundamentals:** Building zero-downtime serverless database bridges with automatic seed fallbacks, atomic checkout mutations, and strict TypeScript data contracts.
- **Micro-Interaction Polish & Mobile Ergonomics:** Designing fluid 800ms touch-swipe carousels, instant optimistic cart/wishlist persistence, typeahead olfactory search, and responsive thumb-friendly mobile app navigation.

If you'd like to collaborate, discuss e-commerce architecture, or explore tailored bespoke solutions, feel free to connect:
- **Email:** [syedkhubaibshah@icloud.com](mailto:syedkhubaibshah@icloud.com)
- **GitHub:** [@Khubaib-shah](https://github.com/Khubaib-shah)
