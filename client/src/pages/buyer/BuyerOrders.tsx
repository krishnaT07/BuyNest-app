"use client";
import Orders from "@/pages/Orders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BuyerOrders = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Orders />
      <Footer />
    </div>
  );
};

export default BuyerOrders;

