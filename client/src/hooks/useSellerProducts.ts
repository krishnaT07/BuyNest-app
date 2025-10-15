"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';

export const useSellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProducts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First get the seller's shop
      const { data: shops, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id);

      if (shopError) throw shopError;

      if (!shops || shops.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const shopId = shops[0].id;

      // Then get products for that shop
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        category: product.category || '',
        imageUrl: product.image_url || '',
        inStock: product.in_stock ?? true,
        stockQuantity: product.stock_quantity || 0,
        isActive: product.is_active ?? true,
        shopId: product.shop_id,
        sku: product.sku || '',
        weight: product.weight || '',
        nutritionInfo: product.nutrition_info || null,
        isFeatured: product.is_featured ?? false,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
      }));

      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching seller products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Creating product - User:', user);
    
    if (!user) {
      console.error('No user found in context');
      throw new Error('User not authenticated');
    }

    try {
      // Get seller's shop
      console.log('Fetching shop for user:', user.id);
      const { data: shops, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      console.log('Shop query result:', { shops, shopError });

      if (shopError) {
        console.error('Shop error:', shopError);
        throw shopError;
      }
      
      if (!shops) {
        console.error('No shop found for user');
        throw new Error('No shop found for seller');
      }

      const productPayload = {
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        category: productData.category,
        image_url: productData.imageUrl,
        in_stock: productData.inStock,
        shop_id: shops.id,
        sku: productData.sku,
        weight: productData.weight,
        nutrition_info: productData.nutritionInfo,
        is_featured: productData.isFeatured,
      };

      console.log('Creating product with payload:', productPayload);

      const { data, error } = await supabase
        .from('products')
        .insert(productPayload)
        .select()
        .single();

      console.log('Product creation result:', { data, error });

      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        original_price: updates.originalPrice,
        category: updates.category,
        image_url: updates.imageUrl,
        in_stock: updates.inStock,
        sku: updates.sku,
        weight: updates.weight,
        nutrition_info: updates.nutritionInfo,
        is_featured: updates.isFeatured,
      })
      .eq('id', id);

    if (error) throw error;
    
    await fetchProducts(); // Refresh the list
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await fetchProducts(); // Refresh the list
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const updateStock = async (productId: string, stockQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: stockQuantity,
          in_stock: stockQuantity > 0
        })
        .eq('id', productId);

      if (error) throw error;
      
      await fetchProducts(); // Refresh products
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId);

      if (error) throw error;
      
      await fetchProducts(); // Refresh products
    } catch (error) {
      console.error('Error toggling product status:', error);
      throw error;
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    toggleProductStatus,
    refetch: fetchProducts,
  };
};