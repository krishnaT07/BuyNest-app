"use client";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SellerRouteProtectionProps {
  children: React.ReactNode;
}

/**
 * Prevents sellers from accessing buyer-only routes like Browse, Cart, Checkout
 */
const SellerRouteProtection = ({ children }: SellerRouteProtectionProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user?.role === 'seller') {
      toast({
        title: "Access Restricted",
        description: "Sellers cannot browse or purchase items. Please use your seller dashboard.",
        variant: "destructive",
      });
      navigate('/seller-dashboard');
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Block sellers
  if (user?.role === 'seller') {
    return null;
  }

  return <>{children}</>;
};

export default SellerRouteProtection;
