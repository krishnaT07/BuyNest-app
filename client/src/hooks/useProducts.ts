import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';

export interface UseProductsOptions {
  shopId?: string;
  category?: string;
  searchQuery?: string;
  priceRange?: [number, number];
  sortBy?: string;
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const queryKey = ['products', {
    shopId: options.shopId,
    category: options.category,
    searchQuery: options.searchQuery,
    priceMin: options.priceRange?.[0],
    priceMax: options.priceRange?.[1],
    sortBy: options.sortBy,
    limit: options.limit,
  }];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true);

      if (options.shopId) {
        query = query.eq('shop_id', options.shopId);
      }

      if (options.category && options.category !== 'All Categories') {
        query = query.eq('category', options.category);
      }

      if (options.searchQuery) {
        query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
      }

      if (options.priceRange) {
        query = query
          .gte('price', options.priceRange[0])
          .lte('price', options.priceRange[1]);
      }

      switch (options.sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        category: product.category,
        imageUrl: product.image_url,
        inStock: product.in_stock,
        shopId: product.shop_id,
        sku: product.sku,
        weight: product.weight,
        nutritionInfo: product.nutrition_info,
        isFeatured: product.is_featured,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
      }));
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load products' : null,
    refetch: query.refetch,
  };
};