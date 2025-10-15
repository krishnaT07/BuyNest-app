-- Add RLS policies for sellers to view and manage orders from their shops

-- Drop existing order policies to recreate them with seller access
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Recreate order policies with seller access
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (((select auth.uid())::text = (user_id)::text));

CREATE POLICY "Sellers can view orders from their shops" 
ON public.orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.shops 
  WHERE shops.id = orders.shop_id 
  AND shops.owner_id::text = (select auth.uid())::text
));

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (((select auth.uid())::text = (user_id)::text));

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (((select auth.uid())::text = (user_id)::text));

CREATE POLICY "Sellers can update orders from their shops" 
ON public.orders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.shops 
  WHERE shops.id = orders.shop_id 
  AND shops.owner_id::text = (select auth.uid())::text
));
