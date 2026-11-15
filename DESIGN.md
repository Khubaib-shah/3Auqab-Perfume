# 3Uqab Perfume: Admin Dashboard Design System (`DESIGN.md`)

> **CRITICAL INSTRUCTION FOR AI AGENTS & DEVELOPERS**
> Before writing any Admin Dashboard UI component, read this file completely.
> The Admin Dashboard MUST look like a native extension of the **3Uqab (Three Uqab Perfume)** luxury storefront (`style.css` & `globals.css`).
> Do **NOT** generate generic "AI SaaS" dashboards (no Indigo/Violet `#6366f1` buttons, no Tailwind `rounded-xl` cards, no heavy `shadow-lg` floating boxes, no glassmorphism, and no neon gradients).

---

## 1. Core Brand Philosophy: "Editorial Parisian & Arabian Atelier"

The 3Uqab storefront combines **sharp architectural containers (`border-radius: 0px`)** with **soft pill-shaped interactive controls (`border-radius: 30px`)**, framed in **Warm Bronze Gold (`#ab8e66`)**, **Obsidian Black (`#111111`)**, **Alabaster Stone (`#f3f3f3`)**, and **Crisp White (`#ffffff`)**, set exclusively in the **Jost** geometric sans-serif typeface.

### Strict Anti-AI-Slop Rules
1. **No Blue/Indigo/Purple Primary Accents**: The primary brand color is `#ab8e66` (Warm Bronze Gold) and secondary action color is `#111111` (Obsidian Black). Never use default Tailwind `blue-600`, `indigo-500`, or `violet-600`.
2. **Sharp Cards (`0px`), Pill Controls (`30px`)**:
   * Cards, tables, modals, panels, drawers, and image frames MUST have **`border-radius: 0px`** (sharp 90-degree corners) with a `1px solid #f1f1f1` or `#e9e9e9` border.
   * Buttons, inputs, selects, search bars, and status badges MUST have **`border-radius: 30px`** (or `20px` for compact badges).
3. **No Heavy Drop Shadows on Cards**: Storefront cards (`product-inner`, `blog-item`, `checkout-form`) rely on crisp `1px solid #f1f1f1` borders that turn `1px solid #ab8e66` on hover or focus. Shadows are reserved strictly for floating dropdowns, modals, and drawers.
4. **No Emojis as UI Icons**: Use `FontAwesome 4.7` (`fa fa-*`) or `Flaticon` (`flaticon-*`) icons already loaded in the project.

---

## 2. Color Palette & Tokens

| Token Name | Hex Value | Usage in Admin Dashboard |
| :--- | :--- | :--- |
| **Brand Gold (Primary)** | `#ab8e66` | Primary CTA buttons, active sidebar item indicator, active tab underline, focus borders, "New" / "Featured" badges, key metric highlights. |
| **Brand Gold Hover** | `#967a54` | Hover state when transitioning from `#ab8e66` (or transition directly to `#111111` as the storefront does). |
| **Obsidian Black** | `#111111` | Top/Sidebar dark surfaces, primary headings, secondary buttons ("View", "Export"), button hover background. |
| **Charcoal Text** | `#222222` | Table row titles, product names, modal titles, form section headers. |
| **Body Muted Text** | `#666666` | Default body text, table cell secondary data. |
| **Subtle Label Text** | `#888888` | Input labels, timestamps, SKU codes, pagination numbers, table column headers. |
| **Alabaster Stone** | `#f3f3f3` | Page background canvas, table header background (`.shop-top-control`), muted banner surfaces. |
| **Soft Card Tint** | `#f5f5f5` | Secondary inner panels, preview boxes, inactive tab pills. |
| **Pure White** | `#ffffff` | Card backgrounds, table body backgrounds, modal surfaces, form inputs. |
| **Border Hairline** | `#f1f1f1` | Card borders, table row dividers, section dividers. |
| **Input Border** | `#e9e9e9` | Form input, textarea, and select resting borders. |
| **Star / Warning Gold** | `#ffb933` | Product ratings, "Pending Confirmation" order status badge. |
| **Success Green (Editorial)** | `#2e6f40` | "Delivered" / "Paid" / "In Stock" status badge text (paired with `#eaf4ec` background). |
| **WhatsApp Action Green** | `#1f7a4c` | "Contact on WhatsApp" action button (deep luxury emerald, not neon green). |
| **Danger / Cancelled Red** | `#b42318` | "Cancelled" / "Out of Stock" / "Delete" actions (paired with `#fef3f2` background). |

