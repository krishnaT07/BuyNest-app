"use client";
import Orders from "@/pages/Orders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BuyerOrders = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Orders />
      <Footer />
    </div>
  );
};

export default BuyerOrders;

