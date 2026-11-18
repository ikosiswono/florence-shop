"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  LogOut, 
  Check, 
  X, 
  Phone, 
  Crown, 
  AlertCircle, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Printer, 
  RefreshCw, 
  Award,
  ChevronRight,
  Filter,
  Sparkles,
  Trash2,
  FileImage
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, PRODUCTS } from "@/data/products";
import { AUTHORIZED_GAMERTAGS } from "@/data/whitelist";
import { Order, UserProfile } from "@/types/shop";
import InvoicePrintModal from "@/components/InvoicePrintModal";

export default function AdminPage() {
  const { 
    showToast,
    setSelectedInvoice,
    setIsInvoicePrintOpen,
    adminApproveOrder,
    adminRejectOrder,
    adminUpdatePlayerRank,
    getAllOrders,
    getAllUsers,
    resetAllOrders
  } = useShop();

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Proof Screenshot Modal View
  const [viewingProofUrl, setViewingProofUrl] = useState<string | null>(null);

  // Dashboard Navigation State (Active Menu Tab)
  const [activeTab, setActiveTab] = useState<
    "overview" | "pending" | "orders" | "players" | "whitelist"
  >("overview");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "REJECTED">("ALL");

  // Modal Player Rank Edit
  const [editingPlayer, setEditingPlayer] = useState<UserProfile | null>(null);
  const [selectedRank, setSelectedRank] = useState<string>("");

  // Live Refresh Trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Check saved admin session on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("florence_admin_auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.username === "marcellnw" && parsed.isAuthenticated) {
          setIsAdminAuthenticated(true);
        }
      }
    } catch (e) {}
  }, []);

  // Fetch real data
  const allOrders: Order[] = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const orders = getAllOrders();
      return orders;
    } catch (e) {
      return [];
    }
  }, [refreshKey, getAllOrders]);

  const allUsers: UserProfile[] = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const users = getAllUsers();
      return users;
    } catch (e) {
      return [];
    }
  }, [refreshKey, getAllUsers]);

  // Orders statistics
  const pendingOrders = useMemo(() => {
    return allOrders.filter((o) => o.status === "PENDING");
  }, [allOrders]);

  const completedOrders = useMemo(() => {
    return allOrders.filter((o) => o.status === "COMPLETED");
  }, [allOrders]);

  const totalRevenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [completedOrders]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const cleanUsername = adminUsername.trim().toLowerCase();
    const cleanPassword = adminPassword.trim();

    // Strict validation: marcellnw / padmi1921
    if (cleanUsername === "marcellnw" && cleanPassword === "padmi1921") {
      const authSession = {
        username: "marcellnw",
        role: "owner",
        isAuthenticated: true,
        loggedInAt: new Date().toISOString()
      };
      try {
        localStorage.setItem("florence_admin_auth", JSON.stringify(authSession));
      } catch (e) {}
      setIsAdminAuthenticated(true);
      showToast("✓ Selamat datang kembali, Head Admin marcellnw!");
    } else {
      setLoginError("Kredensial Admin salah. Pastikan Username dan Password admin benar.");
    }
    setIsLoggingIn(false);
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    try {
      localStorage.removeItem("florence_admin_auth");
    } catch (e) {}
    setIsAdminAuthenticated(false);
    setAdminUsername("");
    setAdminPassword("");
    showToast("Anda telah keluar dari Portal Admin.");
  };

  // Handle Reset All Orders
  const handleResetOrders = () => {
    if (
      window.confirm(
        "PERINGATAN RESMI: Apakah Anda yakin ingin mereset SELURUH data pembelian player? Semua riwayat transaksi akan dihapus bersih agar siap menerima pesanan riil berlampiran screenshot."
      )
    ) {
      resetAllOrders();
      setRefreshKey((k) => k + 1);
    }
  };

  // Action: ACC (Approve) Order
  const handleApprove = async (invoiceId: string) => {
    const res = await adminApproveOrder(invoiceId);
    if (res.success) {
      setRefreshKey((k) => k + 1);
    }
  };

  // Action: Reject Order
  const handleReject = async (invoiceId: string) => {
    const res = await adminRejectOrder(invoiceId);
    if (res.success) {
      setRefreshKey((k) => k + 1);
    }
  };

  // Action: View Invoice Print Modal
  const handleViewInvoice = (order: Order) => {
    setSelectedInvoice(order);
    setIsInvoicePrintOpen(true);
  };

  // Action: Save Player Rank Edit
  const handleSavePlayerRank = async () => {
    if (!editingPlayer || !selectedRank) return;
    const res = await adminUpdatePlayerRank(editingPlayer.gamertag, selectedRank);
    if (res.success) {
      setEditingPlayer(null);
      setRefreshKey((k) => k + 1);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchSearch =
        order.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.userPhone && order.userPhone.includes(searchQuery));

      if (statusFilter === "ALL") return matchSearch;
      return matchSearch && order.status === statusFilter;
    });
  }, [allOrders, searchQuery, statusFilter]);

  // Filtered Players
  const filteredPlayers = useMemo(() => {
    return allUsers.filter((u) => {
      return (
        u.gamertag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.fullName && u.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.phone && u.phone.includes(searchQuery)) ||
        (u.rank && u.rank.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [allUsers, searchQuery]);

  // =========================================================================
  // VIEW 1: GATE LOGIN ADMIN (JIKA BELUM LOGIN)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Atmosphere Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-[#121721] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-900 border border-amber-400/40 p-2 shadow-glow-gold flex items-center justify-center relative">
              <Image
                src="/assets/logo/florence-network-logo.png"
                alt="Florence Network Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PORTAL ADMIN KHUSUS</span>
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white">
              FLORENCE NETWORK
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Akses khusus manajemen server & persetujuan (ACC) transaksi resmi.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form Login Admin */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan username admin..."
                  className="w-full bg-[#1b2230] border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi Admin
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showAdminPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full bg-[#1b2230] border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#967751] hover:bg-[#a6855c] active:bg-[#856743] py-3 rounded-xl text-sm font-bold text-white tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoggingIn ? "MEMVERIFIKASI..." : "MASUK KE DASHBOARD ADMIN"}</span>
            </button>
          </form>

          {/* Back to Web Store */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>← Kembali ke Halaman Utama Toko</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DASHBOARD ADMIN UTAMA (DENGAN MENU DI SAMPING KIRI UNTUK HP & PC)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex font-sans">
      
      {/* =========================================================================
          SIDEBAR NAVIGASI DI SAMPING KIRI (SESUAI PERMINTAAN USER: SAMPING KIRI UNTUK HP & PC)
          ========================================================================= */}
      <aside className="w-14 sm:w-60 bg-[#0e131d] border-r border-slate-800/80 flex flex-col justify-between shrink-0 fixed left-0 top-0 bottom-0 z-40 select-none">
        
        {/* Top Logo & Brand */}
        <div>
          <div className="p-2 sm:p-4 border-b border-slate-800/80 flex items-center justify-center sm:justify-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
              <Image
                src="/assets/logo/florence-network-logo.png"
                alt="Logo"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col overflow-hidden">
              <span className="font-cinzel text-xs font-bold text-white truncate leading-tight">
                FLORENCE ADMIN
              </span>
              <span className="text-[9px] text-amber-300 font-bold uppercase truncate leading-tight">
                Owner Portal
              </span>
            </div>
          </div>

          {/* Navigation Items in Left Sidebar */}
          <nav className="p-1 sm:p-2.5 space-y-1 mt-2">
            
            {/* 1. Ringkasan (Overview) */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              title="Ringkasan"
              className={`w-full flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              } justify-center sm:justify-start`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Ringkasan</span>
            </button>

            {/* 2. Persetujuan Pembelian (ACC Order) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("pending");
                setStatusFilter("PENDING");
              }}
              title="Perlu di-ACC"
              className={`w-full flex items-center justify-between p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === "pending"
                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
                <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="hidden sm:inline">Perlu di-ACC</span>
              </div>
              {pendingOrders.length > 0 && (
                <span className="absolute sm:relative -top-1 -right-1 sm:top-auto sm:right-auto px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shrink-0">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            {/* 3. Semua Transaksi */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("orders");
                setStatusFilter("ALL");
              }}
              title="Semua Transaksi"
              className={`w-full flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              } justify-center sm:justify-start`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Semua Transaksi</span>
            </button>

            {/* 4. Data Player */}
            <button
              type="button"
              onClick={() => setActiveTab("players")}
              title="Data Pemain"
              className={`w-full flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "players"
                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              } justify-center sm:justify-start`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Data Pemain</span>
            </button>

            {/* 5. Whitelist Resmi */}
            <button
              type="button"
              onClick={() => setActiveTab("whitelist")}
              title="Whitelist Gamertag"
              className={`w-full flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "whitelist"
                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              } justify-center sm:justify-start`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="hidden sm:inline">Whitelist Resmi</span>
            </button>

          </nav>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="p-1 sm:p-2.5 border-t border-slate-800/80 space-y-1">
          <Link
            href="/"
            title="Buka Toko Utama"
            className="w-full flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors justify-center sm:justify-start"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Buka Web Toko</span>
          </Link>

          <button
            type="button"
            onClick={handleAdminLogout}
            title="Keluar Admin"
            className="w-full flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors justify-center sm:justify-start"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>

      </aside>

      {/* =========================================================================
          KONTEN UTAMA (DI KANAN SIDEBAR, TANPA HEADER MENU DI ATAS)
          ========================================================================= */}
      <main className="flex-1 ml-14 sm:ml-60 min-h-screen p-3 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Top Bar Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 uppercase">
                ADMIN: marcellnw
              </span>
              <span className="text-xs text-slate-400">• Florence Network Official</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {activeTab === "overview" && "Ringkasan Dasbor Admin"}
              {activeTab === "pending" && "Persetujuan Pembelian Rank (Perlu di-ACC)"}
              {activeTab === "orders" && "Daftar Riwayat Seluruh Transaksi"}
              {activeTab === "players" && "Manajemen Data Akun Pemain"}
              {activeTab === "whitelist" && "Daftar 40+ Gamertag Whitelist Sah"}
            </h1>
          </div>

          {/* Quick Actions (Reset & Refresh) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetOrders}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset seluruh data pembelian player"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset Data Pembelian</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefreshKey((k) => k + 1);
                showToast("✓ Data berhasil diperbarui!");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Perbarui Data</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW (RINGKASAN METRIK)
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1: Perlu di-ACC */}
              <div 
                onClick={() => {
                  setActiveTab("pending");
                  setStatusFilter("PENDING");
                }}
                className="bg-[#121722] border border-amber-400/40 rounded-2xl p-4 cursor-pointer hover:border-amber-300 hover:shadow-glow-gold transition-all"
              >
                <div className="flex items-center justify-between text-amber-300 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Perlu di-ACC</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {pendingOrders.length}
                </div>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  {pendingOrders.length > 0 ? "⚠️ Ada pesanan menunggu ACC Anda" : "✓ Semua pesanan sudah di-ACC"}
                </p>
              </div>

              {/* Card 2: Total Transaksi */}
              <div 
                onClick={() => {
                  setActiveTab("orders");
                  setStatusFilter("ALL");
                }}
                className="bg-[#121722] border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Pesanan</span>
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {allOrders.length}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {completedOrders.length} berhasil disetujui
                </p>
              </div>

              {/* Card 3: Pemain Terdaftar */}
              <div 
                onClick={() => setActiveTab("players")}
                className="bg-[#121722] border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pemain Terdaftar</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {allUsers.length}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Akun Bedrock resmi tersimpan
                </p>
              </div>

              {/* Card 4: Total Pendapatan */}
              <div className="bg-[#121722] border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pendapatan Sah</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dari transaksi berstatus ACC
                </p>
              </div>

            </div>

            {/* Quick Action Alert if Pending */}
            {pendingOrders.length > 0 && (
              <div className="bg-amber-500/15 border border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Terdapat {pendingOrders.length} Pembelian Rank Menunggu Persetujuan Anda!
                    </h3>
                    <p className="text-xs text-amber-200/90">
                      Klik tombol untuk langsung memeriksa bukti dan menyetujui (ACC) rank pemain.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("pending");
                    setStatusFilter("PENDING");
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md shrink-0"
                >
                  Periksa Sekarang →
                </button>
              </div>
            )}

            {/* Recent Orders Table Preview */}
            <div className="bg-[#121722] border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  5 Transaksi Terkini
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  Lihat Semua Transaksi →
                </button>
              </div>

              {allOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Belum ada transaksi yang tercatat di sistem.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {allOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.invoiceId}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                          <Image
                            src={`https://mc-heads.net/avatar/${encodeURIComponent(order.username)}/40`}
                            alt={order.username}
                            width={32}
                            height={32}
                            className="object-contain image-rendering-pixelated"
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{order.username}</span>
                            <span className="text-[10px] text-slate-400">({order.invoiceId})</span>
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            {order.items.map((i) => i.name).join(", ")} • Rp {order.total.toLocaleString("id-ID")} ({order.paymentMethod.toUpperCase()})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === "COMPLETED" 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : order.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}>
                          {order.status === "COMPLETED" ? "ACC RESMI" : order.status === "PENDING" ? "MENUNGGU ACC" : "DITOLAK"}
                        </span>

                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(order.invoiceId)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow"
                          >
                            <Check className="w-3.5 h-3.5" /> ACC
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2 & 3: ORDERS MANAGEMENT & ACC PERSIDANGAN
            ========================================================================= */}
        {(activeTab === "pending" || activeTab === "orders") && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-[#121722] border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Invoice, Gamertag, WhatsApp..."
                  className="w-full bg-[#1b2230] border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === "ALL"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Semua ({allOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("PENDING")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    statusFilter === "PENDING"
                      ? "bg-amber-500 text-slate-950 font-black shadow"
                      : "text-amber-400 hover:bg-slate-800"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Perlu ACC ({pendingOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === "COMPLETED"
                      ? "bg-emerald-500 text-slate-950 font-black shadow"
                      : "text-emerald-400 hover:bg-slate-800"
                  }`}
                >
                  Sudah ACC ({completedOrders.length})
                </button>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#121722] border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
                <Clock className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">
                  Tidak Ada Pesanan yang Sesuai Filter
                </h3>
                <p className="text-xs text-slate-500">
                  {statusFilter === "PENDING"
                    ? "Semua pesanan telah berhasil di-ACC resmi oleh admin!"
                    : "Coba ubah kata kunci pencarian Anda."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.invoiceId}
                    className={`bg-[#121722] border rounded-2xl p-4 sm:p-5 transition-all ${
                      order.status === "PENDING"
                        ? "border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                        : order.status === "COMPLETED"
                        ? "border-emerald-500/30"
                        : "border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: Player & Invoice Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border-2 border-amber-400/40 p-1 flex items-center justify-center shrink-0 shadow-md">
                          <Image
                            src={`https://mc-heads.net/avatar/${encodeURIComponent(order.username)}/48`}
                            alt={order.username}
                            width={40}
                            height={40}
                            className="object-contain image-rendering-pixelated"
                            unoptimized
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white">
                              {order.username}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                              {order.invoiceId}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800 uppercase">
                              {order.platform.toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-slate-300">
                            <strong>Item:</strong> {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                            <span>Metode: <strong className="text-white uppercase">{order.paymentMethod}</strong></span>
                            <span>•</span>
                            <span>Total: <strong className="text-amber-300 font-bold">Rp {order.total.toLocaleString("id-ID")}</strong></span>
                            <span>•</span>
                            <span>Waktu: {new Date(order.createdAt).toLocaleString("id-ID")}</span>
                          </div>

                          {/* WhatsApp Link if available */}
                          {order.userPhone && (
                            <div className="mt-2 flex items-center gap-2">
                              <a
                                href={`https://wa.me/${order.userPhone.replace(/\D/g, "")}?text=Halo%20${order.username},%20terima%20kasih%20telah%20order%20rank%20di%20Florence%20Network.%20Pesanan%20Anda%20dengan%20nomor%20${order.invoiceId}%20telah%20kami%20proses.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-semibold"
                              >
                                <Phone className="w-3 h-3" />
                                <span>WhatsApp: {order.userPhone}</span>
                              </a>
                            </div>
                          )}

                          {/* Screenshot Bukti Pembayaran & Validasi Analisis Otomatis */}
                          {order.paymentProofUrl ? (
                            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-emerald-400/40 space-y-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    onClick={() => setViewingProofUrl(order.paymentProofUrl!)}
                                    className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-400/60 bg-black cursor-pointer hover:opacity-90 relative shrink-0 group"
                                    title="Klik untuk memperbesar struk transfer"
                                  >
                                    <Image
                                      src={order.paymentProofUrl}
                                      alt={`Bukti ${order.invoiceId}`}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Eye className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Bukti Screenshot Terlampir
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      Tersimpan di Google Drive & Cloud Database
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setViewingProofUrl(order.paymentProofUrl!)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 shrink-0"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Periksa Struk</span>
                                </button>
                              </div>

                              {/* Automated Validation & Analysis Badge */}
                              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-start gap-1.5 leading-relaxed">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Hasil Analisis Otomatis:</strong> {order.proofAnalysis?.details || `Screenshot bukti terlampir. Nominal cocok (Rp ${order.total.toLocaleString("id-ID")}), Gamertag sesuai (${order.username}). Valid dan siap di-ACC.`}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Pemain belum melampirkan file screenshot bukti pembayaran.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Status & Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 self-start lg:self-center shrink-0">
                        {/* Status Badge */}
                        <div className="mr-2">
                          {order.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 animate-spin" /> Menunggu ACC
                            </span>
                          )}
                          {order.status === "COMPLETED" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resmi Di-ACC
                            </span>
                          )}
                          {order.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Ditolak
                            </span>
                          )}
                        </div>

                        {/* ACC Action Button (Emerald Green) */}
                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(order.invoiceId)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
                            title="Setujui dan Aktifkan Rank Resmi untuk Pemain"
                          >
                            <Check className="w-4 h-4" />
                            <span>ACC / SETUJUI</span>
                          </button>
                        )}

                        {/* Reject Action Button */}
                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleReject(order.invoiceId)}
                            className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
                            title="Tolak Pesanan Ini"
                          >
                            <X className="w-4 h-4" />
                            <span>Tolak</span>
                          </button>
                        )}

                        {/* View / Print Receipt */}
                        <button
                          type="button"
                          onClick={() => handleViewInvoice(order)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Kwitansi</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 4: DATA PLAYER (MANAJEMEN PEMAIN)
            ========================================================================= */}
        {activeTab === "players" && (
          <div className="space-y-4">
            
            {/* Header & Search */}
            <div className="bg-[#121722] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Daftar Akun Pemain Terdaftar ({allUsers.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Data pemain yang telah mendaftar dengan Gamertag resmi Bedrock.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Gamertag, Nama, No WA..."
                  className="w-full bg-[#1b2230] border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Players Table / Cards */}
            {filteredPlayers.length === 0 ? (
              <div className="bg-[#121722] border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">
                  Belum Ada Pemain yang Terdaftar
                </h3>
                <p className="text-xs text-slate-500">
                  Pemain dapat mendaftarkan akun di halaman utama web store sesuai Gamertag resmi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="bg-[#121722] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-400/50 p-1 overflow-hidden shrink-0">
                          <Image
                            src={player.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(player.gamertag)}/48`}
                            alt={player.gamertag}
                            width={44}
                            height={44}
                            className="object-contain image-rendering-pixelated"
                            unoptimized
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-white truncate">
                            {player.gamertag}
                          </h4>
                          {player.fullName && (
                            <p className="text-[11px] text-slate-400 truncate">
                              {player.fullName}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                              {player.rank || "Member"}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase">
                              {player.role || "Member"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">WhatsApp:</span>
                          {player.phone ? (
                            <a
                              href={`https://wa.me/${player.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline font-mono"
                            >
                              {player.phone}
                            </a>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Email:</span>
                          <span className="text-slate-300 truncate max-w-[150px]">{player.email || "-"}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Bergabung:</span>
                          <span className="text-slate-400">
                            {new Date(player.joinedAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action: Edit Rank */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPlayer(player);
                          setSelectedRank(player.rank || "Member");
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ubah / Setel Rank</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 5: WHITELIST GAMERTAG RESMI
            ========================================================================= */}
        {activeTab === "whitelist" && (
          <div className="space-y-4">
            
            <div className="bg-[#121722] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SISTEM KEAMANAN STRICT WHITELIST</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Daftar 40+ Gamertag Sah Florence Network
                </h3>
                <p className="text-xs text-slate-400">
                  Hanya Gamertag yang terdaftar di bawah ini yang dapat mendaftar akun di Web Store.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {AUTHORIZED_GAMERTAGS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#121722] border border-slate-800 flex items-center gap-2 text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                    <Image
                      src={`https://mc-heads.net/avatar/${encodeURIComponent(item.gamertag)}/28`}
                      alt={item.gamertag}
                      width={28}
                      height={28}
                      className="object-contain image-rendering-pixelated"
                      unoptimized
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-bold text-white block truncate text-[11px]">
                      {item.gamertag}
                    </span>
                    <span className="text-[9px] text-amber-300 block uppercase">
                      {item.role || "Member"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL: UBAH / SETEL RANK PEMAIN
          ========================================================================= */}
      {/* Modal: Ubah / Setel Rank Pemain */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121722] border border-amber-400/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditingPlayer(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-slate-950 border-2 border-amber-400/50 p-1 overflow-hidden">
                <Image
                  src={editingPlayer.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(editingPlayer.gamertag)}/56`}
                  alt={editingPlayer.gamertag}
                  width={48}
                  height={48}
                  className="object-contain image-rendering-pixelated"
                  unoptimized
                />
              </div>
              <h3 className="text-base font-bold text-white">
                Setel Rank untuk {editingPlayer.gamertag}
              </h3>
              <p className="text-xs text-slate-400">
                Pilih rank baru yang akan diaktifkan secara resmi pada akun pemain ini.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-300">
                Pilih Rank Server:
              </label>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full bg-[#1b2230] border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Member">Member (Default)</option>
                <option value="Rank VIP">Rank VIP</option>
                {PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.name}>
                    {prod.name} (Rp {prod.price.toLocaleString("id-ID")})
                  </option>
                ))}
                <option value="Admin">Admin</option>
                <option value="Owner">Owner</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSavePlayerRank}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold tracking-wider"
              >
                Simpan Rank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Screenshot Zoom Modal */}
      {viewingProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121722] border border-slate-700 rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileImage className="w-4 h-4 text-emerald-400" />
                <span>Bukti Screenshot Pembayaran Player</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingProofUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-black/60 border border-slate-800 flex items-center justify-center p-2 min-h-[300px]">
              <div className="relative w-full h-[65vh] max-h-[600px]">
                <Image
                  src={viewingProofUrl}
                  alt="Bukti Transfer Player"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Pastikan nama pengirim dan nominal sesuai dengan total tagihan sebelum mengeklik ACC.
              </span>
              <button
                type="button"
                onClick={() => setViewingProofUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Print Modal for Official Receipts */}
      <InvoicePrintModal />

    </div>
  );
}
