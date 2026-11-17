"use client";

import React from "react";
import Image from "next/image";
import { 
  Home, 
  ShoppingBag, 
  Receipt, 
  ShoppingCart, 
  MessageCircle,
  User,
  Crown
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CONFIG } from "@/data/products";

export default function MobileBottomNav() {
  const { 
    cartCount, 
    setIsCartOpen, 
    currentUser, 
    setIsDashboardOpen, 
    setIsAuthOpen, 
    setAuthMode 
  } = useShop();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#051428]/95 backdrop-blur-lg border-t border-cyan-400/30 px-3 py-2 flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.8)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <a
        href="#hero"
        className="flex flex-col items-center gap-1 text-[10px] font-montserrat text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Beranda</span>
      </a>

      <a
        href="#katalog"
        className="flex flex-col items-center gap-1 text-[10px] font-montserrat text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Katalog</span>
      </a>

      {/* Cart with Counter */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 text-[10px] font-montserrat text-amber-300 relative transition-colors"
      >
        <div className="relative">
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </div>
        <span>Keranjang</span>
      </button>

      {/* User Dashboard or Login */}
      {currentUser ? (
        <button
          type="button"
          onClick={() => setIsDashboardOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-montserrat text-cyan-300 transition-colors"
        >
          <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-300/80">
            <Image
              src={currentUser.avatarUrl || `https://mc-heads.net/avatar/${encodeURIComponent(currentUser.gamertag)}/20`}
              alt="Profile"
              width={16}
              height={16}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="truncate max-w-[55px] font-bold">{currentUser.gamertag}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setAuthMode("login");
            setIsAuthOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-montserrat text-slate-400 hover:text-amber-300 transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Akun</span>
        </button>
      )}

      <a
        href={`https://wa.me/${CONFIG.ADMIN_WA}?text=Halo%20Admin%20Florence%20Network`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 text-[10px] font-montserrat text-emerald-400 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Admin WA</span>
      </a>
    </nav>
  );
}
