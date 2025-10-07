import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Order {
  id: string;
  user_id: string;
  shop_id: string;
  items: any[];
  total_amount: number;
  status: string;
  delivery_address: string;
  phone_number: string;
  notes?: string;
  estimated_delivery_time: string;
  created_at: string;
  updated_at: string;
}

export const useSellerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
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
        setOrders([]);
        setLoading(false);
        return;
      }

      // Get orders for the shop
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shops.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch: fetchOrders,
  };
};