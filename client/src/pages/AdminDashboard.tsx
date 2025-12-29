"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Store, Package, MessageSquare, BarChart3, CheckCircle, XCircle, Phone, Calendar, MapPin, Eye } from "lucide-react";
import { usePendingShops } from "@/hooks/usePendingShops";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useAdminActivity } from "@/hooks/useAdminActivity";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { pendingShops, loading: shopsLoading, approveShop, rejectShop } = usePendingShops();
  const { stats, loading: statsLoading } = useAdminStats();
  const { users, loading: usersLoading } = useAdminUsers();
  const { orders, loading: ordersLoading, updateOrderStatus } = useAdminOrders();
  const { activities, loading: activitiesLoading } = useAdminActivity();
  const { toast } = useToast();

  const statsDisplay = [
    {
      title: "Total Users",
      value: statsLoading ? "..." : stats.totalUsers.toString(),
      change: stats.usersChange,
      icon: Users
    },
    {
      title: "Active Sellers",
      value: statsLoading ? "..." : stats.activeSellers.toString(),
      change: stats.sellersChange,
      icon: Store
    },
    {
      title: "Total Orders",
      value: statsLoading ? "..." : stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: Package
    },
    {
      title: "Platform Revenue",
      value: statsLoading ? "..." : `₹${stats.platformRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: BarChart3
    }
  ];

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleApproveShop = async (shopId: string) => {
    try {
      await approveShop(shopId);
      toast({
        title: "Shop approved!",
        description: "The shop has been approved and can now start selling.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectShop = async (shopId: string) => {
    try {
      await rejectShop(shopId);
      toast({
        title: "Shop rejected",
        description: "The shop has been rejected and removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject shop. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">BuyNest Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs sm:text-sm">Super Admin</Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsDisplay.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change} from last month</p>
                        </div>
                        <Icon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Shop Approvals</CardTitle>
                    <CardDescription>Shops waiting for verification</CardDescription>
                  </div>
                  <Badge variant="secondary">{pendingShops.length}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shopsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading pending shops...</p>
                    </div>
                  ) : pendingShops.length === 0 ? (
                    <div className="text-center py-8">
                      <Store className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No shops pending approval</p>
                    </div>
                  ) : (
                    pendingShops.map((shop) => (
                      <div key={shop.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{shop.name}</h4>
                            <p className="text-sm text-muted-foreground">Owner: {shop.owner_name}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>{shop.categories?.[0] || 'No category'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {shop.address}
                              </span>
                              {shop.phone && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {shop.phone}
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{shop.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(shop.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="flex-1"
                            onClick={() => handleApproveShop(shop.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleRejectShop(shop.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activitiesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : (
                    activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-yellow-500' :
                          activity.status === 'pending' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and buyers</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>{user.address || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {user.roles.map((role) => (
                                <Badge key={role} variant="secondary" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.is_verified ? "default" : "secondary"}>
                              {user.is_verified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sellers">
            <Card>
              <CardHeader>
                <CardTitle>Seller Management</CardTitle>
                <CardDescription>Manage shops and seller accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {shopsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading shops...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shop Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingShops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell className="font-medium">{shop.name}</TableCell>
                          <TableCell>{shop.owner_name}</TableCell>
                          <TableCell>{shop.categories?.[0] || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {shop.phone}
                              </div>
                              <div className="text-muted-foreground">{shop.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Pending</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(shop.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Monitoring</CardTitle>
                <CardDescription>Monitor all platform orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Shop</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{order.phone_number}</div>
                            </div>
                          </TableCell>
                          <TableCell>{order.shop_name}</TableCell>
                          <TableCell>₹{order.total_amount}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'cancelled' ? 'destructive' :
                              order.status === 'confirmed' ? 'secondary' :
                              'outline'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {order.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                >
                                  Confirm
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
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

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Platform analytics and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">₹{stats.platformRevenue.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground mt-1">Total platform revenue</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Orders Completed</span>
                          <span>{stats.totalOrders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Sellers</span>
                          <span>{stats.activeSellers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Users</span>
                          <span>{stats.totalUsers}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Growth Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">User Growth</span>
                          <Badge variant="secondary">{stats.usersChange}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Seller Growth</span>
                          <Badge variant="secondary">{stats.sellersChange}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Order Growth</span>
                          <Badge variant="secondary">{stats.ordersChange}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Revenue Growth</span>
                          <Badge variant="secondary">{stats.revenueChange}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;