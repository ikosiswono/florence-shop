"use client";

import React from "react";
import Image from "next/image";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { formatRupiah } from "@/data/products";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    setIsCheckoutOpen,
    requireAuth,
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#051428] border-l border-cyan-400/30 h-full flex flex-col justify-between p-6 shadow-2xl">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-cyan-400/20 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                Keranjang Belanja ({cart.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#061B35]/70 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-950/80 border border-cyan-400/20 flex items-center justify-center p-1.5 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={36}
                      height={36}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-white truncate max-w-[150px]">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-300 block">
                      Item: {item.textureName}
                    </span>
                    <span className="text-[11px] font-cinzel text-amber-300 font-bold block">
                      {formatRupiah(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-montserrat text-white font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm">Keranjang Anda masih kosong.</p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 text-xs text-amber-300 font-semibold underline"
                >
                  Pilih Rank di Katalog
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-cyan-400/20">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span>Subtotal:</span>
              <strong className="text-base font-cinzel text-amber-300">
                {formatRupiah(cartSubtotal)}
              </strong>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  requireAuth(() => {
                    setIsCheckoutOpen(true);
                  }, "Silakan Masuk atau Daftarkan Gamertag Bedrock Anda terlebih dahulu sebelum menyelesaikan pesanan rank.");
                }}
                className="btn-fantasy-gold w-full py-3.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-2"
              >
                <span>LANJUT KE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-[11px] text-slate-400 hover:text-rose-400 py-1 transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
