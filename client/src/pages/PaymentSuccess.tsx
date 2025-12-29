"use client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Optional: Verify payment status with backend
    if (sessionId) {
      // You could call an edge function to verify the payment
      console.log('Payment session ID:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md text-center shadow-xl border-primary/10">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Your payment has been processed successfully. Your order is now confirmed and being prepared.
            </p>
            
            {sessionId && (
              <p className="text-sm text-muted-foreground">
                Transaction ID: {sessionId.slice(-8)}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/orders')} 
              className="w-full bg-gradient-hero hover:shadow-strong"
            >
              View My Orders
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/browse')} 
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
          
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              You will receive order updates via notifications and can track your order in the Orders section.
            </p>
          </div>
        </CardContent>
      </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;