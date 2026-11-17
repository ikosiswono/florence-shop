export interface Product {
  id: number;
  name: string;
  category: "starter" | "elemental" | "sultan";
  price: number;
  oldPrice: number;
  badge: string;
  badgeColor: "cyan" | "gold" | "purple";
  duration: string;
  textureName: string;
  image: string;
  command: string;
  tierKey: string;
  benefits: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  invoiceId: string;
  username: string; // Gamertag Minecraft Bedrock
  platform: "bedrock" | "java";
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "qris" | "dana" | "gopay";
  status: "PENDING" | "PAID" | "COMPLETED";
  createdAt: string;
  command: string;
  userPhone?: string;
}

export interface UserProfile {
  id: string;
  gamertag: string;
  phone: string;
  email?: string;
  password?: string;
  bio?: string;
  rank?: string;
  joinedAt: string;
  avatarUrl: string;
  verified: boolean;
  loginMethod: "gamertag" | "google";
}

export interface Coupon {
  code: string;
  label: string;
  discountPercent?: number;
  discountAmount?: number;
}
