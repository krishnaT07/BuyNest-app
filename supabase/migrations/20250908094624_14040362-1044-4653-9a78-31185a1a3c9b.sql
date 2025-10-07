-- Fix RLS policy performance issues by wrapping auth functions in SELECT statements
-- This prevents re-evaluation of auth functions for each row

-- Drop existing policies to recreate them with performance optimizations
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own non-admin role" ON public.user_roles;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

DROP POLICY IF EXISTS "Shop owners can manage their shops" ON public.shops;
DROP POLICY IF EXISTS "Shop owners can manage their products" ON public.products;

-- Recreate profiles policies with performance optimization
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

-- Recreate user_roles policies with performance optimization
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "Users can insert their own non-admin role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (((select auth.uid()) = user_id) AND (role <> 'admin'::app_role));

-- Recreate orders policies with performance optimization
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (((select auth.uid())::text = (user_id)::text));

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (((select auth.uid())::text = (user_id)::text));

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (((select auth.uid())::text = (user_id)::text));

-- Recreate shops policy with performance optimization
CREATE POLICY "Shop owners can manage their shops" 
ON public.shops 
FOR ALL 
USING (((select auth.uid())::text = (owner_id)::text));

-- Recreate products policy with performance optimization
CREATE POLICY "Shop owners can manage their products" 
ON public.products 
FOR ALL 
USING (EXISTS ( SELECT 1
   FROM shops
  WHERE ((shops.id = products.shop_id) AND ((shops.owner_id)::text = ((select auth.uid()))::text))));