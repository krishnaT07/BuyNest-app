"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  MapPin, 
  Phone, 
  Clock, 
  CreditCard, 
  User, 
  CheckCircle, 
  XCircle,
  Truck,
  ShoppingBag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate: () => void;
}

interface OrderDetails {
  id: string;
  user_id: string;
  shop_id: string;
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  total_amount: number;
  status: string;
  delivery_address: string;
  phone_number: string;
  notes?: string;
  estimated_delivery_time: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose, onOrderUpdate }: OrderDetailsModalProps) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (orderId && isOpen) {
      fetchOrderDetails();
    }
  }, [orderId, isOpen]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      // Get order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Get customer details
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('user_id', orderData.user_id)
        .single();

      setOrder({
        ...orderData,
        customer_name: profile?.name || 'Customer',
        customer_email: profile?.email || ''
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = useCallback(async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      setOrder({ ...order, status: newStatus });
      onOrderUpdate();
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  }, [order, onOrderUpdate, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>Order Details</span>
            <Badge className={`ml-auto ${getStatusColor(order.status)}`}>
              <span className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status.replace('_', ' ')}</span>
              </span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{order.phone_number}</span>
                  </p>
                </div>
                {order.customer_email && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="font-medium">{order.delivery_address}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Time</p>
                  <p className="font-medium flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{order.estimated_delivery_time}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="font-medium flex items-center space-x-1">
                    <CreditCard className="w-3 h-3" />
                    <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Order Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={item.image_url || '/placeholder.svg'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-xl font-bold">₹{order.total_amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate('confirmed')}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Order
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate('cancelled')}
                      disabled={updating}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Order
                    </Button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <Button
                    onClick={() => handleStatusUpdate('preparing')}
                    disabled={updating}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    onClick={() => handleStatusUpdate('out_for_delivery')}
                    disabled={updating}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Out for Delivery
                  </Button>
                )}
                {order.status === 'out_for_delivery' && (
                  <Button
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Delivered
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
