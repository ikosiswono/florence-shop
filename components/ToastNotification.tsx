"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";

export default function ToastNotification() {
  const { toast } = useShop();

  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce">
      <div className="p-3.5 rounded-xl bg-slate-950/95 border border-cyan-400 text-cyan-200 text-xs font-montserrat font-bold shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {toast}
      </div>
    </div>
  );
}