### Recommended CSS Variables for Dashboard Scope

```css
:root {
  --auqab-gold: #ab8e66;
  --auqab-black: #111111;
  --auqab-heading: #222222;
  --auqab-body: #666666;
  --auqab-muted: #888888;
  --auqab-bg-canvas: #f3f3f3;
  --auqab-bg-surface: #ffffff;
  --auqab-bg-subtle: #f5f5f5;
  --auqab-border-card: #f1f1f1;
  --auqab-border-input: #e9e9e9;
  --auqab-whatsapp: #1f7a4c;
  --auqab-danger: #b42318;
}
```

---

## 3. Typography (`Jost` Font System)

The entire dashboard uses **`"Jost", sans-serif`** (already loaded in `src/app/layout.tsx`).

| Element | Font Size | Font Weight | Text Transform | Letter Spacing | Color |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title (H1)** | `24px` - `26px` | `600` (SemiBold) | `uppercase` | `0.02em` | `#111111` |
| **Card / Section Title (H2/H3)** | `18px` | `500` - `600` | `uppercase` or `capitalize` | `0` | `#0a0a0a` |
| **Widget / Sidebar Heading** | `14px` | `600` (SemiBold) | `uppercase` | `0.1em` | `#222222` |
| **Table Column Header (`th`)** | `12px` | `600` (SemiBold) | `uppercase` | `0.08em` | `#888888` |
| **Table Cell Primary** | `15px` | `500` (Medium) | `none` | `0` | `#222222` |
| **Table Cell Secondary** | `14px` | `400` (Regular) | `none` | `0` | `#666666` |
| **Form Label** | `14px` | `500` (Medium) | `capitalize` | `0` | `#333333` |
| **Buttons & Badges** | `12px` - `13px` | `600` (SemiBold) | `uppercase` | `0.05em` | `#ffffff` |

### Signature Section Title Underline
Every major card or form section title in the dashboard should use the storefront's signature `.title-form` gold underline bar:

```css
.admin-section-title {
  font-family: "Jost", sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #0a0a0a;
  margin-bottom: 25px;
  padding-bottom: 10px;
  position: relative;
  text-transform: uppercase;
}

.admin-section-title::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  border-bottom: 2px solid #ab8e66;
  width: 30px;
}
```

---

## 4. Layout, Spacing, Borders & Shadows

### 4.1 Dashboard Shell Layout
* **Left Sidebar (`260px` fixed on desktop, slide-over drawer on mobile)**:
  * Background: `#111111` (matches `.form-contact-information` and dark luxury footer) OR `#ffffff` with `1px solid #f1f1f1` right border.
  * Recommended: **Dark Obsidian Sidebar (`#111111`)** with white/muted text (`#cccccc`) and **Brand Gold (`#ab8e66`)** active bar on the left (`border-left: 3px solid #ab8e66; background: #1a1a1a; color: #ffffff`).
  * Top of Sidebar: 3Uqab Logo + `"ADMIN ATELIER"` subtitle in `11px` uppercase `#ab8e66` (`letter-spacing: 0.15em`).
* **Top Header Bar (`64px` height)**:
  * Background: `#ffffff`
  * Border Bottom: `1px solid #f1f1f1`
  * Left: Breadcrumb matching storefront `.breadcrumb` (`Dashboard > Orders > #3UQAB-10042`).
  * Right: Quick "View Live Store" pill button (`border: 1px solid #e9e9e9; border-radius: 30px`), Pending Orders notification bell with gold badge count, and Admin profile name.
* **Main Workspace Canvas**:
  * Background: `#f3f3f3` (or `#fafafa`) so `#ffffff` sharp cards stand out cleanly.
  * Padding: `30px` on desktop, `20px` on tablet, `15px` on mobile.
  * Grid Gap: `30px` between major cards/columns (`15px` column padding matching Bootstrap `.row`).

### 4.2 Border Radius Rules (Strict)

