import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/orders'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
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
    </div>
  );
};

export default PaymentProcessing;


