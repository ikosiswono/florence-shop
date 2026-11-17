"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  MessageCircle, 
  Clock, 
  Terminal, 
  QrCode, 
  Smartphone,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, formatRupiah } from "@/data/products";

export default function PaymentModal() {
  const {
    isPaymentOpen,
    setIsPaymentOpen,
    activeOrder,
    completeOrder,
    showToast,
  } = useShop();

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  useEffect(() => {
    if (!isPaymentOpen) {
      setTimeLeft(15 * 60);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaymentOpen]);

  if (!isPaymentOpen || !activeOrder) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const copyInvoice = () => {
    navigator.clipboard.writeText(activeOrder.invoiceId);
    setCopiedInvoice(true);
    showToast(`✓ Nomor Invoice (${activeOrder.invoiceId}) berhasil disalin!`);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(CONFIG.PAYMENT_PHONE);
    setCopiedNumber(true);
    showToast(`✓ Nomor E-Wallet (${CONFIG.PAYMENT_PHONE}) berhasil disalin!`);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(activeOrder.total.toString());
    setCopiedAmount(true);
    showToast(`✓ Nominal (${activeOrder.total}) berhasil disalin!`);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const downloadQris = () => {
    const link = document.createElement("a");
    link.href = CONFIG.QRIS_IMAGE_URL;
    link.download = `QRIS-FLORENCE-${activeOrder.invoiceId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Gambar QRIS sedang diunduh ke HP/perangkat Anda!");
  };

  const isQris = activeOrder.paymentMethod === "qris";
  const ewalletMethodName = activeOrder.paymentMethod === "dana" ? "DANA" : "GoPay";

  const waConfirmText = encodeURIComponent(
    `Halo Admin Florence Network, saya melakukan pembayaran via ${isQris ? "QRIS" : ewalletMethodName}:\n` +
    `- Invoice: ${activeOrder.invoiceId}\n` +
    `- Akun Minecraft: ${activeOrder.username} (${activeOrder.platform.toUpperCase()})\n` +
    `- Total Tagihan: ${formatRupiah(activeOrder.total)}\n` +
    `Mohon dicek dan dikirimkan rank-nya ke server. Terima kasih!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#051428] border border-cyan-400/50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-cyan-400/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                Selesaikan Pembayaran
              </h3>
              <span className="text-[10px] text-slate-400">
                Pindai barcode atau transfer manual sesuai nominal
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaymentOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Meta Banner */}
        <div className="p-3.5 rounded-2xl bg-[#061B35]/80 border border-slate-800 space-y-1.5 text-xs font-montserrat mb-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Nomor Invoice:</span>
            <div className="flex items-center gap-2">
              <strong className="text-cyan-300 font-mono font-bold">{activeOrder.invoiceId}</strong>
              <button
                type="button"
                onClick={copyInvoice}
                className="text-slate-400 hover:text-white p-0.5"
                title="Salin Invoice"
              >
                {copiedInvoice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Username Pemain:</span>
            <strong className="text-amber-300">
              {activeOrder.username} ({activeOrder.platform.toUpperCase()})
            </strong>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-800">
            <span className="text-slate-400">Total Pembayaran:</span>
            <strong className="font-cinzel text-base font-black text-amber-300">
              {formatRupiah(activeOrder.total)}
            </strong>
          </div>
        </div>

        {/* 15 Minutes Countdown */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-montserrat mb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Sisa Waktu Pembayaran:</span>
          </span>
          <strong className="font-mono text-sm tracking-wider font-black text-amber-300">
            {timeFormatted}
          </strong>
        </div>

        {/* Payment Channel Content: QRIS vs Manual e-Wallet */}
        {isQris ? (
          /* QRIS Display Area */
          <div className="glass-panel rounded-2xl p-4 sm:p-5 text-center border border-cyan-400/30 mb-4">
            <div className="mb-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-montserrat font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase">
                GOPAY MERCHANT QRIS
              </span>
              <h4 className="font-cinzel text-base font-bold text-white mt-1">
                {CONFIG.QRIS_MERCHANT_NAME}
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                NMID: <strong className="text-cyan-300">{CONFIG.QRIS_NMID}</strong>
              </span>
            </div>

            {/* QRIS Code Standee Frame */}
            <div className="relative inline-block p-2 rounded-xl bg-white shadow-2xl max-w-[210px] sm:max-w-[240px] mx-auto mb-3">
              <Image
                src={CONFIG.QRIS_IMAGE_URL}
                alt="QRIS Standee ETERNALSMP"
                width={240}
                height={320}
                className="object-contain rounded-lg"
                unoptimized
              />
            </div>

            {/* Actions for QRIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={downloadQris}
                className="btn-fantasy-cyan py-2.5 px-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan QRIS ke HP</span>
              </button>

              <button
                type="button"
                onClick={copyInvoice}
                className="btn-fantasy-outline py-2.5 px-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Nomor Invoice</span>
              </button>
            </div>

            {/* WhatsApp Confirmation Link */}
            <a
              href={`https://wa.me/${CONFIG.ADMIN_WA}?text=${waConfirmText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 text-xs font-montserrat font-bold flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Konfirmasi via WA Admin ({CONFIG.ADMIN_WA_DISPLAY})</span>
            </a>
          </div>
        ) : (
          /* Manual e-Wallet (DANA & GoPay) Area */
          <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border border-amber-300/40 mb-4">
            <div className="text-center mb-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-montserrat font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase">
                TRANSFER MANUAL VIA {ewalletMethodName}
              </span>
              <h4 className="font-cinzel text-base font-bold text-white mt-1">
                Akun Resmi: ETERNALSMP / Admin
              </h4>
            </div>

            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-400/20 mb-3 text-xs font-montserrat">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nomor HP / Rekening:</span>
                  <strong className="text-base text-cyan-300 font-mono tracking-wide">
                    {CONFIG.PAYMENT_PHONE_DISPLAY}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={copyPhone}
                  className="btn-fantasy-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin No HP</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nominal Tepat:</span>
                  <strong className="text-base text-amber-300 font-cinzel font-black">
                    {formatRupiah(activeOrder.total)}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={copyAmount}
                  className="btn-fantasy-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Nominal</span>
                </button>
              </div>
            </div>

            {/* WA Button */}
            <a
              href={`https://wa.me/${CONFIG.ADMIN_WA}?text=${waConfirmText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 text-xs font-montserrat font-bold flex items-center justify-center gap-2 transition-all mb-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Kirim Bukti Transfer ke WA Admin ({CONFIG.ADMIN_WA_DISPLAY})</span>
            </a>
          </div>
        )}

        {/* Simulation Webhook Helper for Instant Testing */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <Terminal className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight">
              Ingin menguji respon instan tanpa scan? Tekan simulasi:
            </span>
          </div>

          <button
            type="button"
            onClick={completeOrder}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md transition-all shrink-0"
          >
            Simulasi Bayar Berhasil
          </button>
        </div>

      </div>
    </div>
  );
}
