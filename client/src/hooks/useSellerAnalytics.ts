"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  todayOrders: number;
  salesByDay: Array<{ date: string; amount: number; orders: number }>;
  topProducts: Array<{ name: string; sales: number; quantity: number }>;
}

export const useSellerAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get seller's shop first
      const { data: shops, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (shopError) throw shopError;

      if (!shops) {
        setAnalytics({
          totalSales: 0,
          totalOrders: 0,
          totalProducts: 0,
          todayOrders: 0,
          salesByDay: [],
          topProducts: [],
        });
        setLoading(false);
        return;
      }

      // Fetch orders for analytics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shops.id);

      if (ordersError) throw ordersError;

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shops.id);

      if (productsError) throw productsError;

      // Calculate analytics
      const totalSales = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;
      
      // Today's orders
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders?.filter(order => 
        new Date(order.created_at).toISOString().split('T')[0] === today
      ).length || 0;

      // Sales by day (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const salesByDay = last7Days.map(date => {
        const dayOrders = orders?.filter(order => 
          new Date(order.created_at).toISOString().split('T')[0] === date
        ) || [];
        
        return {
          date,
          amount: dayOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
          orders: dayOrders.length,
        };
      });

      // Top products (mock data for now as we need more complex queries)
      const topProducts = [
        { name: "Fresh Bananas", sales: 2340, quantity: 45 },
        { name: "Organic Milk", sales: 1890, quantity: 32 },
        { name: "Wheat Flour", sales: 1560, quantity: 28 },
      ];

      setAnalytics({
        totalSales,
        totalOrders,
        totalProducts: productsCount || 0,
        todayOrders,
        salesByDay,
        topProducts,
      });
    } catch (err) {
      console.error('Error fetching seller analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};