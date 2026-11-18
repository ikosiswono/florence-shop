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
  Edit3,
  Shirt,
  UploadCloud,
  X,
  AlertCircle,
  Plus,
  Play
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG, PRODUCTS, formatRupiah } from "@/data/products";
import { Order, Product } from "@/types/shop";
import InvoicePrintModal from "@/components/InvoicePrintModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import PaymentModal from "@/components/PaymentModal";
import AuthModal from "@/components/AuthModal";
import MinecraftSkinViewer from "@/components/MinecraftSkinViewer";

// 40+ Official Whitelist Players
const OFFICIAL_WHITELIST = [
  "Adyputra6", "AmiiLunaa", "arvans29", "Awaaadesu3", "Baimmenkaaaa",
  "CelCelxyh", "Chyntia136", "Daifukiro0", "Dennnzi14", "Drikzz223",
  "Finaxn", "Gerykzz", "gilenlavv", "ItsMikaellaa", "itsmolor",
  "ItzNawirMc", "JustVnite", "Kazzuya2007", "KHOIRULLLGMG", "kinicth",
  "kiyoomii1769", "leaaa2553", "MANTAPMEN3", "meliaaa syududu", "millooouuu",
  "mrayzyou", "N D Skyline9925", "PudingBeku", "QueennnzMe19", "Ryuuenzi",
  "Sinzznex1", "Skeepy6025", "Sunny4462", "syududu", "Tinus3541",
  "TN12 12 12 12", "Toorden", "Xanzkc", "ZeroMercy", "ZYiiL13"
];

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
    updateUserProfile,
    updateUserCustomSkin
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "ranks" | "purchased" | "friends" | "payments" | "notification" | "settings"
  >("dashboard");

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIP, setCopiedIP] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Custom Skin Upload State
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);
  const [customSkinPreview, setCustomSkinPreview] = useState<string | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<"64x64" | "128x128" | null>(null);
  const [skinUploadError, setSkinUploadError] = useState<string | null>(null);
  const [isSavingSkin, setIsSavingSkin] = useState(false);

  // Hero carousel slide index
  const [heroSlide, setHeroSlide] = useState(1);

  // Real Buyers Data from Apps Script or localStorage
  const [spreadsheetBuyers, setSpreadsheetBuyers] = useState<any[]>([]);
  const [isLoadingBuyers, setIsLoadingBuyers] = useState(false);

  React.useEffect(() => {
    async function loadSpreadsheetBuyers() {
      if (!CONFIG.APPS_SCRIPT_URL) return;
      setIsLoadingBuyers(true);
      try {
        const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=recent_buyers`);
        const json = await res.json();
        if (json && json.success && Array.isArray(json.buyers)) {
          setSpreadsheetBuyers(json.buyers);
        }
      } catch (err) {
        console.warn("Apps Script buyers fetch notice:", err);
      } finally {
        setIsLoadingBuyers(false);
      }
    }
    loadSpreadsheetBuyers();
  }, []);

  const serverBuyers = useMemo(() => {
    if (spreadsheetBuyers.length > 0) return spreadsheetBuyers;
    if (typeof window !== "undefined") {
      try {
        const localOrders = JSON.parse(localStorage.getItem("florence_orders") || "[]");
        return localOrders.filter((o: any) => o.status === "COMPLETED");
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [spreadsheetBuyers]);

  // Profile Edit Form State
  const [phoneEdit, setPhoneEdit] = useState(currentUser?.phone || "");
  const [bioEdit, setBioEdit] = useState(currentUser?.bio || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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

  // Handle Skin File Upload (Bedrock 64x64 or 128x128 HD)
  const handleSkinFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSkinUploadError(null);
    if (!file) return;

    if (!file.type.includes("png")) {
      setSkinUploadError("Format file skin wajib berupa file gambar PNG (Minecraft Bedrock Skin).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const testImg = new window.Image();
      testImg.src = dataUrl;
      testImg.onload = () => {
        const w = testImg.width;
        const h = testImg.height;
        if ((w === 64 && h === 64) || (w === 64 && h === 32)) {
          setDetectedFormat("64x64");
          setCustomSkinPreview(dataUrl);
        } else if (w === 128 && h === 128) {
          setDetectedFormat("128x128");
          setCustomSkinPreview(dataUrl);
        } else {
          setSkinUploadError(
            `Dimensi gambar skin (${w}x${h}px) tidak sesuai standar. Minecraft Bedrock mewajibkan 64x64 piksel atau 128x128 piksel HD.`
          );
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomSkin = async () => {
    if (!customSkinPreview) return;
    setIsSavingSkin(true);
    try {
      await updateUserCustomSkin(customSkinPreview, detectedFormat || "64x64");
      setIsSkinModalOpen(false);
    } finally {
      setIsSavingSkin(false);
    }
  };

  // Rank Benefits matching purchased active rank
  const currentRankBenefits = useMemo(() => {
    if (currentUser?.activeBenefits && currentUser.activeBenefits.length > 0) {
      return currentUser.activeBenefits;
    }
    const matched = PRODUCTS.find(
      (p) => p.name.toLowerCase() === (currentUser?.rank || "").toLowerCase()
    );
    if (matched) return matched.benefits;
    return [
      "Perintah Chat Dasar: +spawn, +tpa, +sethome",
      "Bonus Saldo Koin Survival Server",
      "Kit Peralatan Pemula Survival",
      "Akses Area Klaim Tanah (Land Claim)"
    ];
  }, [currentUser]);

  // Chat commands
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

  // Filtered Ranks
  const filteredRanks = useMemo(() => {
    if (!searchQuery.trim()) return PRODUCTS;
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.benefits.some((b) => b.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // 4 Featured Cards for "You Might Also Like" section (Matching Reference Image)
  const youMightAlsoLike = useMemo(() => {
    return [
      {
        id: 12,
        title: "Nether Berserker (Legend)",
        rankName: "Florence Monarch (Legend)",
        badge: "2.5k Players",
        tag1: "Strategy",
        tag2: "Battle Royale",
        image: "/assets/characters/character-berserker.webp",
        product: PRODUCTS.find((p) => p.id === 12) || PRODUCTS[0]
      },
      {
        id: 11,
        title: "Celestial Sorceress (VIP)",
        rankName: "Rank VIP",
        badge: "2.5k Players",
        tag1: "Strategy",
        tag2: "Shooter",
        image: "/assets/characters/character-sorceress.webp",
        product: PRODUCTS.find((p) => p.id === 11) || PRODUCTS[1]
      },
      {
        id: 7,
        title: "Shadowblade Valkyrie",
        rankName: "Rank Diamond",
        badge: "New",
        tag1: "Video Game",
        tag2: "Multiplayer",
        image: "/assets/characters/character-assassin.webp",
        product: PRODUCTS.find((p) => p.id === 7) || PRODUCTS[2]
      },
      {
        id: 8,
        title: "Street Fighter Empire",
        rankName: "Rank Emerald",
        badge: "2.5k Players",
        tag1: "Strategy",
        tag2: "Fighting",
        image: "/assets/characters/character-warrior.webp",
        product: PRODUCTS.find((p) => p.id === 8) || PRODUCTS[3]
      }
    ];
  }, []);

  // Filtered Friends from Whitelist
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return OFFICIAL_WHITELIST;
    const q = searchQuery.toLowerCase();
    return OFFICIAL_WHITELIST.filter((p) => p.toLowerCase().includes(q));
  }, [searchQuery]);

  // =========================================================================
  // AUTH GUARD: Jika belum login, tampilkan layar otentikasi resmi
  // =========================================================================
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#110815] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full bg-[#1b0d24]/90 border border-[#3b1747] rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(225,29,72,0.25)] backdrop-blur-xl text-center space-y-5">
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
              Halaman ini khusus untuk pemain terverifikasi <strong>Minecraft Bedrock</strong>. Silakan masuk atau daftarkan akun Gamertag Anda.
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

  // Live avatar URL
  const avatarUrl = currentUser.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(currentUser.gamertag)}/80`;

  return (
    <div className="min-h-screen bg-[#110617] text-slate-100 flex p-2 sm:p-3 lg:p-5 font-sans select-none overflow-x-hidden">
      
      {/* Outer Cockpit Container with Exact Reference Plum/Wine Palette & Rounding */}
      <div className="w-full max-w-[1580px] mx-auto bg-[#1a0a24]/95 border border-[#30133c] rounded-[26px] sm:rounded-[34px] shadow-[0_20px_90px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row overflow-hidden relative backdrop-blur-2xl">
        
        {/* ===================================================================
            LEFT SIDEBAR (EXACT MATCH TO REFERENCE IMAGE 1)
           =================================================================== */}
        <aside className="w-full lg:w-60 bg-[#16081e]/95 border-b lg:border-b-0 lg:border-r border-[#2b0f38] p-4 sm:p-5 flex flex-col justify-between shrink-0">
          
          <div className="space-y-5">
            
            {/* Logo / Brand Header */}
            <div className="flex items-center gap-2.5 px-1">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-600/30 to-purple-900/40 border border-red-500/40 p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/logo/florence-network-logo.png"
                  alt="Florence Network"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="overflow-hidden">
                <span className="font-cinzel text-xs sm:text-sm font-black tracking-wider text-white block leading-tight truncate">
                  FLORENCE <span className="text-red-400">NET</span>
                </span>
                <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block">
                  CONSOLE DASHBOARD
                </span>
              </div>
            </div>

            {/* Navigation Tabs (Exact Matching Names from Reference Screenshot) */}
            <nav className="space-y-1 font-montserrat text-xs">
              
              {/* 1. My Dashboard */}
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>My Dashboard</span>
              </button>

              {/* 2. Game's List (Rank Catalog) */}
              <button
                type="button"
                onClick={() => setActiveTab("ranks")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "ranks"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span>Game&apos;s List</span>
              </button>

              {/* 3. Explore Store */}
              <Link
                href="/#katalog"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Explore Store</span>
              </Link>

              {/* 4. Purchased */}
              <button
                type="button"
                onClick={() => setActiveTab("purchased")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "purchased"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 shrink-0" />
                  <span>Purchased</span>
                </div>
                {userOrders.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-mono">
                    {userOrders.length}
                  </span>
                )}
              </button>

              {/* 5. Friends (Official Whitelist Players) */}
              <button
                type="button"
                onClick={() => setActiveTab("friends")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "friends"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Friends</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                  {OFFICIAL_WHITELIST.length}
                </span>
              </button>

              {/* 6. Payments (Billing & Google Sheets/Drive Link) */}
              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "payments"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Payments</span>
              </button>

              {/* 7. Notification */}
              <button
                type="button"
                onClick={() => setActiveTab("notification")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "notification"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>Notification</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              {/* 8. Settings */}
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === "settings"
                    ? "bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(225,29,72,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Settings</span>
              </button>

            </nav>

            {/* ONLINE PLAYERS SECTION (EXACT MATCH TO REFERENCE SCREENSHOT) */}
            <div className="pt-3 border-t border-[#2a0e35] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>ONLINE PLAYERS</span>
                <button
                  type="button"
                  onClick={() => setActiveTab("friends")}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Lihat Semua Teman"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Player Roster from Official Whitelist */}
              <div className="space-y-2">
                {[
                  { name: "CelCelxyh", status: "Online", rank: "VIP" },
                  { name: "Adyputra6", status: "In-Game", rank: "Player" },
                  { name: "Chyntia136", status: "Survival", rank: "Member" },
                  { name: "AmiiLunaa", status: "Lobby", rank: "Player" }
                ].map((p, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => setActiveTab("friends")}
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <Image
                        src={`https://mc-heads.net/avatar/${p.name}/40`}
                        alt={p.name}
                        width={28}
                        height={28}
                        className="object-contain image-rendering-pixelated"
                        unoptimized
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
                    </div>
                    <div className="overflow-hidden leading-tight flex-1">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white block truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Bottom: Log Out Button (Matching Reference Image) */}
          <div className="pt-4 border-t border-[#2a0e35] mt-4 lg:mt-0">
            <button
              type="button"
              onClick={logoutUser}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#2a0f2b]/60 border border-[#4a1849] hover:bg-red-950/60 hover:border-red-500/50 text-slate-300 hover:text-white text-xs font-montserrat font-bold transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>

        </aside>

        {/* ===================================================================
            MAIN COCKPIT PANEL (HEADER, HERO BANNER, LIBRARY, YOU MIGHT LIKE)
           =================================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 flex flex-col space-y-5 overflow-y-auto max-h-[96vh]">
          
          {/* Top Bar: Search Bar, Bell, Profile Capsule, Settings (Exact Match to Image 1) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input Bar (Matching Image 1: "Search for games...") */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for games, ranks, perks..."
                className="w-full bg-[#240e30]/80 border border-[#3e1951] rounded-2xl py-2 pl-10 pr-4 text-xs font-montserrat text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-all shadow-inner"
              />
            </div>

            {/* Right Group: Bedrock IP Pill, Notification Bell, User Capsule, Settings */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              
              {/* Server IP Pill */}
              <button
                type="button"
                onClick={copyServerIP}
                className="px-3 py-1.5 rounded-xl bg-[#240e30] border border-[#3e1951] hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-2 transition-all"
                title="Salin IP Bedrock"
              >
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline font-bold">{CONFIG.SERVER_IP}:{CONFIG.BEDROCK_PORT}</span>
                {copiedIP ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Notification Bell with Badge */}
              <button 
                type="button"
                onClick={() => setActiveTab("notification")}
                className="relative p-2 rounded-xl bg-[#240e30] border border-[#3e1951] text-slate-300 hover:text-white transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              {/* Player Capsule (Alex Ryan @alex.gg style) */}
              <div 
                onClick={() => setActiveTab("settings")}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-[#240e30] border border-[#3e1951] cursor-pointer hover:border-red-400/50 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-amber-400/60 overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={avatarUrl}
                    alt={currentUser.gamertag}
                    width={28}
                    height={28}
                    className="object-contain image-rendering-pixelated"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-left leading-tight pr-1">
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">
                    {currentUser.gamertag}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    @{currentUser.gamertag.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Settings Gear Icon */}
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className="p-2 rounded-xl bg-[#240e30] border border-[#3e1951] text-slate-300 hover:text-white transition-colors"
                title="Pengaturan Akun"
              >
                <Settings className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* =================================================================
              CONTENT TAB: DASHBOARD (EXACT COCKPIT FROM REFERENCE IMAGE 1)
             ================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOP SPLIT: HERO SPOTLIGHT (65%) + IN LIBRARY CARD (35%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* 1. HERO SPOTLIGHT CARD (Matching Marvel's Spider-Man Remastered Banner) */}
                <div className="lg:col-span-8 rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#2a0e35] via-[#3d1248] to-[#1c0825] border border-[#4d195c] p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[340px]">
                  
                  {/* Subtle Background Art Watermark */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
                    <Image
                      src="/assets/backgrounds/background-04-divine-rpg-world.webp"
                      alt="Hero Art Background"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Left Details */}
                    <div className="md:col-span-7 space-y-3">
                      {/* Popular Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] font-montserrat font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Popular
                      </span>

                      {/* Main Title */}
                      <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight">
                        Florence Monarch: Divine Ascension
                      </h2>

                      {/* Description */}
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        Nikmati pengalaman bermain Minecraft Bedrock terbaik dengan rank eksklusif, bonus saldo koin, perlengkapan survival, dan sinkronisasi otomatis Google Database.
                      </p>

                      {/* Book Now / Buy Action Button (Red Button Matching Reference) */}
                      <div className="pt-2 flex items-center gap-3 flex-wrap">
                        <Link
                          href="/#katalog"
                          className="px-6 py-2.5 rounded-2xl bg-[#e11d48] hover:bg-[#f43f5e] active:scale-95 text-white font-montserrat font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(225,29,72,0.5)] transition-all flex items-center gap-2"
                        >
                          <span>Beli / Upgrade Rank</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setIsSkinModalOpen(true)}
                          className="px-4 py-2.5 rounded-2xl bg-[#1c0825] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Ganti Skin 3D</span>
                        </button>
                      </div>
                    </div>

                    {/* Right: Live Interactive Walking 3D Minecraft Character */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center">
                      <div className="w-full max-w-[210px] h-[240px] rounded-2xl bg-black/40 border border-[#4d195c]/60 p-2 relative flex items-center justify-center shadow-inner">
                        <MinecraftSkinViewer
                          skinUrl={currentUser.customSkinUrl}
                          gamertag={currentUser.gamertag}
                          height={220}
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                          3D Walking Skin
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Navigation Dots & Arrows (< > 1/5 •) */}
                  <div className="relative z-10 pt-4 mt-2 flex items-center justify-between border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setHeroSlide((prev) => (prev > 1 ? prev - 1 : 5))}
                        className="w-7 h-7 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-slate-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setHeroSlide((prev) => (prev < 5 ? prev + 1 : 1))}
                        className="w-7 h-7 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-slate-300"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono ml-2">
                        {heroSlide}/5
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${
                            heroSlide === idx ? "bg-[#e11d48] w-4" : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                </div>

                {/* 2. IN LIBRARY CARD (Exact Matching Reference Image 1) */}
                <div className="lg:col-span-4 rounded-[28px] sm:rounded-[32px] bg-[#1c0a27] border border-[#371545] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#30133c] mb-3">
                      <h3 className="font-montserrat text-sm font-bold text-white tracking-wide">
                        In Library
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        4 ITEMS
                      </span>
                    </div>

                    {/* 4 Library Items */}
                    <div className="space-y-3">
                      
                      {/* Item 1: Active Rank */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#250d33] border border-[#3e1951] hover:border-red-500/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
                            <Image
                              src="/assets/characters/character-warrior.webp"
                              alt="Active Rank"
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                              {currentUser.rank || "Rank Member"}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[9px] font-mono">
                                Rank Aktif
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-red-900/40 text-rose-300 text-[9px] font-mono">
                                Bedrock
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab("ranks")}
                          className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#e11d48] text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0"
                          title="Lihat Detail Rank"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item 2: Whitelist Pass */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#250d33] border border-[#3e1951] hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden border border-emerald-400/40 p-1 flex items-center justify-center shrink-0">
                            <Image
                              src="/assets/characters/character-berserker.webp"
                              alt="Whitelist"
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                              Whitelist Bedrock
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[9px] font-mono">
                                Verified
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-900/40 text-cyan-300 text-[9px] font-mono">
                                19242
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={copyServerIP}
                          className="w-8 h-8 rounded-full bg-black/40 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0"
                          title="Salin IP"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item 3: Daily Kit & Coins */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#250d33] border border-[#3e1951] hover:border-amber-500/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
                            <Image
                              src="/assets/characters/character-sorceress.webp"
                              alt="Daily Kit"
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                              Kit & Koin Harian
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 text-[9px] font-mono">
                                Daily
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[9px] font-mono">
                                Survival
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyCommandText("+kit")}
                          className="w-8 h-8 rounded-full bg-black/40 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0"
                          title="Klaim Kit"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item 4: Kwitansi Pembayaran Terakhir */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#250d33] border border-[#3e1951] hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden border border-cyan-400/40 p-1 flex items-center justify-center shrink-0">
                            <Image
                              src="/assets/characters/character-assassin.webp"
                              alt="Receipt"
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                              Kwitansi Terakhir
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 text-[9px] font-mono">
                                Official
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300 text-[9px] font-mono">
                                PDF HD
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (userOrders.length > 0) {
                              handleOpenReceipt(userOrders[0]);
                            } else {
                              showToast("Belum ada transaksi pembelian.");
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-black/40 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0"
                          title="Cetak Kwitansi"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30133c] text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab("purchased")}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Lihat Riwayat Lengkap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>

              {/* BOTTOM SECTION: "YOU MIGHT ALSO LIKE" (EXACT MATCH TO REFERENCE IMAGE 1) */}
              <div className="space-y-3.5">
                
                {/* Header: Title Left, Nav Controls Right */}
                <div className="flex items-center justify-between">
                  <h3 className="font-montserrat text-sm sm:text-base font-extrabold text-white tracking-wide">
                    You Might Also Like
                  </h3>

                  {/* Left / Right Arrow Controls Matching Image 1 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast("Menampilkan rekomendasi...")}
                      className="w-7 h-7 rounded-full bg-[#250d33] border border-[#3e1951] hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Menampilkan rekomendasi berikutnya...")}
                      className="w-7 h-7 rounded-full bg-[#e11d48] text-white hover:bg-[#f43f5e] flex items-center justify-center shadow transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Cards Grid Matching Exact Layout from Image 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {youMightAlsoLike.map((card) => (
                    <div
                      key={card.id}
                      className="group rounded-2xl bg-[#1c0a27] border border-[#371545] hover:border-red-500/60 p-3.5 flex flex-col justify-between shadow-lg transition-all duration-300"
                    >
                      <div>
                        {/* Artwork Banner with Badge */}
                        <div className="relative h-32 w-full rounded-xl bg-gradient-to-br from-black/80 to-[#270d37] border border-white/5 mb-3 overflow-hidden flex items-center justify-center">
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1c0a27] via-transparent to-black/30" />
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[9px] font-mono font-bold border border-white/10">
                            {card.badge}
                          </span>
                        </div>

                        {/* Title & Tags */}
                        <h4 className="font-montserrat text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {card.title}
                        </h4>

                        {/* Category Tags Matching Reference */}
                        <div className="flex items-center gap-1.5 mt-1.5 mb-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#2d113e] text-purple-300 text-[9px] font-semibold">
                            {card.tag1}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#2d113e] text-purple-300 text-[9px] font-semibold">
                            {card.tag2}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-amber-300 font-cinzel text-xs font-black">
                            {formatRupiah(card.product.price)}
                          </span>
                          <span className="text-slate-500 line-through text-[10px]">
                            {formatRupiah(card.product.oldPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button
                        type="button"
                        onClick={() => buyNow(card.product)}
                        className="mt-3 w-full py-2 rounded-xl bg-[#e11d48]/20 hover:bg-[#e11d48] border border-[#e11d48]/50 text-rose-200 hover:text-white text-[11px] font-montserrat font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Beli Sekarang</span>
                      </button>

                    </div>
                  ))}
                </div>

              </div>

              {/* PERINTAH CHAT IN-GAME (+cmd cheat sheet) */}
              <div className="rounded-3xl bg-[#1c0a27] border border-[#371545] p-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#30133c] mb-3">
                  <span className="font-cinzel text-xs font-bold text-white tracking-wider uppercase">
                    DAFTAR PERINTAH CHATBOX RESMI SERVER (FORMAT: +cmd)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    KLIK UNTUK SALIN PERINTAH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {activeCommands.map((item) => (
                    <div
                      key={item.cmd}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#250d33] border border-[#3e1951] hover:border-cyan-400/50 transition-all"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-base select-none">{item.icon}</span>
                        <div className="overflow-hidden">
                          <span className="font-mono text-xs font-black text-emerald-400 block truncate">
                            {item.cmd}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
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

            </div>
          )}

          {/* =================================================================
              CONTENT TAB: GAME'S LIST (RANK CATALOG)
             ================================================================= */}
          {activeTab === "ranks" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#30133c]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Katalog Lengkap Rank & Benefit In-Game
                  </h3>
                  <p className="text-xs text-slate-400">
                    Semua rank berstatus aktif selama tema server saat ini berlangsung.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRanks.map((rank) => (
                  <div
                    key={rank.id}
                    className="p-4 rounded-2xl bg-[#1c0a27] border border-[#371545] hover:border-amber-300/40 transition-all flex flex-col justify-between space-y-3"
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
                      className="w-full py-2 rounded-xl bg-[#e11d48] text-white font-montserrat font-bold text-xs hover:bg-[#f43f5e] transition-colors"
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
              <div className="flex items-center justify-between pb-3 border-b border-[#30133c]">
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
                <div className="text-center py-16 bg-[#1c0a27] rounded-3xl border border-[#371545] p-8 space-y-3">
                  <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="font-cinzel text-base font-bold text-slate-300">
                    Belum Ada Riwayat Pembelian
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Anda belum melakukan pemesanan rank atau benefit server. Silakan jelajahi katalog kami.
                  </p>
                  <Link
                    href="/#katalog"
                    className="inline-block px-5 py-2.5 rounded-xl bg-[#e11d48] text-white text-xs font-bold font-montserrat mt-2"
                  >
                    Beli Rank Pertama
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div
                      key={order.invoiceId}
                      className="p-4 rounded-2xl bg-[#1c0a27] border border-[#371545] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {order.invoiceId}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            order.status === "COMPLETED" 
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {order.status === "COMPLETED" ? "BERHASIL (DI-ACC)" : "MENUNGGU ACC ADMIN"}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white">
                          {order.items.map((it) => it.name).join(", ")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleString("id-ID")} • Total: {formatRupiah(order.total)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(order)}
                        className="px-4 py-2 rounded-xl bg-[#250d33] border border-[#3e1951] hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Kwitansi HD</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: FRIENDS (OFFICIAL WHITELIST ROSTER)
             ================================================================= */}
          {activeTab === "friends" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#30133c]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Daftar Pemain Resmi & Whitelist ({filteredFriends.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pemain yang terdaftar resmi dan memiliki izin masuk server Minecraft Bedrock Florence Network.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredFriends.map((ign, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#1c0a27] border border-[#371545] flex items-center gap-2.5 hover:border-cyan-400/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                      <Image
                        src={`https://mc-heads.net/avatar/${encodeURIComponent(ign)}/48`}
                        alt={ign}
                        width={36}
                        height={36}
                        className="object-contain image-rendering-pixelated group-hover:scale-110 transition-transform"
                        unoptimized
                      />
                    </div>
                    <div className="overflow-hidden leading-tight">
                      <span className="text-xs font-bold text-white block truncate">
                        {ign}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400">
                        Whitelist ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: PAYMENTS (DATABASE SPREADSHEET & DRIVE)
             ================================================================= */}
          {activeTab === "payments" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#30133c]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Pusat Pembayaran & Integrasi Database
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sistem database Google Cloud resmi Florence Network untuk verifikasi pembayaran real-time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={CONFIG.GOOGLE_SPREADSHEET_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#1c0a27] border border-[#371545] hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      Google Spreadsheet Database
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Buka spreadsheet Users, Orders, Whitelist, dan Katalog Rank.
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <span>Buka Spreadsheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>

                <a
                  href={CONFIG.GOOGLE_DRIVE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#1c0a27] border border-[#371545] hover:border-cyan-500/60 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                      Google Drive Folder Storage
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Folder bukti transfer, skin Bedrock pemain, dan log invoice.
                    </p>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    <span>Buka Drive Folder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>

                <a
                  href={CONFIG.GOOGLE_APPS_SCRIPT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#1c0a27] border border-[#371545] hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300">
                      Google Apps Script Automation
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Endpoint serverless untuk sinkronisasi pesanan & upload Drive.
                    </p>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <span>Buka Script Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: NOTIFICATION
             ================================================================= */}
          {activeTab === "notification" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#30133c]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Pusat Notifikasi Server Florence
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pemberitahuan resmi event, jadwal maintenance, dan status rank.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#1c0a27] border border-[#371545] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Akun Anda Telah Terverifikasi</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gamertag <strong>{currentUser.gamertag}</strong> telah aktif dan terhubung ke whitelist Florence Network.
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Baru saja</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1c0a27] border border-[#371545] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Tema Server Aktif Berjalan</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Florence Network kini bergantung pada tema server aktif. Semua rank yang Anda beli aktif selama tema berjalan!
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hari ini</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              CONTENT TAB: SETTINGS (PROFILE & SKIN UPLOAD)
             ================================================================= */}
          {activeTab === "settings" && (
            <div className="space-y-5 animate-fadeIn max-w-2xl">
              <div className="pb-3 border-b border-[#30133c]">
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Pengaturan Akun & Skin Minecraft Bedrock
                </h3>
                <p className="text-xs text-slate-400">
                  Perbarui nomor WhatsApp, kata sandi, dan upload skin Bedrock Anda.
                </p>
              </div>

              {/* Skin Section */}
              <div className="p-5 rounded-3xl bg-[#1c0a27] border border-[#371545] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shirt className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Skin Karakter Minecraft Bedrock</h4>
                      <span className="text-[10px] text-slate-400">Support format 64x64 & 128x128 HD</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSkinModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Skin Baru</span>
                  </button>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSaveProfile} className="p-5 rounded-3xl bg-[#1c0a27] border border-[#371545] space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Gamertag (Tidak Dapat Diubah)</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.gamertag}
                    className="w-full bg-black/40 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    value={phoneEdit}
                    onChange={(e) => setPhoneEdit(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-[#250d33] border border-[#3e1951] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Ganti Password Baru</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Kosongkan jika tidak diubah"
                      className="w-full bg-[#250d33] border border-[#3e1951] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Ketik ulang password baru"
                      className="w-full bg-[#250d33] border border-[#3e1951] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-montserrat font-bold text-xs shadow transition-all"
                  >
                    {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan Akun"}
                  </button>
                </div>
              </form>

            </div>
          )}

        </main>

      </div>

      {/* =========================================================================
          MODAL: UPLOAD CUSTOM MINECRAFT BEDROCK SKIN (64x64 / 128x128 HD)
         ========================================================================= */}
      {isSkinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c0a27] border border-[#371545] rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsSkinModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-cinzel text-lg font-black text-white">
                Upload Skin Minecraft Bedrock
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan file PNG skin Bedrock standar 64x64 piksel atau 128x128 piksel HD.
              </p>
            </div>

            {skinUploadError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{skinUploadError}</span>
              </div>
            )}

            {/* Upload Area */}
            <label className="border-2 border-dashed border-[#4d195c] hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#250d33]/50">
              <UploadCloud className="w-10 h-10 text-cyan-400 mb-2" />
              <span className="text-xs font-bold text-slate-200">
                Klik untuk memilih file skin PNG
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Format: 64x64 atau 128x128 HD
              </span>
              <input
                type="file"
                accept="image/png"
                onChange={handleSkinFileSelect}
                className="hidden"
              />
            </label>

            {/* Preview */}
            {customSkinPreview && (
              <div className="p-3 rounded-2xl bg-black/40 border border-[#371545] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={customSkinPreview}
                      alt="Skin Preview"
                      className="w-10 h-10 object-contain image-rendering-pixelated"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">
                      ✓ Format Terdeteksi: {detectedFormat}
                    </span>
                    <span className="text-[10px] text-slate-400">Siap diterapkan ke avatar 3D</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSkinModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!customSkinPreview || isSavingSkin}
                onClick={handleSaveCustomSkin}
                className="flex-1 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] disabled:opacity-50 text-white text-xs font-bold shadow transition-all"
              >
                {isSavingSkin ? "Menyimpan..." : "Terapkan Skin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal />
      <InvoicePrintModal />
      <PaymentModal />
      <CheckoutModal />
      <CartDrawer />

    </div>
  );
}
