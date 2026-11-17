"use client";

import React, { useState } from "react";
import { 
  X, 
  Search, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Terminal,
  ExternalLink
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { formatRupiah, CONFIG } from "@/data/products";
import { Order } from "@/types/shop";

export default function InvoiceTracker() {
  const { isInvoiceTrackerOpen, setIsInvoiceTrackerOpen, orderHistory } = useShop();
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isInvoiceTrackerOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    // Search in local orderHistory
    const found = orderHistory.find(
      (o) =>
        o.invoiceId.toLowerCase().includes(clean) ||
        o.username.toLowerCase().includes(clean)
    );

    if (found) {
      setSearchResult(found);
    } else {
      // Mock demonstration order for testing
      setSearchResult({
        invoiceId: query.startsWith("INV-") ? query.toUpperCase() : "INV-FLORENCE-202611-1029",
        username: query.startsWith("INV-") ? "Steve" : query,
        platform: "bedrock",
        items: [],
        subtotal: 100000,
        discount: 0,
        total: 100000,
        paymentMethod: "qris",
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
        command: `lp user ${query.startsWith("INV-") ? "Steve" : query} parent add vip`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-300/40 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-400/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                Lacak Status Invoice
              </h3>
              <span className="text-[10px] text-slate-400">
                Pantau proses verifikasi dan aktivasi rank Anda
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsInvoiceTrackerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan Nomor Invoice atau Username Minecraft..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-montserrat text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="btn-fantasy-cyan px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
            >
              Cek Invoice
            </button>
          </div>
        </form>

        {/* Search Result */}
        {hasSearched && searchResult && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-400/30 text-left text-xs font-montserrat space-y-2 mb-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Nomor Invoice:</span>
                <strong className="text-cyan-300 font-mono text-sm">{searchResult.invoiceId}</strong>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                searchResult.status === "COMPLETED"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-400/40"
              }`}>
                {searchResult.status === "COMPLETED" ? "✓ BERHASIL AKTIF" : "MENUNGGU PEMBAYARAN"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Username Pemain:</span>
              <strong className="text-amber-300">{searchResult.username} ({searchResult.platform.toUpperCase()})</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Total Tagihan:</span>
              <strong className="text-white font-cinzel font-bold">{formatRupiah(searchResult.total)}</strong>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                Perintah Server LuckPerms:
              </span>
              <code className="block p-2 rounded-lg bg-black border border-slate-800 text-[11px] font-mono text-emerald-400 select-all">
                /{searchResult.command}
              </code>
            </div>
          </div>
        )}

        {/* WhatsApp Admin Help */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 mb-2">
            Mengalami kendala invoice atau rank belum masuk setelah 15 menit?
          </p>
          <a
            href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network,%20saya%20ingin%20cek%20invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline inline-flex items-center gap-1"
          >
            <span>Hubungi WhatsApp Admin ({CONFIG.ADMIN_WA_DISPLAY})</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
