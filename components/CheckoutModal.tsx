"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  User, 
  Smartphone, 
  Monitor, 
  Tag, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, formatRupiah } from "@/data/products";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    createOrder,
    showToast,
    currentUser,
    setIsAuthOpen,
    setAuthMode,
    setAuthMessage
  } = useShop();

  const [platform, setPlatform] = useState<"bedrock" | "java">("bedrock");
  const [username, setUsername] = useState(currentUser?.gamertag || "");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; label: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "dana" | "gopay">("qris");

  // Keep username synced with currentUser if available
  React.useEffect(() => {
    if (currentUser?.gamertag && !username) {
      setUsername(currentUser.gamertag);
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  // STRICT LOGIN GUARD
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-300/40 shadow-2xl text-center relative space-y-4">
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-amber-300 shadow-glow-gold">
            <User className="w-8 h-8" />
          </div>

          <h3 className="font-cinzel text-xl font-bold text-white text-shadow-gold">
            LOGIN DIPERLUKAN
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Untuk melakukan pembelian rank, Anda wajib masuk atau membuat akun terlebih dahulu menggunakan <strong>Gamertag Minecraft Bedrock</strong> Anda.
          </p>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthMessage("Silakan masuk dengan akun Gamertag Bedrock Anda untuk melanjutkan pesanan.");
                setIsAuthOpen(true);
              }}
              className="btn-fantasy-gold w-full py-3 rounded-xl text-xs font-bold tracking-wider"
            >
              MASUK KE AKUN SAYA
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthMessage("Daftarkan Gamertag Bedrock Anda untuk aktivasi rank instan.");
                setIsAuthOpen(true);
              }}
              className="btn-fantasy-cyan w-full py-3 rounded-xl text-xs font-bold tracking-wider"
            >
              DAFTAR AKUN BARU
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    setCouponError(null);
    const upper = couponCode.trim().toUpperCase();
    if (!upper) {
      setAppliedCoupon(null);
      return;
    }

    const found = (CONFIG.COUPONS as Record<string, { code: string; label: string; discountPercent?: number; discountAmount?: number }>)[upper];
    if (found) {
      let discountAmt = 0;
      if (found.discountPercent) {
        discountAmt = Math.round((cartSubtotal * found.discountPercent) / 100);
      } else if (found.discountAmount) {
        discountAmt = Math.min(cartSubtotal, found.discountAmount);
      }
      setAppliedCoupon({ code: found.code, label: found.label, discount: discountAmt });
      showToast(`✓ Kupon ${found.code} berhasil digunakan!`);
    } else {
      setAppliedCoupon(null);
      setCouponError("Kupon tidak valid atau telah kedaluwarsa.");
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast("⚠️ Harap masukkan Username Minecraft Anda!");
      return;
    }
    if (cart.length === 0) {
      showToast("⚠️ Keranjang belanja Anda kosong!");
      return;
    }

    createOrder(username.trim(), platform, paymentMethod, appliedCoupon?.code);
  };

  const avatarUrl = username.trim()
    ? `https://mc-heads.net/avatar/${encodeURIComponent(username.trim())}/48`
    : `https://mc-heads.net/avatar/Steve/48`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#051428] border border-cyan-400/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-400/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                Checkout Pesanan Rank
              </h3>
              <span className="text-[10px] text-slate-400">
                Lengkapi identitas akun untuk aktivasi otomatis
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-5">
          
          {/* Langkah 1: Platform & Username */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061B35]/70 border border-slate-800">
            <span className="text-[10px] font-montserrat font-bold text-amber-300 uppercase tracking-wider block mb-2">
              LANGKAH 1: INFORMASI AKUN MINECRAFT
            </span>

            {/* Platform Selector */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPlatform("bedrock")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-montserrat font-semibold transition-all ${
                  platform === "bedrock"
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-glow"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Bedrock Edition</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform("java")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-montserrat font-semibold transition-all ${
                  platform === "java"
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-glow"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Java Edition</span>
              </button>
            </div>

            {/* Username Input with Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-300/40 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-glow-gold">
                <Image
                  src={avatarUrl}
                  alt="Avatar Preview"
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username Minecraft (contoh: Steve)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-montserrat text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Akun Terhubung: {currentUser.gamertag}
                  </span>
                  {currentUser.phone && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      (WA: {currentUser.phone})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Langkah 2: Kupon Promo */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061B35]/70 border border-slate-800">
            <span className="text-[10px] font-montserrat font-bold text-amber-300 uppercase tracking-wider block mb-2">
              LANGKAH 2: KODE PROMO / KUPON DISKON
            </span>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="KODE KUPON (FLORENCE25, SULTAN)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs font-montserrat text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="btn-fantasy-outline px-4 py-2 rounded-xl text-xs"
              >
                Terapkan
              </button>
            </div>

            {appliedCoupon && (
              <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{appliedCoupon.label} (-{formatRupiah(appliedCoupon.discount)})</span>
              </div>
            )}
            {couponError && (
              <div className="mt-2 text-[11px] text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{couponError}</span>
              </div>
            )}
          </div>

          {/* Langkah 3: Metode Pembayaran (Sesuai Permintaan User: QRIS, DANA, GoPay) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061B35]/70 border border-slate-800">
            <span className="text-[10px] font-montserrat font-bold text-amber-300 uppercase tracking-wider block mb-2">
              LANGKAH 3: PILIH METODE PEMBAYARAN
            </span>

            <div className="space-y-2">
              {/* Option 1: QRIS */}
              <label
                onClick={() => setPaymentMethod("qris")}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "qris"
                    ? "bg-cyan-500/20 border-cyan-400 shadow-glow"
                    : "bg-slate-900/60 border-slate-700/80 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "qris"}
                    onChange={() => setPaymentMethod("qris")}
                    className="accent-cyan-400"
                  />
                  <div>
                    <strong className="block text-xs font-montserrat text-white">
                      QRIS (GoPay Merchant / Semua E-Wallet & Bank)
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      Scan instan via GoPay, DANA, OVO, ShopeePay, BCA, Mandiri, BRI
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-montserrat font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  INSTAN
                </span>
              </label>

              {/* Option 2: DANA */}
              <label
                onClick={() => setPaymentMethod("dana")}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "dana"
                    ? "bg-cyan-500/20 border-cyan-400 shadow-glow"
                    : "bg-slate-900/60 border-slate-700/80 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "dana"}
                    onChange={() => setPaymentMethod("dana")}
                    className="accent-cyan-400"
                  />
                  <div>
                    <strong className="block text-xs font-montserrat text-white">
                      DANA (Transfer Manual)
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      Kirim langsung ke nomor DANA: {CONFIG.PAYMENT_PHONE_DISPLAY} (a.n ETERNALSMP / Admin)
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-montserrat font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  {CONFIG.PAYMENT_PHONE_DISPLAY}
                </span>
              </label>

              {/* Option 3: GoPay */}
              <label
                onClick={() => setPaymentMethod("gopay")}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "gopay"
                    ? "bg-cyan-500/20 border-cyan-400 shadow-glow"
                    : "bg-slate-900/60 border-slate-700/80 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "gopay"}
                    onChange={() => setPaymentMethod("gopay")}
                    className="accent-cyan-400"
                  />
                  <div>
                    <strong className="block text-xs font-montserrat text-white">
                      GoPay (Transfer Manual)
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      Kirim langsung ke nomor GoPay: {CONFIG.PAYMENT_PHONE_DISPLAY} (a.n ETERNALSMP / Admin)
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-montserrat font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  {CONFIG.PAYMENT_PHONE_DISPLAY}
                </span>
              </label>
            </div>
          </div>

          {/* Order Summary & Submit Button */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-cyan-400/30">
            <div className="space-y-1.5 text-xs text-slate-300 mb-3">
              <div className="flex justify-between">
                <span>Subtotal Item ({cart.length}):</span>
                <span>{formatRupiah(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Kupon:</span>
                  <span>- {formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-sm">
                <span>Total Tagihan:</span>
                <span className="font-cinzel text-base text-amber-300 font-black">
                  {formatRupiah(finalTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-fantasy-gold w-full py-3.5 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <span>LANJUT KE PEMBAYARAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
