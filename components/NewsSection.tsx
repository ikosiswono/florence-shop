"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Calendar, 
  User, 
  ArrowRight, 
  ChevronRight, 
  Bell, 
  Layers, 
  Flame,
  Swords
} from "lucide-react";

interface NewsItem {
  id: string;
  category: "UPDATE" | "EVENT" | "NEW CLASS" | "ANNOUNCEMENT";
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  badgeColor: string;
}

export default function NewsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const newsData: NewsItem[] = [
    {
      id: "news-1",
      category: "UPDATE",
      title: "Infernal Bonus Server Grand Opening — Tema Baru Florence",
      date: "February 9, 2026",
      author: "Marcus X (Lead GM)",
      excerpt: "Bergabunglah dalam peluncuran server terbaru dengan bonus EXP 300%, drop rate legendaris, dan dungeon Celestial Fortress yang terbuka perdana.",
      image: "/assets/characters/character-sorceress.webp",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    },
    {
      id: "news-2",
      category: "NEW CLASS",
      title: "Awakening of the Shadowblade: New Assassin Class Preview",
      date: "February 5, 2026",
      author: "Aetheria DevTeam",
      excerpt: "Kuasai seni bertarung bayangan dengan daggers berkekuatan arcane. Dapatkan akses eksklusif ke skill stealth dan kombo mematikan di server testing.",
      image: "/assets/characters/character-assassin.webp",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    },
    {
      id: "news-3",
      category: "EVENT",
      title: "Siege of the Colossus: Global World Boss Raid Event",
      date: "January 28, 2026",
      author: "Event Coordinator",
      excerpt: "Kalahkan Titan Runic di Valley of the Gods setiap akhir pekan untuk memperebutkan Divine Weapons, Mythic Mounts, dan gelar kehormatan guild.",
      image: "/assets/gallery/feature-trailer-thumb.webp",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    },
    {
      id: "news-4",
      category: "ANNOUNCEMENT",
      title: "Nether Berserker PvP Tournament: Total Prize $50,000",
      date: "January 20, 2026",
      author: "Esports Council",
      excerpt: "Pendaftaran turnamen 3v3 Arena dan Guild Wars resmi dibuka. Buktikan ketangguhan aliansi Anda dan menangkan hadiah cashpool serta trofi in-game.",
      image: "/assets/characters/character-berserker.webp",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    },
  ];

  const categories = ["ALL", "UPDATE", "NEW CLASS", "EVENT", "ANNOUNCEMENT"];

  const filteredNews = activeCategory === "ALL" 
    ? newsData 
    : newsData.filter(item => item.category === activeCategory);

  return (
    <section id="news" className="relative py-28 overflow-hidden">
      {/* Background 2 — Celestial Ocean Kingdom */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/background-02-celestial-ocean.webp"
          alt="Celestial Ocean Kingdom Background"
          fill
          className="object-cover object-center"
          quality={95}
        />
        {/* Top and Bottom Atmosphere Blending Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041022] via-[#063A60]/55 to-[#041022]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#061B35]/40 to-[#041022]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-400/30 text-cyan-300 text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 backdrop-blur-md">
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span>REALM CHRONICLES & UPDATES</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-white text-shadow-dark mb-4">
            LATEST NEWS & SERVER EVENTS
          </h2>

          <p className="text-slate-300/90 text-sm sm:text-base font-sans font-light leading-relaxed">
            Dapatkan kabar terkini seputar patch note, event mingguan, rotasi world boss, dan turnamen komunitas langsung dari pengembang resmi.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-montserrat font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-glow font-bold scale-105"
                    : "bg-slate-900/70 border border-slate-700/60 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="glass-panel group rounded-2xl overflow-hidden flex flex-col justify-between hover:border-cyan-300/50 hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061B35] via-transparent to-transparent opacity-90" />
                  
                  {/* Category Badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-montserrat font-bold tracking-wider uppercase border backdrop-blur-md ${news.badgeColor}`}>
                    {news.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-sans mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {news.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-amber-400" />
                      {news.author}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-2.5">
                    {news.title}
                  </h3>

                  <p className="text-slate-300/80 text-xs font-sans font-light leading-relaxed line-clamp-3">
                    {news.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-montserrat font-semibold text-cyan-400 group-hover:text-amber-300 transition-colors">
                <span>READ COMPLETE LOG</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            className="btn-fantasy-outline inline-flex items-center gap-2.5 px-8 py-3 rounded-xl text-xs tracking-widest"
          >
            <span>VIEW ALL ARCHIVED NEWS & EVENTS</span>
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
