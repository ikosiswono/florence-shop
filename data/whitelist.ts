/**
 * DAFTAR RESMI GAMERTAG MINECRAFT BEDROCK (WHITELIST SYSTEM)
 * -------------------------------------------------------------
 * Anda dapat menambahkan nama-nama pemain yang sah di sini.
 * Hanya Gamertag yang terdaftar yang dapat melakukan registrasi akun di Web Store.
 */

export interface WhitelistEntry {
  gamertag: string;
  role?: "member" | "vip" | "moderator" | "admin" | "owner";
  notes?: string;
}

// Daftar Gamertag Pemain yang Sah (Whitelist Resmi Server)
// Nama-nama yang Anda kirimkan akan disusun dan ditambahkan di sini.
export const AUTHORIZED_GAMERTAGS: WhitelistEntry[] = [
  // Server Founders & Admins
  { gamertag: "ikosiswono", role: "owner", notes: "Owner Florence Network" },
  { gamertag: "FlorenceAdmin", role: "admin", notes: "Admin Florence Network" }
  // >> Nama-nama pemain baru dari Anda akan dimasukkan di sini <<
];

// Opsi Mode Whitelist:
// Jika "STRICT", hanya nama yang tertera di AUTHORIZED_GAMERTAGS yang boleh registrasi.
// Jika "FLEXIBLE", format Gamertag Bedrock (3-16 karakter) diperbolehkan registrasi mandiri.
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

  // Format valid Xbox Live Bedrock Gamertag (huruf, angka, garis bawah, dan spasi tunggal)
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
        reason: `Gamertag "${clean}" belum terdaftar di whitelist resmi server. Hubungi Admin Florence Network untuk mendaftarkan nama akun Anda ke sistem whitelist.`
      };
    }
  }

  return {
    allowed: true,
    entry: found
  };
}
