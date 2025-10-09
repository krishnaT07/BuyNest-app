"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PendingShop {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
  categories: string[];
  owner_id: string;
  created_at: string;
  owner_name?: string;
}

export const usePendingShops = () => {
  const [pendingShops, setPendingShops] = useState<PendingShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingShops = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch shops that are not approved
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (shopsError) throw shopsError;

      // Fetch owner profiles for each shop
      const shopsWithOwners = await Promise.all(
        shops.map(async (shop) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', shop.owner_id)
            .single();

          return {
            ...shop,
            owner_name: profile?.name || 'Unknown'
          };
        })
      );

      setPendingShops(shopsWithOwners);
    } catch (err) {
      console.error('Error fetching pending shops:', err);
      setError('Failed to load pending shops');
    } finally {
      setLoading(false);
    }
  };

  const approveShop = async (shopId: string) => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', shopId);

      if (error) throw error;

      // Refresh the list
      await fetchPendingShops();
      return true;
    } catch (err) {
      console.error('Error approving shop:', err);
      throw err;
    }
  };

  const rejectShop = async (shopId: string) => {
    try {
      // For now, we'll just delete rejected shops
      // In a real app, you might want to keep them with a rejected status
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId);

      if (error) throw error;

      // Refresh the list
      await fetchPendingShops();
      return true;
    } catch (err) {
      console.error('Error rejecting shop:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPendingShops();
  }, []);

  return {
    pendingShops,
    loading,
    error,
    approveShop,
    rejectShop,
    refetch: fetchPendingShops
  };
};
