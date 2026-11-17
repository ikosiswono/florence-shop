"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Search, 
  X, 
  Sparkles, 
  Shield, 
  Flame, 
  Crown, 
  ShoppingCart, 
  Check, 
  Zap, 
  Info,
  Layers
} from "lucide-react";
import { PRODUCTS, formatRupiah } from "@/data/products";
import { Product } from "@/types/shop";
import { useShop } from "@/context/ShopContext";

export default function ShopCatalog() {
  const { addToCart, buyNow } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "starter" | "elemental" | "sultan">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailModalProduct, setDetailModalProduct] = useState<Product | null>(null);

  const categories = [
    { id: "all", label: "Semua 12 Rank", icon: Crown },
    { id: "starter", label: "Starter (Noob - Gold)", icon: Shield },
    { id: "elemental", label: "Elemental (Diamond - Nether)", icon: Flame },
    { id: "sultan", label: "Sultan (End - Monarch)", icon: Sparkles },
  ] as const;

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="katalog" className="relative py-24 overflow-hidden">
      {/* Background 2 — Celestial Ocean Kingdom */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/background-02-celestial-ocean.webp"
          alt="Celestial Ocean Kingdom Background"
          fill
          className="object-cover object-center"
          quality={95}
        />
        {/* Soft atmospheric gradient blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041022] via-[#063A60]/60 to-[#041022]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#061B35]/40 to-[#041022]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-400/30 text-cyan-300 text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>KATALOG STORE RESMI</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-white text-shadow-dark mb-3">
            PILIH 12 TIER RANK RESMI
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed">
            Semua rank berstatus <strong className="text-amber-300">Aktif Per-Season (1 Season Penuh)</strong> dengan aktivasi perintah instan. Masa aktif rank berlaku selama season server berjalan hingga reset atau pergantian season baru.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none w-full md:w-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-montserrat font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? "btn-fantasy-gold shadow-glow-gold scale-105"
                      : "bg-[#061B35]/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama rank (VIP, Diamond)..."
              className="w-full bg-[#061B35]/80 border border-cyan-400/30 rounded-xl py-2 pl-9 pr-8 text-xs font-montserrat text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:shadow-glow"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* 2-Column Compact Grid on Mobile ("perkecil seperti desktop, ukuran ramah pengguna"), 4-Column on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-cyan-400/20 hover:border-amber-300/60 hover:shadow-glow-gold transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Product Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-montserrat font-extrabold uppercase tracking-wider backdrop-blur-md ${
                  product.badgeColor === "gold"
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                    : product.badgeColor === "purple"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                }`}>
                  {product.badge}
                </span>
              </div>

              <div>
                {/* Texture Icon Preview & Item Name Badge */}
                <div className="relative aspect-square w-full max-w-[90px] sm:max-w-[120px] mx-auto mb-2 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 border border-white/5 group-hover:border-cyan-400/40 transition-colors">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="object-contain filter drop-shadow-[0_4px_12px_rgba(40,216,232,0.4)] group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                  <span className="mt-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-400/40 text-[9px] sm:text-[10px] font-mono text-cyan-300 font-bold truncate max-w-full text-center shadow-sm">
                    {product.textureName}
                  </span>
                </div>

                {/* Duration Tag */}
                <span className="text-[9px] sm:text-[10px] font-montserrat text-emerald-400 font-semibold block text-center mb-1">
                  {product.duration}
                </span>

                {/* Rank Name */}
                <h3 className="font-cinzel text-xs sm:text-base font-bold text-white text-center leading-tight mb-2 group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h3>

                {/* Benefits: Command, Money & Item Eksklusif */}
                <ul className="space-y-1.5 mb-3 text-[10px] sm:text-[11px] text-slate-300 font-sans border-t border-b border-white/5 py-2 min-h-[85px]">
                  {product.benefits.map((benefit, idx) => {
                    const isItem = idx === 2 || benefit.toLowerCase().includes("item eksklusif");
                    return (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <Check className={`w-3 h-3 shrink-0 mt-0.5 ${isItem ? "text-amber-400" : "text-cyan-400"}`} />
                        <span className={isItem ? "text-amber-300 font-semibold" : ""}>
                          {benefit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                {/* Price Display */}
                <div className="flex items-baseline justify-between mb-2.5 px-0.5">
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatRupiah(product.oldPrice)}
                  </span>
                  <strong className="text-sm sm:text-base font-cinzel font-black text-amber-300">
                    {formatRupiah(product.price)}
                  </strong>
                </div>

                {/* Action Buttons: Beli Langsung & Tambah ke Keranjang */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => buyNow(product)}
                    className="btn-fantasy-gold flex-1 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider text-center"
                  >
                    Beli Langsung
                  </button>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="p-2 sm:p-2.5 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 transition-all shrink-0"
                    title="Tambah ke Keranjang"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl max-w-md mx-auto">
            <p className="text-slate-400 text-sm">Tidak ada rank yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 text-xs text-amber-300 underline font-semibold"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}

      </div>

      {/* Rank Detail Modal */}
      {detailModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel-gold rounded-2xl p-6 max-w-lg w-full border border-amber-300/40 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setDetailModalProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-slate-950/60 border border-cyan-400/30 flex flex-col items-center justify-center p-1.5 shrink-0">
                <Image
                  src={detailModalProduct.image}
                  alt={detailModalProduct.name}
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                />
                <span className="text-[8px] font-mono text-cyan-300 font-bold truncate max-w-full text-center mt-1">
                  {detailModalProduct.textureName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-montserrat font-bold uppercase tracking-wider block">
                  {detailModalProduct.duration}
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  {detailModalProduct.name}
                </h3>
                <span className="text-xs font-mono text-cyan-300 block mb-0.5">
                  Item Ikon: {detailModalProduct.textureName}
                </span>
                <span className="text-sm font-cinzel font-black text-amber-300">
                  {formatRupiah(detailModalProduct.price)} (Hemat {formatRupiah(detailModalProduct.oldPrice - detailModalProduct.price)})
                </span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs font-montserrat font-bold text-slate-300 block mb-2 uppercase tracking-wider">
                Fasilitas Fitur Chat, Money & Item Eksklusif Rank:
              </span>
              <ul className="space-y-2">
                {detailModalProduct.benefits.map((b, i) => {
                  const isItem = i === 2 || b.toLowerCase().includes("item eksklusif");
                  return (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-xs rounded-lg p-1.5 ${
                        isItem
                          ? "text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/30"
                          : "text-slate-200"
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isItem ? "text-amber-400" : "text-cyan-400"}`} />
                      <span>{b}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  buyNow(detailModalProduct);
                  setDetailModalProduct(null);
                }}
                className="btn-fantasy-gold flex-1 py-3 rounded-xl text-xs tracking-wider"
              >
                Beli Rank Sekarang
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(detailModalProduct);
                  setDetailModalProduct(null);
                }}
                className="btn-fantasy-outline flex-1 py-3 rounded-xl text-xs tracking-wider"
              >
                + Masukkan Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
