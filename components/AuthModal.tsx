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
  AlertCircle,
  Eye,
  EyeOff,
  RotateCw,
  Check,
  ChevronDown
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG } from "@/data/products";

export default function AuthModal() {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    authMode, 
    setAuthMode, 
    authMessage,
    registerUser,
    loginUser
  } = useShop();

  // Form states
  const [fullName, setFullName] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI & Security states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  // Live avatar preview based on gamertag input
  const avatarPreview = gamertag.trim()
    ? `https://mc-heads.net/avatar/${encodeURIComponent(gamertag.trim())}/80`
    : "https://mc-heads.net/avatar/Steve/80";

  // Simulate bot verification click
  const handleCaptchaClick = () => {
    if (captchaVerified) return;
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
      setError(null);
    }, 600);
  };

  const handleRefreshCaptcha = () => {
    setCaptchaLoading(true);
    setCaptchaVerified(false);
    setTimeout(() => {
      setCaptchaLoading(false);
    }, 400);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaVerified) {
      setError("Harap centang verifikasi 'Saya bukan robot' terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser(gamertag, password);
      if (!res.success) {
        setError(res.message);
      } else {
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

    if (!agreeTerms) {
      setError("Anda harus menyetujui Syarat dan Ketentuan serta Kebijakan Pribadi untuk mendaftar.");
      return;
    }

    if (!captchaVerified) {
      setError("Harap centang verifikasi 'Saya bukan robot' terlebih dahulu.");
      return;
    }

    if (password.length < 5) {
      setError("Password minimal 5 karakter demi keamanan akun Anda.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi dan Konfirmasi kata sandi tidak cocok. Pastikan keduanya sama persis.");
      return;
    }

    // Format phone to standard if entered without +62
    let cleanPhone = phone.trim();
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }

    setLoading(true);
    try {
      const res = await registerUser(gamertag, password, cleanPhone, email, fullName);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog Styled Exactly Like Reference Screenshot */}
      <div className="bg-[#24272c] text-white rounded-2xl max-w-lg w-full border border-[#3b424e] shadow-2xl overflow-hidden relative max-h-[94vh] flex flex-col font-sans">
        
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={() => {
            setIsAuthOpen(false);
            setError(null);
          }}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">

          {/* Header Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {authMode === "register" ? "Daftar" : "Masuk"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {authMode === "register" 
                ? "Masukkan informasi pendaftaran yang valid." 
                : "Masukkan informasi akun Anda yang valid."}
            </p>

            {/* Alert Message from Checkout Guard */}
            {authMessage && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{authMessage}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content */}
          {authMode === "register" ? (
            /* =========================================================================
               DAFTAR (REGISTER) FORM - EXACT MATCH TO USER REFERENCE SCREENSHOT
               ========================================================================= */
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              {/* Row 1: Nama lengkap & Username (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Nama lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Alamat email (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Alamat email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat email"
                  className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                />
              </div>

              {/* Row 3: Nomor whatsapp (Indonesian Flag + +62 Badge + Input) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Nomor whatsapp
                </label>
                <div className="flex rounded-lg overflow-hidden border border-[#49515d] bg-[#353a43] focus-within:border-[#967751] transition-colors">
                  {/* Flag & Prefix Picker */}
                  <div className="flex items-center gap-1.5 px-3 bg-[#2d323b] border-r border-[#49515d] select-none shrink-0">
                    {/* Indonesian Flag Icon */}
                    <span className="text-base leading-none">🇮🇩</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-200 ml-1">+62</span>
                  </div>
                  {/* Phone Input */}
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=""
                    className="flex-1 bg-transparent py-2.5 px-3.5 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Kata sandi & Konfirmasi kata sandi (2 columns with Eye Toggles) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Kata sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata sandi"
                      className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Konfirmasi kata sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi kata sandi"
                      className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="text-[11px] font-medium">
                  {password === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Kata sandi cocok
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Kata sandi belum sama
                    </span>
                  )}
                </div>
              )}

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                  Saya setuju dengan{" "}
                  <span className="text-[#b38c5d] hover:underline font-medium">Syarat dan Ketentuan</span> dan{" "}
                  <span className="text-[#b38c5d] hover:underline font-medium">Kebijakan Pribadi</span>.
                </label>
              </div>

              {/* Bot Verification Widget (reCAPTCHA Styled Widget Matching Image) */}
              <div className="flex items-center gap-3 pt-1">
                {/* White Captcha Box */}
                <div 
                  onClick={handleCaptchaClick}
                  className="flex-1 bg-white rounded-lg p-3 sm:px-4 sm:py-3.5 flex items-center justify-between shadow border border-slate-300 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox state */}
                    <div className="w-6 h-6 rounded border-2 flex items-center justify-center transition-all bg-white border-slate-300">
                      {captchaLoading ? (
                        <RotateCw className="w-4 h-4 text-slate-500 animate-spin" />
                      ) : captchaVerified ? (
                        <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                      ) : null}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      Saya bukan robot
                    </span>
                  </div>

                  {/* reCAPTCHA Brand Logo */}
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 relative">
                      <svg viewBox="0 0 48 48" className="w-7 h-7">
                        <path fill="#1A73E8" d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 6c7.7 0 14 6.3 14 14s-6.3 14-14 14S10 31.7 10 24 16.3 10 24 10z"/>
                        <path fill="#4285F4" d="M24 12v6l7-7-7-7v6c-7.7 0-14 6.3-14 14h6c0-4.4 3.6-8 8-8z"/>
                        <path fill="#34A853" d="M36 24c0 6.6-5.4 12-12 12v-6l-7 7 7 7v-6c8.8 0 16-7.2 16-16h-4z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 tracking-tighter">reCAPTCHA</span>
                    <span className="text-[7px] text-slate-400">Privasi - Persyaratan</span>
                  </div>
                </div>

                {/* Refresh Captcha Button */}
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="w-12 h-12 rounded-lg bg-[#2d323b] border border-[#49515d] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#967751] transition-colors shrink-0"
                  title="Muat ulang Captcha"
                  aria-label="Muat ulang Captcha"
                >
                  <RotateCw className={`w-5 h-5 ${captchaLoading ? "animate-spin text-amber-400" : ""}`} />
                </button>
              </div>

              {/* Submit Button (Bronze / Warm Gold Matching Screenshot) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#967751] hover:bg-[#a6855c] active:bg-[#856743] py-3 rounded-lg text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-2 shadow transition-colors mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? "Memproses Pendaftaran..." : "Daftar"}</span>
              </button>

              {/* Switch to Login Footer */}
              <div className="text-center pt-2 text-xs text-slate-400">
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setError(null);
                  }}
                  className="text-[#b38c5d] hover:text-[#cbb085] font-semibold hover:underline"
                >
                  Masuk
                </button>
              </div>

            </form>
          ) : (
            /* =========================================================================
               MASUK (LOGIN) FORM - MATCHING DESIGN LANGUAGE
               ========================================================================= */
            <form onSubmit={handleLogin} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={gamertag}
                  onChange={(e) => setGamertag(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Kata sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi"
                    className="w-full bg-[#353a43] border border-[#49515d] rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#967751] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>
                <a
                  href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence,%20saya%20butuh%20bantuan%20reset%20kata%20sandi%20akun.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#b38c5d] hover:text-[#cbb085] hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>

              {/* Bot Verification Widget */}
              <div className="flex items-center gap-3 pt-1">
                <div 
                  onClick={handleCaptchaClick}
                  className="flex-1 bg-white rounded-lg p-3 sm:px-4 sm:py-3.5 flex items-center justify-between shadow border border-slate-300 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 flex items-center justify-center transition-all bg-white border-slate-300">
                      {captchaLoading ? (
                        <RotateCw className="w-4 h-4 text-slate-500 animate-spin" />
                      ) : captchaVerified ? (
                        <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                      ) : null}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      Saya bukan robot
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 relative">
                      <svg viewBox="0 0 48 48" className="w-7 h-7">
                        <path fill="#1A73E8" d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 6c7.7 0 14 6.3 14 14s-6.3 14-14 14S10 31.7 10 24 16.3 10 24 10z"/>
                        <path fill="#4285F4" d="M24 12v6l7-7-7-7v6c-7.7 0-14 6.3-14 14h6c0-4.4 3.6-8 8-8z"/>
                        <path fill="#34A853" d="M36 24c0 6.6-5.4 12-12 12v-6l-7 7 7 7v-6c8.8 0 16-7.2 16-16h-4z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 tracking-tighter">reCAPTCHA</span>
                    <span className="text-[7px] text-slate-400">Privasi - Persyaratan</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="w-12 h-12 rounded-lg bg-[#2d323b] border border-[#49515d] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#967751] transition-colors shrink-0"
                  title="Muat ulang Captcha"
                  aria-label="Muat ulang Captcha"
                >
                  <RotateCw className={`w-5 h-5 ${captchaLoading ? "animate-spin text-amber-400" : ""}`} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#967751] hover:bg-[#a6855c] active:bg-[#856743] py-3 rounded-lg text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-2 shadow transition-colors mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? "Memverifikasi..." : "Masuk"}</span>
              </button>

              {/* Switch to Register Footer */}
              <div className="text-center pt-2 text-xs text-slate-400">
                Belum memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setError(null);
                  }}
                  className="text-[#b38c5d] hover:text-[#cbb085] font-semibold hover:underline"
                >
                  Daftar
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
