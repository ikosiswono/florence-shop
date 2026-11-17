"use client";

import React, { useState } from "react";
import { 
  Check, 
  Copy, 
  MessageCircle, 
  ThumbsUp, 
  ShieldCheck, 
  Terminal,
  Sparkles,
  Receipt
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, formatRupiah } from "@/data/products";

export default function SuccessModal() {
  const { 
    isSuccessOpen, 
    setIsSuccessOpen, 
    activeOrder, 
    showToast,
    setSelectedInvoice,
    setIsInvoicePrintOpen
  } = useShop();
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isSuccessOpen || !activeOrder) return null;

  const copyCommand = () => {
    navigator.clipboard.writeText(activeOrder.command);
    setCopiedCmd(true);
    showToast("✓ Perintah LuckPerms berhasil disalin!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const waText = encodeURIComponent(
    `Halo Admin Florence Network, pembayaran saya untuk invoice ${activeOrder.invoiceId} (${formatRupiah(activeOrder.total)}) telah berhasil. Akun: ${activeOrder.username} (${activeOrder.platform.toUpperCase()}). Mohon bantuannya jika rank belum aktif. Terima kasih!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-300/40 text-center shadow-2xl relative">
        
        {/* Animated Checkmark Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <span className="text-[10px] font-montserrat font-bold tracking-widest text-emerald-400 uppercase block mb-1">
          TRANSAKSI SUKSES DIVERIFIKASI
        </span>

        <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white mb-2">
          Pembayaran Berhasil!
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed mb-6">
          Pesanan rank Anda sedang dikirimkan ke server <strong className="text-cyan-300">Florence Network</strong>. Silakan masuk ke dalam game untuk menikmati hak istimewa baru Anda!
        </p>

        {/* Order Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-400/30 text-left text-xs font-montserrat space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400">Nomor Invoice:</span>
            <strong className="text-cyan-300 font-mono">{activeOrder.invoiceId}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Username Pemain:</span>
            <strong className="text-amber-300">{activeOrder.username} ({activeOrder.platform.toUpperCase()})</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Dibayar:</span>
            <strong className="text-white font-cinzel font-bold">{formatRupiah(activeOrder.total)}</strong>
          </div>

          {/* Generated LuckPerms Command */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" /> Perintah Server (Console):
              </span>
              <button
                type="button"
                onClick={copyCommand}
                className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1"
              >
                {copiedCmd ? "Tersalin!" : "Salin Perintah"}
              </button>
            </div>
            <code className="block p-2 rounded-lg bg-black border border-slate-800 text-[11px] font-mono text-emerald-400 break-all select-all">
              /{activeOrder.command}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              setSelectedInvoice(activeOrder);
              setIsSuccessOpen(false);
              setIsInvoicePrintOpen(true);
            }}
            className="btn-fantasy-cyan w-full py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4 text-slate-950" />
            <span>LIHAT & CETAK KWITANSI RESMI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSuccessOpen(false)}
            className="btn-fantasy-gold w-full py-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>SELESAI & KEMBALI KE STORE</span>
          </button>

          <a
            href={`https://wa.me/${CONFIG.ADMIN_WA}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-montserrat font-bold flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Hubungi WA Admin ({CONFIG.ADMIN_WA_DISPLAY})</span>
          </a>
        </div>

      </div>
    </div>
  );
}
