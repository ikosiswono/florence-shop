/**
 * DAFTAR RESMI GAMERTAG MINECRAFT BEDROCK (WHITELIST SYSTEM)
 * -------------------------------------------------------------
 * Hanya Gamertag resmi yang terdaftar di bawah ini yang diizinkan untuk
 * membuat akun dan menentukan password sendiri di Web Store Florence Network.
 */

export interface WhitelistEntry {
  gamertag: string;
  role?: "member" | "vip" | "moderator" | "admin" | "owner";
  notes?: string;
}

// Daftar Gamertag Pemain yang Sah (Whitelist Resmi Server Florence Network)
export const AUTHORIZED_GAMERTAGS: WhitelistEntry[] = [
  // Server Leadership & Administration
  { gamertag: "ikosiswono", role: "owner", notes: "Server Owner" },
  { gamertag: "FlorenceAdmin", role: "admin", notes: "Server Administrator" },

  // Daftar Resmi 40 Pemain Terverifikasi
  { gamertag: "Adyputra6", role: "member" },
  { gamertag: "AmiiLunaa", role: "member" },
  { gamertag: "arvans29", role: "member" },
  { gamertag: "Awaaadesu3", role: "member" },
  { gamertag: "Baimmenkaaaa", role: "member" },
  { gamertag: "CelCelxyh", role: "member" },
  { gamertag: "Chyntia136", role: "member" },
  { gamertag: "Daifukiro0", role: "member" },
  { gamertag: "Dennnzi14", role: "member" },
  { gamertag: "Drikzz223", role: "member" },
  { gamertag: "Finaxn", role: "member" },
  { gamertag: "Gerykzz", role: "member" },
  { gamertag: "gilenlavv", role: "member" },
  { gamertag: "ItsMikaellaa", role: "member" },
  { gamertag: "itsmolor", role: "member" },
  { gamertag: "ItzNawirMc", role: "member" },
  { gamertag: "JustVnite", role: "member" },
  { gamertag: "Kazzuya2007", role: "member" },
  { gamertag: "KHOIRULLLGMG", role: "member" },
  { gamertag: "kinicth", role: "member" },
  { gamertag: "kiyoomii1769", role: "member" },
  { gamertag: "leaaa2553", role: "member" },
  { gamertag: "MANTAPMEN3", role: "member" },
  { gamertag: "meliaaa syududu", role: "member" },
  { gamertag: "millooouuu", role: "member" },
  { gamertag: "mrayzyou", role: "member" },
  { gamertag: "N D Skyline9925", role: "member" },
  { gamertag: "PudingBeku", role: "member" },
  { gamertag: "QueennnzMe19", role: "member" },
  { gamertag: "Ryuuenzi", role: "member" },
  { gamertag: "Sinzznex1", role: "member" },
  { gamertag: "Skeepy6025", role: "member" },
  { gamertag: "Sunny4462", role: "member" },
  { gamertag: "syududu", role: "member" },
  { gamertag: "Tinus3541", role: "member" },
  { gamertag: "TN12 12 12 12", role: "member" },
  { gamertag: "Toorden", role: "member" },
  { gamertag: "Xanzkc", role: "member" },
  { gamertag: "ZeroMercy", role: "member" },
  { gamertag: "ZYiiL13", role: "member" }
];

// Mode Whitelist: "STRICT" = Hanya nama yang terdaftar di atas yang dapat mendaftar.
export const WHITELIST_MODE: "STRICT" | "FLEXIBLE" = "STRICT";

/**
 * Validasi apakah Gamertag terdaftar dan sah untuk registrasi
 */
export function checkGamertagAuthorization(gamertag: string): { 
  allowed: boolean; 
  reason?: string; 
  entry?: WhitelistEntry 
} {
  const clean = gamertag.trim();
  
  if (!clean || clean.length < 3 || clean.length > 20) {
    return {
      allowed: false,
      reason: "Gamertag Minecraft Bedrock harus terdiri dari minimal 3 karakter."
    };
  }

  // Format valid Xbox Live Bedrock Gamertag (huruf, angka, garis bawah, dan spasi)
  const bedrockRegex = /^[a-zA-Z0-9_ ]+$/;
  if (!bedrockRegex.test(clean)) {
    return {
      allowed: false,
      reason: "Gamertag hanya boleh berisi huruf, angka, garis bawah (_), dan spasi."
    };
  }

  const found = AUTHORIZED_GAMERTAGS.find(
    (item) => item.gamertag.toLowerCase() === clean.toLowerCase()
  );

  if (WHITELIST_MODE === "STRICT") {
    if (!found) {
      return {
        allowed: false,
        reason: `Gamertag "${clean}" tidak terdaftar di whitelist resmi server. Pastikan nama Gamertag sesuai dengan daftar sah Florence Network.`
      };
    }
  }

  return {
    allowed: true,
    entry: found
  };
}
