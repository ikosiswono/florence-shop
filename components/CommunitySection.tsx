"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Users, 
  Smartphone, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { CONFIG } from "@/data/products";
import { useShop } from "@/context/ShopContext";

export default function CommunitySection() {
  const { showToast } = useShop();
  const [copiedIP, setCopiedIP] = useState(false);

  const copyServerIP = () => {
    navigator.clipboard.writeText(`${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}`);
    setCopiedIP(true);
    showToast(`✓ IP Server (${CONFIG.SERVER_IP}:${CONFIG.BEDROCK_PORT}) berhasil disalin!`);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  return (
    <section id="komunitas" className="relative py-24 bg-[#041022] overflow-hidden">
      {/* Background 4 — Divine RPG World */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/background-04-divine-rpg-world.webp"
          alt="Divine RPG World Background"
          fill
          className="object-cover object-center"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#041022] via-[#051C36]/70 to-[#041022]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-900/30 border border-cyan-400/30 text-cyan-300 text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>KOMUNITAS MINECRAFT INDONESIA</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-white text-shadow-dark mb-3">
            GABUNG BERSAMA FLORENCE NETWORK
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed">
            Mainkan Minecraft bersama teman-temanmu di server survival ramah pemula dengan perlindungan lahan dan ekonomi aktif.
          </p>
        </div>

        {/* Dual Cards: Tutorial Connect Bedrock & WhatsApp Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Cara Masuk Server Bedrock */}
          <div className="glass-panel-gold rounded-2xl p-6 border border-amber-300/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-montserrat font-bold text-amber-300 uppercase tracking-wider block mb-2">
                PANDUAN LOGIN BEDROCK
              </span>
              <h3 className="font-cinzel text-lg font-bold text-white mb-3">
                Cara Masuk Server (HP & Windows)
              </h3>
              <ol className="space-y-2 text-xs text-slate-300 font-sans list-decimal list-inside leading-relaxed mb-6">
                <li>Buka game Minecraft Bedrock Anda.</li>
                <li>Pilih menu <strong>Play &gt; Servers &gt; Add Server</strong>.</li>
                <li>Isi Server Name: <strong className="text-amber-300">Florence Network</strong>.</li>
                <li>Isi Server Address: <strong className="text-cyan-300">{CONFIG.SERVER_IP}</strong>.</li>
                <li>Isi Port: <strong className="text-cyan-300">{CONFIG.BEDROCK_PORT}</strong> lalu klik <strong>Play / Save</strong>!</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={copyServerIP}
              className="btn-fantasy-cyan w-full py-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2"
            >
              {copiedIP ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{copiedIP ? "IP TERSALIN!" : "SALIN ALAMAT SERVER"}</span>
            </button>
          </div>

          {/* Card 2: Layanan WhatsApp Admin */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-400/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-montserrat font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                BANTUAN & TRANSAKSI
              </span>
              <h3 className="font-cinzel text-lg font-bold text-white mb-3">
                Layanan Admin WhatsApp
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                Ada kendala saat pembayaran QRIS/DANA/GoPay? Atau ingin memesan rank khusus secara manual? Hubungi admin resmi kami langsung melalui WhatsApp:
              </p>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-montserrat space-y-1 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor WhatsApp:</span>
                  <strong className="text-emerald-400">{CONFIG.ADMIN_WA_DISPLAY}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jam Operasional:</span>
                  <strong className="text-white">24 Jam Setiap Hari</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Respon Rata-rata:</span>
                  <strong className="text-cyan-300">&lt; 5 Menit</strong>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>CHAT WA: {CONFIG.ADMIN_WA_DISPLAY}</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
