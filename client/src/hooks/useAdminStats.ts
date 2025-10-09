"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  activeSellers: number;
  totalOrders: number;
  platformRevenue: number;
  usersChange: string;
  sellersChange: string;
  ordersChange: string;
  revenueChange: string;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSellers: 0,
    totalOrders: 0,
    platformRevenue: 0,
    usersChange: '+0%',
    sellersChange: '+0%',
    ordersChange: '+0%',
    revenueChange: '+0%'
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active sellers (approved shops)
      const { count: sellersCount } = await supabase
        .from('shops')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true);

      // Get total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get platform revenue (sum of all completed orders)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        activeSellers: sellersCount || 0,
        totalOrders: ordersCount || 0,
        platformRevenue: totalRevenue,
        usersChange: '+12%', // TODO: Calculate actual change
        sellersChange: '+8%',
        ordersChange: '+15%',
        revenueChange: '+23%'
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};