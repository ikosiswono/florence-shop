"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Gamepad2, 
  ShoppingBag, 
  Receipt, 
  Users, 
  CreditCard, 
  Bell, 
  LogOut, 
  Search, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Copy, 
  Check, 
  CheckCircle2, 
  Flame, 
  Crown, 
  Lock, 
  ArrowRight, 
  ExternalLink, 
  Download, 
  ChevronRight,
  ChevronLeft,
  Server,
  Zap,
  Terminal,
  Printer,
  Smartphone,
  Eye,
  Edit3
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, PRODUCTS, formatRupiah } from "@/data/products";
import { MOCK_ONLINE_PLAYERS } from "@/data/whitelist";
import { Order, Product } from "@/types/shop";
import InvoicePrintModal from "@/components/InvoicePrintModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import PaymentModal from "@/components/PaymentModal";
import AuthModal from "@/components/AuthModal";

export default function DashboardPage() {
  const { 
    currentUser, 
    logoutUser, 
    getUserOrders, 
    setSelectedInvoice, 
    setIsInvoicePrintOpen,
    addToCart,
    buyNow,
    showToast,
    setIsAuthOpen,
    setAuthMode,
    updateUserProfile
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "ranks" | "purchased" | "players" | "settings"
  >("dashboard");

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIP, setCopiedIP] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Settings Edit Form State
  const [phoneEdit, setPhoneEdit] = useState(currentUser?.phone || "");
  const [bioEdit, setBioEdit] = useState(currentUser?.bio || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Keep form in sync with currentUser
  React.useEffect(() => {
    if (currentUser) {
      setPhoneEdit(currentUser.phone || "");
      setBioEdit(currentUser.bio || "");
    }
  }, [currentUser]);

  const copyServerIP = () => {
    navigator.clipboard.writeText(`${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}`);
    setCopiedIP(true);
    showToast(`✓ IP Server (${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}) berhasil disalin!`);
    setTimeout(() => setCopiedIP(false), 2500);
  };

  const copyCommandText = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    showToast(`✓ Perintah chat "${cmd}" berhasil disalin!`);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const userOrders = getUserOrders();

  const handleOpenReceipt = (order: Order) => {
    setSelectedInvoice(order);
    setIsInvoicePrintOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmNewPassword) {
      showToast("⚠️ Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    setIsSavingProfile(true);
    try {
      const updateData: any = {
        phone: phoneEdit.trim(),
        bio: bioEdit.trim()
      };
      if (newPassword.trim()) {
        updateData.password = newPassword.trim();
      }
      await updateUserProfile(updateData);
      setNewPassword("");
      setConfirmNewPassword("");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Commands Cheat Sheet based on rank
  const activeCommands = useMemo(() => {
    return [
      { cmd: "+heal", desc: "Memulihkan seluruh darah karakter Anda secara instan", icon: "❤️" },
      { cmd: "+feed", desc: "Mengisi bar rasa lapar (hunger) hingga penuh", icon: "🍗" },
      { cmd: "+fly", desc: "Mengaktifkan mode terbang di area klaim / survival", icon: "🪽" },
      { cmd: "+craft", desc: "Membuka meja kerja (crafting table) di mana saja", icon: "🧰" },
      { cmd: "+ec", desc: "Membuka brankas Ender Chest pribadi dari chat", icon: "📦" },
      { cmd: "+nightvision", desc: "Melihat dalam kegelapan tanpa batas waktu", icon: "👁️" }
    ];
  }, []);

  // Filtered Ranks for Search / Catalog
  const filteredRanks = useMemo(() => {
    if (!searchQuery.trim()) return PRODUCTS;
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.benefits.some((b) => b.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Featured ranks for bottom carousel (inspired by reference image)
  const featuredRanks = useMemo(() => {
    return [
      PRODUCTS.find((p) => p.id === 1) || PRODUCTS[0],
      PRODUCTS.find((p) => p.id === 4) || PRODUCTS[1],
      PRODUCTS.find((p) => p.id === 5) || PRODUCTS[2],
      PRODUCTS.find((p) => p.id === 12) || PRODUCTS[3]
    ];
  }, []);

  // =========================================================================
  // AUTH GUARD: Jika belum login, tampilkan layar otentikasi resmi
  // =========================================================================
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#07050f] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full bg-[#120a1c]/90 border border-red-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(239,68,68,0.2)] backdrop-blur-xl text-center space-y-5">
          
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent border-2 border-red-400/50 flex items-center justify-center text-red-400 shadow-glow">
            <Lock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold block">
              RESTRICTED ACCESS AREA
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wider">
              DASHBOARD PEMAIN FLORENCE
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Halaman ini dikhususkan bagi pemain yang telah login menggunakan <strong>Gamertag Minecraft Bedrock</strong> terverifikasi. Silakan masuk atau daftarkan akun Gamertag Anda.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2.5 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sistem dilengkapi proteksi anti-hack, hashing password SHA-256 + Salt, dan verifikasi whitelist.</span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setIsAuthOpen(true);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-montserrat font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(225,29,72,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>MASUK DENGAN GAMERTAG BEDROCK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setIsAuthOpen(true);
              }}
              className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-montserrat font-bold text-xs tracking-wider uppercase transition-all"
            >
              DAFTAR AKUN BARU
            </button>

            <Link
              href="/"
              className="inline-block text-xs text-slate-400 hover:text-cyan-300 pt-2 transition-colors font-medium"
            >
              ← Kembali ke Web Store Utama
            </Link>
          </div>

        </div>

        <AuthModal />
      </main>
    );
  }

  // =========================================================================
  // DASHBOARD UTAMA (TERINSPIRASI DARI DESAIN CONSOLE / GAMING COCKPIT)
  // =========================================================================
  const avatarUrl = currentUser.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(currentUser.gamertag)}/80`;

  return (
    <div className="min-h-screen bg-[#07040d] text-slate-100 flex p-2 sm:p-4 lg:p-6 font-sans select-none overflow-x-hidden">
      
      {/* Outer Cockpit Container with Rounded Frame & Ambient Glows */}
      <div className="w-full max-w-[1560px] mx-auto bg-[#10091d]/95 border border-[#2b173d] rounded-[28px] sm:rounded-[36px] shadow-[0_20px_80px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row overflow-hidden relative backdrop-blur-2xl">
        
        {/* ===================================================================
            LEFT SIDEBAR (NAVIGATION & ONLINE PLAYERS ROSTER)
           =================================================================== */}
        <aside className="w-full lg:w-64 bg-[#0d0717]/95 border-b lg:border-b-0 lg:border-r border-[#261336] p-4 sm:p-5 flex flex-col justify-between shrink-0">
          
          <div className="space-y-6">
            
            {/* Logo / Brand Header */}
            <div className="flex items-center gap-3 px-2">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-purple-900/40 border border-red-500/40 p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/logo/florence-network-logo.png"
                  alt="Florence Network"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div className="overflow-hidden">
                <span className="font-cinzel text-sm font-black tracking-wider text-white block leading-tight truncate">
                  FLORENCE <span className="text-red-400">NET</span>
                </span>
                <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block">
                  BEDROCK DASHBOARD
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1 font-montserrat text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-red-600/80 to-rose-700/70 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>My Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ranks")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "ranks"
                    ? "bg-gradient-to-r from-red-600/80 to-rose-700/70 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span>Rank & Perk List</span>
              </button>

              <Link
                href="/#katalog"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Explore Store</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab("purchased")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "purchased"
                    ? "bg-gradient-to-r from-red-600/80 to-rose-700/70 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 shrink-0" />
                  <span>Purchased / Invoice</span>
                </div>
                {userOrders.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-mono">
                    {userOrders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("players")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "players"
                    ? "bg-gradient-to-r from-red-600/80 to-rose-700/70 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Friends / Players</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "settings"
                    ? "bg-gradient-to-r from-red-600/80 to-rose-700/70 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Pengaturan Akun</span>
              </button>
            </nav>

            {/* Online Players Roster Widget in Sidebar */}
            <div className="pt-2 border-t border-[#231033] hidden sm:block">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 px-1">
                <span>ONLINE PLAYERS</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {MOCK_ONLINE_PLAYERS.filter(p => p.isOnline).length}
                </span>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-none">
                {MOCK_ONLINE_PLAYERS.map((player) => (
                  <div
                    key={player.gamertag}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        <Image
                          src={`https://mc-heads.net/avatar/${encodeURIComponent(player.gamertag)}/24`}
                          alt={player.gamertag}
                          width={24}
                          height={24}
                          className="object-contain image-rendering-pixelated"
                          unoptimized
                        />
                      </div>
                      <span className="text-[11px] font-montserrat text-slate-300 truncate max-w-[100px]">
                        {player.gamertag}
                      </span>
                    </div>

                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      player.isOnline ? "bg-emerald-400 shadow-[0_0_6px_#10b981]" : "bg-slate-600"
                    }`} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Bottom Action: Log Out & Store Link */}
          <div className="pt-4 border-t border-[#231033] space-y-2 mt-4 lg:mt-0">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-montserrat font-semibold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ke Halaman Toko</span>
            </Link>

            <button
              type="button"
              onClick={logoutUser}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/40 border border-red-500/30 text-rose-300 hover:bg-red-900/50 hover:text-white text-xs font-montserrat font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </aside>

        {/* ===================================================================
            MAIN COCKPIT PANEL (HEADER, HERO BANNER, LIBRARY, YOU MIGHT LIKE)
           =================================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 flex flex-col space-y-6 overflow-y-auto max-h-[96vh]">
          
          {/* Top Bar: Search, Server Status, Notifications & Player Profile Capsule */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input Bar (Matches Reference Image) */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari perintah rank, benefit, invoice ID..."
                className="w-full bg-[#1b1129]/80 border border-[#381e4f] rounded-2xl py-2.5 pl-10 pr-4 text-xs font-montserrat text-white placeholder-slate-400 focus:outline-none focus:border-red-400/80 transition-all shadow-inner"
              />
            </div>

            {/* Right Top Items: Server IP, Notification & Profile Pill */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              
              {/* Quick Server IP Copy Pill */}
              <button
                type="button"
                onClick={copyServerIP}
                className="px-3 py-2 rounded-xl bg-[#1b1129] border border-[#3a2052] hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-2 transition-all"
                title="Salin IP Bedrock"
              >
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline font-bold">{CONFIG.SERVER_IP} : {CONFIG.BEDROCK_PORT}</span>
                {copiedIP ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Notification Bell */}
              <div className="relative p-2.5 rounded-xl bg-[#1b1129] border border-[#3a2052] text-slate-300 hover:text-white cursor-pointer transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>

              {/* Player Profile Capsule (Matches Reference Image) */}
              <div className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-2xl bg-[#1b1129] border border-[#3a2052]">
                <div className="w-8 h-8 rounded-xl bg-slate-950 border border-amber-300/60 overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={avatarUrl}
                    alt={currentUser.gamertag}
                    width={32}
                    height={32}
                    className="object-contain image-rendering-pixelated"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-cinzel text-xs font-black text-white truncate max-w-[110px]">
                    {currentUser.gamertag}
                  </span>
                  <span className="text-[9px] font-montserrat font-bold text-amber-300 uppercase">
                    {currentUser.rank || "Member"}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* =================================================================
              CONTENT TAB: DASHBOARD OVERVIEW
             ================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOP SPLIT: HERO SPOTLIGHT (Left 65%) + IN LIBRARY BENEFIT (Right 35%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. HERO SPOTLIGHT CARD (Matches Reference Image) */}
                <div className="lg:col-span-8 rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#170a24] via-[#240e36] to-[#140822] border border-[#3d1957] p-6 sm:p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] min-h-[300px]">
                  
                  {/* Background Artwork */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none select-none overflow-hidden hidden sm:block">
                    <Image
                      src="/assets/characters/character-warrior.webp"
                      alt="Hero Artwork"
                      fill
                      className="object-cover object-left"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#170a24] via-[#170a24]/60 to-transparent" />
                  </div>

                  {/* Top Tags */}
                  <div className="relative z-10 flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] font-montserrat font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      AKTIF SEASON 5 (PER-SEASON)
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      ✓ WHITELIST TERVERIFIKASI
                    </span>
                  </div>

                  {/* Title & Lore */}
                  <div className="relative z-10 max-w-md space-y-2 mb-6">
                    <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight">
                      Selamat Datang, {currentUser.gamertag}!
                    </h2>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Status akun Anda aktif di server Minecraft Bedrock Florence Network. Rank berlaku selama masa aktif Season 5 berjalan. Nikmati perintah in-game khusus dan akses brankas eksklusif.
                    </p>
                  </div>

                  {/* Quick Action Button & Season Countdown */}
                  <div className="relative z-10 flex flex-wrap items-center gap-3">
                    <Link
                      href="/#katalog"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-montserrat font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>UPGRADE / PERPANJANG RANK</span>
                    </Link>

                    {userOrders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(userOrders[0])}
                        className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-amber-300/40 text-amber-300 hover:text-white text-xs font-montserrat font-bold transition-all flex items-center gap-1.5"
                      >
                        <Receipt className="w-4 h-4 text-amber-400" />
                        <span>Kwitansi Terakhir</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* 2. IN LIBRARY / PERINTAH CHAT AKTIF (Matches Reference Image Right Column) */}
                <div className="lg:col-span-4 rounded-3xl bg-[#130b20] border border-[#2b173d] p-5 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#2b173d] mb-3">
                      <span className="font-cinzel text-xs font-bold text-white tracking-wider uppercase">
                        PERINTAH CHAT AKTIF
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        FORMAT: +cmd
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                      {activeCommands.map((item) => (
                        <div
                          key={item.cmd}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#1b102c] border border-[#381c53] hover:border-cyan-400/50 transition-all"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="text-base select-none">{item.icon}</span>
                            <div className="overflow-hidden">
                              <span className="font-mono text-xs font-black text-emerald-400 block truncate">
                                {item.cmd}
                              </span>
                              <span className="text-[9px] text-slate-400 block truncate max-w-[150px]">
                                {item.desc}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyCommandText(item.cmd)}
                            className="p-1.5 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors shrink-0"
                            title="Salin perintah"
                          >
                            {copiedCmd === item.cmd ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2b173d] text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Aktivasi in-game:</span>
                    <strong className="text-amber-300 font-mono">Chatbox Minecraft Bedrock</strong>
                  </div>

                </div>

              </div>

              {/* BOTTOM SECTION: "YOU MIGHT ALSO LIKE" / REKOMENDASI RANK MUSIM INI (Matches Reference Image Bottom Row) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-white tracking-wider">
                      REKOMENDASI RANK POPULER SEASON 5
                    </h3>
                  </div>
                  <Link
                    href="/#katalog"
                    className="text-xs font-montserrat font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <span>Lihat Semua 12 Rank</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 4-Card Horizontal Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredRanks.map((rank) => (
                    <div
                      key={rank.id}
                      className="group relative rounded-2xl bg-[#140b22] border border-[#2d1840] hover:border-red-500/60 p-4 flex flex-col justify-between shadow-lg hover:shadow-[0_8px_30px_rgba(225,29,72,0.25)] transition-all duration-300"
                    >
                      <div>
                        {/* Image / Icon Badge */}
                        <div className="relative h-28 w-full rounded-xl bg-gradient-to-br from-black/60 to-[#1e0e31] border border-white/5 mb-3 flex items-center justify-center overflow-hidden">
                          <Image
                            src={rank.image}
                            alt={rank.name}
                            width={56}
                            height={56}
                            className="object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300 image-rendering-pixelated"
                            unoptimized
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[9px] font-mono font-bold tracking-wider">
                            {rank.badge}
                          </span>
                        </div>

                        {/* Title & Price */}
                        <h4 className="font-cinzel text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {rank.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5 mb-2">
                          <span className="text-amber-300 font-cinzel text-sm font-black">
                            {formatRupiah(rank.price)}
                          </span>
                          <span className="text-slate-500 line-through text-[10px]">
                            {formatRupiah(rank.oldPrice)}
                          </span>
                        </div>

                        {/* Benefit Snippet */}
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                          {rank.benefits[0]} • {rank.benefits[1]}
                        </p>
                      </div>

                      {/* Buy / Add to Cart Action */}
                      <button
                        type="button"
                        onClick={() => buyNow(rank)}
                        className="mt-3 w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white text-[11px] font-montserrat font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Beli Sekarang</span>
                      </button>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* =================================================================
              CONTENT TAB: RANK & PERK LIST
             ================================================================= */}
          {activeTab === "ranks" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b173d]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Katalog Lengkap Rank & Benefit In-Game
                  </h3>
                  <p className="text-xs text-slate-400">
                    Semua rank berstatus aktif per season (Season 5).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRanks.map((rank) => (
                  <div
                    key={rank.id}
                    className="p-4 rounded-2xl bg-[#140b22] border border-[#2d1840] hover:border-amber-300/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/60 border border-slate-800 p-1.5 flex items-center justify-center shrink-0">
                        <Image
                          src={rank.image}
                          alt={rank.name}
                          width={36}
                          height={36}
                          className="object-contain image-rendering-pixelated"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="font-cinzel text-sm font-bold text-white">{rank.name}</h4>
                        <span className="text-amber-300 text-xs font-black font-cinzel">
                          {formatRupiah(rank.price)}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-300 font-sans">
                      {rank.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => buyNow(rank)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-montserrat font-bold text-xs"
                    >
                      Beli Rank Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: PURCHASED / INVOICES
             ================================================================= */}
          {activeTab === "purchased" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b173d]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Riwayat Pembelian & Kwitansi Resmi
                  </h3>
                  <p className="text-xs text-slate-400">
                    Unduh kwitansi resmi beresolusi HD untuk dikirimkan ke WhatsApp Admin.
                  </p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-16 bg-[#130b20] rounded-3xl border border-[#2b173d] p-6 space-y-3">
                  <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="font-cinzel text-base font-bold text-slate-300">
                    Belum Ada Riwayat Pembelian
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Anda belum melakukan pembelian rank pada Season ini. Jelajahi katalog rank untuk meningkatkan pengalaman bermain Anda!
                  </p>
                  <Link
                    href="/#katalog"
                    className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold font-montserrat uppercase tracking-wider"
                  >
                    Beli Rank Pertama
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div
                      key={order.invoiceId}
                      className="p-4 sm:p-5 rounded-2xl bg-[#140b22] border border-[#2d1840] hover:border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-cyan-300 text-xs sm:text-sm">
                            {order.invoiceId}
                          </strong>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            order.status === "COMPLETED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                          }`}>
                            {order.status === "COMPLETED" ? "LUNAS & AKTIF" : "MENUNGGU PEMBAYARAN"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Item: {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          Waktu: {new Date(order.createdAt).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-cinzel text-sm sm:text-base font-black text-amber-300">
                          {formatRupiah(order.total)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(order)}
                          className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-montserrat font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Kwitansi HD</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: PLAYERS ROSTER
             ================================================================= */}
          {activeTab === "players" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b173d]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Daftar Pemain & Rekan Petualang (Florence Bedrock)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Status online pemain yang terdaftar di whitelist resmi server.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOCK_ONLINE_PLAYERS.map((p) => (
                  <div
                    key={p.gamertag}
                    className="p-3.5 rounded-2xl bg-[#140b22] border border-[#2d1840] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/60 border border-slate-700 overflow-hidden flex items-center justify-center">
                        <Image
                          src={`https://mc-heads.net/avatar/${encodeURIComponent(p.gamertag)}/40`}
                          alt={p.gamertag}
                          width={40}
                          height={40}
                          className="object-contain image-rendering-pixelated"
                          unoptimized
                        />
                      </div>
                      <div>
                        <strong className="text-xs text-white block">{p.gamertag}</strong>
                        <span className="text-[10px] text-amber-300 font-montserrat">{p.rank}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.isOnline ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {p.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: SETTINGS & PROFILE EDIT
             ================================================================= */}
          {activeTab === "settings" && (
            <div className="max-w-xl mx-auto space-y-5 animate-fadeIn py-4">
              <div className="text-center space-y-1">
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Pengaturan Akun & Keamanan
                </h3>
                <p className="text-xs text-slate-400">
                  Perbarui nomor WhatsApp atau perbarui password akun Gamertag Anda.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-5 rounded-3xl bg-[#140b22] border border-[#2d1840] space-y-4">
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    GAMERTAG MINECRAFT (TERKUNCI KEAMANAN)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.gamertag}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                  />
                  <span className="text-[9px] text-slate-500 mt-0.5 block">
                    Gamertag diverifikasi sesuai akun Minecraft Bedrock sah.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    NOMOR WHATSAPP AKTIF
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneEdit}
                    onChange={(e) => setPhoneEdit(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-[#1b1129] border border-[#381e4f] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    BIO PETUALANG (STATUS)
                  </label>
                  <textarea
                    rows={2}
                    value={bioEdit}
                    onChange={(e) => setBioEdit(e.target.value)}
                    placeholder="Tulis status petualang Anda..."
                    className="w-full bg-[#1b1129] border border-[#381e4f] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block mb-2">
                    UBAH PASSWORD AKUN (OPSIONAL)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Password baru"
                      className="w-full bg-[#1b1129] border border-[#381e4f] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-red-400"
                    />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Konfirmasi password baru"
                      className="w-full bg-[#1b1129] border border-[#381e4f] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {isSavingProfile ? "Menyimpan Perubahan..." : "Simpan Perubahan Akun"}
                </button>

              </form>
            </div>
          )}

        </main>

      </div>

      {/* Global Modals Mounted */}
      <InvoicePrintModal />
      <CartDrawer />
      <CheckoutModal />
      <PaymentModal />
      <AuthModal />

    </div>
  );
}
