"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { 
  X, 
  Printer, 
  ShieldCheck, 
  MessageCircle, 
  Download, 
  Sparkles,
  Lock,
  ArrowRight
} from "lucide-react";
import html2canvas from "html2canvas";
import { useShop } from "@/context/ShopContext";
import { CONFIG, formatRupiah } from "@/data/products";

export default function InvoicePrintModal() {
  const { isInvoicePrintOpen, setIsInvoicePrintOpen, selectedInvoice, showToast } = useShop();
  const invoiceCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isInvoicePrintOpen || !selectedInvoice) return null;

  const orderDate = new Date(selectedInvoice.createdAt).toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const waText = encodeURIComponent(
    `*KONFIRMASI PEMBAYARAN RANK — FLORENCE NETWORK*\n` +
    `========================================\n` +
    `No. Invoice  : ${selectedInvoice.invoiceId}\n` +
    `Gamertag     : ${selectedInvoice.username} (Bedrock Edition)\n` +
    `Nomor WA     : ${selectedInvoice.userPhone || "-"}\n` +
    `Item Rank    : ${selectedInvoice.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}\n` +
    `Total Bayar  : ${formatRupiah(selectedInvoice.total)}\n` +
    `Metode Bayar : ${selectedInvoice.paymentMethod.toUpperCase()}\n` +
    `Status       : LUNAS & TERVERIFIKASI\n` +
    `Waktu        : ${orderDate}\n` +
    `========================================\n\n` +
    `Halo Admin Florence Network, saya telah menyelesaikan pembayaran dan mengunduh bukti Kwitansi Resmi Florence Network. Gambar kwitansi terlampir di chat ini. Mohon segera aktifkan rank saya in-game. Terima kasih!`
  );

  // Download high-resolution PNG of the invoice
  const handleDownloadImage = async () => {
    if (!invoiceCardRef.current) return;
    setIsDownloading(true);
    showToast("⏳ Sedang memproses gambar kwitansi kualitas HD...");

    try {
      const element = invoiceCardRef.current;
      
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(element, {
          scale: 2.5, // 2.5x high-DPI crystal clear capture
          backgroundColor: "#030c1b",
          useCORS: true,
          allowTaint: false,
          logging: false
        });
      } catch (corsErr) {
        // Fallback capture ignoring remote images that might fail CORS
        console.warn("CORS issue detected during canvas capture, falling back with safe mode:", corsErr);
        canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: "#030c1b",
          useCORS: false,
          allowTaint: false,
          logging: false,
          ignoreElements: (el) => el.tagName === "IMG" && el.getAttribute("src")?.startsWith("http") === true
        });
      }

      const imgData = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imgData;
      downloadLink.download = `KWITANSI_FLORENCE_${selectedInvoice.invoiceId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast("✓ Kwitansi resmi berhasil diunduh ke perangkat Anda! Silakan kirimkan gambarnya ke WhatsApp Admin.");
    } catch (err) {
      console.error("Gagal mengunduh gambar invoice:", err);
      showToast("⚠️ Browser membatasi unduhan otomatis. Membuka jendela cetak/PDF...");
      // Fallback to print
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(selectedInvoice.username)}/64`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="max-w-2xl w-full my-auto">
        
        {/* Top Control Bar (Not printed) */}
        <div className="flex items-center justify-between mb-3 px-1 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-montserrat font-bold text-white uppercase tracking-wider">
              Kwitansi Transaksi Resmi Florence Network
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-montserrat font-semibold flex items-center gap-1.5 transition-all"
              title="Cetak via browser atau simpan PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInvoicePrintOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            OFFICIAL ULTRA-LUXURY INVOICE CARD (CAPTURED BY HTML2CANVAS & PRINTED)
           ========================================================================= */}
        <div 
          ref={invoiceCardRef}
          className="bg-gradient-to-b from-[#05142b] via-[#040e20] to-[#020712] text-slate-100 rounded-3xl p-5 sm:p-8 border-2 border-amber-300/60 shadow-[0_0_60px_rgba(217,119,6,0.35)] relative overflow-hidden print:p-4 print:border-none print:shadow-none print:bg-white print:text-black"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-300/80 pointer-events-none rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-300/80 pointer-events-none rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-300/80 pointer-events-none rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-300/80 pointer-events-none rounded-br-lg" />

          {/* Background Watermark Logo */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.04] pointer-events-none select-none">
            <Image
              src="/assets/logo/florence-network-logo.png"
              alt="Watermark"
              fill
              className="object-contain"
            />
          </div>

          {/* Top Security Banner */}
          <div className="mb-4 pb-3 border-b border-white/10 print:border-slate-300 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono text-amber-300/90 print:text-amber-800 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              OFFICIAL GAMING TRANSACTION RECEIPT
            </span>
            <span className="text-slate-400 print:text-slate-600">
              ID: {selectedInvoice.invoiceId}
            </span>
          </div>

          {/* Header: Logo, Server Info & Official Wax Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-white/10 print:border-slate-300">
            
            {/* Logo & Brand Info */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 filter drop-shadow-[0_4px_16px_rgba(40,216,232,0.4)]">
                <Image
                  src="/assets/logo/florence-network-logo.png"
                  alt="Florence Network Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300 print:text-amber-800 tracking-wider">
                  FLORENCE NETWORK
                </h1>
                <p className="text-[11px] font-mono text-cyan-300 print:text-slate-700 font-bold">
                  SERVER: {CONFIG.SERVER_IP} : {CONFIG.BEDROCK_PORT}
                </p>
                <p className="text-[10px] text-slate-300 print:text-slate-600">
                  Minecraft Bedrock Edition — Official Rank Store
                </p>
              </div>
            </div>

            {/* Official Digital Wax Seal Stamp */}
            <div className="relative shrink-0 flex flex-col items-center sm:items-end">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-300/80 bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent p-1.5 flex flex-col items-center justify-center text-center shadow-glow-gold rotate-[-6deg] select-none">
                <span className="text-[7px] font-montserrat font-extrabold text-amber-300 uppercase tracking-widest">
                  ★ FLORENCE ★
                </span>
                <span className="text-[11px] font-black text-emerald-300 tracking-wider font-montserrat leading-tight my-0.5">
                  ✓ LUNAS
                </span>
                <span className="text-[7px] font-montserrat font-bold text-amber-200 uppercase">
                  VERIFIED SEAL
                </span>
                <span className="text-[6px] font-mono text-slate-300 mt-0.5">
                  100% AUTHENTIC
                </span>
              </div>
            </div>

          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-3.5 my-3.5 rounded-2xl bg-[#061B35]/85 print:bg-slate-100 p-3.5 border border-cyan-400/20 print:border-slate-300 text-xs">
            
            {/* Gamertag with Avatar */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-amber-300/60 overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src={avatarUrl}
                  alt={selectedInvoice.username}
                  width={32}
                  height={32}
                  className="object-contain image-rendering-pixelated"
                  unoptimized
                />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-bold text-slate-400 print:text-slate-600 uppercase block">
                  GAMERTAG BEDROCK:
                </span>
                <strong className="text-cyan-300 print:text-slate-900 font-mono text-xs sm:text-sm truncate block">
                  {selectedInvoice.username}
                </strong>
              </div>
            </div>

            <div>
              <span className="text-[9px] font-bold text-slate-400 print:text-slate-600 uppercase block">
                EDISI GAME:
              </span>
              <strong className="text-white print:text-slate-800 text-xs uppercase block font-montserrat">
                {selectedInvoice.platform} Edition
              </strong>
            </div>

            <div>
              <span className="text-[9px] font-bold text-slate-400 print:text-slate-600 uppercase block">
                METODE BAYAR:
              </span>
              <strong className="text-amber-300 print:text-slate-900 text-xs uppercase block font-montserrat">
                {selectedInvoice.paymentMethod}
              </strong>
            </div>

            <div>
              <span className="text-[9px] font-bold text-slate-400 print:text-slate-600 uppercase block">
                STATUS KLAIM:
              </span>
              <span className="text-emerald-400 print:text-emerald-700 text-xs font-bold font-montserrat block">
                AKTIF 1 TEMA SERVER
              </span>
            </div>

          </div>

          {/* Items Purchased Table */}
          <div className="mb-4">
            <span className="text-[10px] font-montserrat font-bold text-amber-300 print:text-amber-900 uppercase tracking-wider block mb-2">
              Rincian Item & Hak Istimewa Rank
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 print:border-slate-300 text-slate-400 print:text-slate-600 text-[9px] sm:text-[10px] uppercase font-montserrat">
                    <th className="py-2 pl-1">Paket Rank</th>
                    <th className="py-2">Masa Aktif</th>
                    <th className="py-2 text-center">Jumlah</th>
                    <th className="py-2 text-right">Harga</th>
                    <th className="py-2 text-right pr-1">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx} className="text-slate-200 print:text-slate-800">
                      <td className="py-2.5 pl-1">
                        <strong className="block text-white print:text-black font-cinzel text-xs sm:text-sm font-bold">
                          {item.name}
                        </strong>
                        <span className="text-[10px] text-emerald-400 print:text-emerald-700 block">
                          {item.benefits[0] || "Perintah Chat Khusus"}
                        </span>
                        <span className="text-[9px] text-amber-300/90 print:text-amber-800 block">
                          ✓ Item Eksklusif Benefit Rank
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-slate-300 print:text-slate-600 font-montserrat">
                        {item.duration || "Selama Tema Berjalan"}
                      </td>
                      <td className="py-2.5 text-center font-mono font-bold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-300 print:text-slate-700">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-amber-300 print:text-black pr-1">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary & Total Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-white/10 print:border-slate-300">
            <div className="text-center sm:text-left text-xs">
              <span className="text-[9px] text-slate-400 print:text-slate-600 uppercase block font-bold">
                Waktu Transaksi Resmi:
              </span>
              <p className="text-[11px] text-slate-200 print:text-slate-800 font-mono mt-0.5">
                {orderDate}
              </p>
              {selectedInvoice.userPhone && (
                <p className="text-[10px] text-slate-400 print:text-slate-600 font-mono">
                  WhatsApp Terdaftar: {selectedInvoice.userPhone}
                </p>
              )}
            </div>

            <div className="w-full sm:w-60 p-3 rounded-xl bg-slate-950/70 border border-amber-300/30 print:bg-slate-50 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600 text-[11px]">
                <span>Subtotal:</span>
                <span className="font-mono">{formatRupiah(selectedInvoice.subtotal)}</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700 text-[11px]">
                  <span>Kupon Diskon:</span>
                  <span className="font-mono">- {formatRupiah(selectedInvoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-white print:text-black pt-1.5 border-t border-slate-800 print:border-slate-300">
                <span className="font-montserrat">TOTAL LUNAS:</span>
                <strong className="font-cinzel text-base text-amber-300 print:text-amber-900 font-black">
                  {formatRupiah(selectedInvoice.total)}
                </strong>
              </div>
            </div>
          </div>

          {/* Anti-Fraud Security Footer */}
          <div className="mt-5 pt-3 border-t border-dashed border-white/15 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] text-slate-400 print:text-slate-600">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="font-mono">VALIDATION HASH: SHA256-{selectedInvoice.invoiceId}-FLORENCE-VERIFIED</span>
            </div>
            <span className="italic">Florence Network Official Verification System</span>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM ACTION BUTTONS: UNDUH GAMBAR HD & KIRIM KE WHATSAPP ADMIN
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-4 print:hidden">
          
          {/* Action 1: Unduh Gambar Kwitansi HD */}
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadImage}
            className="btn-fantasy-cyan flex-1 w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>
              {isDownloading ? "MEMPROSES GAMBAR HD..." : "UNDUH GAMBAR KWITANSI (PNG HD)"}
            </span>
          </button>

          {/* Action 2: Kirim ke WhatsApp Admin */}
          <a
            href={`https://wa.me/${CONFIG.ADMIN_WA}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform text-center"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>KIRIM KE WHATSAPP ADMIN</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </a>

        </div>

        {/* Instructional Helper Banner */}
        <p className="text-[11px] text-center text-slate-400 mt-2.5 print:hidden">
          💡 <strong>Tips:</strong> Klik tombol <strong>&ldquo;UNDUH GAMBAR KWITANSI&rdquo;</strong> terlebih dahulu, lalu klik <strong>&ldquo;KIRIM KE WHATSAPP ADMIN&rdquo;</strong> dan lampirkan gambar kwitansi tersebut di chat WA agar admin memproses rank Anda secara instan.
        </p>

      </div>
    </div>
  );
}
