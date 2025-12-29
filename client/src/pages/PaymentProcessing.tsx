"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/orders'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="max-w-md w-full shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle>Redirecting to Payment...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-center text-muted-foreground text-sm">
            If you are not redirected, please check the opened payment tab. After payment, you'll be taken to your orders.
          </p>
        </CardContent>
      </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentProcessing;


