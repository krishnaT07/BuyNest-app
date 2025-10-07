import { useState, useEffect } from "react";
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
import { formatCurrency, validateCoupon } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, CreditCard, MapPin, Phone, User, Truck, ShoppingBag, Shield, Gift, Percent, Clock3 } from "lucide-react";
import { LocationInput } from "@/components/LocationInput";
import { useAddressBook } from "@/context/AddressBookContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, getCartByShop } = useCart();
  const { user } = useAuth();
  const { addresses } = useAddressBook();
  const { deliveryMode } = useDeliveryMode();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [tip, setTip] = useState(0);
  const [giftWrap, setGiftWrap] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);

  const cartByShop = getCartByShop();
  const shopIds = Object.keys(cartByShop);

  // Prefill from user profile if available
  useEffect(() => {
    if (user) {
      if (!deliveryAddress && (user as any).address) setDeliveryAddress((user as any).address);
      if (!phoneNumber && (user as any).phone) setPhoneNumber((user as any).phone);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

    const needsAddress = deliveryMode !== 'pickup';
    if ((needsAddress && !deliveryAddress.trim()) || !phoneNumber.trim()) {
      toast({
        title: "Missing Information",
        description: needsAddress ? "Please fill in your delivery address and phone number." : "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare per-shop orders
      const orderPayloads = shopIds.map((shopId) => {
        const shopItems = cartByShop[shopId];
        const shopTotal = shopItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
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
          delivery_address: needsAddress ? deliveryAddress : 'Pickup at shop',
          phone_number: phoneNumber,
          notes: notes || null,
          estimated_delivery_time: deliveryMode === 'pickup' ? 'Ready for pickup' : '30-45 minutes',
          payment_method: paymentMethod,
        };
      });

      if (paymentMethod === 'card') {
        // Single Stripe session for all shops combined
        const totalCents = Math.round(totalPrice * 100);
        try {
          const { data, error } = await supabase.functions.invoke('create-payment', {
            body: {
              amount: totalCents,
              currency: 'usd',
              orders: orderPayloads,
            },
          });

          if (error) throw error;
          if (data?.url) {
            clearCart();
            window.location.href = data.url; // redirect in same tab
            return;
          }
          throw new Error('Payment session could not be created');
        } catch (err) {
          // Fallback: create pending card orders directly
          const pendingOrders = orderPayloads.map(o => ({ ...o, payment_method: 'card_pending' }));
          const { error: insertFallbackError } = await supabase
            .from('orders')
            .insert(pendingOrders);
          if (insertFallbackError) throw insertFallbackError;

          clearCart();
          toast({
            title: 'Payment Pending',
            description: 'We could not initiate card payment due to a network issue. Your orders were created as pending. You can complete payment with the shop.',
          });
          navigate('/orders');
          return;
        }
      }

      // Cash on delivery: create orders directly (one per shop)
      const { error: insertError } = await supabase
        .from('orders')
        .insert(orderPayloads);
      if (insertError) throw insertError;

      clearCart();
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully!",
      });
      navigate('/orders');

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

  // derived totals
  const discount = couponApplied ? Math.min(totalPrice * 0.1, 100) : 0; // default; overridden when validating
  const giftWrapFee = giftWrap ? 19 : 0;
  const grandTotal = Math.max(0, totalPrice - discount) + tip + giftWrapFee;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 flex-1 rounded bg-muted">
              <div className="h-2 w-2/3 bg-primary rounded" />
            </div>
            <span className="text-xs text-muted-foreground">2 of 3</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Cart</span>
            <span>›</span>
            <span className="font-medium text-foreground">Checkout</span>
            <span>›</span>
            <span>Payment</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">Checkout</h1>
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
                {/* Delivery slot selection (delivery only) */}
                {deliveryMode !== 'pickup' && (
                  <div className="mt-4">
                    <Label className="text-sm mb-2 block">Delivery Slot</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Today 4-6 PM','Today 6-8 PM','Tomorrow 10-12 AM','Tomorrow 12-2 PM','Tomorrow 4-6 PM','Express 30-45 min'].map((s) => (
                        <button key={s} onClick={() => setSlot(s)} className={`p-2 text-sm rounded border ${slot === s ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                            src={item.imageUrl || "/images/products/default-product.jpg"}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/products/default-product.jpg"; }}
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
                {/* Coupon */}
                <div className="mt-4 p-3 rounded-lg border bg-muted/30">
                  <Label className="text-sm mb-2 flex items-center gap-2"><Percent className="h-4 w-4" />Apply Coupon</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    <Button type="button" variant="outline" onClick={() => {
                      const res = validateCoupon(coupon, totalPrice);
                      setCouponApplied(res.valid);
                      setCouponMsg(res.message);
                      if (!res.valid) return;
                    }}>
                      {couponApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                  {couponMsg && <p className={`text-xs mt-1 ${couponApplied ? 'text-green-600' : 'text-destructive'}`}>{couponMsg}</p>}
                </div>

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
                {/* Quick fill saved profile */}
                {user && (
                  <div className="flex items-center gap-2 text-sm">
                    <Button variant="outline" size="sm" onClick={() => { if ((user as any).address) setDeliveryAddress((user as any).address); if ((user as any).phone) setPhoneNumber((user as any).phone); }}>
                      Use saved details
                    </Button>
                    <span className="text-muted-foreground">Fill from profile</span>
                  </div>
                )}
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
                {/* Saved addresses */}
                {addresses.length > 0 && deliveryMode !== 'pickup' && (
                  <div>
                    <Label className="text-sm">Choose a saved address</Label>
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      {addresses.map(a => (
                        <button key={a.id} className={`p-2 text-left rounded border ${deliveryAddress === a.line1 ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onClick={() => setDeliveryAddress(a.line1)}>
                          <p className="font-medium text-sm">{a.label}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{a.line1}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
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

                {/* Gift option */}
                <div className="flex items-center gap-2">
                  <input id="gift" type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} />
                  <Label htmlFor="gift" className="flex items-center gap-2"><Gift className="h-4 w-4" />Add gift wrap (₹19)</Label>
                </div>

                {/* Tip */}
                <div>
                  <Label className="text-sm">Tip your delivery partner (optional)</Label>
                  <div className="flex gap-2 mt-2">
                    {[0, 10, 20, 50].map(v => (
                      <Button key={v} type="button" variant={tip === v ? 'default' : 'outline'} size="sm" onClick={() => setTip(v)}>
                        {v === 0 ? 'No tip' : `₹${v}`}
                      </Button>
                    ))}
                  </div>
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
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Items subtotal</span><span>{formatCurrency(totalPrice)}</span></div>
                {couponApplied && (<div className="flex justify-between text-green-600"><span>Coupon discount</span><span>-{formatCurrency(discount)}</span></div>)}
                {giftWrap && (<div className="flex justify-between"><span>Gift wrap</span><span>{formatCurrency(giftWrapFee)}</span></div>)}
                {tip > 0 && (<div className="flex justify-between"><span>Tip</span><span>{formatCurrency(tip)}</span></div>)}
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Grand Total</span><span>{formatCurrency(grandTotal)}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground pt-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Secure checkout • 256-bit SSL encryption</span>
                </div>
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
                `Place Order • ${formatCurrency(grandTotal)}`
              )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;