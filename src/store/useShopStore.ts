"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Product,
  getDefaultProductSize,
  getProductPriceForSize,
} from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedFinish?: string;
  price?: number;
}

export interface AppliedVoucher {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
}

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  appliedVoucher: AppliedVoucher | null;
  quickViewProduct: Product | null;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedFinish?: string
  ) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  setAppliedVoucher: (voucher: AppliedVoucher | null) => void;
  toggleWishlist: (productId: string) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      appliedVoucher: null,
      quickViewProduct: null,

      addToCart: (
        product,
        quantity = 1,
        selectedSize = getDefaultProductSize(product),
        selectedFinish = ""
      ) =>
        set((state) => {
          const itemPrice = getProductPriceForSize(product, selectedSize);
          const existingIndex = state.cart.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === selectedSize
          );
          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
              price: itemPrice,
            };
            return { cart: updated };
          }
          return {
            cart: [
              ...state.cart,
              {
                product,
                quantity,
                selectedSize,
                selectedFinish: selectedFinish || "",
                price: itemPrice,
              },
            ],
          };
        }),

      removeFromCart: (productId, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (!size || item.selectedSize === size)
              )
          ),
        })),

      updateQuantity: (productId, quantity, size) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter(
                  (item) =>
                    !(
                      item.product.id === productId &&
                      (!size || item.selectedSize === size)
                    )
                )
              : state.cart.map((item) =>
                  item.product.id === productId &&
                  (!size || item.selectedSize === size)
                    ? { ...item, quantity }
                    : item
                ),
        })),

      clearCart: () => set({ cart: [], appliedVoucher: null }),

      setAppliedVoucher: (voucher) => set({ appliedVoucher: voucher }),

      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),
    }),
    {
      name: "three-oqab-shop-storage",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        appliedVoucher: state.appliedVoucher,
      }),
    }
  )
);
