import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminOrder {
  id: string;
  user_id: string;
  shop_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivery_address: string;
  phone_number: string;
  customer_name?: string;
  shop_name?: string;
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Get all orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!ordersData) return;

      // Get customer and shop details
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          // Get customer name
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', order.user_id)
            .single();

          // Get shop name
          const { data: shop } = await supabase
            .from('shops')
            .select('name')
            .eq('id', order.shop_id)
            .single();

          return {
            ...order,
            customer_name: profile?.name || 'Unknown',
            shop_name: shop?.name || 'Unknown Shop'
          };
        })
      );

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, updateOrderStatus, refetch: fetchOrders };
};