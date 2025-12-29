"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Eye } from "lucide-react";
import { useSellerOrders } from "@/hooks/useSellerOrders";
import { useToast } from "@/hooks/use-toast";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const SellerOrders = () => {
  const { orders, loading, updateOrderStatus, refetch } = useSellerOrders();
  const { toast } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: "Order status updated",
        description: `Order has been marked as ${status}`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsOrderModalOpen(true);
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage and track your shop orders</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {statusFilter === "all" 
                ? "You don't have any orders yet."
                : `No ${statusFilter} orders found.`
              }
            </p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Order List</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>{order.phone_number}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "pending" ? "secondary" :
                            order.status === "confirmed" ? "default" :
                            order.status === "delivered" ? "default" : "outline"
                          }
                        >
                          {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === "pending" && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">Confirm</SelectItem>
                                <SelectItem value="cancelled">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {order.status === "confirmed" && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="cancelled">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {order.status === "preparing" && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {order.status === "out_for_delivery" && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="delivered">Mark Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {selectedOrderId && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            isOpen={isOrderModalOpen}
            onClose={() => {
              setIsOrderModalOpen(false);
              setSelectedOrderId(null);
            }}
            onUpdate={refetch}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SellerOrders;

