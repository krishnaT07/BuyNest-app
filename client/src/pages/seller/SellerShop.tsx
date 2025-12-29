"use client";
import ShopSettings from "./ShopSettings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SellerShop = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ShopSettings />
      </main>
      <Footer />
    </div>
  );
};

export default SellerShop;

