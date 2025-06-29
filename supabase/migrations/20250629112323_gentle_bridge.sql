/*
  # Seed Initial Data

  1. Categories
    - Men's T-Shirts
    - Men's Bottomwear
    - Women's Leggings
    - Saree Shapewear
    - Night Wear

  2. Sample Products
    - Based on your product list from the handwritten notes
    - Complete with variants, images, and specifications
*/

-- Insert categories
INSERT INTO categories (name, description, slug, is_active, sort_order) VALUES
('Men''s T-Shirts', 'Premium quality t-shirts for men in various styles', 'mens-t-shirts', true, 1),
('Men''s Bottomwear', 'Track pants, shorts and other bottomwear for men', 'mens-bottomwear', true, 2),
('Women''s Leggings', 'Comfortable and stylish leggings for women', 'womens-leggings', true, 3),
('Saree Shapewear', 'Shapewear designed specifically for sarees', 'saree-shapewear', true, 4),
('Night Wear', 'Comfortable night wear for men and women', 'night-wear', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
WITH category_ids AS (
  SELECT 
    (SELECT id FROM categories WHERE slug = 'mens-t-shirts') as mens_tshirts,
    (SELECT id FROM categories WHERE slug = 'mens-bottomwear') as mens_bottomwear,
    (SELECT id FROM categories WHERE slug = 'womens-leggings') as womens_leggings,
    (SELECT id FROM categories WHERE slug = 'saree-shapewear') as saree_shapewear,
    (SELECT id FROM categories WHERE slug = 'night-wear') as night_wear
)
INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating) 
SELECT * FROM (VALUES
  ('Men''s Round Neck T-Shirt', 'Premium quality round neck t-shirt made from 100% cotton. Perfect for casual wear with excellent breathability and comfort.', (SELECT mens_tshirts FROM category_ids), 399.00, 499.00, 'MRT001', 'mens-round-neck-tshirt', true, true, 5.0),
  ('Men''s V-Neck T-Shirt', 'Stylish V-neck t-shirt crafted from premium cotton blend. Features a modern slim fit design.', (SELECT mens_tshirts FROM category_ids), 449.00, 549.00, 'MVT001', 'mens-v-neck-tshirt', true, false, 4.0),
  ('Men''s Polo T-Shirt', 'Classic polo t-shirt with collar and button placket. Made from premium cotton pique fabric.', (SELECT mens_tshirts FROM category_ids), 699.00, 899.00, 'MPT001', 'mens-polo-tshirt', true, false, 4.5),
  ('Men''s Track Pants', 'Comfortable track pants made from moisture-wicking fabric. Perfect for workouts and casual wear.', (SELECT mens_bottomwear FROM category_ids), 699.00, 899.00, 'MTP001', 'mens-track-pants', true, false, 5.0),
  ('Men''s Shorts', 'Casual shorts perfect for summer and sports activities. Made from lightweight breathable fabric.', (SELECT mens_bottomwear FROM category_ids), 499.00, 649.00, 'MSH001', 'mens-shorts', true, false, 4.0),
  ('Women''s Flat Ankle Leggings', 'Premium quality flat ankle leggings made from stretchable cotton blend. Perfect for daily wear.', (SELECT womens_leggings FROM category_ids), 599.00, 799.00, 'WFL001', 'womens-flat-ankle-leggings', true, true, 5.0),
  ('Women''s Full Length Leggings', 'Comfortable full length leggings with high waistband. Made from premium cotton lycra.', (SELECT womens_leggings FROM category_ids), 649.00, 849.00, 'WLL001', 'womens-full-length-leggings', true, false, 4.5),
  ('Churidhar Ankle Leggings', 'Traditional churidhar style ankle leggings. Perfect for ethnic wear and daily use.', (SELECT womens_leggings FROM category_ids), 449.00, 599.00, 'CAL001', 'churidhar-ankle-leggings', true, false, 4.0),
  ('Shimmer Leggings', 'Glamorous shimmer leggings perfect for parties and special occasions. Metallic finish fabric.', (SELECT womens_leggings FROM category_ids), 799.00, 999.00, 'SHL001', 'shimmer-leggings', true, false, 5.0),
  ('Saree Shapewear', 'Premium saree shapewear designed to give perfect silhouette. Breathable fabric with tummy control.', (SELECT saree_shapewear FROM category_ids), 649.00, 849.00, 'SSH001', 'saree-shapewear', true, false, 4.0),
  ('Women''s Night T-Shirt', 'Comfortable night t-shirt made from soft cotton fabric. Perfect for sleeping and lounging.', (SELECT night_wear FROM category_ids), 399.00, 499.00, 'WNT001', 'womens-night-tshirt', true, false, 4.0),
  ('Women''s 3/4 Leggings', 'Versatile 3/4 length leggings perfect for workouts and casual wear. Moisture-wicking fabric.', (SELECT womens_leggings FROM category_ids), 499.00, 649.00, 'W34L001', 'womens-3-4-leggings', true, false, 4.0)
) AS v(name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating)
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN p.slug = 'mens-round-neck-tshirt' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop'
    WHEN p.slug = 'mens-v-neck-tshirt' THEN 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=600&fit=crop'
    WHEN p.slug = 'mens-polo-tshirt' THEN 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=600&fit=crop'
    WHEN p.slug = 'mens-track-pants' THEN 'https://images.unsplash.com/photo-1506629905962-d997d54d4702?w=400&h=600&fit=crop'
    WHEN p.slug = 'mens-shorts' THEN 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop'
    WHEN p.slug = 'womens-flat-ankle-leggings' THEN 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=600&fit=crop'
    WHEN p.slug = 'womens-full-length-leggings' THEN 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop'
    WHEN p.slug = 'churidhar-ankle-leggings' THEN 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=600&fit=crop'
    WHEN p.slug = 'shimmer-leggings' THEN 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop'
    WHEN p.slug = 'saree-shapewear' THEN 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=600&fit=crop'
    WHEN p.slug = 'womens-night-tshirt' THEN 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=600&fit=crop'
    WHEN p.slug = 'womens-3-4-leggings' THEN 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=600&fit=crop'
  END,
  p.name,
  0,
  true
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- Insert product variants for Men's products (T-Shirts, Bottomwear, Night Wear)
INSERT INTO product_variants (product_id, size, color_name, color_code, sku, stock_quantity, is_active)
SELECT 
  p.id,
  sizes.size,
  colors.color_name,
  colors.color_code,
  p.sku || '-' || sizes.size || '-' || colors.color_code,
  50,
  true
