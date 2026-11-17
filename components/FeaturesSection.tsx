"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Play, 
  Swords, 
  Shield, 
  Hammer, 
  Castle, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Sparkles, 
  ExternalLink,
  Flame,
  X
} from "lucide-react";

interface FeatureTab {
  id: string;
  name: string;
  icon: React.ElementType;
  title: string;
  description: string;
  highlightStats: { label: string; value: string }[];
}

export default function FeaturesSection() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const featureTabs: FeatureTab[] = [
    {
      id: "hunting",
      name: "HUNTING GROUNDS",
      icon: Swords,
      title: "EPIC WORLD BOSSES & DUNGEON EXPEDITIONS",
      description: "Jelajahi Hunting Grounds tanpa batas di mana makhluk mitologi purba dan Colossus penjaga gerbang langit bangkit. Bentuk party 8 hingga 24 pemain untuk menaklukkan mekanik pertarungan bertahap dan raih drop relic surgawi legendaris.",
      highlightStats: [
        { label: "WORLD BOSSES", value: "32 Unique Titans" },
        { label: "DIFFICULTY", value: "Normal / Heroic / Mythic" },
        { label: "RAID LOOT", value: "Tier 5 Divine Relics" },
      ],
    },
    {
      id: "crafting",
      name: "CRAFTING SYSTEM",
      icon: Hammer,
      title: "MASTER ALCHEMY, BLACKSMITHING & RUNE FORGING",
      description: "Sistem ekonomi dan crafting yang 100% dikendalikan oleh pemain. Kumpulkan kristal aether dari kepulauan melayang, tempa bilah pedang berkekuatan petir, dan gabungkan batu rune purba untuk membuka atribut sihir tersembunyi.",
      highlightStats: [
        { label: "PROFESSIONS", value: "8 Master Trades" },
        { label: "RUNE COMBINATIONS", value: "500+ Hidden Affixes" },
        { label: "PLAYER MARKET", value: "Tax-Free Auction House" },
      ],
    },
    {
      id: "siege",
      name: "CASTLE SIEGE",
      icon: Castle,
      title: "500 VS 500 MASSIVE GUILD CITADEL WARFARE",
      description: "Pertempuran skala kolosal setiap hari Minggu malam! Bangun ketapel sihir, robohkan gerbang batu raksasa, dan rebut tahta kerajaan langit untuk mengklaim pajak kastil, tahta kaisar, dan patung emas guild di pusat kota.",
      highlightStats: [
        { label: "SIEGE CAPACITY", value: "1,000 Simultaneous Players" },
        { label: "DEFENSE WEAPONS", value: "Ballistas & Magic Cannons" },
        { label: "GUILD REWARDS", value: "Emperor's Crown & Citadel Tax" },
      ],
    },
    {
      id: "flight",
      name: "CELESTIAL FLIGHT",
      icon: Compass,
      title: "UNRESTRICTED 360° SKY EXPLORATION & MOUNT COMBAT",
      description: "Rasakan kebebasan sejati menjelajahi angkasa Aetheria. Jinakkan naga langit, griffin bersayap emas, dan kapal udara sihir untuk bertarung di udara serta melintasi lautan awan antarpulau melayang.",
      highlightStats: [
        { label: "FLIGHT SPEED", value: "Up to 450% Boost" },
        { label: "MOUNT BREEDING", value: "Elemental Gene Fusion" },
        { label: "AERIAL COMBAT", value: "Sky Archery & Jousting" },
      ],
    },
  ];

  const currentTab = featureTabs[activeTabIdx];

  const classCards = [
    {
      name: "ASTRAL SORCERESS",
      role: "Ranged Arcane DPS",
      desc: "Penguasa sihir kosmik dan bintang, mampu memanggil hujan meteor dan menghentikan aliran waktu musuh.",
      image: "/assets/characters/character-sorceress.webp",
      videoBadge: "GAMEPLAY 4K",
      author: "Marcus X (Lead GM)",
      date: "Season V",
    },
    {
      name: "SHADOWBLADE VALKYRIE",
      role: "Burst Melee Assassin",
      desc: "Penari bayangan bersenjatakan daggers magenta listrik. Menguasai teleportasi instan dan kombo beruntun.",
      image: "/assets/characters/character-assassin.webp",
      videoBadge: "CLASS SHOWCASE",
      author: "Aetheria DevTeam",
      date: "Season V",
    },
    {
      name: "NETHER BERSERKER",
      role: "Frontline Bruiser & Tank",
      desc: "Raksasa obsidian berlumur api fel. Setiap pukulan kapak raksasanya membelah tanah dan menyerap darah musuh.",
      image: "/assets/characters/character-berserker.webp",
      videoBadge: "ARENA COMBAT",
      author: "Combat Director",
      date: "Season V",
    },
    {
      name: "CELESTIAL PALADIN",
      role: "Divine Knight & Support",
      desc: "Banteng pertahanan berzirah perak suci. Melindungi rekan satu tim dengan perisai cahaya dan doa pemulihan.",
      image: "/assets/characters/character-warrior.webp",
      videoBadge: "RAID TANK",
      author: "Vanguard Guild",
      date: "Season V",
    },
  ];

  return (
    <section id="features" className="relative py-28 bg-[#041022] overflow-hidden">
      {/* Decorative Atmosphere Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-900/30 border border-cyan-400/30 text-cyan-300 text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>DYNAMIC MMORPG SYSTEMS</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-white text-shadow-dark mb-4">
            ABOUT AETHERIA — CORE FEATURES
          </h2>

          <p className="text-slate-300/90 text-sm sm:text-base font-sans font-light leading-relaxed">
            Didesain dengan perhatian mendalam terhadap kebebasan bermain, pertarungan aksi taktis, dan petualangan tanpa batas yang menggetarkan jiwa.
          </p>
        </div>

        {/* Editorial Feature Showcase (Split 2-Column Like Image Reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Left Column: Featured Trailer Video Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-cyan-400/30 shadow-2xl group">
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <Image
                  src="/assets/gallery/feature-trailer-thumb.webp"
                  alt="Aetheria Hunting Grounds Raid Boss Trailer"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B35] via-transparent to-transparent opacity-80" />

                {/* Badge Tag Top Left */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-montserrat font-bold tracking-wider backdrop-blur-md">
                  OFFICIAL TRAILER
                </span>

                {/* Big Center Play Button */}
                <button
                  type="button"
                  onClick={() => setActiveVideoModal("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400/90 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-glow-gold hover:scale-110 transition-all duration-300 group/btn"
                  aria-label="Play Trailer Video"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1 group-hover/btn:scale-110 transition-transform" />
                </button>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200 font-montserrat">
                  <span className="font-bold tracking-wider text-amber-200 truncate pr-2">
                    [TRAILER] CELESTIAL COLOSSUS RAID BATTLE [WATCH]
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    30,522,322 Views
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Feature Info Box */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel-gold rounded-2xl p-6 sm:p-8 border border-amber-300/40">
            <div>
              {/* Tab Navigation Arrows / Icons Row */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-400/20">
                <span className="text-[11px] font-montserrat font-bold tracking-widest text-amber-300 uppercase">
                  GAMEPLAY SYSTEMS ({activeTabIdx + 1} / {featureTabs.length})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx((prev) => (prev > 0 ? prev - 1 : featureTabs.length - 1))}
                    className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-colors"
                    aria-label="Previous Feature"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx((prev) => (prev < featureTabs.length - 1 ? prev + 1 : 0))}
                    className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-colors"
                    aria-label="Next Feature"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Tab Chips */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {featureTabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTabIdx === idx;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabIdx(idx)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-montserrat transition-all ${
                        isActive
                          ? "bg-amber-400/20 border border-amber-400 text-amber-200 font-bold shadow-glow-gold"
                          : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-slate-500"}`} />
                      <span className="truncate text-[11px]">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Content */}
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-3">
                {currentTab.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed mb-6">
                {currentTab.description}
              </p>

              {/* Highlight Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 mb-6 text-center">
                {currentTab.highlightStats.map((st, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] font-montserrat text-slate-400 uppercase tracking-wider">
                      {st.label}
                    </span>
                    <strong className="text-xs font-cinzel text-amber-300 truncate">
                      {st.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-amber-400/20">
              <a
                href="#download"
                className="btn-fantasy-gold flex-1 py-3 rounded-xl text-xs tracking-wider text-center"
              >
                PLAY NOW
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fantasy-outline flex-1 py-3 rounded-xl text-xs tracking-wider text-center"
              >
                JOIN DISCORD
              </a>
            </div>

          </div>

        </div>

        {/* 4 Interactive Class / Character Cards (Matching Image Reference Bottom) */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-montserrat font-bold tracking-widest text-cyan-400 uppercase">
                CHOOSE YOUR DESTINY
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                HEROIC CLASS ROSTER
              </h3>
            </div>
            <a
              href="#community"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-montserrat font-semibold text-amber-300 hover:text-white transition-colors"
            >
              <span>VIEW ALL 12 SPECIALIZATIONS</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classCards.map((cls, idx) => (
              <div
                key={idx}
                className="glass-panel group rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-300/60 hover:shadow-glow-gold transition-all duration-500 hover:-translate-y-2"
              >
                <div>
                  {/* Thumbnail & Video Icon */}
                  <div className="relative aspect-[4/5] w-full bg-slate-950 overflow-hidden">
                    <Image
                      src={cls.image}
                      alt={cls.name}
                      fill
                      className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061B35] via-transparent to-transparent opacity-95" />

                    {/* Top Video Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-500/80 text-slate-950 text-[10px] font-montserrat font-extrabold tracking-wider uppercase backdrop-blur-md">
                      {cls.videoBadge}
                    </span>

                    {/* Play Video Circle Button */}
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400/90 text-white hover:text-slate-950 flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-all duration-300"
                      aria-label={`Preview ${cls.name}`}
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>

                    {/* Class Details in Card Bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-montserrat font-bold text-cyan-300 uppercase tracking-widest block">
                        {cls.role}
                      </span>
                      <h4 className="font-cinzel text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                        {cls.name}
                      </h4>
                    </div>
                  </div>

                  {/* Card Description */}
                  <div className="p-4">
                    <p className="text-slate-300/80 text-xs font-sans font-light leading-relaxed line-clamp-3">
                      {cls.desc}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span>Author: {cls.author}</span>
                  <span className="text-amber-300 font-semibold">{cls.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Video Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#061B35] border border-cyan-400/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
                  CLASS SHOWCASE & GAMEPLAY PREVIEW
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src={`${activeVideoModal}?autoplay=1`}
                title="Aetheria Class Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
