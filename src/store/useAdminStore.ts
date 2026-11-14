"use client";

import { create } from "zustand";
import {
  DatabaseSchema,
  getInitialDatabaseSeed,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
} from "@/data/initialStoreSeed";

interface AdminStoreState extends DatabaseSchema {
  isHydrated: boolean;
  isSaving: boolean;
  isAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  hydrateFromServer: (force?: boolean) => Promise<void>;
  saveStoreSlice: (partial: Partial<DatabaseSchema>) => Promise<void>;
  createOrderOnServer: (payload: Record<string, unknown>) => Promise<OrderRecord | null>;
  updateOrderOnServer: (payload: {
    id: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    adminNotes?: string;
    statusNote?: string;
  }) => Promise<OrderRecord | null>;
  submitContactOnServer: (payload: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) => Promise<boolean>;
  updateMessageOnServer: (payload: {
    id: string;
    status?: "UNREAD" | "READ" | "REPLIED";
    action?: "delete";
  }) => Promise<void>;
  subscribeNewsletterOnServer: (email: string, source: string) => Promise<boolean>;
  updateSubscriberOnServer: (payload: {
    id: string;
    isActive?: boolean;
    action?: "delete";
  }) => Promise<void>;
}

const initialSeed = getInitialDatabaseSeed();

function broadcastStoreSync(data: DatabaseSchema) {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel("3auqab_realtime_sync");
      channel.postMessage(data);
      channel.close();
    } catch {
      // Ignore BroadcastChannel errors
    }
  }
}

export const useAdminStore = create<AdminStoreState>()((set, get) => ({
  ...initialSeed,
  isHydrated: false,
  isSaving: false,
  isAuthenticated: false,

  loginAdmin: (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "auqab@owner.com" && password === "3Auqab1122@@") {
      if (typeof window !== "undefined") {
        localStorage.setItem("3auqab_admin_session", "authenticated");
      }
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logoutAdmin: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("3auqab_admin_session");
    }
    set({ isAuthenticated: false });
  },

  hydrateFromServer: async (force = false) => {
    if (!force && get().isHydrated) return;
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("3auqab_admin_session");
      if (savedAuth === "authenticated") {
        set({ isAuthenticated: true });
      }
    }
    try {
      const res = await fetch("/api/store", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as DatabaseSchema;
      set({
        ...initialSeed,
        ...data,
        vouchers: data.vouchers || initialSeed.vouchers,
        promoBanners: data.promoBanners || initialSeed.promoBanners,
        isHydrated: true,
      });
    } catch (err) {
      console.error("Failed to hydrate store from server:", err);
    }
  },

  saveStoreSlice: async (partial) => {
    set((state) => ({ ...state, ...partial, isSaving: true }));
    try {
      const res = await fetch("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (res.ok) {
        const data = (await res.json()) as DatabaseSchema;
        set({ ...data, isSaving: false });
        broadcastStoreSync(data);
      } else {
        set({ isSaving: false });
      }
    } catch (err) {
      console.error("Failed to save store slice:", err);
      set({ isSaving: false });
    }
  },

  createOrderOnServer: async (payload) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const { order, db } = (await res.json()) as {
        order: OrderRecord;
        db: DatabaseSchema;
      };
      set({ ...db });
      broadcastStoreSync(db);
      return order;
    } catch (err) {
      console.error("Failed to create order:", err);
      return null;
    }
  },

  updateOrderOnServer: async (payload) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const { order, db } = (await res.json()) as {
        order: OrderRecord;
        db: DatabaseSchema;
      };
      set({ ...db });
      broadcastStoreSync(db);
      return order;
    } catch (err) {
      console.error("Failed to update order:", err);
      return null;
    }
  },

  submitContactOnServer: async (payload) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return false;
      const { db } = (await res.json()) as { db: DatabaseSchema };
      set({ ...db });
      broadcastStoreSync(db);
      return true;
    } catch (err) {
      console.error("Failed to submit contact:", err);
      return false;
    }
  },

  updateMessageOnServer: async (payload) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      const { db } = (await res.json()) as { db: DatabaseSchema };
      set({ ...db });
      broadcastStoreSync(db);
    } catch (err) {
      console.error("Failed to update message:", err);
    }
  },

  subscribeNewsletterOnServer: async (email, source) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) return false;
      const { db } = (await res.json()) as { db: DatabaseSchema };
      set({ ...db });
      broadcastStoreSync(db);
      return true;
    } catch (err) {
      console.error("Failed to subscribe newsletter:", err);
      return false;
    }
  },

  updateSubscriberOnServer: async (payload) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      const { db } = (await res.json()) as { db: DatabaseSchema };
      set({ ...db });
      broadcastStoreSync(db);
    } catch (err) {
      console.error("Failed to update subscriber:", err);
    }
  },
}));