| Element Type | `border-radius` | Reference in Storefront |
| :--- | :--- | :--- |
| **Cards, Panels, Tables, Modals** | `0px` | `.product-inner`, `.checkout-form`, `.cart-form`, `.blog-item` |
| **Text Inputs, Selects, Search Bars** | `30px` | `input[type="text"]`, `.form-search .inner`, `.quantity .control` |
| **Multiline `<textarea>`** | `15px` or `0px` | `textarea` in `style.css` |
| **Buttons (Primary, Secondary, Outline)** | `30px` | `.button`, `input[type="submit"]` |
| **Status Badges / Tags** | `20px` | `.product-item .flash` |
| **Avatar / Icon Circle Buttons** | `50%` | `.stelina-contact-info .item .icon`, `.pagination .page-numbers` |

### 4.3 Shadow Tokens

| Surface | `box-shadow` | When to Use |
| :--- | :--- | :--- |
| **Resting Cards & Tables** | `none` (use `border: 1px solid #f1f1f1`) | All dashboard KPI cards, forms, and tables. |
| **Hovered Card** | `none` (change border to `1px solid #ab8e66`) | KPI cards, product cards, selectable items. |
| **Dropdowns & Popovers** | `0 3px 18px 0 rgba(0, 0, 0, 0.09)` | Action menus, filter popovers, notification menus. |
| **Modals & Dialogs** | `0 0 12px 0 rgba(2, 2, 2, 0.16)` | Product edit modals, order status confirmation modals. |
| **Slide-Over Drawer** | `3px 5px 14px -3px rgba(0, 0, 0, 0.11)` | Mobile sidebar drawer, Order quick-view drawer. |

---

## 5. Component Specifications

### 5.1 KPI Summary Cards
* **Container**: `background: #ffffff; border: 1px solid #f1f1f1; border-radius: 0; padding: 28px 25px; transition: border-color 0.25s ease;`
* **Hover**: `border-color: #ab8e66;`
* **Icon Circle**: `width: 46px; height: 46px; border-radius: 50%; border: 1px solid #ab8e66; color: #ab8e66; display: inline-flex; align-items: center; justify-content: center; font-size: 20px;`
* **Label**: `font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #888888; margin-bottom: 6px;`
* **Metric Value**: `font-size: 28px; font-weight: 600; color: #111111; line-height: 1.1;`

### 5.2 Buttons
All buttons follow the storefront `.button` specification:

```css
/* Primary Gold Button (Save, Create Product, Confirm Order) */
.admin-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 43px;
  padding: 0 24px;
  border-radius: 30px;
  background-color: #ab8e66;
  color: #ffffff;
  font-family: "Jost", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.admin-btn-primary:hover {
  background-color: #111111;
  color: #ffffff;
}

/* Secondary Dark Button (Export CSV, Print Invoice) */
.admin-btn-dark {
  height: 43px;
  padding: 0 24px;
  border-radius: 30px;
  background-color: #111111;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid #111111;
  transition: all 0.25s ease;
}

.admin-btn-dark:hover {
  background-color: #ab8e66;
  border-color: #ab8e66;
}

/* Ghost / Outline Button (Cancel, Filter, Back) */
.admin-btn-outline {
  height: 43px;
  padding: 0 22px;
  border-radius: 30px;
  background-color: transparent;
  color: #333333;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid #e9e9e9;
  transition: all 0.25s ease;
}

.admin-btn-outline:hover {
  background-color: #ab8e66;
  border-color: #ab8e66;
  color: #ffffff;
}

/* WhatsApp Action Button (1-Click Customer Contact) */
.admin-btn-whatsapp {
  height: 38px;
  padding: 0 18px;
  border-radius: 30px;
  background-color: #1f7a4c;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: none;
  transition: all 0.25s ease;
}

.admin-btn-whatsapp:hover {
  background-color: #111111;
  color: #ffffff;
}
```

### 5.3 Forms, Inputs & Toggles
Every form container looks like `.checkout-form` (`padding: 35px 30px; border: 1px solid #f1f1f1; background: #ffffff; border-radius: 0;`).

* **Text / Number / Email / Select Input**:
  * `height: 42px;`
  * `padding: 7px 20px;`
  * `border: 1px solid #e9e9e9;`
  * `border-radius: 30px;`
  * `font-size: 14px; color: #333333; background: #ffffff;`
  * **Focus State**: `border-color: #ab8e66; outline: none;`
