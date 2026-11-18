/**
 * DAFTAR RESMI GAMERTAG MINECRAFT BEDROCK (WHITELIST SYSTEM)
 * -------------------------------------------------------------
 * Anda dapat menambahkan atau memperbarui nama-nama pemain yang sah di sini.
 * Hanya Gamertag yang terdaftar yang dapat melakukan registrasi akun di Web Store.
 */

export interface WhitelistEntry {
  gamertag: string;
  role?: "member" | "vip" | "moderator" | "admin" | "owner";
  notes?: string;
}

// Daftar Gamertag Pemain yang Sah (Whitelist)
// Pemilik server dapat mengirimkan nama-nama tambahan kapan saja dan akan langsung dimasukkan ke sini.
export const AUTHORIZED_GAMERTAGS: WhitelistEntry[] = [
  // Admin & Server Founders
  { gamertag: "FlorenceAdmin", role: "admin", notes: "Founder Florence Network" },
  { gamertag: "ikosiswono", role: "owner", notes: "Server Owner" },
  { gamertag: "Marcel", role: "admin", notes: "System Administrator" },
  
  // Contoh Pemain Terdaftar / Batch Pertama (Akan disesuaikan dengan daftar yang Anda kirim)
  { gamertag: "AlexRyan", role: "vip", notes: "Pemain Aktif Season 5" },
  { gamertag: "EstherHoward", role: "member", notes: "Bedrock Player" },
  { gamertag: "JacobJones", role: "vip", notes: "Bedrock Player" },
  { gamertag: "CodyFisher", role: "member", notes: "Bedrock Player" },
  { gamertag: "AlezRayhan", role: "vip", notes: "Bedrock Player" },
  { gamertag: "Steve", role: "member", notes: "Default Bedrock Player" },
  { gamertag: "Alex", role: "member", notes: "Default Bedrock Player" }
];

// Opsi Mode Whitelist:
// "STRICT" = Hanya nama yang terdaftar di AUTHORIZED_GAMERTAGS yang boleh registrasi.
// "FLEXIBLE" = Gamertag yang valid (3-16 karakter, format Bedrock) diizinkan, namun nama di AUTHORIZED_GAMERTAGS mendapat verifikasi instan.
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
  
  if (!clean || clean.length < 3 || clean.length > 16) {
    return {
      allowed: false,
      reason: "Gamertag Minecraft Bedrock harus terdiri dari 3 hingga 16 karakter."
    };
  }

  // Format valid Xbox Live Bedrock Gamertag (huruf, angka, dan spasi tunggal)
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
        reason: `Gamertag "${clean}" belum terdaftar di whitelist resmi server. Hubungi Admin Florence Network untuk verifikasi nama akun Anda.`
      };
    }
  }

  return {
    allowed: true,
    entry: found
  };
}

/**
 * Daftar Pemain Online Simulasi Real-Time untuk Widget Dashboard
 */
export const MOCK_ONLINE_PLAYERS = [
  { gamertag: "ikosiswono", rank: "Owner", isOnline: true },
  { gamertag: "FlorenceAdmin", rank: "Admin", isOnline: true },
  { gamertag: "AlexRyan", rank: "Florence Monarch", isOnline: true },
  { gamertag: "EstherHoward", rank: "Rank Diamond", isOnline: true },
  { gamertag: "JacobJones", rank: "Rank VIP", isOnline: true },
  { gamertag: "CodyFisher", rank: "Rank Gold", isOnline: false },
  { gamertag: "AlezRayhan", rank: "Rank Nether", isOnline: true }
];
