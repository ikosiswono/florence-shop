import { Product } from "@/types/shop";

const MC_CDN = "https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/";

export const PRODUCTS: Product[] = [
  // ---------- TIER STARTER ----------
  {
    id: 1,
    name: "Rank Novice (Noob)",
    category: "starter",
    price: 5000,
    oldPrice: 10000,
    badge: "STARTER",
    badgeColor: "cyan",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Wooden Sword",
    image: MC_CDN + "item/wooden_sword.png",
    command: "lp user {ign} parent add noob",
    tierKey: "noob",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear",
      "Bonus Uang In-Game: $25.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 2,
    name: "Rank Stone",
    category: "starter",
    price: 10000,
    oldPrice: 15000,
    badge: "TIER 2",
    badgeColor: "cyan",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Stone Pickaxe",
    image: MC_CDN + "item/stone_pickaxe.png",
    command: "lp user {ign} parent add stone",
    tierKey: "stone",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day",
      "Bonus Uang In-Game: $50.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 3,
    name: "Rank Iron",
    category: "starter",
    price: 15000,
    oldPrice: 20000,
    badge: "TIER 3",
    badgeColor: "purple",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Iron Ingot",
    image: MC_CDN + "item/iron_ingot.png",
    command: "lp user {ign} parent add iron",
    tierKey: "iron",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather",
      "Bonus Uang In-Game: $100.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 4,
    name: "Rank Gold",
    category: "starter",
    price: 20000,
    oldPrice: 25000,
    badge: "HOT",
    badgeColor: "gold",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Gold Ingot",
    image: MC_CDN + "item/gold_ingot.png",
    command: "lp user {ign} parent add gold",
    tierKey: "gold",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather, +nightvision",
      "Bonus Uang In-Game: $250.000",
      "Item Eksklusif Benefit Rank"
    ]
  },

  // ---------- TIER ELEMENTAL ----------
  {
    id: 5,
    name: "Rank Diamond",
    category: "elemental",
    price: 25000,
    oldPrice: 35000,
    badge: "BEST VALUE",
    badgeColor: "cyan",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Diamond Gem",
    image: MC_CDN + "item/diamond.png",
    command: "lp user {ign} parent add diamond",
    tierKey: "diamond",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather, +nv, +enderchest, +workbench",
      "Bonus Uang In-Game: $500.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 6,
    name: "Rank Water",
    category: "elemental",
    price: 30000,
    oldPrice: 40000,
    badge: "ELEMENTAL",
    badgeColor: "cyan",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Heart of the Sea",
    image: MC_CDN + "item/heart_of_the_sea.png",
    command: "lp user {ign} parent add water",
    tierKey: "water",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather, +ec, +nv, +haste",
      "Bonus Uang In-Game: $850.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 7,
    name: "Rank Fire",
    category: "elemental",
    price: 35000,
    oldPrice: 45000,
    badge: "ELEMENTAL",
    badgeColor: "gold",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Blaze Rod",
    image: MC_CDN + "item/blaze_rod.png",
    command: "lp user {ign} parent add fire",
    tierKey: "fire",
    benefits: [
      "Perintah Chat: +feed, +heal, +ec, +nv, +haste, +warp resource",
      "Bonus Uang In-Game: $1.250.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 8,
    name: "Rank Nether",
    category: "elemental",
    price: 40000,
    oldPrice: 55000,
    badge: "NETHER TIER",
    badgeColor: "purple",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Netherite Ingot",
    image: MC_CDN + "item/netherite_ingot.png",
    command: "lp user {ign} parent add nether",
    tierKey: "nether",
    benefits: [
      "Perintah Chat: +fly, +feed, +heal, +ec, +nv, +haste, +fireres",
      "Bonus Uang In-Game: $1.750.000",
      "Item Eksklusif Benefit Rank"
    ]
  },

  // ---------- TIER SULTAN ----------
  {
    id: 9,
    name: "Rank End",
    category: "sultan",
    price: 55000,
    oldPrice: 75000,
    badge: "POPULAR",
    badgeColor: "purple",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Eye of Ender",
    image: MC_CDN + "item/ender_eye.png",
    command: "lp user {ign} parent add end",
    tierKey: "end",
    benefits: [
      "Perintah Chat: +fly, +feed, +heal, +ec, +nv, +haste, +fireres, +hov",
      "Bonus Uang In-Game: $2.500.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 10,
    name: "Rank Space",
    category: "sultan",
    price: 85000,
    oldPrice: 110000,
    badge: "COSMIC TIER",
    badgeColor: "cyan",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Elytra Wings",
    image: MC_CDN + "item/elytra.png",
    command: "lp user {ign} parent add space",
    tierKey: "space",
    benefits: [
      "Perintah Chat: +fly, +craft, +feed, +heal, +speed, +jumpboost, +hov",
      "Bonus Uang In-Game: $3.250.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 11,
    name: "Rank VIP",
    category: "sultan",
    price: 100000,
    oldPrice: 135000,
    badge: "POPULAR",
    badgeColor: "gold",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Golden Helmet",
    image: MC_CDN + "item/golden_helmet.png",
    command: "lp user {ign} parent add vip",
    tierKey: "vip",
    benefits: [
      "Perintah Chat: +fly, +craft, +workbench, +feed, +heal, +ec, +speed",
      "Bonus Uang In-Game: $4.000.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 12,
    name: "Florence Monarch (Legend)",
    category: "sultan",
    price: 150000,
    oldPrice: 200000,
    badge: "LEGENDARY",
    badgeColor: "gold",
    duration: "Aktif Selama Tema Berjalan (Per-Tema Server)",
    textureName: "Nether Star",
    image: MC_CDN + "item/nether_star.png",
    command: "lp user {ign} parent add legend",
    tierKey: "legend",
    benefits: [
      "Perintah Chat: Akses SEMUA Fitur (+fly, +god, +heal, +feed, +ec, +craft)",
      "Bonus Uang In-Game: $5.000.000 (Tertinggi)",
      "Item Eksklusif Benefit Rank"
    ]
  }
];

export const CONFIG = {
  STORE_NAME: "Florence Network",
  SERVER_IP: "game-gnl-jh3.raznar.net",
  BEDROCK_PORT: 19242,
  ADMIN_WA: "6283187198288",
  ADMIN_WA_DISPLAY: "0831-8719-8288",
  PAYMENT_PHONE: "083159084210",
  PAYMENT_PHONE_DISPLAY: "0831-5908-4210",
  QRIS_IMAGE_URL: "/qris.jpg",
  QRIS_MERCHANT_NAME: "ETERNALSMP, ID",
  QRIS_NMID: "ID1025374342240",
  // Google Apps Script Web App Endpoint (Database Google Sheet Gratis)
  APPS_SCRIPT_URL: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzI7fGvO0WWVtIQFlnOSp5z6xOgDF2p3eZ_sJCqSwC5Ko6-8gT96dvm9dn3p3RmvHLt/exec",
  GOOGLE_SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/1NVW_b4dHx-tcgtQE7A--ZR13S_l4RBgnmLbI8TG1sAQ/edit",
  GOOGLE_DRIVE_URL: "https://drive.google.com/drive/folders/1ypqhwhsbmpxE7tNzIYt_7dN1WP8F512x",
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/u/0/home/projects/1k-0pbXoCTqAn0zaV2oi36iyByS7qqyh78NckjmGnorBJ9IJCqh2VZ-YB/edit",
  STATS: {
    onlineCount: "11/50",
    recordCount: "Rekor: 45 Online",
    supportedVersion: "1.26.62.1",
    versionType: "Bedrock Only",
    totalTransactions: "25",
    successRate: "99.8% Sukses",
    deliveryTime: "1x24 Jam",
    deliveryNote: "Langsung dari admin"
  },
  COUPONS: {
    "FLORENCE25": { code: "FLORENCE25", label: "Diskon Khusus Grand Opening 25%", discountPercent: 25 },
    "THEME5": { code: "THEME5", label: "Diskon Tema Server Aktif (15%)", discountPercent: 15 },
    "SULTAN": { code: "SULTAN", label: "Potongan Langsung Rp 30.000", discountAmount: 30000 }
  }
};

export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}
