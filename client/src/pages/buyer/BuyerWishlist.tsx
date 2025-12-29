"use client";
import Wishlist from "@/pages/Wishlist";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BuyerWishlist = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Wishlist />
      <Footer />
    </div>
  );
};

export default BuyerWishlist;

