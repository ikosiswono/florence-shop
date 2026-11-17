"use client";

import React from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  Crown, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Users,
  MessageCircle
} from "lucide-react";
import { CONFIG } from "@/data/products";

export default function WhyChooseUs() {
  const perks = [
    {
      icon: Smartphone,
      title: "Bedrock Edition 1.26.62.1",
      desc: "Dioptimalkan khusus untuk pengguna HP Android, iPhone/iPad, dan Windows Bedrock dengan latensi stabil tanpa patah-patah.",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-400/30",
    },
    {
      icon: Clock,
      title: "Pengiriman 1x24 Jam Langsung Admin",
      desc: "Semua transaksi diproses dan diverifikasi secara langsung oleh admin resmi dengan garansi aktivasi cepat dan tepat sasaran.",
      color: "text-amber-400 bg-amber-500/10 border-amber-400/30",
    },
    {
      icon: Crown,
      title: "Rank Per-Season (Aktif 1 Season)",
      desc: "Rank ini berlaku khusus selama Season berjalan! Masa aktif mengikuti durasi season server hingga dilakukan reset/ganti season baru. Seluruh fasilitas command, money, dan kit perlengkapan dapat dinikmati penuh sepanjang season.",
      color: "text-purple-400 bg-purple-500/10 border-purple-400/30",
    },
    {
      icon: ShieldCheck,
      title: "Perlengkapan & Kit In-Game",
      desc: "Setiap rank dibekali paket kit perlengkapan in-game berupa armor, senjata, tools, dan item pendukung petualangan survival.",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-400/30",
    },
    {
      icon: Sparkles,
      title: "Bonus Money / Saldo In-Game",
      desc: "Dapatkan bonus uang in-game bernilai hingga jutaan koin instan untuk modal belanja di /shop server dan berdagang antar pemain.",
      color: "text-sky-400 bg-sky-500/10 border-sky-400/30",
    },
    {
      icon: MessageCircle,
      title: "Bantuan WhatsApp 24 Jam",
      desc: `Punya pertanyaan atau butuh bantuan saat top-up? Admin siap membantu via WhatsApp di ${CONFIG.ADMIN_WA_DISPLAY}.`,
      color: "text-rose-400 bg-rose-500/10 border-rose-400/30",
    },
  ];

  return (
    <section id="keunggulan" className="relative py-24 overflow-hidden">
      {/* Background 3 — Divine Frozen Mountain Kingdom */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/background-03-frozen-kingdom.webp"
          alt="Divine Frozen Mountain Kingdom Background"
          fill
          className="object-cover object-center"
          quality={95}
        />
        {/* Atmosphere overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041022] via-[#06203D]/65 to-[#041022]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#041022]/40 to-[#041022]/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Celestial Warrior Character Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[520px] bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative w-full max-w-md rounded-3xl overflow-hidden glass-panel-gold border border-amber-300/40 p-2 shadow-2xl group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950">
                <Image
                  src="/assets/characters/character-warrior.webp"
                  alt="Florence Network Celestial Knight"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B35] via-transparent to-transparent opacity-90" />

                {/* Floating Character Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-400/50 text-cyan-300 text-[11px] font-montserrat font-bold tracking-wider backdrop-blur-md">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>FLORENCE MONARCH TIER</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold tracking-wide border border-amber-400/30">
                    BERLAKU SELAMA SEASON BERJALAN
                  </span>
                </div>

                {/* Server Quick Status Card */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/85 border border-cyan-400/30 backdrop-blur-md text-xs font-montserrat">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">Status Server:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> ONLINE
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span>Pemain Aktif:</span>
                    <strong className="text-cyan-300">{CONFIG.STATS.onlineCount} ({CONFIG.STATS.recordCount})</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span>Versi Server:</span>
                    <strong className="text-purple-300">{CONFIG.STATS.supportedVersion} ({CONFIG.STATS.versionType})</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Perks Grid */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 backdrop-blur-md w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>KENAPA MEMILIH FLORENCE NETWORK?</span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-white text-shadow-dark mb-3">
              SERVER MINECRAFT TERPERCAYA
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed mb-6">
              Florence Network hadir memberikan pengalaman bermain Minecraft Bedrock terbaik di Indonesia dengan pelayanan cepat, komunitas suportif, dan gameplay yang menyenangkan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {perks.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <div
                    key={idx}
                    className="glass-panel rounded-xl p-3.5 border border-cyan-400/20 hover:border-amber-300/50 hover:shadow-glow transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`p-1.5 rounded-lg border ${p.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h3 className="font-cinzel text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                          {p.title}
                        </h3>
                      </div>
                      <p className="text-slate-300/80 text-[11px] font-sans font-light leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold font-montserrat">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Garansi Resmi Florence</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#katalog"
                className="btn-fantasy-gold px-6 py-3 rounded-xl text-xs tracking-wider inline-flex items-center gap-2"
              >
                <span>LIHAT DAFTAR RANK</span>
              </a>
              <a
                href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasy-outline px-6 py-3 rounded-xl text-xs tracking-wider inline-flex items-center gap-2"
              >
                <span>KONSULTASI VIA WA ADMIN</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
