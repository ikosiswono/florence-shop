"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ShopCatalog from "@/components/ShopCatalog";
import WhyChooseUs from "@/components/WhyChooseUs";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import PaymentModal from "@/components/PaymentModal";
import SuccessModal from "@/components/SuccessModal";
import InvoiceTracker from "@/components/InvoiceTracker";
import AuthModal from "@/components/AuthModal";
import UserDashboard from "@/components/UserDashboard";
import InvoicePrintModal from "@/components/InvoicePrintModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#041022] overflow-x-hidden pb-16 md:pb-0">
      {/* Sticky Header with Cart Counter */}
      <Header />

      {/* Hero Section — Background 1 */}
      <HeroSection />

      {/* 12 Rank Shop Catalog — Background 2 */}
      <ShopCatalog />

      {/* Why Choose Us & Bedrock Information — Background 3 */}
      <WhyChooseUs />

      {/* Community, Connect Guide & Support — Background 4 */}
      <CommunitySection />

      {/* Footer */}
      <Footer />

      {/* Modals & Interactive Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <PaymentModal />
      <SuccessModal />
      <InvoiceTracker />
      <AuthModal />
      <UserDashboard />
      <InvoicePrintModal />
      
      {/* Mobile Navigation Dock & Widgets */}
      <MobileBottomNav />
      <FloatingWhatsApp />
    </main>
  );
}
