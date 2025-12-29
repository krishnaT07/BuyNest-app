"use client";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency, validateCoupon } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  Phone, 
  Truck, 
  ShoppingBag, 
  Shield, 
  Gift, 
  Percent, 
  Clock3,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { LocationInput } from "@/components/LocationInput";
import { useAddressBook } from "@/context/AddressBookContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const [activeStep, setActiveStep] = useState(1);

  const cartByShop = getCartByShop();
  const shopIds = Object.keys(cartByShop);
  const freeShippingThreshold = 999;
  const deliveryFee = totalPrice >= freeShippingThreshold ? 0 : 49;

  useEffect(() => {
    if (user) {
      if (!deliveryAddress && (user as any).address) setDeliveryAddress((user as any).address);
      if (!phoneNumber && (user as any).phone) setPhoneNumber((user as any).phone);
    }
  }, [user]);

  const handleApplyCoupon = () => {
    const res = validateCoupon(coupon, totalPrice);
    setCouponApplied(res.valid);
    setCouponMsg(res.message);
    if (res.valid) {
      toast({
        title: "Coupon Applied!",
        description: res.message,
      });
    }
  };

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
          estimated_delivery_time: deliveryMode === 'pickup' ? 'Ready for pickup' : slot || '30-45 minutes',
          payment_method: paymentMethod,
        };
      });

      if (paymentMethod === 'card') {
        const totalCents = Math.round(grandTotal * 100);
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
            window.location.href = data.url;
            return;
          }
          throw new Error('Payment session could not be created');
        } catch (err) {
          const pendingOrders = orderPayloads.map(o => ({ ...o, payment_method: 'card_pending' }));
          const { error: insertFallbackError } = await supabase
            .from('orders')
            .insert(pendingOrders);
          if (insertFallbackError) throw insertFallbackError;

          clearCart();
          toast({
            title: 'Payment Pending',
            description: 'We could not initiate card payment. Your orders were created as pending.',
          });
          navigate('/orders');
          return;
        }
      }

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to get started!</p>
            <Button onClick={() => navigate("/browse")}>Browse Shops</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = couponApplied ? Math.min(totalPrice * 0.1, 100) : 0;
  const giftWrapFee = giftWrap ? 19 : 0;
  const grandTotal = Math.max(0, totalPrice - discount) + tip + giftWrapFee + deliveryFee;

  const steps = [
    { number: 1, label: "Review", icon: ShoppingCart },
    { number: 2, label: "Details", icon: MapPin },
    { number: 3, label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Checkout</h1>
              <p className="text-muted-foreground text-lg">Complete your purchase securely</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/cart")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </div>
          
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep >= step.number;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted text-muted-foreground border-muted'
                    }`}>
                      {isActive ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Mode */}
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                  {deliveryMode === 'pickup' ? <ShoppingBag className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                  {deliveryMode === 'pickup' ? 'Pickup Order' : 'Delivery Order'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Badge variant={deliveryMode === 'pickup' ? 'secondary' : 'default'} className="mb-4">
                  {deliveryMode === 'pickup' ? 'Self Pickup' : 'Home Delivery'}
                </Badge>
                {deliveryMode !== 'pickup' && (
                  <div className="mt-4">
                    <Label className="text-sm font-semibold mb-3 block">Choose Delivery Slot</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Today 4-6 PM','Today 6-8 PM','Tomorrow 10-12 AM','Tomorrow 12-2 PM','Tomorrow 4-6 PM','Express 30-45 min'].map((s) => (
                        <button 
                          key={s} 
                          onClick={() => setSlot(s)} 
                          className={`p-3 text-sm rounded-lg border transition-all ${
                            slot === s 
                              ? 'border-primary bg-primary/10 text-primary font-semibold' 
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <Clock3 className="h-4 w-4" />
                            <span>{s}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {deliveryMode === 'pickup' ? 'Contact Information' : 'Delivery Address'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {user && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { 
                      if ((user as any).address) setDeliveryAddress((user as any).address); 
                      if ((user as any).phone) setPhoneNumber((user as any).phone); 
                    }}
                    className="mb-2"
                  >
                    Use saved details
                  </Button>
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
                />
                
                {addresses.length > 0 && deliveryMode !== 'pickup' && (
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Saved Addresses</Label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {addresses.map(a => (
                        <button 
                          key={a.id} 
                          className={`p-3 text-left rounded-lg border transition-all ${
                            deliveryAddress === a.line1 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`} 
                          onClick={() => setDeliveryAddress(a.line1)}
                        >
                          <p className="font-medium text-sm">{a.label}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{a.line1}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-2 h-11"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special delivery instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "cash")}>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}>
                      <RadioGroupItem value="card" id="card" className="sr-only" />
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-semibold">Card Payment</p>
                          <p className="text-xs text-muted-foreground">Debit/Credit card</p>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                      )}
                    </label>
                    
                    <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'cash' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}>
                      <RadioGroupItem value="cash" id="cash" className="sr-only" />
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                          <span className="text-xs font-bold">₹</span>
                        </div>
                        <div>
                          <p className="font-semibold">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when delivered</p>
                        </div>
                      </div>
                      {paymentMethod === 'cash' && (
                        <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                      )}
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {Object.entries(cartByShop).map(([shopId, shopItems]) => (
                  <div key={shopId} className="space-y-3 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{shopItems[0].shopName}</h3>
                      <Badge variant="secondary">{shopItems.length} items</Badge>
                    </div>
                    {shopItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || "/images/products/default-product.jpg"}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-xl border-primary/10">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent border-b">
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Coupon */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Coupon Code
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter code" 
                      value={coupon} 
                      onChange={(e) => setCoupon(e.target.value)}
                      className="h-9"
                    />
                    <Button 
                      type="button" 
                      variant={couponApplied ? "default" : "outline"}
                      onClick={handleApplyCoupon}
                      size="sm"
                    >
                      {couponApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs mt-2 ${couponApplied ? 'text-green-600' : 'text-destructive'}`}>
                      {couponMsg}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="gift" 
                      checked={giftWrap} 
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="gift" className="flex items-center gap-2 cursor-pointer">
                      <Gift className="h-4 w-4" />
                      Gift wrap (₹19)
                    </Label>
                  </div>
                  
                  {giftWrap && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gift Wrap</span>
                      <span>{formatCurrency(giftWrapFee)}</span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Label className="text-sm font-semibold mb-2 block">Tip (Optional)</Label>
                    <div className="flex gap-2">
                      {[0, 10, 20, 50].map(v => (
                        <Button 
                          key={v} 
                          type="button" 
                          variant={tip === v ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setTip(v)}
                          className="flex-1"
                        >
                          {v === 0 ? 'None' : `₹${v}`}
                        </Button>
                      ))}
                    </div>
                    {tip > 0 && (
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Tip</span>
                        <span>{formatCurrency(tip)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>256-bit SSL encryption</span>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full h-12 text-base bg-gradient-primary hover:shadow-lg transition-all mt-4"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order • {formatCurrency(grandTotal)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
