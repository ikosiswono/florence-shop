"use client";

import React from "react";
import Image from "next/image";
import { 
  ChevronUp, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  Receipt
} from "lucide-react";
import { CONFIG } from "@/data/products";
import { useShop } from "@/context/ShopContext";

export default function Footer() {
  const { setIsInvoiceTrackerOpen } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-20 pb-16 overflow-hidden border-t border-cyan-500/20 bg-[#020914]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <a href="#hero" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(40,216,232,0.4)]">
                <Image
                  src="/assets/logo/florence-network-logo.png"
                  alt="Florence Network Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-xl font-black tracking-wider text-gold-gradient">
                  FLORENCE<span className="text-cyan-300">NETWORK</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-cyan-200 uppercase font-montserrat font-semibold">
                  Minecraft Bedrock Server
                </span>
              </div>
            </a>

            <p className="text-slate-400 text-xs font-sans font-light leading-relaxed max-w-sm mb-4">
              Toko digital dan top-up rank resmi server Minecraft Florence Network. Pengiriman otomatis dan manual langsung dari admin resmi bergaransi 100% aman.
            </p>

            <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm">
              Kami tidak berafiliasi secara resmi dengan Mojang AB atau Microsoft. Seluruh hak cipta Minecraft adalah milik Mojang AB.
            </p>
          </div>

          {/* Navigasi Cepat (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
              NAVIGASI STORE
            </h4>
            <ul className="space-y-2 text-xs font-montserrat text-slate-300">
              <li><a href="#hero" className="hover:text-cyan-300 transition-colors">Beranda</a></li>
              <li><a href="#katalog" className="hover:text-cyan-300 transition-colors">Katalog 12 Rank</a></li>
              <li><a href="#keunggulan" className="hover:text-cyan-300 transition-colors">Keunggulan Server</a></li>
              <li><a href="#komunitas" className="hover:text-cyan-300 transition-colors">Panduan Bedrock</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsInvoiceTrackerOpen(true)}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 text-amber-400"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Lacak Invoice Anda</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Layanan & Bantuan (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
                BANTUAN & KONFIRMASI WA
              </h4>
              <p className="text-slate-400 text-xs font-sans mb-3">
                Butuh konfirmasi transfer atau pembayaran via DANA/GoPay/QRIS? Chat admin langsung:
              </p>
            </div>

            <a
              href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fantasy-gold py-3 px-4 rounded-xl text-xs tracking-wider text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>WHATSAPP: {CONFIG.ADMIN_WA_DISPLAY}</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back To Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-slate-500">
          <div>
            <p>&copy; 2026 Florence Network. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4">
            <span>Server IP: <code className="text-cyan-400">{CONFIG.SERVER_IP}</code></span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="Kembali ke Atas"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
