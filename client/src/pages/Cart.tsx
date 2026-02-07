"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, Truck, Shield, Gift, ArrowRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, getCartByShop } = useCart();
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const freeShippingThreshold = 999;
  const progress = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Looks like you haven't added anything to your cart yet
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/browse")} size="lg" className="bg-gradient-primary">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cartByShop = getCartByShop();

  const handleRemove = async (itemId: string) => {
    setRemovingItem(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItem(null);
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground text-lg">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Free Shipping Progress */}
        {totalPrice < freeShippingThreshold && (
          <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    Add {formatCurrency(remainingForFreeShipping)} more for <span className="text-primary font-bold">FREE delivery</span>
                  </p>
                  <div className="h-2 rounded-full bg-muted mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {totalPrice >= freeShippingThreshold && (
          <Card className="mb-6 border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-700">🎉 You've unlocked FREE delivery!</p>
                  <p className="text-sm text-muted-foreground">Your order qualifies for free shipping</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(cartByShop).map(([shopId, shopItems]) => (
              <Card key={shopId} className="overflow-hidden shadow-lg border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      {shopItems[0]?.shopName || `Shop ${shopId}`}
                    </CardTitle>
                    <Badge variant="secondary">
                      {shopItems.length} {shopItems.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {shopItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 transition-all ${
                          removingItem === item.id ? 'opacity-50 scale-95' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <Link 
                            to={`/products/${item.id}`}
                            className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                          >
                            <img
                              src={item.imageUrl || "/images/products/default-product.jpg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => { 
                                (e.currentTarget as HTMLImageElement).src = "/images/products/default-product.jpg"; 
                              }}
                            />
                            {item.quantity > 1 && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {item.quantity}
                              </div>
                            )}
                          </Link>
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <Link 
                                  to={`/products/${item.id}`}
                                  className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {formatCurrency(item.price)} each
                                </p>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 mt-3">
                                  <div className="flex items-center gap-1 border rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-r-none"
                                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold text-sm">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-l-none"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemove(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-lg text-primary">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatCurrency(item.price)} × {item.quantity}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-xl border-primary/10">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent border-b">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      {totalPrice >= freeShippingThreshold ? (
                        <>
                          <span className="line-through text-muted-foreground">{formatCurrency(49)}</span>
                          <span>FREE</span>
                        </>
                      ) : (
                        formatCurrency(49)
                      )}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 49))}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={() => navigate("/checkout")} 
                    className="w-full h-12 text-base bg-gradient-primary hover:shadow-lg transition-all"
                    size="lg"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/browse")}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 space-y-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Gift className="h-4 w-4 text-primary" />
                    <span>Easy returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
