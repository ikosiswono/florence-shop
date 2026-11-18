"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, Coupon, UserProfile } from "@/types/shop";
import { PRODUCTS, CONFIG } from "@/data/products";
import { checkGamertagAuthorization } from "@/data/whitelist";
import { 
  generateSalt, 
  hashPasswordWithSalt, 
  sanitizeInput, 
  checkBruteForceLock, 
  recordFailedLogin, 
  resetFailedLogin 
} from "@/utils/security";

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isPaymentOpen: boolean;
  setIsPaymentOpen: (open: boolean) => void;
  isSuccessOpen: boolean;
  setIsSuccessOpen: (open: boolean) => void;
  isInvoiceTrackerOpen: boolean;
  setIsInvoiceTrackerOpen: (open: boolean) => void;
  
  // Auth & Dashboard Modals
  currentUser: UserProfile | null;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;

  // Invoice Print / Kwitansi Modal
  isInvoicePrintOpen: boolean;
  setIsInvoicePrintOpen: (open: boolean) => void;
  selectedInvoice: Order | null;
  setSelectedInvoice: (order: Order | null) => void;

  // Auth Functions
  registerUser: (gamertag: string, password: string, phone: string, email?: string, fullName?: string) => Promise<{ success: boolean; message: string }>;
  loginUser: (gamertag: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (googleUser: { name: string; email: string; gamertag: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  getUserOrders: () => Order[];
  requireAuth: (onSuccess?: () => void, customMsg?: string) => boolean;

  // Active Order & History
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  orderHistory: Order[];
  createOrder: (username: string, platform: "bedrock" | "java", paymentMethod: "qris" | "dana" | "gopay", couponCode?: string) => Order;
  completeOrder: () => void;

  // Buy now shortcut
  buyNow: (product: Product) => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Helper to sync to Google Apps Script Web App
async function syncToAppsScript(action: string, payload: any) {
  if (!CONFIG.APPS_SCRIPT_URL) return null;
  try {
    const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload })
    });
    return await res.json();
  } catch (err) {
    console.warn("Apps Script sync notice:", err);
    return null;
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isInvoiceTrackerOpen, setIsInvoiceTrackerOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Auth & Dashboard States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Invoice Print / Kwitansi State
  const [isInvoicePrintOpen, setIsInvoicePrintOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("florence_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("florence_orders");
      if (savedOrders) setOrderHistory(JSON.parse(savedOrders));

      const savedUser = localStorage.getItem("florence_current_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, []);

  // Save cart changes
  const saveCart = (items: CartItem[]) => {
    setCart(items);
    try {
      localStorage.setItem("florence_cart", JSON.stringify(items));
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Helper to get all registered users
  const getStoredUsers = (): UserProfile[] => {
    try {
      const raw = localStorage.getItem("florence_users");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const saveStoredUsers = (users: UserProfile[]) => {
    try {
      localStorage.setItem("florence_users", JSON.stringify(users));
    } catch (e) {}
  };

  // Require Auth guard
  const requireAuth = (onSuccess?: () => void, customMsg?: string): boolean => {
    if (currentUser) {
      if (onSuccess) onSuccess();
      return true;
    }
    setAuthMessage(customMsg || "Silakan Masuk atau Buat Akun Gamertag Bedrock Anda terlebih dahulu sebelum melanjutkan pembelian rank.");
    setPendingAuthAction(() => onSuccess || null);
    setIsAuthOpen(true);
    return false;
  };

  // Register User (With Whitelist & High-Security Anti-Hack Hashing)
  const registerUser = async (
    gamertag: string,
    password: string,
    phone: string,
    email?: string,
    fullName?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanGt = sanitizeInput(gamertag);
    const cleanPhone = sanitizeInput(phone);
    const cleanEmail = sanitizeInput(email || "");
    const cleanFullName = sanitizeInput(fullName || "");

    // 1. Verifikasi Validitas dan Whitelist Resmi
    const authCheck = checkGamertagAuthorization(cleanGt);
    if (!authCheck.allowed) {
      return { 
        success: false, 
        message: authCheck.reason || "Gamertag Anda belum terdaftar di whitelist resmi server." 
      };
    }

    if (!password || password.length < 5) {
      return { success: false, message: "Password minimal 5 karakter demi keamanan akun Anda." };
    }
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, message: "Masukkan nomor WhatsApp yang valid untuk konfirmasi penerimaan rank." };
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.gamertag.toLowerCase() === cleanGt.toLowerCase());
    if (existing) {
      return { success: false, message: `Gamertag "${cleanGt}" sudah memiliki akun aktif. Silakan masuk (login).` };
    }

    // 2. Anti-Hack Password Hashing dengan Salt Unik (SHA-256)
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(password, salt);

    // 3. Avatar Resmi Minecraft Bedrock via CDN
    const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(cleanGt)}/100`;

    // 4. Role Assignment dari Whitelist
    const assignedRole = authCheck.entry?.role || "member";
    const initialRank = assignedRole === "owner" ? "Owner" : assignedRole === "admin" ? "Admin" : assignedRole === "vip" ? "Rank VIP" : "Member";

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: cleanFullName,
      gamertag: cleanGt,
      phone: cleanPhone,
      email: cleanEmail,
      password: password, // backward compatibility
      passwordHash,
      salt,
      role: assignedRole,
      bio: "Petualang aktif Florence Network Minecraft Bedrock.",
      rank: initialRank,
      joinedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      seasonExpiry: "Aktif Selama Tema Server Berjalan (Reset Saat Ganti Tema)",
      avatarUrl,
      verified: true,
      loginMethod: "gamertag"
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);
    setCurrentUser(newUser);
    try {
      localStorage.setItem("florence_current_user", JSON.stringify(newUser));
    } catch (e) {}

    // Async sync to Apps Script (Google Sheets)
    syncToAppsScript("register", {
      gamertag: newUser.gamertag,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      joinedAt: newUser.joinedAt,
      rank: newUser.rank
    });

    setIsAuthOpen(false);
    showToast(`✓ Akun Gamertag "${newUser.gamertag}" berhasil dibuat dengan proteksi keamanan tinggi!`);

    // Execute pending action if any
    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      setTimeout(() => action(), 100);
    }

    return { success: true, message: "Registrasi berhasil." };
  };

  // Login User (With Anti Brute-Force Rate Limiting & Hash Verification)
  const loginUser = async (
    gamertag: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanGt = sanitizeInput(gamertag);
    if (!cleanGt || !password) {
      return { success: false, message: "Gamertag dan Password wajib diisi." };
    }

    // 1. Anti Brute-Force Rate Limiting Guard
    const bfCheck = checkBruteForceLock(cleanGt);
    if (bfCheck.isLocked) {
      return { 
        success: false, 
        message: `⚠️ Keamanan: Terlalu banyak percobaan gagal. Akun dikunci sementara. Silakan coba lagi dalam ${bfCheck.remainingSeconds} detik.` 
      };
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.gamertag.toLowerCase() === cleanGt.toLowerCase());

    if (userIndex === -1) {
      return { 
        success: false, 
        message: `Gamertag "${cleanGt}" belum terdaftar. Silakan pilih tab 'Daftar Akun' untuk membuat akun baru.` 
      };
    }

    const user = users[userIndex];

    // 2. Verifikasi Password (Hash SHA-256 atau fallback legacy)
    let isPasswordCorrect = false;

    if (user.passwordHash && user.salt) {
      const computedHash = await hashPasswordWithSalt(password, user.salt);
      isPasswordCorrect = computedHash === user.passwordHash;
    } else if (user.password) {
      // Legacy unhashed user, compare and automatically upgrade
      isPasswordCorrect = user.password === password;
      if (isPasswordCorrect) {
        const newSalt = generateSalt();
        const newHash = await hashPasswordWithSalt(password, newSalt);
        user.salt = newSalt;
        user.passwordHash = newHash;
      }
    }

    if (!isPasswordCorrect) {
      const bfRecord = recordFailedLogin(cleanGt);
      if (bfRecord.isLocked) {
        return {
          success: false,
          message: "⚠️ Peringatan Keamanan: Anda salah memasukkan password 5 kali. Akun Anda dikunci sementara selama 3 menit."
        };
      }
      return { 
        success: false, 
        message: `Password salah. Sisa kesempatan mencoba: ${bfRecord.attemptsLeft} kali sebelum akun dikunci.` 
      };
    }

    // Reset Brute-force record on successful login
    resetFailedLogin(cleanGt);

    // Refresh avatar and last login
    const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(user.gamertag)}/100`;
    const updatedUser: UserProfile = { 
      ...user, 
      avatarUrl, 
      lastLoginAt: new Date().toISOString() 
    };

    users[userIndex] = updatedUser;
    saveStoredUsers(users);
    
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem("florence_current_user", JSON.stringify(updatedUser));
    } catch (e) {}

    setIsAuthOpen(false);
    showToast(`✓ Selamat datang kembali di Florence Network, ${updatedUser.gamertag}!`);

    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      setTimeout(() => action(), 100);
    }

    return { success: true, message: "Login berhasil." };
  };

  // Google Sign-In (Structured & Secure)
  const loginWithGoogle = async (googleUser: {
    name: string;
    email: string;
    gamertag: string;
    phone?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanGt = googleUser.gamertag.trim();
    if (!cleanGt || cleanGt.length < 3) {
      return { success: false, message: "Gamertag Minecraft Bedrock wajib diisi." };
    }

    const users = getStoredUsers();
    let user = users.find(
      (u) =>
        u.gamertag.toLowerCase() === cleanGt.toLowerCase() ||
        (u.email && u.email.toLowerCase() === googleUser.email.toLowerCase())
    );

    const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(cleanGt)}/100`;

    if (!user) {
      // Create new user linked with Google
      user = {
        id: `usr_g_${Date.now()}`,
        gamertag: cleanGt,
        phone: googleUser.phone || "",
        email: googleUser.email,
        bio: `Akun Florence Network terhubung dengan Google (${googleUser.email}).`,
        rank: "Member",
        joinedAt: new Date().toISOString(),
        avatarUrl,
        verified: true,
        loginMethod: "google"
      };
      saveStoredUsers([...users, user]);
      
      syncToAppsScript("register_google", {
        gamertag: user.gamertag,
        email: user.email,
        joinedAt: user.joinedAt
      });
    } else {
      user = { ...user, email: googleUser.email, loginMethod: "google", avatarUrl };
      saveStoredUsers(users.map((u) => (u.id === user?.id ? user! : u)));
    }

    setCurrentUser(user);
    try {
      localStorage.setItem("florence_current_user", JSON.stringify(user));
    } catch (e) {}

    setIsAuthOpen(false);
    showToast(`✓ Terhubung dengan Google sebagai ${user.gamertag}!`);

    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      setTimeout(() => action(), 100);
    }

    return { success: true, message: "Login Google berhasil." };
  };

  // Update Profile
  const updateUserProfile = async (
    data: Partial<UserProfile>
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: "Belum login." };

    const updatedUser: UserProfile = { ...currentUser, ...data };
    setCurrentUser(updatedUser);

    try {
      localStorage.setItem("florence_current_user", JSON.stringify(updatedUser));
      const users = getStoredUsers();
      saveStoredUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    } catch (e) {}

    syncToAppsScript("update_profile", {
      gamertag: updatedUser.gamertag,
      phone: updatedUser.phone,
      bio: updatedUser.bio
    });

    showToast("✓ Profil Anda berhasil diperbarui!");
    return { success: true, message: "Profil berhasil diperbarui." };
  };

  // Logout
  const logoutUser = () => {
    const name = currentUser?.gamertag;
    setCurrentUser(null);
    try {
      localStorage.removeItem("florence_current_user");
    } catch (e) {}
    setIsDashboardOpen(false);
    showToast(`Akun ${name || "pemain"} berhasil logout.`);
  };

  // Get orders belonging to currently logged-in user
  const getUserOrders = (): Order[] => {
    if (!currentUser) return [];
    return orderHistory.filter(
      (o) => o.username.toLowerCase() === currentUser.gamertag.toLowerCase()
    );
  };

  const addToCart = (product: Product) => {
    // Adding to cart can be done anytime, but purchasing requires login
    const existing = cart.find((item) => item.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    saveCart(updated);
    showToast(`✓ ${product.name} berhasil ditambahkan ke keranjang!`);
  };

  const removeFromCart = (productId: number) => {
    const updated = cart.filter((item) => item.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === productId ? { ...item, quantity: qty } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Buy Now with Strict Login Guard
  const buyNow = (product: Product) => {
    requireAuth(() => {
      const existing = cart.find((item) => item.id === product.id);
      if (!existing) {
        saveCart([...cart, { ...product, quantity: 1 }]);
      }
      setIsCheckoutOpen(true);
    }, `Untuk membeli "${product.name}", silakan masuk atau daftarkan Gamertag Bedrock Anda terlebih dahulu.`);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const createOrder = (
    username: string,
    platform: "bedrock" | "java",
    paymentMethod: "qris" | "dana" | "gopay",
    couponCode?: string
  ): Order => {
    const subtotal = cartSubtotal;
    let discount = 0;

    if (couponCode) {
      const upper = couponCode.trim().toUpperCase();
      const coupon = (CONFIG.COUPONS as Record<string, Coupon>)[upper];
      if (coupon) {
        if (coupon.discountPercent) {
          discount = Math.round((subtotal * coupon.discountPercent) / 100);
        } else if (coupon.discountAmount) {
          discount = Math.min(subtotal, coupon.discountAmount);
        }
      }
    }

    const total = Math.max(0, subtotal - discount);
    const invoiceId = `INV-FN-${Date.now().toString().slice(-6)}`;
    
    // Command generation
    const firstItem = cart[0];
    const generatedCommand = firstItem 
      ? firstItem.command.replace("{ign}", username)
      : `lp user ${username} parent add vip`;

    const newOrder: Order = {
      invoiceId,
      username,
      platform,
      items: [...cart],
      subtotal,
      discount,
      couponCode,
      total,
      paymentMethod,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      command: generatedCommand,
      userPhone: currentUser?.phone || ""
    };

    setActiveOrder(newOrder);

    // Save to order history in pending state
    const updatedHistory = [newOrder, ...orderHistory.slice(0, 49)];
    setOrderHistory(updatedHistory);
    try {
      localStorage.setItem("florence_orders", JSON.stringify(updatedHistory));
    } catch (e) {}

    // Async sync order to Google Apps Script
    syncToAppsScript("create_order", {
      invoiceId: newOrder.invoiceId,
      gamertag: newOrder.username,
      items: newOrder.items.map((i) => `${i.name} (x${i.quantity})`).join(", "),
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
      phone: newOrder.userPhone
    });

    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
    return newOrder;
  };

  const completeOrder = () => {
    if (!activeOrder) return;
    const completed: Order = { ...activeOrder, status: "COMPLETED" };
    setActiveOrder(completed);

    const updated = orderHistory.map((o) =>
      o.invoiceId === completed.invoiceId ? completed : o
    );
    setOrderHistory(updated);
    try {
      localStorage.setItem("florence_orders", JSON.stringify(updated));
    } catch (e) {}

    // Update user rank in profile if buying rank
    if (currentUser && activeOrder.items.length > 0) {
      const topRank = activeOrder.items[0].name;
      const updatedUser: UserProfile = { ...currentUser, rank: topRank };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("florence_current_user", JSON.stringify(updatedUser));
      } catch (e) {}
    }

    // Sync order completion to Apps Script
    syncToAppsScript("complete_order", {
      invoiceId: completed.invoiceId,
      status: "COMPLETED"
    });

    setIsPaymentOpen(false);
    clearCart();
    setIsSuccessOpen(true);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isPaymentOpen,
        setIsPaymentOpen,
        isSuccessOpen,
        setIsSuccessOpen,
        isInvoiceTrackerOpen,
        setIsInvoiceTrackerOpen,
        currentUser,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        authMessage,
        setAuthMessage,
        isDashboardOpen,
        setIsDashboardOpen,
        isInvoicePrintOpen,
        setIsInvoicePrintOpen,
        selectedInvoice,
        setSelectedInvoice,
        registerUser,
        loginUser,
        loginWithGoogle,
        updateUserProfile,
        logoutUser,
        getUserOrders,
        requireAuth,
        activeOrder,
        setActiveOrder,
        orderHistory,
        createOrder,
        completeOrder,
        buyNow,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}
