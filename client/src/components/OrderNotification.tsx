"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Package, Clock, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface OrderNotificationProps {
  onClose: () => void;
  onViewOrder: (orderId: string) => void;
}

interface NewOrder {
  id: string;
  user_id: string;
  shop_id: string;
  items: any[];
  total_amount: number;
  status: string;
  delivery_address: string;
  phone_number: string;
  notes?: string;
  estimated_delivery_time: string;
  payment_method: string;
  created_at: string;
  customer_name?: string;
}

const OrderNotification = ({ onClose, onViewOrder }: OrderNotificationProps) => {
  const [newOrder, setNewOrder] = useState<NewOrder | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Get seller's shop
    const getShop = async () => {
      const { data: shop } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      return shop;
    };

    // Subscribe to new orders
    const setupRealtimeSubscription = async () => {
      const shop = await getShop();
      if (!shop) return;

      const subscription = supabase
        .channel('new-orders')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
            filter: `shop_id=eq.${shop.id}`,
          },
          async (payload) => {
            const order = payload.new as NewOrder;
            
            // Get customer name
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('user_id', order.user_id)
              .single();

            setNewOrder({
              ...order,
              customer_name: profile?.name || 'Customer'
            });
            setIsVisible(true);

            // Auto-hide after 10 seconds
            setTimeout(() => {
              setIsVisible(false);
            }, 10000);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [user]);

  const handleViewOrder = useCallback(() => {
    if (newOrder) {
      onViewOrder(newOrder.id);
      setIsVisible(false);
    }
  }, [newOrder, onViewOrder]);

  if (!isVisible || !newOrder) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300"
      role="alert"
      aria-live="polite"
      aria-label="New order notification"
    >
      <Card className="w-80 shadow-lg border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">New Order!</h4>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
              aria-label="Close notification"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{newOrder.customer_name}</span>
              <Badge variant="secondary" className="text-xs">
                {newOrder.items.length} items
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {newOrder.delivery_address === 'Pickup at shop' ? 'Pickup' : 'Delivery'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{newOrder.phone_number}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{newOrder.estimated_delivery_time}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">₹{newOrder.total_amount}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {newOrder.payment_method.replace('_', ' ')} payment
              </p>
            </div>
            <Button size="sm" onClick={handleViewOrder}>
              View Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderNotification;
