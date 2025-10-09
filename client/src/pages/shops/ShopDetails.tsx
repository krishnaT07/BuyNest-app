"use client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Star, Phone } from "lucide-react";
import { useShopDetails } from "@/hooks/useShopDetails";
import { useProducts } from "@/hooks/useProducts";

const ShopDetails = () => {
  const { shopId } = useParams();
  const { toast } = useToast();
  
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
        <Header />
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
        <Header />
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
      <Header />
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
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} shopName={shop.name} />
                  ))}
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

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Add items to your cart to see the order summary.
                </p>
                <Button className="w-full" disabled>
                  Add items to cart
                </Button>
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