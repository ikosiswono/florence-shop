"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  MessageCircle, 
  Clock, 
  QrCode, 
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  FileImage,
  AlertCircle,
  Eye,
  Send
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, formatRupiah } from "@/data/products";

export default function PaymentModal() {
  const {
    isPaymentOpen,
    setIsPaymentOpen,
    activeOrder,
    submitOrderProof,
    showToast,
  } = useShop();

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Proof screenshot upload state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPaymentOpen) {
      setTimeLeft(15 * 60);
      setProofFile(null);
      setProofPreview(null);
      setUploadError(null);
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

  // Handle Screenshot Upload File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Harap pilih file gambar (JPG, PNG, atau WEBP).");
      return;
    }

    // Limit 8MB
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 8 MB.");
      return;
    }

    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProofPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProof = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit payment order with screenshot
  const handleSubmitProof = async () => {
    if (!proofPreview) {
      setUploadError("⚠️ Wajib melampirkan screenshot bukti transfer/pembayaran Anda.");
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const res = await submitOrderProof(activeOrder.invoiceId, proofPreview);
      if (!res.success) {
        setUploadError(res.message);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Gagal mengunggah bukti pembayaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQris = activeOrder.paymentMethod === "qris";
  const ewalletMethodName = activeOrder.paymentMethod === "dana" ? "DANA" : "GoPay";

  const waConfirmText = encodeURIComponent(
    `Halo Admin Florence Network, saya telah melakukan transfer/pembayaran via ${isQris ? "QRIS" : ewalletMethodName}:\n` +
    `- Invoice: ${activeOrder.invoiceId}\n` +
    `- Akun Minecraft: ${activeOrder.username} (${activeOrder.platform.toUpperCase()})\n` +
    `- Total Tagihan: ${formatRupiah(activeOrder.total)}\n` +
    `Saya sudah melampirkan bukti transfer di website toko. Mohon dicek dan di-ACC rank-nya. Terima kasih!`
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
                Pindai barcode / transfer lalu lampirkan bukti screenshot di bawah
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
            <div className="mb-2">
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
            <div className="relative inline-block p-2 rounded-xl bg-white shadow-2xl max-w-[200px] sm:max-w-[220px] mx-auto mb-3">
              <Image
                src={CONFIG.QRIS_IMAGE_URL}
                alt="QRIS Standee ETERNALSMP"
                width={220}
                height={290}
                className="object-contain rounded-lg"
                unoptimized
              />
            </div>

            {/* Actions for QRIS */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={downloadQris}
                className="btn-fantasy-cyan py-2 px-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan QRIS</span>
              </button>

              <button
                type="button"
                onClick={copyInvoice}
                className="btn-fantasy-outline py-2 px-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Invoice</span>
              </button>
            </div>
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
          </div>
        )}

        {/* =========================================================================
            AREA LAMPIRAN BUKTI SCREENSHOT PEMBAYARAN (WAJIB UPLOAD DI SINI)
            ========================================================================= */}
        <div className="p-4 rounded-2xl bg-[#091f3a]/90 border border-amber-400/40 mb-4 font-sans">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <FileImage className="w-4 h-4 text-amber-400" />
                <span>Lampirkan Bukti Screenshot Pembayaran <span className="text-rose-400">*</span></span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Wajib unggah tangkapan layar (screenshot) bukti transfer berhasil dari aplikasi e-wallet / mobile banking Anda.
              </p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="paymentProofInput"
          />

          {/* Upload Area / Preview */}
          {!proofPreview ? (
            <label
              htmlFor="paymentProofInput"
              className="border-2 border-dashed border-amber-400/40 hover:border-amber-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/60 hover:bg-slate-900/80 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Klik untuk Memilih File Screenshot Bukti
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Format gambar JPG, PNG, atau WEBP (Maksimal 8 MB)
                </span>
              </div>
            </label>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-400/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-emerald-400/60 bg-black shrink-0 relative">
                  <Image
                    src={proofPreview}
                    alt="Preview Bukti Transfer"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Screenshot Terlampir</span>
                  </div>
                  <span className="text-[11px] text-slate-300 block truncate">
                    {proofFile?.name || "bukti_transfer.jpg"}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {proofFile ? `${(proofFile.size / 1024).toFixed(0)} KB` : "Siap dikirim"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleRemoveProof}
                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                  title="Hapus gambar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="mt-2 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* =========================================================================
            TOMBOL KIRIM UTAMA (DI BAWAH LAMPIRAN BUKTI SCREENSHOT)
            ========================================================================= */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleSubmitProof}
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
              proofPreview 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black shadow-glow" 
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmitting
                ? "MENGUNGGAH BUKTI PEMBAYARAN..."
                : proofPreview 
                ? "KIRIM BUKTI PEMBAYARAN & SELESAIKAN PESANAN"
                : "PILIH BUKTI SCREENSHOT DI ATAS DAHULU"}
            </span>
          </button>

          {/* Backup WA Button */}
          <a
            href={`https://wa.me/${CONFIG.ADMIN_WA}?text=${waConfirmText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-emerald-300 hover:bg-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kirim Notifikasi via WhatsApp Admin ({CONFIG.ADMIN_WA_DISPLAY})</span>
          </a>
        </div>

      </div>
    </div>
  );
}
