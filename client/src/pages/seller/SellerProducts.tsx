"use client";
import ProductManagement from "@/components/ProductManagement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SellerProducts = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ProductManagement />
      </main>
      <Footer />
    </div>
  );
};

export default SellerProducts;

