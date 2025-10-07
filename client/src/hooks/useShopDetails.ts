import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types';

export const useShopDetails = (shopId: string | undefined) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('id', shopId)
          .single();

        if (error) throw error;

        // Map database fields to type fields
        const mappedShop: Shop = {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          rating: data.rating,
          reviewCount: data.review_count,
          openingHours: data.opening_hours,
          categories: data.categories || [],
          isOpen: data.is_open,
          deliveryTime: data.delivery_time,
          minimumOrder: data.minimum_order,
          ownerId: data.owner_id,
          imageUrl: data.image_url,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };

        setShop(mappedShop);
      } catch (err) {
        console.error('Error fetching shop:', err);
        setError('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  return { shop, loading, error, refetch: () => window.location.reload() };
};