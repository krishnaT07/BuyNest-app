-- Add sample product images to existing products
-- This migration adds realistic product images to the products table

-- Update existing products with sample images
UPDATE public.products 
SET image_url = CASE 
  WHEN name ILIKE '%banana%' THEN 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'
  WHEN name ILIKE '%milk%' THEN 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%bread%' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'
  WHEN name ILIKE '%apple%' THEN 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'
  WHEN name ILIKE '%orange%' THEN 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=400&h=400&fit=crop'
  WHEN name ILIKE '%tomato%' THEN 'https://images.unsplash.com/photo-1546470427-5a4a4b0b0b0b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%potato%' THEN 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop'
  WHEN name ILIKE '%onion%' THEN 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=400&fit=crop'
  WHEN name ILIKE '%carrot%' THEN 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop'
  WHEN name ILIKE '%rice%' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name ILIKE '%chicken%' THEN 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop'
  WHEN name ILIKE '%fish%' THEN 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop'
  WHEN name ILIKE '%egg%' THEN 'https://images.unsplash.com/photo-1518569656558-1e25a4d84d1d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%cheese%' THEN 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%yogurt%' THEN 'https://images.unsplash.com/photo-1571212054550-4b77192a5d1a?w=400&h=400&fit=crop'
  WHEN name ILIKE '%pasta%' THEN 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop'
  WHEN name ILIKE '%pizza%' THEN 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%burger%' THEN 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
  WHEN name ILIKE '%sandwich%' THEN 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=400&fit=crop'
  WHEN name ILIKE '%salad%' THEN 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop'
  WHEN name ILIKE '%soup%' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744ac9?w=400&h=400&fit=crop'
  WHEN name ILIKE '%coffee%' THEN 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'
  WHEN name ILIKE '%tea%' THEN 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop'
  WHEN name ILIKE '%juice%' THEN 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%water%' THEN 'https://images.unsplash.com/photo-1548839140-29a749e1e4b5?w=400&h=400&fit=crop'
  WHEN name ILIKE '%soda%' THEN 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop'
  WHEN name ILIKE '%beer%' THEN 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop'
  WHEN name ILIKE '%wine%' THEN 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop'
  WHEN name ILIKE '%chocolate%' THEN 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop'
  WHEN name ILIKE '%cookie%' THEN 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop'
  WHEN name ILIKE '%cake%' THEN 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
  WHEN name ILIKE '%ice cream%' THEN 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop'
  WHEN name ILIKE '%candy%' THEN 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop'
  WHEN name ILIKE '%snack%' THEN 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%chips%' THEN 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%nuts%' THEN 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=400&fit=crop'
  WHEN name ILIKE '%cereal%' THEN 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%oats%' THEN 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%granola%' THEN 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'
  WHEN name ILIKE '%honey%' THEN 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop'
  WHEN name ILIKE '%jam%' THEN 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop'
  WHEN name ILIKE '%butter%' THEN 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop'
  WHEN name ILIKE '%oil%' THEN 'https://images.unsplash.com/photo-1474979266404-7eaacbcd86c5?w=400&h=400&fit=crop'
  WHEN name ILIKE '%vinegar%' THEN 'https://images.unsplash.com/photo-1474979266404-7eaacbcd86c5?w=400&h=400&fit=crop'
  WHEN name ILIKE '%sauce%' THEN 'https://images.unsplash.com/photo-1474979266404-7eaacbcd86c5?w=400&h=400&fit=crop'
  WHEN name ILIKE '%spice%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%salt%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%pepper%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%garlic%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%ginger%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%curry%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%masala%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  WHEN name ILIKE '%dal%' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name ILIKE '%lentil%' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name ILIKE '%bean%' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name ILIKE '%flour%' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name ILIKE '%sugar%' THEN 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop'
  WHEN name ILIKE '%salt%' THEN 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'
END
WHERE image_url IS NULL OR image_url = '';

