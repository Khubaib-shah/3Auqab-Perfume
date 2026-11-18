export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
  children?: NavItem[];
}

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export interface NavigationConfig {
  announcements: string[];
  mainMenu: NavItem[];
  /** Featured links shown in the desktop mega menu and mobile "Pages" panel. */
  featuredMenu: { title: string; links: NavItem[] };
  footerColumns: FooterColumn[];
}

export const navigationConfig: NavigationConfig = {
  announcements: [
    "✦ Free Delivery on All Orders Above Rs 3,000 in Karachi",
    "✦ Use Promo Code 3UQAB20 for 20% Off Your Entire Order",
    "✦ Pure Arabian Oud & Concentrated Attar — 100% Authentic & Long-Lasting",
    "✦ Fast Express Cash on Delivery (COD) Exclusively in Karachi",
  ],

  mainMenu: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],

  featuredMenu: {
    title: "Signature Fragrances",
    links: [
      { label: "3Uqab Signature EDP", href: "/product/uqab-signature-edp" },
      { label: "Uqab Rihla Eau", href: "/product/uqab-rihla-edp" },
    ],
  },

  footerColumns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Shop All", href: "/shop" },
        { label: "Our Blog", href: "/blog" },
        { label: "About Our Brand", href: "/about" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { label: "Shopping Cart", href: "/cart" },
        { label: "Checkout", href: "/checkout" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "My Account", href: "/login" },
      ],
    },
  ],
};
