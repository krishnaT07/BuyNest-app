"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, Package, MessageSquare, BarChart3, Plus, Bell, Settings, TrendingUp, Users, ShoppingCart, Eye } from "lucide-react";
import ProductManagement from "@/components/ProductManagement";
import SellerRedirect from "@/components/SellerRedirect";
import ShopSettings from "@/pages/seller/ShopSettings";
import { PerformanceMetrics } from "@/components/seller/PerformanceMetrics";
import { ProductRatings } from "@/components/seller/ProductRatings";
import { CustomerChat } from "@/components/seller/CustomerChat";
import { useSellerShop } from "@/hooks/useSellerShop";
import { useSellerOrders } from "@/hooks/useSellerOrders";
import { useSellerAnalytics } from "@/hooks/useSellerAnalytics";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { useToast } from "@/hooks/use-toast";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shop, loading } = useSellerShop();
  const { orders, loading: ordersLoading, updateOrderStatus } = useSellerOrders();
  const { analytics, loading: analyticsLoading } = useSellerAnalytics();
  const { products, loading: productsLoading } = useSellerProducts();

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: "Order status updated",
        description: `Order has been marked as ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const stats = analytics ? [
    {
      title: "Total Sales",
      value: `₹${analytics.totalSales.toLocaleString()}`,
      change: "+12%",
      icon: BarChart3
    },
    {
      title: "Orders Today",
      value: analytics.todayOrders.toString(),
      change: "+8%",
      icon: Package
    },
    {
      title: "Products",
      value: analytics.totalProducts.toString(),
      change: "+3",
      icon: Store
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toString(),
      change: "+15%",
      icon: ShoppingCart
    }
  ] : [
    { title: "Total Sales", value: "₹0", change: "0%", icon: BarChart3 },
    { title: "Orders Today", value: "0", change: "0%", icon: Package },
    { title: "Products", value: "0", change: "0%", icon: Store },
    { title: "Total Orders", value: "0", change: "0%", icon: ShoppingCart }
  ];

  // Show different views based on shop status
  if (loading) {
    return (
      <SellerRedirect>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </SellerRedirect>
    );
  }
  if (!shop && !loading) {
    return (
      <SellerRedirect>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                <Store className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h1 className="text-2xl font-bold mb-4">Register Your Shop</h1>
                <p className="text-muted-foreground mb-6">
                  You need to register your shop before you can start selling products and managing orders.
                </p>
                <Button 
                  onClick={() => navigate('/shops/register')}
                  size="lg"
                  className="w-full"
                >
                  Register Shop Now
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </SellerRedirect>
    );
  }

  if (shop && !shop.is_approved) {
    return (
      <SellerRedirect>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
                <Store className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                <h1 className="text-2xl font-bold mb-4">Shop Under Review</h1>
                <p className="text-muted-foreground mb-6">
                  Your shop "{shop.name}" has been submitted for admin approval. 
                  You'll be able to start selling once it's approved by our admin team.
                </p>
                <div className="bg-white border rounded p-4 text-sm text-left">
                  <p className="font-semibold mb-2">What happens next?</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Admin will review your shop details</li>
                    <li>• You'll receive a notification once approved</li>
                    <li>• After approval, you can add products and start selling</li>
                  </ul>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/shops/register')}
                  className="w-full mt-4"
                >
                  Edit Shop Details
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </SellerRedirect>
    );
  }

  return (
    <SellerRedirect>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Store className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{shop?.name || "Your Shop"}</h1>
                <p className="text-sm text-muted-foreground">Seller Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change} from yesterday</p>
                        </div>
                        <Icon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from customers</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab("orders")}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ordersLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-4">
                      <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{order.id.substring(0, 8)}...</p>
                          <p className="text-xs text-muted-foreground">{order.phone_number}</p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={
                                order.status === "pending" ? "secondary" :
                                order.status === "confirmed" ? "default" : "outline"
                              }
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total_amount}</p>
                          <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling items this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics?.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.quantity} sold</p>
                      </div>
                      <p className="font-semibold">₹{product.sales.toLocaleString()}</p>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <TrendingUp className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No product data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics analytics={analytics} />
            <ProductRatings products={products} />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <CustomerChat />
          </TabsContent>

          {/* Other tabs content would go here */}
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage all orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{order.phone_number}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>₹{order.total_amount}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.status === "pending" ? "secondary" :
                                order.status === "confirmed" ? "default" :
                                order.status === "delivered" ? "default" : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {order.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, "confirmed")}
                                >
                                  Confirm
                                </Button>
                              )}
                              {order.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, "preparing")}
                                >
                                  Preparing
                                </Button>
                              )}
                              {order.status === "preparing" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, "out_for_delivery")}
                                >
                                  Out for Delivery
                                </Button>
                              )}
                              {order.status === "out_for_delivery" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, "delivered")}
                                >
                                  Delivered
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // View order details
                                  console.log('View order:', order);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>View detailed sales analytics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading analytics...</p>
                    </div>
                  ) : analytics && analytics.salesByDay.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.salesByDay}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value, name) => [
                              name === 'amount' ? `₹${value}` : value,
                              name === 'amount' ? 'Sales' : 'Orders'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="hsl(var(--secondary))" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No sales data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Order Value</span>
                      <span className="font-semibold">
                        ₹{analytics ? (analytics.totalOrders > 0 ? (analytics.totalSales / analytics.totalOrders).toFixed(0) : 0) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-semibold text-green-600">12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Retention</span>
                      <span className="font-semibold text-blue-600">68%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekly Growth</span>
                      <span className="font-semibold text-green-600">+15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Growth</span>
                      <span className="font-semibold text-green-600">+28.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Customers</span>
                      <span className="font-semibold">+45</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <ShopSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </SellerRedirect>
  );
};

export default SellerDashboard;
