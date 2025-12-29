"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
          
          <Card>
            <CardContent className="pt-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using BuyNest, you accept and agree to be bound by these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
                <p className="text-muted-foreground">
                  You agree to use our service only for lawful purposes and in accordance with these Terms. 
                  You must not use the service in any way that could damage, disable, or impair the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Orders and Payments</h2>
                <p className="text-muted-foreground">
                  All orders are subject to acceptance by the seller. Prices are set by individual sellers 
                  and may vary. Payment must be completed before order processing begins.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Seller Responsibilities</h2>
                <p className="text-muted-foreground">
                  Sellers are responsible for the accuracy of product listings, order fulfillment, and 
                  customer service. BuyNest acts as a platform connecting buyers and sellers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  BuyNest is not liable for any indirect, incidental, or consequential damages arising 
                  from your use of the platform.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;

