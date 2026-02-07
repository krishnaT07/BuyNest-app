"use client";
import Wishlist from "@/pages/Wishlist";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BuyerWishlist = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Wishlist />
      <Footer />
    </div>
  );
};

export default BuyerWishlist;

