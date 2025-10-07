import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useDeliveryMode } from "@/context/DeliveryModeContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, CreditCard, MapPin, Phone, User, Truck, ShoppingBag } from "lucide-react";
import { LocationInput } from "@/components/LocationInput";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, getCartByShop } = useCart();
  const { user } = useAuth();
  const { deliveryMode } = useDeliveryMode();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const cartByShop = getCartByShop();
  const shopIds = Object.keys(cartByShop);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (!deliveryAddress.trim() || !phoneNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your delivery address and phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create orders for each shop
      for (const shopId of shopIds) {
        const shopItems = cartByShop[shopId];
        const shopTotal = shopItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderData = {
          user_id: user.id,
          shop_id: shopId,
          items: shopItems.map(item => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.imageUrl,
          })),
          total_amount: shopTotal,
          status: 'pending',
          delivery_address: deliveryAddress,
          phone_number: phoneNumber,
          notes: notes || null,
          estimated_delivery_time: deliveryMode === 'pickup' ? 'Ready for pickup' : '30-45 minutes',
          payment_method: paymentMethod,
          delivery_mode: deliveryMode,
        };

        if (paymentMethod === 'card') {
          // For card payments, create Stripe checkout session
          const { data, error } = await supabase.functions.invoke('create-payment', {
            body: {
              amount: Math.round(shopTotal * 100), // Convert to cents
              currency: 'usd',
              orderData,
            },
          });

          if (error) throw error;

          if (data?.url) {
            // Open Stripe checkout in a new tab
            window.open(data.url, '_blank');
          }
        } else {
          // For cash payments, create order directly
          const { error } = await supabase
            .from('orders')
            .insert(orderData);

          if (error) throw error;
        }
      }

      clearCart();
      
      toast({
        title: "Order Placed!",
        description: paymentMethod === 'card' 
          ? "Payment window opened. Complete payment to confirm your order."
          : "Your order has been placed successfully!",
      });

      navigate(paymentMethod === 'card' ? '/payment-processing' : '/orders');

    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">Add some items to get started!</p>
            <Button onClick={() => navigate("/browse")}>Browse Shops</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Review your order and complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Delivery Mode Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {deliveryMode === 'pickup' ? <ShoppingBag className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                  {deliveryMode === 'pickup' ? 'Pickup Order' : 'Delivery Order'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={deliveryMode === 'pickup' ? 'secondary' : 'default'}>
                    {deliveryMode === 'pickup' ? 'Self Pickup' : 'Home Delivery'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {deliveryMode === 'pickup' 
                      ? 'You will collect your order from the shop'
                      : 'Your order will be delivered to your address'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(cartByShop).map(([shopId, shopItems]) => (
                  <div key={shopId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{shopItems[0].shopName}</h3>
                      <Badge variant="secondary">
                        {shopItems.length} item{shopItems.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {shopItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Shop Total:</span>
                      <span>{formatCurrency(shopItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {deliveryMode === 'pickup' ? 'Contact Information' : 'Delivery Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocationInput
                  label={deliveryMode === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
                  value={deliveryAddress}
                  onChange={setDeliveryAddress}
                  placeholder={deliveryMode === 'pickup' 
                    ? "Shop address will be provided after order confirmation..." 
                    : "Enter your full delivery address..."
                  }
                  disabled={deliveryMode === 'pickup'}
                  required={deliveryMode !== 'pickup'}
                  helperText={deliveryMode === 'pickup' 
                    ? "Shop location will be shared after order confirmation"
                    : "Click 'Use Current Location' or enter address manually"
                  }
                />
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special delivery instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <p className="font-medium">Card Payment</p>
                    <p className="text-sm text-muted-foreground">Pay with debit/credit card</p>
                  </button>
                  
                  <button
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className="w-6 h-6 mb-2 bg-accent rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-accent-foreground">$</span>
                    </div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when order arrives</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full h-12 text-lg bg-gradient-hero hover:shadow-strong transform hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `Place Order • ${formatCurrency(totalPrice)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;