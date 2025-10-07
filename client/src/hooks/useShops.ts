import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types';
import { useQuery } from '@tanstack/react-query';

export interface UseShopsOptions {
  category?: string;
  searchQuery?: string;
  sortBy?: string;
  limit?: number;
}

export const useShops = (options: UseShopsOptions = {}) => {
  const queryKey = ['shops', {
    category: options.category,
    searchQuery: options.searchQuery,
    sortBy: options.sortBy,
    limit: options.limit,
  }];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<Shop[]> => {
      let query = supabase
        .from('shops')
        .select('*')
        .eq('is_open', true);

      if (options.category && options.category !== 'All Categories') {
        query = query.contains('categories', [options.category]);
      }

      if (options.searchQuery) {
        query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
      }

      switch (options.sortBy) {
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'delivery-time':
          query = query.order('delivery_time');
          break;
        default:
          query = query.order('rating', { ascending: false });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((shop: any) => ({
        id: shop.id,
        name: shop.name,
        description: shop.description,
        address: shop.address,
        phone: shop.phone,
        email: shop.email,
        rating: shop.rating,
        reviewCount: shop.review_count,
        openingHours: shop.opening_hours,
        categories: shop.categories || [],
        isOpen: shop.is_open,
        deliveryTime: shop.delivery_time,
        minimumOrder: shop.minimum_order,
        ownerId: shop.owner_id,
        imageUrl: shop.image_url,
        createdAt: new Date(shop.created_at),
        updatedAt: new Date(shop.updated_at),
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    shops: query.data || [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load shops' : null,
    refetch: query.refetch,
  };
};