"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { CONFIG } from "@/data/products";

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network,%20saya%20butuh%20bantuan%20terkait%20store/topup`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_8px_25px_rgba(16,185,129,0.5)] hover:scale-110 transition-all items-center gap-2 group"
      title={`Chat WhatsApp Admin (${CONFIG.ADMIN_WA_DISPLAY})`}
      aria-label="WhatsApp Admin Support"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-montserrat font-bold pr-1">
        Bantuan WA: {CONFIG.ADMIN_WA_DISPLAY}
      </span>
    </a>
  );
}
