"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  X, 
  User, 
  Crown, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  Receipt, 
  Edit3, 
  LogOut, 
  ShoppingBag, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Save, 
  Copy, 
  Check,
  Server,
  Lock,
  Sparkles
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, formatRupiah } from "@/data/products";
import { Order } from "@/types/shop";

export default function UserDashboard() {
  const { 
    currentUser, 
    isDashboardOpen, 
    setIsDashboardOpen, 
    logoutUser, 
    getUserOrders, 
    updateUserProfile,
    setSelectedInvoice,
    setIsInvoicePrintOpen,
    setIsCartOpen,
    showToast
  } = useShop();

  const [activeTab, setActiveTab] = useState<"history" | "profile" | "server">("history");
  
  // Profile edit states
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || "");
  const [bioInput, setBioInput] = useState(currentUser?.bio || "");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedIP, setCopiedIP] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setPhoneInput(currentUser.phone || "");
      setBioInput(currentUser.bio || "");
    }
  }, [currentUser]);

  if (!isDashboardOpen || !currentUser) return null;

  const orders = getUserOrders();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData: any = {
        phone: phoneInput.trim(),
        bio: bioInput.trim()
      };
      if (newPassword.trim()) {
        updateData.password = newPassword.trim();
      }
      await updateUserProfile(updateData);
      setNewPassword("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedInvoice(order);
    setIsInvoicePrintOpen(true);
  };

  const copyServerIP = () => {
    navigator.clipboard.writeText(`${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}`);
    setCopiedIP(true);
    showToast(`✓ IP Server (${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}) berhasil disalin!`);
    setTimeout(() => setCopiedIP(false), 2500);
  };

  const joinedFormatted = new Date(currentUser.joinedAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="glass-panel-gold rounded-3xl max-w-4xl w-full border border-amber-300/40 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col relative">
        
        {/* Header Profile Bar */}
        <div className="p-5 sm:p-7 bg-gradient-to-r from-[#041022] via-[#061B35] to-[#041022] border-b border-white/10 relative shrink-0">
          
          <button
            type="button"
            onClick={() => setIsDashboardOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-amber-400 transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            
            {/* Minecraft Head Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950/90 border-2 border-amber-300 shadow-glow-gold overflow-hidden p-1 flex items-center justify-center">
                <Image
                  src={currentUser.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(currentUser.gamertag)}/100`}
                  alt={currentUser.gamertag}
                  width={80}
                  height={80}
                  className="object-contain image-rendering-pixelated"
                  unoptimized
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-montserrat font-extrabold text-[9px] border-2 border-slate-950 shadow-md">
                ONLINE
              </span>
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white text-shadow-gold">
                  {currentUser.gamertag}
                </h2>
                
                {/* Active Rank Badge */}
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-montserrat font-extrabold text-[10px] tracking-wider uppercase shadow-glow-gold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>{currentUser.rank || "Member"}</span>
                </span>

                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-montserrat font-semibold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Bedrock Player</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 italic mb-3 font-sans line-clamp-2 max-w-xl">
                &ldquo;{currentUser.bio || "Petualang aktif Florence Network."}&rdquo;
              </p>

              {/* Meta Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gabung: <strong className="text-white">{joinedFormatted}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total Transaksi: <strong className="text-amber-300 font-mono">{orders.length}</strong></span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WA: <strong className="text-white font-mono">{currentUser.phone}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="sm:self-start">
              <button
                type="button"
                onClick={logoutUser}
                className="py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-slate-950/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 px-4 text-xs font-montserrat font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "history"
                ? "bg-amber-400/20 text-amber-300 border-b-2 border-amber-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>RIWAYAT PEMBELIAN & KWITANSI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-4 text-xs font-montserrat font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "profile"
                ? "bg-amber-400/20 text-amber-300 border-b-2 border-amber-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>PERBARUI PROFIL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("server")}
            className={`flex-1 py-3 px-4 text-xs font-montserrat font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "server"
                ? "bg-amber-400/20 text-amber-300 border-b-2 border-amber-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>INFORMASI SERVER</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* TAB 1: HISTORY & INVOICES */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white">
                    Daftar Transaksi Rank Anda
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kwitansi resmi diterbitkan otomatis dan dapat Anda cetak atau simpan kapan saja.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-[#061B35]/50 border border-slate-800">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-cinzel text-base font-bold text-white mb-1">
                    Belum Ada Riwayat Pembelian
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Akun Anda belum memiliki transaksi rank. Silakan pilih rank impian Anda dari katalog sekarang!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDashboardOpen(false);
                      const el = document.getElementById("katalog");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="btn-fantasy-gold py-2.5 px-6 rounded-xl text-xs font-bold tracking-wider inline-flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>JELAJAHI KATALOG RANK</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const isCompleted = order.status === "COMPLETED";
                    const orderTime = new Date(order.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    });

                    return (
                      <div
                        key={order.invoiceId}
                        className="p-4 rounded-2xl bg-[#061B35]/80 border border-cyan-400/20 hover:border-amber-300/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Item Icon */}
                          <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-cyan-400/30 flex items-center justify-center p-2 shrink-0">
                            {order.items[0]?.image ? (
                              <Image
                                src={order.items[0].image}
                                alt={order.items[0].name}
                                width={36}
                                height={36}
                                className="object-contain"
                                unoptimized
                              />
                            ) : (
                              <Crown className="w-5 h-5 text-amber-300" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-xs font-bold text-cyan-300">
                                {order.invoiceId}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-montserrat font-bold uppercase ${
                                isCompleted
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                  : "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                              }`}>
                                {isCompleted ? "LUNAS (AKTIF)" : "MENUNGGU VERIFIKASI"}
                              </span>
                            </div>

                            <h4 className="font-cinzel text-sm font-bold text-white">
                              {order.items.map((i) => i.name).join(", ")}
                            </h4>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <span>Waktu: {orderTime}</span>
                              <span>•</span>
                              <span>Metode: <strong className="text-white uppercase">{order.paymentMethod}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <strong className="font-cinzel text-base font-black text-amber-300">
                            {formatRupiah(order.total)}
                          </strong>

                          <button
                            type="button"
                            onClick={() => handleViewInvoice(order)}
                            className="btn-fantasy-gold py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Lihat Kwitansi</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPDATE PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="max-w-lg mx-auto space-y-4">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white mb-1">
                  Perbarui Informasi Profil
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Data ini digunakan oleh sistem dan admin untuk mengonfirmasi pengiriman rank in-game.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Gamertag Minecraft Bedrock (Permanen)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={currentUser.gamertag}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Gamertag terkait dengan identitas rank in-game Anda. Hubungi admin jika ingin ganti nama.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Nomor WhatsApp Aktif
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Bio / Catatan Profil In-Game
                </label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Ceritakan gaya bermain Minecraft Anda (PvP, Builder, Miner)..."
                  className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Ganti Password (Kosongkan jika tidak ingin diubah)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="btn-fantasy-gold w-full py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 mt-4"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "MENYIMPAN PERUBAHAN..." : "SIMPAN PERUBAHAN PROFIL"}</span>
              </button>
            </form>
          )}

          {/* TAB 3: SERVER INFO */}
          {activeTab === "server" && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white mb-1">
                  Koneksi & Info Server Florence Network
                </h3>
                <p className="text-xs text-slate-400">
                  Pastikan Anda memasukkan alamat server berikut di Minecraft Bedrock Edition Anda.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-panel-gold border border-amber-300/40 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-slate-300">Server Address (IP):</span>
                  <strong className="font-mono text-sm text-cyan-300">{CONFIG.SERVER_IP}</strong>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-slate-300">Bedrock Port:</span>
                  <strong className="font-mono text-sm text-amber-300">{CONFIG.BEDROCK_PORT}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Versi Minecraft:</span>
                  <span className="text-xs font-semibold text-emerald-400">1.26.62.1 (Bedrock Only)</span>
                </div>

                <button
                  type="button"
                  onClick={copyServerIP}
                  className="btn-fantasy-cyan w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2"
                >
                  {copiedIP ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                  <span>{copiedIP ? "IP TERSALIN!" : "SALIN ALAMAT SERVER & PORT"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/20 text-xs text-slate-300 space-y-2">
                <h4 className="font-cinzel font-bold text-amber-300">
                  Cara Memperoleh Rank In-Game:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Lakukan pembayaran melalui QRIS, DANA, atau GoPay.</li>
                  <li>Unduh kwitansi atau kirim bukti via tombol WhatsApp admin.</li>
                  <li>Admin Florence Network akan memproses verifikasi dalam 1x24 jam.</li>
                  <li>Setelah aktif, masuk ke server dan nikmati fitur perintah chat `+` dan item eksklusif rank Anda!</li>
                </ol>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
