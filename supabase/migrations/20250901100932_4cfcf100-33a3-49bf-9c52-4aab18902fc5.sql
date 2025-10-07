-- Insert sample shops
INSERT INTO public.shops (id, name, description, address, phone, email, rating, review_count, opening_hours, categories, is_open, delivery_time, minimum_order, owner_id, image_url) VALUES
('shop-1', 'Fresh Market Corner', 'Fresh fruits, vegetables, and daily essentials', '123 Green Street, City Center', '+1-555-0101', 'info@freshmarket.com', 4.8, 245, '6:00 AM - 10:00 PM', ARRAY['Grocery', 'Fresh Produce'], true, '15-20 min', 25, 'c47e1e4e-4c51-4c8a-8f8c-8b5c6d7e8f9a', '/images/shops/grocery/fresh-market-1.jpg'),
('shop-2', 'Tech Hub Electronics', 'Latest gadgets and electronic accessories', '456 Tech Avenue, Downtown', '+1-555-0202', 'support@techhub.com', 4.6, 189, '9:00 AM - 9:00 PM', ARRAY['Electronics', 'Gadgets'], true, '20-30 min', 50, 'c47e1e4e-4c51-4c8a-8f8c-8b5c6d7e8f9b', '/images/shops/electronics/electronics-store-1.jpg'),
('shop-3', 'Fashion Forward', 'Trendy clothes and fashion accessories', '789 Style Boulevard, Fashion District', '+1-555-0303', 'hello@fashionforward.com', 4.9, 312, '10:00 AM - 8:00 PM', ARRAY['Clothing', 'Fashion'], true, '25-35 min', 30, 'c47e1e4e-4c51-4c8a-8f8c-8b5c6d7e8f9c', '/images/shops/clothing/clothing-store-1.jpg'),
('shop-4', 'Cafe Delight', 'Fresh coffee, snacks and light meals', '321 Coffee Lane, Riverside', '+1-555-0404', 'orders@cafedelight.com', 4.7, 156, '6:00 AM - 6:00 PM', ARRAY['Food & Drinks', 'Cafe'], true, '10-15 min', 15, 'c47e1e4e-4c51-4c8a-8f8c-8b5c6d7e8f9d', '/images/shops/food/cafe-1.jpg'),
('shop-5', 'Beauty Haven', 'Premium beauty products and cosmetics', '654 Beauty Street, Uptown', '+1-555-0505', 'info@beautyhaven.com', 4.5, 98, '9:00 AM - 7:00 PM', ARRAY['Beauty', 'Health & Beauty'], true, '30-40 min', 40, 'c47e1e4e-4c51-4c8a-8f8c-8b5c6d7e8f9e', '/images/shops/beauty/beauty-store-1.jpg'),
('shop-6', 'Sports Zone', 'Sports equipment and athletic wear', '987 Athletic Way, Sports Complex', '+1-555-0606', 'gear@sportszone.com', 4.4, 76, '8:00 AM - 9:00 PM', ARRAY['Sports', 'Athletic'], true, '35-45 min', 60, 'c47e1e4e-4c51-4c8a-8f8c-8b5c6d7e8f9f', '/images/shops/sports/sports-store-1.jpg');

-- Insert sample products
INSERT INTO public.products (id, name, description, price, original_price, category, image_url, in_stock, shop_id, sku, weight, nutrition_info, is_featured) VALUES
-- Fresh Market Corner Products
('prod-1', 'Fresh Red Apples', 'Crisp and sweet red apples, locally sourced', 120, 150, 'Fruits', '/images/products/fruits/apple.jpg', true, 'shop-1', 'APL-001', '1kg', '{"calories": 52, "protein": "0.3g", "carbs": "14g", "fiber": "2.4g", "sugar": "10g"}', true),
('prod-2', 'Organic Mixed Vegetables', 'Fresh organic seasonal vegetables bundle', 200, 250, 'Vegetables', '/images/products/vegetables/vegetables.jpg', true, 'shop-1', 'VEG-001', '2kg', '{"calories": 25, "protein": "2g", "carbs": "5g", "fiber": "3g", "sugar": "3g"}', false),
('prod-3', 'Fresh Whole Wheat Bread', 'Artisan baked whole wheat bread', 45, null, 'Bakery', '/images/products/bakery/bread.jpg', true, 'shop-1', 'BRD-001', '500g', '{"calories": 247, "protein": "13g", "carbs": "41g", "fiber": "7g", "sugar": "4g"}', false),
('prod-4', 'Organic Milk', 'Fresh organic whole milk', 65, null, 'Dairy', '/images/products/dairy/milk.jpg', true, 'shop-1', 'MLK-001', '1L', '{"calories": 150, "protein": "8g", "carbs": "12g", "fiber": "0g", "sugar": "12g"}', true),

-- Tech Hub Electronics Products
('prod-5', 'Wireless Bluetooth Earbuds', 'High-quality wireless earbuds with noise cancellation', 2999, 3999, 'Electronics', '/images/products/electronics/earbuds.jpg', true, 'shop-2', 'EAR-001', '50g', null, true),
('prod-6', 'Smartphone Case', 'Protective smartphone case with kickstand', 599, 799, 'Accessories', '/images/products/electronics/phone-case.jpg', true, 'shop-2', 'CSE-001', '30g', null, false),

-- Fashion Forward Products
('prod-7', 'Cotton T-Shirt', 'Comfortable cotton t-shirt in multiple colors', 799, 999, 'Clothing', '/images/products/clothing/tshirt.jpg', true, 'shop-3', 'TSH-001', '200g', null, false),
('prod-8', 'Denim Jeans', 'Classic fit denim jeans', 1899, 2299, 'Clothing', '/images/products/clothing/jeans.jpg', true, 'shop-3', 'JNS-001', '600g', null, true),

-- Cafe Delight Products
('prod-9', 'Artisan Coffee Blend', 'Premium coffee beans from local roasters', 350, null, 'Beverages', '/images/products/coffee/coffee-beans.jpg', true, 'shop-4', 'COF-001', '250g', null, true),
('prod-10', 'Croissant', 'Buttery, flaky croissant baked fresh daily', 85, null, 'Bakery', '/images/products/bakery/croissant.jpg', true, 'shop-4', 'CRS-001', '80g', '{"calories": 231, "protein": "5g", "carbs": "26g", "fiber": "1g", "sugar": "7g"}', false),

-- Beauty Haven Products
('prod-11', 'Moisturizing Face Cream', 'Hydrating face cream for all skin types', 1299, 1599, 'Skincare', '/images/products/beauty/face-cream.jpg', true, 'shop-5', 'FCR-001', '50ml', null, true),

-- Sports Zone Products
('prod-12', 'Running Shoes', 'Lightweight running shoes for all terrains', 4999, 5999, 'Footwear', '/images/products/sports/running-shoes.jpg', true, 'shop-6', 'SHO-001', '300g', null, true);