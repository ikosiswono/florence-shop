"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Copy, 
  Check, 
  Users, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ShoppingBag,
  Receipt,
  MessageCircle
} from "lucide-react";
import { CONFIG } from "@/data/products";
import { useShop } from "@/context/ShopContext";

export default function HeroSection() {
  const { setIsInvoiceTrackerOpen, showToast } = useShop();
  const [copiedIP, setCopiedIP] = useState(false);

  const copyServerIP = () => {
    navigator.clipboard.writeText(`${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}`);
    setCopiedIP(true);
    showToast(`✓ IP Server (${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}) berhasil disalin!`);
    setTimeout(() => setCopiedIP(false), 2500);
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-14">
      {/* Background 1 — Heavenly Paradise */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/background-01-heavenly-paradise.webp"
          alt="Heavenly Paradise Hero Background"
          fill
          priority
          className="object-cover object-center scale-105 animate-pulse-glow"
          quality={95}
        />
        {/* Soft atmospheric gradient overlays preserving central artwork */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041022] via-transparent to-[#041022]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041022]/40 via-transparent to-[#041022]/40" />
        {/* Celestial halos behind logo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-400/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-400/15 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Live Server Announcement Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#061B35]/80 border border-amber-300/40 shadow-glow-gold backdrop-blur-md mb-4 animate-float-slow">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-montserrat font-bold tracking-wider text-amber-200 uppercase">
            MINECRAFT BEDROCK SERVER 1.26.62.1 — ONLINE
          </span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-[11px] text-cyan-300 font-medium">
            PORT: {CONFIG.BEDROCK_PORT}
          </span>
        </div>

        {/* Official FlorenceSMP / Florence Network Crystal Logo */}
        <div className="relative w-72 sm:w-[420px] md:w-[540px] h-32 sm:h-44 md:h-56 mb-2 select-none filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.85)] hover:scale-[1.02] transition-transform duration-500">
          <Image
            src="/assets/logo/florence-network-logo.png"
            alt="Florence Network Official Minecraft Server Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Store Title & Description */}
        <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.18em] text-cyan-gradient text-shadow-cyan uppercase mb-2">
          OFFICIAL DIGITAL STORE & RANK TOP-UP
        </h1>

        <p className="max-w-2xl text-xs sm:text-sm md:text-base text-slate-200/90 font-sans font-light leading-relaxed mb-6 text-shadow-dark px-2">
          Upgrade akun Minecraft Anda sekarang! Dapatkan akses fitur perintah khusus, bonus saldo uang in-game, dan perlengkapan kit eksklusif dengan pengiriman kilat langsung dari admin.
        </p>

        {/* Server IP Copy Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl glass-panel-gold border border-amber-300/40 max-w-md w-full mb-8 shadow-xl">
          <div className="flex items-center gap-3 text-left pl-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] text-slate-400 font-montserrat uppercase tracking-wider block">
                SERVER ADDRESS (BEDROCK)
              </span>
              <strong className="text-xs sm:text-sm font-mono text-cyan-300 tracking-wide block">
                {CONFIG.SERVER_IP}
              </strong>
              <span className="text-[10px] font-mono text-amber-300 font-bold block">
                PORT: {CONFIG.BEDROCK_PORT}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={copyServerIP}
            className="btn-fantasy-cyan py-2 px-4 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            {copiedIP ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>TERSALIN!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-950" />
                <span>SALIN IP</span>
              </>
            )}
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full mb-10">
          <a
            href="#katalog"
            className="btn-fantasy-gold px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-widest flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>PILIH 12 RANK RESMI</span>
          </a>

          <button
            type="button"
            onClick={() => setIsInvoiceTrackerOpen(true)}
            className="btn-fantasy-outline px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Receipt className="w-4 h-4 text-amber-300" />
            <span>LACAK STATUS INVOICE</span>
          </button>

          <a
            href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-montserrat font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WA: {CONFIG.ADMIN_WA_DISPLAY}</span>
          </a>
        </div>

        {/* 4 Live Server Stats Banner (Exact metrics requested by user) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full">
          {/* Stat 1: Pemain Terhubung */}
          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 text-left flex items-center gap-3.5 border border-cyan-400/20 hover:border-cyan-400/50 transition-colors">
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-montserrat text-slate-400 uppercase tracking-wider block">
                Pemain Terhubung
              </span>
              <strong className="text-base sm:text-xl font-cinzel font-black text-white">
                {CONFIG.STATS.onlineCount}
              </strong>
              <span className="text-[10px] text-cyan-300 block">
                {CONFIG.STATS.recordCount}
              </span>
            </div>
          </div>

          {/* Stat 2: Versi Didukung */}
          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 text-left flex items-center gap-3.5 border border-purple-400/20 hover:border-purple-400/50 transition-colors">
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-montserrat text-slate-400 uppercase tracking-wider block">
                Versi Didukung
              </span>
              <strong className="text-base sm:text-xl font-cinzel font-black text-purple-200">
                {CONFIG.STATS.supportedVersion}
              </strong>
              <span className="text-[10px] text-purple-300 block">
                {CONFIG.STATS.versionType}
              </span>
            </div>
          </div>

          {/* Stat 3: Total Transaksi */}
          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 text-left flex items-center gap-3.5 border border-amber-400/20 hover:border-amber-400/50 transition-colors">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-400/30 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-montserrat text-slate-400 uppercase tracking-wider block">
                Total Transaksi
              </span>
              <strong className="text-base sm:text-xl font-cinzel font-black text-amber-300">
                {CONFIG.STATS.totalTransactions}
              </strong>
              <span className="text-[10px] text-amber-200 block">
                {CONFIG.STATS.successRate}
              </span>
            </div>
          </div>

          {/* Stat 4: Pengiriman */}
          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 text-left flex items-center gap-3.5 border border-emerald-400/20 hover:border-emerald-400/50 transition-colors">
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-montserrat text-slate-400 uppercase tracking-wider block">
                Pengiriman
              </span>
              <strong className="text-base sm:text-xl font-cinzel font-black text-emerald-300">
                {CONFIG.STATS.deliveryTime}
              </strong>
              <span className="text-[10px] text-emerald-200 block">
                {CONFIG.STATS.deliveryNote}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#katalog"
          className="mt-10 flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
          aria-label="Scroll ke Katalog"
        >
          <span className="text-[10px] tracking-[0.25em] font-montserrat uppercase font-semibold">
            PILIH KATALOG RANK
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </a>

      </div>
    </section>
  );
}