FROM products p
JOIN categories c ON p.category_id = c.id
CROSS JOIN (
  VALUES ('S'), ('M'), ('L'), ('XL'), ('XXL')
) AS sizes(size)
CROSS JOIN (
  VALUES 
    ('Black', '#000000'),
    ('White', '#FFFFFF'),
    ('Navy', '#000080'),
    ('Maroon', '#800000'),
    ('Royal', '#4169E1')
) AS colors(color_name, color_code)
WHERE c.slug IN ('mens-t-shirts', 'mens-bottomwear', 'night-wear')
AND NOT EXISTS (
  SELECT 1 FROM product_variants pv 
  WHERE pv.product_id = p.id 
  AND pv.size = sizes.size 
  AND pv.color_code = colors.color_code
);

-- Insert product variants for Women's products (Leggings, Shapewear)
INSERT INTO product_variants (product_id, size, color_name, color_code, sku, stock_quantity, is_active)
SELECT 
  p.id,
  sizes.size,
  colors.color_name,
  colors.color_code,
  p.sku || '-' || sizes.size || '-' || colors.color_code,
  50,
  true
FROM products p
JOIN categories c ON p.category_id = c.id
CROSS JOIN (
  VALUES ('S'), ('M'), ('L'), ('XL'), ('XXL'), ('3XL'), ('4XL'), ('5XL')
) AS sizes(size)
CROSS JOIN (
  VALUES 
    ('Black', '#000000'),
    ('White', '#FFFFFF'),
    ('Pink', '#FF69B4'),
    ('Lt-Green', '#90EE90'),
    ('Purple', '#800080')
) AS colors(color_name, color_code)
WHERE c.slug IN ('womens-leggings', 'saree-shapewear')
AND NOT EXISTS (
  SELECT 1 FROM product_variants pv 
  WHERE pv.product_id = p.id 
  AND pv.size = sizes.size 
  AND pv.color_code = colors.color_code
);