export interface BusinessConfig {
  industry: "perfume" | "fashion" | "cosmetics" | "general";
  variant: {
    label: string; // e.g. "Size", "Bottle Size", "Volume", "Weight"
    options: string[]; // e.g. ["15ml", "30ml", "50ml", "100ml"] or ["S", "M", "L", "XL"]
    defaultOption: string;
  };
  specifications: {
    tabTitle: string; // e.g. "Fragrance Notes", "Specifications", "Material & Care"
    defaultAttributes: { key: string; label: string }[];
    /** Rows shown for every product, e.g. Concentration for perfumes, Material for clothing. */
    staticRows: { label: string; value: string }[];
  };
  shipping: {
    freeShippingThreshold: number;
    flatShippingRate: number;
    cashOnDeliveryEnabled: boolean;
    deliveryAreaDescription: string;
    estimatedDeliveryDays: string;
  };
  promo: {
    defaultCode: string;
    defaultDiscountPercent: number;
    /** Extra codes accepted as the default promo (legacy or typo-friendly aliases). */
    aliasCodes: string[];
  };
  /** Industry-specific UI copy. Change these when onboarding a non-perfume brand. */
  labels: {
    specsLinkText: string;
    emptyCartCta: string;
    reviewerFallbackRole: string;
    reviewFallbackQuote: string;
    productImageLabel: string;
  };
}

export const businessConfig: BusinessConfig = {
  industry: "perfume",

  variant: {
    label: "Bottle Size",
    options: ["15ml", "30ml", "50ml", "100ml"],
    defaultOption: "50ml",
  },

  specifications: {
    tabTitle: "Fragrance Notes",
    defaultAttributes: [
      { key: "topNotes", label: "Top Notes" },
      { key: "heartNotes", label: "Heart Notes" },
      { key: "baseNotes", label: "Base Notes" },
    ],
    staticRows: [
      { label: "Concentration", value: "Eau de Parfum (High Oil Concentration)" },
    ],
  },

  shipping: {
    freeShippingThreshold: 3000,
    flatShippingRate: 250,
    cashOnDeliveryEnabled: true,
    deliveryAreaDescription: "Exclusively across Karachi",
    estimatedDeliveryDays: "1 to 2 business days",
  },

  promo: {
    defaultCode: "3UQAB20",
    defaultDiscountPercent: 20,
    aliasCodes: ["3UQAB", "3AUQAB"],
  },

  labels: {
    specsLinkText: "View Fragrance Pyramid",
    emptyCartCta: "Explore Perfumes",
    reviewerFallbackRole: "Fragrance Connoisseur",
    reviewFallbackQuote:
      "Extraordinary sillage and authentic Arabian luxury in every bottle.",
    productImageLabel: "Bottle",
  },
};
