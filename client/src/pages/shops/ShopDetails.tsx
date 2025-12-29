"use client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useDeliveryMode } from "@/context/DeliveryModeContext";
import { useShopDetails } from "@/hooks/useShopDetails";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Star, Phone, ShoppingCart, Truck } from "lucide-react";

const ShopDetails = () => {
  const { shopId } = useParams();
  const { toast } = useToast();
  const { items: cartItems, totalPrice } = useCart();
  const { deliveryMode } = useDeliveryMode();
  
  const { shop, loading: shopLoading, error: shopError } = useShopDetails(shopId);
  const { products, loading: productsLoading, error: productsError } = useProducts({ shopId });
  
  const isLoading = shopLoading || productsLoading;
  const error = shopError || productsError;

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop && !isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Shop not found</h1>
          <p className="text-gray-600 mt-2">The shop you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{shop.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {shop.description}
                    </CardDescription>
                  </div>
                  <Badge variant={shop.isOpen ? "default" : "destructive"}>
                    {shop.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{shop.rating}</span>
                    <span>({shop.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{shop.deliveryTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shop.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="products" className="mt-8">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="info">Store Info</TabsTrigger>
              </TabsList>
              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(products as any) && (products as any).length > 0 ? (products as any).map((product: any) => (
                    <ProductCard key={product.id} product={product} shopName={shop.name} />
                  )) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No products available in this shop.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">Reviews will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="info" className="mt-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold">Opening Hours</h4>
                      <p className="text-muted-foreground">{shop.openingHours}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Minimum Order</h4>
                      <p className="text-muted-foreground">₹{shop.minimumOrder}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Contact</h4>
                      <p className="text-muted-foreground">{shop.email}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            {/* Cart Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>Delivery Mode:</span>
                        <span className="capitalize">{deliveryMode}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => window.location.href = '/cart'}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Cart ({cartItems.length})
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">
                      Your cart is empty. Add some products to get started!
                    </p>
                    <Button className="w-full" disabled>
                      Add items to cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shop Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.phone}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Minimum order: <span className="font-medium">₹{shop.minimumOrder}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopDetails;