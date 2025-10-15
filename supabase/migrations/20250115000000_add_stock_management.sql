-- Add stock quantity and active status to products table
ALTER TABLE public.products 
ADD COLUMN stock_quantity INTEGER DEFAULT 0,
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Update existing products to have stock
UPDATE public.products 
SET stock_quantity = 100, is_active = true 
WHERE stock_quantity IS NULL;

-- Add index for better performance
CREATE INDEX idx_products_shop_active ON public.products(shop_id, is_active);
CREATE INDEX idx_products_stock ON public.products(stock_quantity) WHERE stock_quantity > 0;