* **Textarea**:
  * `padding: 14px 20px;`
  * `border: 1px solid #e9e9e9;`
  * `border-radius: 15px;`
  * **Focus State**: `border-color: #ab8e66; outline: none;`
* **Checkboxes**:
  * Match storefront square checkboxes (`18px x 18px`, `border: 1px solid #eeeeee`, `border-radius: 0`, FontAwesome `\f00c` check icon when checked).

### 5.4 Data Tables & Filter Bar
* **Top Filter Bar (above table)**:
  * Matches `.shop-top-control`: `background-color: #f3f3f3; border: 1px solid #f3f3f3; padding: 14px 20px; margin-bottom: 20px; border-radius: 0; display: flex; align-items: center; justify-content: space-between; gap: 15px;`
* **Filter Pills (Order Status Tabs)**:
  * Inactive Pill: `background: #ffffff; color: #666666; border: 1px solid #e9e9e9; border-radius: 30px; padding: 6px 18px; font-size: 12px; font-weight: 600; text-transform: uppercase;`
  * Active Pill: `background: #ab8e66; color: #ffffff; border-color: #ab8e66;`
* **Table Structure**:
  * Wrapper: `background: #ffffff; border: 1px solid #f1f1f1; border-radius: 0;`
  * Header (`thead tr`): `border-bottom: 1px solid #f1f1f1; background: #fafafa;`
  * Header cells (`th`): `padding: 16px 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #888888;`
  * Body rows (`tbody tr`): `border-bottom: 1px solid #f1f1f1; transition: background-color 0.2s ease;`
  * Row Hover: `background-color: #fcfaf7;`
  * Body cells (`td`): `padding: 18px 20px; vertical-align: middle; font-size: 14px; color: #555555;`

### 5.5 Order Status Badges
Matches `.product-item .flash` (`border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 12px; display: inline-block;`):

| Status | Background | Text Color | Border |
| :--- | :--- | :--- | :--- |
| `PENDING` | `#fff8eb` | `#b57600` | `1px solid #f5deb3` |
| `CONFIRMED` | `#f4efe8` | `#ab8e66` | `1px solid #decbb1` |
| `PROCESSING` | `#f0f4f8` | `#334e68` | `1px solid #d9e2ec` |
| `SHIPPED` | `#111111` | `#ffffff` | `1px solid #111111` |
| `DELIVERED` | `#eaf4ec` | `#2e6f40` | `1px solid #c6e2ce` |
| `CANCELLED` | `#fef3f2` | `#b42318` | `1px solid #fecdca` |

### 5.6 Modals & Slide-Over Drawers
* **Backdrop**: `background: rgba(0, 0, 0, 0.5); transition: opacity 0.3s ease;`
* **Modal Box**:
  * `background: #ffffff; border-radius: 0; border: none; box-shadow: 0 0 12px 0 rgba(2, 2, 2, 0.16); max-width: 680px; width: 100%;`
  * **Close Button**: Top-right circle or square button matching `.kt-close-btn` (`width: 44px; height: 44px; border-left: 1px solid #eeeeee; color: #222222;`).
  * **Modal Header**: `padding: 20px 30px; border-bottom: 1px solid #f1f1f1;`
  * **Modal Body**: `padding: 30px;`
  * **Modal Footer**: `padding: 18px 30px; border-top: 1px solid #f1f1f1; background: #fafafa; display: flex; justify-content: flex-end; gap: 12px;`

---

## 6. Quick Reference Checklist Before Committing Any Dashboard Screen

- [ ] Are all cards, tables, and modals sharp (`border-radius: 0px`) with `1px solid #f1f1f1` borders?
- [ ] Are all buttons, text inputs, and selects pill-shaped (`border-radius: 30px`)?
- [ ] Are all headings and buttons using `"Jost", sans-serif` with uppercase tracking where appropriate?
- [ ] Is `#ab8e66` (Warm Bronze Gold) + `#111111` (Obsidian Black) used instead of generic SaaS blue/indigo?
- [ ] Do section headers have the `30px` gold bottom border (`#ab8e66`)?
- [ ] Do Order & Contact screens include 1-click WhatsApp (`wa.me`) and Email buttons?
