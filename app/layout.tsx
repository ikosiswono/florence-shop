import type { Metadata, Viewport } from "next";
import "./globals.css";
import ParticleCanvas from "@/components/ParticleCanvas";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://play.florenceshop.net"),
  title: "Florence Network — Official Minecraft Bedrock & Java Store",
  description: "Toko digital dan top-up rank resmi server Minecraft Florence Network (Bedrock & Java Edition). Beli rank per-season dengan akses perintah khusus, bonus uang in-game, dan kit perlengkapan via QRIS, DANA, dan GoPay.",
  keywords: [
    "Florence Network",
    "FlorenceSMP",
    "Minecraft Bedrock",
    "Minecraft Indonesia",
    "Top Up Minecraft",
    "Rank Minecraft",
    "Server Minecraft Indonesia",
    "QRIS Minecraft",
    "DANA Minecraft",
  ],
  authors: [{ name: "Florence Network Team" }],
  icons: {
    icon: "/assets/logo/florence-network-logo.png",
  },
  openGraph: {
    title: "Florence Network — Official Minecraft Bedrock Store",
    description: "Upgrade akun Minecraft kamu di Florence Network! Dapatkan rank per-season dengan akses perintah, bonus saldo uang in-game, dan kit perlengkapan.",
    url: "https://play.florenceshop.net",
    siteName: "Florence Network Store",
    images: [
      {
        url: "/assets/logo/florence-network-logo.png",
        width: 800,
        height: 400,
        alt: "Florence Network Official Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#041022",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#041022] text-[#F8FBFF] antialiased selection:bg-cyan-500 selection:text-slate-950 min-h-screen relative">
        <ParticleCanvas />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
