# White-Label E-commerce Platform Transformation Checklist

This checklist tracks the refactoring of the application into a fully reusable, white-label e-commerce platform suitable for any product brand (perfumes, fashion, cosmetics, electronics, etc.).

---

## Phase 1: Centralized Configuration Architecture (`src/config/`)
- [x] Create `src/config/site.config.ts` (Brand name, company info, contact details, socials, currency, locale).
- [x] Create `src/config/theme.config.ts` (Colors, fonts, border-radius, shadows, spacing tokens).
- [x] Create `src/config/assets.config.ts` (Logos, favicons, hero banners, promo images, product placeholders).
- [x] Create `src/config/navigation.config.ts` (Header links, footer menus, social channels, category navigation).
- [x] Create `src/config/business.config.ts` (Product variant labels, attribute schemas, shipping rules, tax settings).
- [x] Create `src/config/content.config.ts` (Homepage banners, about story, team members, feature iconboxes, FAQs).
- [x] Create `src/config/index.ts` (Unified export for all configurations with backward compatibility).

---

## Phase 2: Theme System & CSS Variables Architecture
- [x] Add CSS theme variables (`:root`) in `globals.css` (`--color-primary`, `--color-heading`, `--color-body`, `--radius-card`, etc.).
- [x] Replace hardcoded gold `#ab8e66` with `var(--color-primary)` throughout `globals.css`.
- [x] Replace hardcoded dark `#222222` with `var(--color-heading)` throughout `globals.css`.
- [x] Replace hardcoded body font and heading font families with configurable CSS font variables.
- [x] Make card border-radius and button border-radius derive from CSS variables.

---

## Phase 3: Brand-Specific Naming Refactoring (`.stelina-*`)
- [x] Map `.stelina-button` to generic `.app-button` / `.theme-button`.
- [x] Map `.stelina-iconbox` to generic `.app-iconbox` / `.theme-iconbox`.
- [x] Map `.stelina-product` to generic `.app-product` / `.theme-product`.
- [x] Map `.stelina-blog` to generic `.app-blog` / `.theme-blog`.
- [x] Map `.stelina-nav` and `.stelina-menu` to generic `.app-nav` / `.theme-nav`.
- [x] Keep backward-compatible class aliases so existing layout styles remain 100% intact.

---

## Phase 4: Centralized Assets Management
- [x] Route all logo references through `assetsConfig.logo`.
- [x] Route favicon references through `assetsConfig.favicon`.
- [x] Route homepage hero slides through `contentConfig.heroSlides`.
- [x] Route promotional banners through `contentConfig.promoBanners`.
- [x] Route placeholder images through `assetsConfig.placeholders`.

---

## Phase 5: Business-Agnostic Product Architecture
- [x] Generalize product variants: support "Size" (clothing), "Weight" (food/groceries), "Volume" (perfumes/skincare), "Option" (general).
- [x] Generalize product specifications: allow flexible Key-Value attributes instead of fixed "Top, Heart, Base Notes".
- [x] Update `ProductDetailsClient.tsx` to dynamically render specifications table based on business config.
- [x] Update `QuickViewModal.tsx` to dynamically render variant selector based on business config.
- [x] Ensure backward compatibility for existing perfume catalog data.

---

## Phase 6: Content, Navigation & SEO Decoupling
- [x] Decouple `AboutPage` (`about/page.tsx`) to pull story, master team members, and feature boxes from config.
- [x] Decouple `ContactPage` (`contact/page.tsx` & `ContactClient.tsx`) to pull address, map, phone, and email from config.
- [x] Decouple `FaqAccordion.tsx` to pull questions and answers from `contentConfig.faqs`.
- [x] Decouple `Header.tsx` and `Footer.tsx` navigation links from hardcoded perfume categories to `navigationConfig`.
- [x] Decouple `layout.tsx` metadata and Schema.org JSON-LD to pull dynamically from `siteConfig`.

---

## Phase 7: Admin Dashboard Generalization
- [x] Update `ProductsModule.tsx` to support custom variant names (e.g. Size / Volume / Weight).
- [x] Update `ProductsModule.tsx` specifications form to accept dynamic key-value attributes.
- [x] Remove hardcoded perfume assumptions in admin product creation.
- [x] Keep settings module connected with the centralized configuration.

---

## Phase 8: Verification & Regression Testing
- [x] Run `npx tsc --noEmit` to ensure 0 TypeScript compilation errors.
- [x] Verify homepage rendering (hero slider, banners, new arrivals, testimonials, FAQs).
- [x] Verify product details page rendering with dynamic tabs and variant selectors.
- [x] Verify cart and checkout flow with dynamic currency and shipping rules.
- [x] Verify mobile responsiveness across all screen sizes.
