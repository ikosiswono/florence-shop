/**
 * SISTEM KEAMANAN & ANTI-HACK FLORENCE NETWORK
 * ---------------------------------------------
 * - Hashing Password SHA-256 + Salt (Web Crypto API)
 * - Anti Brute-Force Rate Limiting (Mencegah serangan tebak password otomatis)
 * - Sanitasi Input XSS & Tag Injection
 * - Validasi Password Ganda (Password 1 & Konfirmasi Password 2)
 */

// Helper untuk membuat random Salt unik per pengguna
export function generateSalt(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}

// Hash password menggunakan SHA-256 + Salt via Web Crypto API
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const text = `${salt}::florence_salt_key_2026::${password}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  
  // Fallback hash implementation jika di environment non-subtle
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(16);
}

// Sanitasi input teks untuk mencegah serangan XSS dan HTML/Script injection
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Hapus tanda kurung sudut HTML
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "") // Hapus event handlers seperti onload, onclick
    .trim();
}

// Anti Brute-Force State (Disimpan di sessionStorage/localStorage)
interface AttemptRecord {
  attempts: number;
  lockUntil: number | null; // timestamp milidetik
}

const BRUTE_FORCE_PREFIX = "florence_bf_";
const MAX_ATTEMPTS = 5; // Maksimal 5x salah password
const LOCK_DURATION_MS = 3 * 60 * 1000; // 3 menit waktu blokir

export function checkBruteForceLock(gamertag: string): { isLocked: boolean; remainingSeconds: number } {
  if (typeof window === "undefined") return { isLocked: false, remainingSeconds: 0 };
  
  const key = BRUTE_FORCE_PREFIX + gamertag.toLowerCase().trim();
  const raw = localStorage.getItem(key);
  if (!raw) return { isLocked: false, remainingSeconds: 0 };
  
  try {
    const record: AttemptRecord = JSON.parse(raw);
    if (record.lockUntil && record.lockUntil > Date.now()) {
      const remainingSeconds = Math.ceil((record.lockUntil - Date.now()) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    // Jika waktu blokir sudah selesai, reset
    if (record.lockUntil && record.lockUntil <= Date.now()) {
      localStorage.removeItem(key);
    }
  } catch (e) {
    localStorage.removeItem(key);
  }
  
  return { isLocked: false, remainingSeconds: 0 };
}

export function recordFailedLogin(gamertag: string): { attemptsLeft: number; isLocked: boolean } {
  if (typeof window === "undefined") return { attemptsLeft: MAX_ATTEMPTS, isLocked: false };
  
  const key = BRUTE_FORCE_PREFIX + gamertag.toLowerCase().trim();
  const raw = localStorage.getItem(key);
  let record: AttemptRecord = { attempts: 0, lockUntil: null };
  
  if (raw) {
    try {
      record = JSON.parse(raw);
    } catch (e) {}
  }
  
  record.attempts += 1;
  
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCK_DURATION_MS;
    localStorage.setItem(key, JSON.stringify(record));
    return { attemptsLeft: 0, isLocked: true };
  }
  
  localStorage.setItem(key, JSON.stringify(record));
  return { attemptsLeft: MAX_ATTEMPTS - record.attempts, isLocked: false };
}

export function resetFailedLogin(gamertag: string): void {
  if (typeof window === "undefined") return;
  const key = BRUTE_FORCE_PREFIX + gamertag.toLowerCase().trim();
  localStorage.removeItem(key);
}

// Validasi Password Ganda
export function validatePasswordCreation(password: string, confirmPassword: string): {
  isValid: boolean;
  message: string;
} {
  if (!password || password.length < 5) {
    return {
      isValid: false,
      message: "Password minimal harus memiliki 5 karakter demi keamanan akun Anda."
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "Konfirmasi password (Password 2) tidak cocok dengan Password 1. Silakan ketik ulang dengan benar."
    };
  }

  return { isValid: true, message: "Password valid dan cocok." };
}
