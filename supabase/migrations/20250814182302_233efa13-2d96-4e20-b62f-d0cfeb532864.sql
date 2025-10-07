-- Create orders table for tracking orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  shop_id TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  notes TEXT,
  estimated_delivery_time TEXT NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create shops table for orders reference
CREATE TABLE IF NOT EXISTS public.shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  opening_hours TEXT,
  categories TEXT[],
  is_open BOOLEAN DEFAULT true,
  delivery_time TEXT,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  owner_id UUID,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for shops
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Create policy for shops to be publicly readable
CREATE POLICY "Shops are publicly readable" 
ON public.shops 
FOR SELECT 
USING (true);

-- Create policy for shop owners to manage their shops
CREATE POLICY "Shop owners can manage their shops" 
ON public.shops 
FOR ALL 
USING (auth.uid()::text = owner_id::text);

-- Insert sample shops for testing
INSERT INTO public.shops (id, name, description, address, phone, delivery_time, minimum_order) VALUES
('1', 'Fresh Market', 'Fresh fruits and vegetables', '123 Main St', '555-0101', '20-30 minutes', 10.00),
('2', 'Corner Store', 'Convenience store with snacks and drinks', '456 Oak Ave', '555-0102', '15-25 minutes', 5.00),
('3', 'Green Grocer', 'Organic produce and healthy foods', '789 Pine Rd', '555-0103', '30-45 minutes', 15.00)
ON CONFLICT (id) DO NOTHING;

-- Create products table for complete e-commerce functionality
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  shop_id TEXT NOT NULL,
  sku TEXT,
  weight TEXT,
  nutrition_info JSONB,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for products to be publicly readable
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policy for shop owners to manage their products
CREATE POLICY "Shop owners can manage their products" 
ON public.products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = products.shop_id 
    AND shops.owner_id::text = auth.uid()::text
  )
);

-- Insert sample products for testing
INSERT INTO public.products (id, name, description, price, category, image_url, shop_id) VALUES
('1', 'Fresh Bananas', 'Sweet and ripe bananas', 2.99, 'Fruits', '/placeholder.svg', '3'),
('2', 'Organic Milk', 'Fresh organic whole milk', 4.99, 'Dairy', '/placeholder.svg', '3'),
('3', 'Whole Wheat Bread', 'Freshly baked whole wheat bread', 3.49, 'Bakery', '/placeholder.svg', '1'),
('4', 'Farm Eggs', 'Free-range farm fresh eggs', 5.99, 'Dairy', '/placeholder.svg', '1'),
('5', 'Energy Drink', 'Refreshing energy drink', 2.49, 'Beverages', '/placeholder.svg', '2'),
('6', 'Chocolate Bar', 'Premium dark chocolate', 3.99, 'Snacks', '/placeholder.svg', '2')
ON CONFLICT (id) DO NOTHING;

-- Create trigger for updating timestamps
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();