"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuickViewModal from "@/components/product/QuickViewModal";
import { useAdminStore } from "@/store/useAdminStore";

export default function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hydrateFromServer = useAdminStore((s) => s.hydrateFromServer);

  useEffect(() => {
    hydrateFromServer();

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("3auqab_realtime_sync");
        channel.onmessage = (event) => {
          if (event.data && typeof event.data === "object") {
            useAdminStore.setState({ ...event.data, isHydrated: true });
          }
        };
      } catch {
        // Ignore BroadcastChannel errors
      }
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <QuickViewModal />
    </>
  );
}
