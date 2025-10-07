import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useSellerShop = () => {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSellerShop = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }

        setShop(data);
      } catch (err) {
        console.error('Error fetching seller shop:', err);
        setError('Failed to load shop');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerShop();
  }, [user]);

  const hasShop = () => {
    return shop !== null;
  };

  return { shop, loading, error, hasShop, refetch: () => fetchSellerShop() };
};