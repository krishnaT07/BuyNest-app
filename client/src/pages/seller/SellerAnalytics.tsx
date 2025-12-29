"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetrics } from "@/components/seller/PerformanceMetrics";
import { useSellerAnalytics } from "@/hooks/useSellerAnalytics";
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";

const SellerAnalytics = () => {
  const { analytics, loading } = useSellerAnalytics();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your shop's performance and insights</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{analytics.totalSales.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.growthStats?.salesGrowth >= 0 ? '+' : ''}
                    {analytics.growthStats?.salesGrowth?.toFixed(1) || '0.0'}% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.todayOrders} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Active products</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{analytics.growthStats?.avgOrderValue?.toFixed(0) || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">Per order</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <PerformanceMetrics analytics={analytics} />

            {/* Sales by Day */}
            {analytics.salesByDay && analytics.salesByDay.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.salesByDay.map((day: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-sm font-bold">₹{day.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(day.amount / Math.max(...analytics.salesByDay.map((d: any) => d.amount))) * 100}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{day.orders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Products */}
            {analytics.topProducts && analytics.topProducts.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topProducts.map((product: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} sold
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{product.sales.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analytics data</h3>
            <p className="text-muted-foreground">Start selling to see your analytics</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SellerAnalytics;

