import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Your payment was cancelled. No charges were made to your account. 
              Your items are still in your cart.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/checkout')} 
              className="w-full bg-gradient-hero hover:shadow-strong"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Checkout
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
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;