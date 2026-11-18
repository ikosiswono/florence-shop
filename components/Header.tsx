"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  MessageCircle, 
  ShieldCheck, 
  Crown,
  Receipt,
  Sparkles,
  User,
  LogIn
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG } from "@/data/products";

export default function Header() {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsInvoiceTrackerOpen,
    currentUser,
    setIsAuthOpen,
    setAuthMode,
    setAuthMessage,
    setIsDashboardOpen
  } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "BERANDA", href: "#hero" },
    { name: "KATALOG RANK", href: "#katalog" },
    { name: "KEUNGGULAN", href: "#keunggulan" },
    { name: "KOMUNITAS", href: "#komunitas" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#041022]/95 backdrop-blur-md border-b border-cyan-400/20 py-1 sm:py-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-[#041022]/95 via-[#041022]/60 to-transparent py-1 sm:py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 h-10 sm:h-14 lg:h-16">
          
          {/* Brand Logo & Name */}
          <a href="#hero" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
            <div className="relative w-6 h-6 sm:w-9 sm:h-9 lg:w-11 lg:h-11 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(40,216,232,0.5)] group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/assets/logo/florence-network-logo.png"
                alt="Florence Network Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xs sm:text-base lg:text-lg font-black tracking-wide text-gold-gradient group-hover:text-shadow-gold transition-all whitespace-nowrap leading-tight">
                FLORENCE <span className="text-cyan-300">NETWORK</span>
              </span>
              <span className="text-[6.5px] sm:text-[8px] lg:text-[9px] tracking-[0.16em] text-cyan-200 uppercase font-montserrat font-bold whitespace-nowrap leading-tight">
                Minecraft Bedrock Server
              </span>
            </div>
          </a>

          {/* Desktop Navigation (Clean, spacious, single line without wrapping) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-cinzel text-xs xl:text-[13px] tracking-wider font-bold text-slate-200 hover:text-cyan-300 px-2.5 xl:px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-cyan-500/10 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}

            {/* Lacak Invoice Button */}
            <button
              type="button"
              onClick={() => setIsInvoiceTrackerOpen(true)}
              className="font-cinzel text-xs xl:text-[13px] tracking-wider font-bold text-amber-300 hover:text-amber-200 px-2.5 xl:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 hover:bg-amber-400/10 whitespace-nowrap"
            >
              <Receipt className="w-3.5 h-3.5 shrink-0" />
              <span>LACAK INVOICE</span>
            </button>
          </nav>

          {/* Header Action Buttons (Proportioned for mobile & desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Account / Auth Button */}
            {currentUser ? (
              <Link
                href="/dashboard"
                className="h-7 sm:h-9 lg:h-10 px-1.5 sm:px-2.5 lg:px-3 rounded-lg sm:rounded-xl bg-[#061B35]/90 border border-amber-300/40 hover:border-amber-300 shadow-glow-gold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-all group shrink-0"
                title={`Buka Dashboard ${currentUser.gamertag}`}
              >
                <div className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded bg-slate-950 border border-amber-300/70 overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src={currentUser.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(currentUser.gamertag)}/24`}
                    alt={currentUser.gamertag}
                    width={20}
                    height={20}
                    className="object-contain image-rendering-pixelated"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="font-cinzel text-[10px] sm:text-xs font-bold text-white group-hover:text-amber-300 truncate max-w-[65px] sm:max-w-[95px] leading-tight">
                    {currentUser.gamertag}
                  </span>
                  <span className="text-[6.5px] sm:text-[8px] font-montserrat text-emerald-400 font-bold uppercase leading-tight">
                    {currentUser.rank || "Dashboard"}
                  </span>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthMessage(null);
                  setIsAuthOpen(true);
                }}
                className="h-7 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 rounded-lg sm:rounded-xl btn-fantasy-gold text-[10px] sm:text-xs font-montserrat font-bold tracking-wider flex items-center justify-center gap-1 whitespace-nowrap shadow-glow-gold hover:scale-[1.02] active:scale-95 transition-all shrink-0"
              >
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>
                  <span className="inline sm:hidden">MASUK</span>
                  <span className="hidden sm:inline">MASUK / DAFTAR</span>
                </span>
              </button>
            )}

            {/* WhatsApp Admin Support Button */}
            <a
              href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network,%20saya%20butuh%20bantuan%20terkait%20store/topup`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex h-9 sm:h-10 px-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-montserrat font-bold items-center justify-center gap-1.5 hover:bg-emerald-500/25 transition-all whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="whitespace-nowrap">WA Admin</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-900/30 border border-cyan-400/40 text-cyan-200 hover:text-white hover:border-cyan-300 shadow-glow flex items-center justify-center relative transition-all shrink-0"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[8px] sm:text-[9px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg sm:rounded-xl bg-slate-900/80 border border-cyan-400/30 text-cyan-300 flex items-center justify-center hover:text-white hover:border-cyan-400 transition-all shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer (Visible on screens below lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#051428]/98 backdrop-blur-2xl border-b border-cyan-400/30 px-4 py-4 sm:px-6 sm:py-5 transition-all animate-fadeIn shadow-2xl">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-cinzel text-sm font-semibold text-slate-200 hover:text-cyan-300 py-2 border-b border-slate-800"
              >
                {link.name}
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsInvoiceTrackerOpen(true);
              }}
              className="font-cinzel text-sm font-semibold text-amber-300 text-left py-2 border-b border-slate-800 flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>LACAK STATUS INVOICE</span>
            </button>

            {/* User Dashboard / Login in Mobile Drawer */}
            {currentUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-amber-400/10 border border-amber-300/40 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-amber-300 overflow-hidden flex items-center justify-center">
                    <Image
                      src={currentUser.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(currentUser.gamertag)}/36`}
                      alt={currentUser.gamertag}
                      width={32}
                      height={32}
                      className="object-contain image-rendering-pixelated"
                      unoptimized
                    />
                  </div>
                  <div>
                    <span className="font-cinzel text-sm font-bold text-white block">
                      {currentUser.gamertag}
                    </span>
                    <span className="text-[10px] text-amber-300 font-montserrat uppercase">
                      Buka Dashboard Pribadi
                    </span>
                  </div>
                </div>
                <Crown className="w-4 h-4 text-amber-400" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthMode("login");
                  setIsAuthOpen(true);
                }}
                className="btn-fantasy-gold w-full text-center py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-slate-950" />
                <span>MASUK ATAU BUAT AKUN (GAMERTAG)</span>
              </button>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network,%20saya%20butuh%20bantuan`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasy-gold w-full text-center py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-slate-950" />
                <span>CHAT WHATSAPP ADMIN ({CONFIG.ADMIN_WA_DISPLAY})</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
