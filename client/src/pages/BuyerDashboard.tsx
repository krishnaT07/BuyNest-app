"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  Star, 
  Clock, 
  Truck, 
  Store, 
  Package, 
  TrendingUp,
  Heart,
  Filter,
  Grid3X3,
  List,
  Eye,
  Plus,
  Minus,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useShops } from "@/hooks/useShops";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ShopCard from "@/components/ShopCard";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems, totalPrice, totalItems } = useCart();
  const { wishlistItems, isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"shops" | "products" | "orders" | "wishlist">("shops");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");

  // Fetch data
  const { shops, loading: shopsLoading } = useShops({
    category: selectedCategory,
    searchQuery: searchQuery,
    sortBy: sortBy
  });

  const { products, loading: productsLoading } = useProducts({
    category: selectedCategory,
    searchQuery: searchQuery,
    priceRange: priceRange,
    sortBy: sortBy
  });

  const categories = [
    "All Categories", "Grocery", "Electronics", "Clothing", "Food & Drinks", 
    "Health & Beauty", "Home & Garden", "Sports", "Books"
  ];

  // Mock recent orders data
  const recentOrders = [
    {
      id: "ORD-001",
      shop: "Fresh Market",
      items: 3,
      total: "₹420",
      status: "Delivered",
      date: "2 days ago",
      image: "/images/shops/fresh-market.jpg"
    },
    {
      id: "ORD-002", 
      shop: "Tech Zone",
      items: 1,
      total: "₹2,999",
      status: "On the way",
      date: "Today",
      image: "/images/shops/tech-zone.jpg"
    }
  ];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const handleSearch = useCallback(() => {
    // Search functionality is handled by the hooks
  }, []);

  const handleAddToCart = useCallback((product: any) => {
    // Add to cart functionality
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, [toast]);

  // Memoize expensive calculations
  const statsCards = useMemo(() => [
    {
      title: "Cart Items",
      value: totalItems,
      icon: ShoppingCart,
      color: "text-primary"
    },
    {
      title: "Wishlist",
      value: wishlistItems.length,
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "Total Spent",
      value: formatPrice(totalPrice),
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Nearby Shops",
      value: (shops as any)?.length || 0,
      icon: Store,
      color: "text-blue-500"
    }
  ], [totalItems, wishlistItems.length, totalPrice, shops]);

  const filteredProducts = useMemo(() => {
    return (products as any)?.slice(0, 12) || [];
  }, [products]);

  const filteredShops = useMemo(() => {
    return (shops as any) || [];
  }, [shops]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || 'Buyer'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Discover amazing local shops and products in your area
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Find Local Shops & Products</CardTitle>
                <CardDescription>
                  Search for shops and products in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for shops, products, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSearch} className="sm:w-auto">
                    Search
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rated</option>
                    <option value="distance">Nearest First</option>
                    <option value="delivery-time">Fastest Delivery</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="shops">Shops</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>

              <TabsContent value="shops" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Nearby Shops</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredShops.length > 0 ? (
                    filteredShops.map((shop: any) => (
                      <ShopCard key={shop.id} shop={shop} viewMode={viewMode} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No shops found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Featured Products</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No products found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <Store className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.shop}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  variant={order.status === "Delivered" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {order.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{order.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{order.total}</p>
                            <p className="text-sm text-muted-foreground">{order.items} items</p>
                            <Button size="sm" variant="outline" className="mt-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="wishlist" className="mt-6">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img
                            src={item.imageUrl || "/images/products/default-product.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          <p className="text-lg font-bold text-primary mb-3">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleWishlist(item)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your wishlist is empty.</p>
                      <p className="text-sm text-muted-foreground">Add some products to your wishlist!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cartItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{cartItems.length - 3} more items
                        </p>
                      )}
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/cart')}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Cart ({totalItems})
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Button className="w-full" onClick={() => navigate('/browse')}>
                      Start Shopping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/browse')}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Browse Shops
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/orders')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Your Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Koramangala, Bangalore</p>
                    <p className="text-sm text-muted-foreground">Change location</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4" />
                  </Button>
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

const Store = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H5a2 2 0 01-2-2m5 0v-5a2 2 0 011-1h2a2 2 0 011 1v5m-4 0h4" />
  </svg>
);

export default BuyerDashboard;