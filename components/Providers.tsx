"use client";

import React from "react";
import { ShopProvider } from "@/context/ShopContext";
import ToastNotification from "@/components/ToastNotification";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      {children}
      <ToastNotification />
    </ShopProvider>
  );
}
