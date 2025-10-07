import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, ShoppingCart, Star, Clock, Truck } from "lucide-react";

const BuyerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const nearbyShops = [
    {
      id: 1,
      name: "Fresh Market",
      category: "Groceries",
      rating: 4.8,
      distance: "0.5 km",
      deliveryTime: "15-20 min",
      image: "/placeholder.svg",
      products: 150
    },
    {
      id: 2,
      name: "Tech Zone",
      category: "Electronics",
      rating: 4.6,
      distance: "1.2 km",
      deliveryTime: "25-30 min",
      image: "/placeholder.svg",
      products: 89
    },
    {
      id: 3,
      name: "Style Store",
      category: "Fashion",
      rating: 4.9,
      distance: "0.8 km",
      deliveryTime: "20-25 min",
      image: "/placeholder.svg",
      products: 200
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      shop: "Fresh Market",
      items: 3,
      total: "₹420",
      status: "Delivered",
      date: "2 days ago"
    },
    {
      id: "ORD-002",
      shop: "Tech Zone",
      items: 1,
      total: "₹2,999",
      status: "On the way",
      date: "Today"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
              <Badge variant="secondary" className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Koramangala, Bangalore
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <ShoppingCart className="w-4 h-4" />
              </Button>
              <Button variant="ghost">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Bar */}
            <Card>
              <CardHeader>
                <CardTitle>Find Local Shops</CardTitle>
                <CardDescription>
                  Search for shops and products in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for shops, products, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nearby Shops */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Shops</CardTitle>
                <CardDescription>
                  Discover local shops in your neighborhood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {nearbyShops.map((shop) => (
                    <Card key={shop.id} className="cursor-pointer hover:shadow-soft transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <Store className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{shop.name}</h3>
                            <p className="text-sm text-muted-foreground">{shop.category}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                                {shop.rating}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {shop.distance}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {shop.deliveryTime}
                              </div>
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {shop.products} products
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Track your latest purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.shop}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={order.status === "Delivered" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.items} items</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Change Location
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Recent Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="w-4 h-4 mr-2" />
                  Track Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Store = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H5a2 2 0 01-2-2m5 0v-5a2 2 0 011-1h2a2 2 0 011 1v5m-4 0h4" />
  </svg>
);

export default BuyerDashboard;