-- Add more sample products with images
INSERT INTO public.products (id, name, description, price, category, image_url, in_stock, shop_id, is_featured) VALUES
('prod-001', 'Fresh Organic Bananas', 'Sweet and ripe organic bananas, perfect for snacking', 2.99, 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', true, '1', true),
('prod-002', 'Whole Milk 1L', 'Fresh whole milk from local dairy farms', 4.99, 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', true, '1', true),
('prod-003', 'Whole Wheat Bread', 'Freshly baked whole wheat bread', 3.49, 'Bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', true, '1', false),
('prod-004', 'Red Apples', 'Crisp and juicy red apples', 4.99, 'Fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', true, '1', true),
('prod-005', 'Fresh Oranges', 'Sweet and tangy fresh oranges', 3.99, 'Fruits', 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=400&h=400&fit=crop', true, '1', false),
('prod-006', 'Ripe Tomatoes', 'Fresh vine-ripened tomatoes', 2.49, 'Vegetables', 'https://images.unsplash.com/photo-1546470427-5a4a4b0b0b0b?w=400&h=400&fit=crop', true, '1', true),
('prod-007', 'Potatoes 5kg', 'Fresh potatoes perfect for cooking', 5.99, 'Vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', true, '1', false),
('prod-008', 'Red Onions', 'Fresh red onions for cooking', 2.99, 'Vegetables', 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=400&fit=crop', true, '1', false),
('prod-009', 'Carrots 1kg', 'Fresh crunchy carrots', 2.49, 'Vegetables', 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop', true, '1', true),
('prod-010', 'Basmati Rice 5kg', 'Premium basmati rice', 12.99, 'Grains', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', true, '1', true),
('prod-011', 'Fresh Chicken Breast', 'Fresh chicken breast fillets', 8.99, 'Meat', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop', true, '1', true),
('prod-012', 'Salmon Fillet', 'Fresh salmon fillet', 15.99, 'Seafood', 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop', true, '1', false),
('prod-013', 'Free Range Eggs', 'Fresh free range eggs (12 pack)', 4.99, 'Dairy', 'https://images.unsplash.com/photo-1518569656558-1e25a4d84d1d?w=400&h=400&fit=crop', true, '1', true),
('prod-014', 'Cheddar Cheese', 'Aged cheddar cheese', 6.99, 'Dairy', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', true, '1', false),
('prod-015', 'Greek Yogurt', 'Creamy Greek yogurt', 3.99, 'Dairy', 'https://images.unsplash.com/photo-1571212054550-4b77192a5d1a?w=400&h=400&fit=crop', true, '1', true),
('prod-016', 'Pasta Spaghetti', 'Italian spaghetti pasta', 2.99, 'Pantry', 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop', true, '1', false),
('prod-017', 'Margherita Pizza', 'Fresh margherita pizza', 12.99, 'Ready Meals', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop', true, '2', true),
('prod-018', 'Classic Burger', 'Juicy classic beef burger', 8.99, 'Ready Meals', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', true, '2', true),
('prod-019', 'Club Sandwich', 'Fresh club sandwich', 6.99, 'Ready Meals', 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=400&fit=crop', true, '2', false),
('prod-020', 'Caesar Salad', 'Fresh Caesar salad', 7.99, 'Ready Meals', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', true, '2', true),
('prod-021', 'Tomato Soup', 'Creamy tomato soup', 4.99, 'Ready Meals', 'https://images.unsplash.com/photo-1547592166-23ac45744ac9?w=400&h=400&fit=crop', true, '2', false),
('prod-022', 'Espresso Coffee', 'Premium espresso coffee beans', 9.99, 'Beverages', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', true, '2', true),
('prod-023', 'Green Tea', 'Organic green tea leaves', 5.99, 'Beverages', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', true, '2', false),
('prod-024', 'Fresh Orange Juice', 'Freshly squeezed orange juice', 3.99, 'Beverages', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', true, '2', true),
('prod-025', 'Mineral Water', 'Pure mineral water', 1.99, 'Beverages', 'https://images.unsplash.com/photo-1548839140-29a749e1e4b5?w=400&h=400&fit=crop', true, '2', false),
('prod-026', 'Dark Chocolate', 'Premium dark chocolate bar', 4.99, 'Confectionery', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop', true, '3', true),
('prod-027', 'Chocolate Cookies', 'Soft chocolate chip cookies', 3.99, 'Confectionery', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', true, '3', true),
('prod-028', 'Vanilla Cake', 'Fresh vanilla sponge cake', 12.99, 'Confectionery', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', true, '3', false),
('prod-029', 'Strawberry Ice Cream', 'Creamy strawberry ice cream', 5.99, 'Confectionery', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', true, '3', true),
('prod-030', 'Mixed Candy Pack', 'Assorted candy collection', 6.99, 'Confectionery', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop', true, '3', false)
ON CONFLICT (id) DO NOTHING;
