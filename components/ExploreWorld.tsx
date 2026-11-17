"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Eye, 
  Flame, 
  Wind, 
  Droplets, 
  Mountain,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface Zone {
  id: string;
  name: string;
  subtitle: string;
  level: string;
  element: string;
  icon: React.ElementType;
  lore: string;
  bgImage: string;
  ambientPoints: string[];
}

export default function ExploreWorld() {
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);

  const zones: Zone[] = [
    {
      id: "elysium",
      name: "CITADEL OF ELYSIUM",
      subtitle: "Capital of the Floating Heavens",
      level: "Lv. 1 - 40",
      element: "Light & Air",
      icon: Wind,
      lore: "Pusat peradaban kerajaan langit tempat para ksatria mengawali sumpah mereka. Dihiasi istana marmer putih bertabur emas, air terjun yang mengalir ke awan, dan kuil suci pelindung semesta.",
      bgImage: "/assets/backgrounds/background-01-heavenly-paradise.webp",
      ambientPoints: [
        "Palace of the Seven Seraphs",
        "Celestial Airship Dockyard",
        "Temple of Eternal Dawn",
      ],
    },
    {
      id: "ocean",
      name: "SUNKEN SAPPHIRE ABYSS",
      subtitle: "The Submerged Ancient Dynasty",
      level: "Lv. 40 - 75",
      element: "Water & Arcane",
      icon: Droplets,
      lore: "Lautan safir mistis di bawah kepulauan melayang. Puing-puing kuil purba yang tenggelam memancarkan cahaya biru magis, dihuni oleh naga laut dan suku penjaga mutiara abadi.",
      bgImage: "/assets/backgrounds/background-02-celestial-ocean.webp",
      ambientPoints: [
        "Submerged Crystal Cathedrals",
        "Trench of the Leviathan",
        "Crystalline Coral Cascades",
      ],
    },
    {
      id: "frost",
      name: "FROZEN GLACIER OF GODS",
      subtitle: "The Desolate Northern Precipice",
      level: "Lv. 75 - 100",
      element: "Frost & Lightning",
      icon: Mountain,
      lore: "Puncak pegunungan es abadi yang membeku dalam waktu. Di balik badai salju dan tirai aurora bercahaya, reruntuhan istana es menyimpan rahasia senjata pamungkas pencipta dunia.",
      bgImage: "/assets/backgrounds/background-03-frozen-kingdom.webp",
      ambientPoints: [
        "Pinnacle of the Ice Archon",
        "Glacial Caverns of Whispers",
        "Frozen Citadel of the Forgotten",
      ],
    },
    {
      id: "valleys",
      name: "VALLEY OF TITANS",
      subtitle: "Wild Emerald Runic Wilderness",
      level: "Lv. 100 - 120 (Endgame)",
      element: "Earth & Nature",
      icon: Sparkles,
      lore: "Lembah hijau zamrud yang luas dengan pepohonan raksasa berusia ribuan tahun dan patung prajurit purba. Tempat berkumpulnya para guild papan atas untuk menantang Colossus Runic.",
      bgImage: "/assets/backgrounds/background-04-divine-rpg-world.webp",
      ambientPoints: [
        "Colossus Awakening Altar",
        "Bridges of the Ancients",
        "Roots of the World Tree",
      ],
    },
  ];

  const currentZone = zones[activeZoneIdx];

  return (
    <section id="gallery" className="relative py-28 overflow-hidden">
      {/* Background 4 — Divine RPG Kingdom / Epic Fantasy World */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/background-04-divine-rpg-world.webp"
          alt="Divine RPG Kingdom World Background"
          fill
          className="object-cover object-center"
          quality={95}
        />
        {/* Cinematic atmospheric depth overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041022] via-[#051C36]/65 to-[#041022]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#041022]/40 to-[#041022]/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>SEAMLESS OPEN-WORLD REALM</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-white text-shadow-dark mb-4">
            EXPLORE THE LIVING FANTASY WORLD
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-sans font-light leading-relaxed">
            Dari istana langit yang menjulang hingga palung lautan kristal, Aetheria menawarkan eksplorasi bebas tanpa sekat loading antar wilayah.
          </p>
        </div>

        {/* Interactive Zone Showcase Panel */}
        <div className="glass-panel-gold rounded-3xl overflow-hidden border border-amber-300/40 p-3 sm:p-6 shadow-2xl">
          
          {/* Top Zone Switcher Pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            {zones.map((zone, idx) => {
              const Icon = zone.icon;
              const isActive = activeZoneIdx === idx;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZoneIdx(idx)}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400/25 to-cyan-500/25 border border-amber-400 text-white shadow-glow-gold scale-[1.02]"
                      : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className={`p-2 rounded-xl border ${isActive ? "bg-amber-400/20 text-amber-300 border-amber-400/40" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block font-cinzel text-xs font-bold truncate">
                      {zone.name}
                    </span>
                    <span className="text-[10px] font-montserrat text-slate-400">
                      {zone.level}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Zone Interactive Visual Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-400/30 aspect-[16/9] lg:aspect-[21/9] w-full bg-slate-950">
            <Image
              src={currentZone.bgImage}
              alt={currentZone.name}
              fill
              className="object-cover object-center animate-pulse-glow"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061B35] via-[#061B35]/40 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061B35]/80 via-transparent to-transparent" />

            {/* In-World Lore Box */}
            <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:max-w-xl z-10 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-montserrat font-bold tracking-wider uppercase">
                  {currentZone.element}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-[10px] font-montserrat font-bold tracking-wider uppercase">
                  {currentZone.level}
                </span>
              </div>

              <h3 className="font-cinzel text-xl sm:text-3xl font-extrabold text-white text-shadow-dark mb-1">
                {currentZone.name}
              </h3>

              <p className="text-amber-200/90 text-xs sm:text-sm font-cormorant italic mb-3">
                {currentZone.subtitle}
              </p>

              <p className="text-slate-200 text-xs sm:text-sm font-sans font-light leading-relaxed mb-4 text-shadow-dark">
                {currentZone.lore}
              </p>

              {/* Ambient Landmark Points */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-400/20">
                {currentZone.ambientPoints.map((pt, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/70 border border-slate-700/80 text-[11px] text-slate-300 font-montserrat"
                  >
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{pt}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
