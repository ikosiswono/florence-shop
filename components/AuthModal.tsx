"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function AuthModal() {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    authMode, 
    setAuthMode, 
    authMessage,
    registerUser,
    loginUser,
    loginWithGoogle
  } = useShop();

  const [gamertag, setGamertag] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleStep, setGoogleStep] = useState(false);
  const [googleGamertag, setGoogleGamertag] = useState("");

  if (!isAuthOpen) return null;

  // Live avatar preview based on gamertag input
  const avatarPreview = gamertag.trim()
    ? `https://mc-heads.net/avatar/${encodeURIComponent(gamertag.trim())}/80`
    : "https://mc-heads.net/avatar/Steve/80";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(gamertag, password);
      if (!res.success) {
        setError(res.message);
      } else {
        // Reset form
        setPassword("");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan sistem login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 5) {
      setError("Password minimal 5 karakter demi keamanan akun Anda.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password 1 dan Password 2 tidak sama. Pastikan kedua password yang Anda ketik cocok!");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(gamertag, password, phone, email);
      if (!res.success) {
        setError(res.message);
      } else {
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan pendaftaran akun.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!googleGamertag.trim()) {
      setError("Masukkan Gamertag Minecraft Bedrock Anda untuk menghubungkan akun Google.");
      return;
    }

    setLoading(true);
    try {
      const simulatedGoogleUser = {
        name: googleGamertag.trim(),
        email: `${googleGamertag.trim().toLowerCase().replace(/\s+/g, "")}@gmail.com`,
        gamertag: googleGamertag.trim(),
        phone: phone.trim()
      };
      const res = await loginWithGoogle(simulatedGoogleUser);
      if (!res.success) {
        setError(res.message);
      } else {
        setGoogleStep(false);
      }
    } catch (err: any) {
      setError("Gagal menghubungkan Google Sign-In.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-gold rounded-3xl max-w-md w-full border border-amber-300/40 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setIsAuthOpen(false);
            setError(null);
            setGoogleStep(false);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-400 hover:text-white hover:border-amber-400 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="relative pt-6 pb-4 px-6 text-center border-b border-white/10 bg-gradient-to-b from-cyan-950/60 via-[#061B35]/80 to-transparent shrink-0">
          <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center">
            {/* Minecraft Avatar Preview */}
            <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border-2 border-amber-300/60 shadow-glow-gold overflow-hidden flex items-center justify-center p-1">
              <Image
                src={avatarPreview}
                alt="Minecraft Avatar Head"
                width={52}
                height={52}
                className="object-contain image-rendering-pixelated"
                unoptimized
              />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-500 border border-slate-950 text-slate-950">
              <ShieldCheck className="w-3 h-3" />
            </span>
          </div>

          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white text-shadow-gold">
            {authMode === "login" ? "MASUK KE AKUN ANDA" : "BUAT AKUN FLORENCE"}
          </h3>
          <p className="text-[11px] text-slate-300 mt-1 font-sans">
            Gunakan Gamertag Minecraft Bedrock resmi Anda untuk verifikasi rank instan.
          </p>

          {/* Alert Message from Checkout Guard */}
          {authMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-200 text-[11px] flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{authMessage}</span>
            </div>
          )}
        </div>

        {/* Tabs: Masuk vs Daftar */}
        {!googleStep && (
          <div className="flex border-b border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-montserrat font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
                authMode === "login"
                  ? "bg-amber-400/20 text-amber-300 border-b-2 border-amber-300"
                  : "text-slate-400 hover:text-white bg-slate-950/40"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>MASUK (LOGIN)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-montserrat font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
                authMode === "register"
                  ? "bg-amber-400/20 text-amber-300 border-b-2 border-amber-300"
                  : "text-slate-400 hover:text-white bg-slate-950/40"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>DAFTAR AKUN BARU</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {googleStep ? (
            /* Google Sign-in Gamertag Confirmation */
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs">
                <p className="font-semibold mb-1">🔗 Hubungkan Akun Google</p>
                <p className="text-[11px] text-slate-300">
                  Ketik nama Gamertag Minecraft Bedrock Anda agar sistem server dapat mendeteksi akun in-game saat rank aktif.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1">
                  GAMERTAG MINECRAFT BEDROCK <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={googleGamertag}
                    onChange={(e) => setGoogleGamertag(e.target.value)}
                    placeholder="Contoh: SteveGamer99"
                    className="w-full bg-[#061B35]/80 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1">
                  NOMOR WHATSAPP (OPSIONAL)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-[#061B35]/80 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleStep(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-montserrat font-bold hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-fantasy-gold flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider"
                >
                  {loading ? "Menghubungkan..." : "Lanjutkan Masuk"}
                </button>
              </div>
            </form>
          ) : authMode === "login" ? (
            /* Form Login */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Gamertag Minecraft Bedrock <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    placeholder="Masukkan Gamertag in-game..."
                    className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300 focus:shadow-glow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Password Akun <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password akun Anda..."
                    className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300 focus:shadow-glow"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-fantasy-gold w-full py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? "MEMVERIFIKASI AKUN..." : "MASUK KE DASHBOARD"}</span>
              </button>
            </form>
          ) : (
            /* Form Registrasi */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Gamertag Minecraft Bedrock <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    placeholder="Nama karakter Bedrock Anda (IGN)..."
                    className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300 focus:shadow-glow"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Pastikan ejaan Gamertag sama persis dengan di game Minecraft.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Nomor WhatsApp Aktif <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300 focus:shadow-glow"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Digunakan untuk konfirmasi pesanan rank dan kwitansi.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Password 1 (Buat Baru) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 5 karakter"
                      className="w-full bg-[#061B35]/90 border border-cyan-400/30 rounded-xl py-2 pl-8 pr-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-montserrat font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Password 2 (Konfirmasi) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password"
                      className={`w-full bg-[#061B35]/90 border rounded-xl py-2 pl-8 pr-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                        confirmPassword
                          ? password === confirmPassword
                            ? "border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                            : "border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                          : "border-cyan-400/30 focus:border-amber-300"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Match Real-Time Indicator */}
              {confirmPassword && (
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[10px] font-montserrat font-bold">
                  {password === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Password 1 & Password 2 Cocok dan Sah!
                    </span>
                  ) : (
                    <span className="text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      ⚠️ Password 1 & Password 2 belum sama, pastikan keduanya cocok.
                    </span>
                  )}
                </div>
              )}

              {/* Anti-Hack Security Badge */}
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/20 text-[10px] text-cyan-300/90 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Anti-Hack Security:</strong> Enkripsi Hashing SHA-256 + Salt Unik & Proteksi Anti Brute-Force aktif.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-fantasy-gold w-full py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? "MEMBUAT AKUN ANDA..." : "DAFTAR & BUAT AKUN SEKARANG"}</span>
              </button>
            </form>
          )}

          {/* Divider */}
          {!googleStep && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-montserrat">
                <span className="bg-[#051326] px-3 text-slate-400 font-bold tracking-wider">
                  ATAU MASUK CEPAT
                </span>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          {!googleStep && (
            <button
              type="button"
              onClick={() => {
                setGoogleStep(true);
                setGoogleGamertag(gamertag);
                setError(null);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-montserrat font-bold text-xs flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google (Otomatis & Aman)</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
