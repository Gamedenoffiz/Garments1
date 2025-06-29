/*
  # Complete Product Catalog Migration
  
  This migration adds all products, categories, sizes, and colors
  based on the handwritten product catalog requirements.
  
  1. Categories Setup
  2. Products with proper pricing and descriptions
  3. Product variants with all sizes and colors
  4. Sample product images
*/

-- First, let's ensure we have all the necessary categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Men''s T-Shirts', 'mens-t-shirts', 'Quality t-shirts for men in various styles', true),
('Men''s Bottomwear', 'mens-bottomwear', 'Comfortable pants and shorts for men', true),
('Women''s Leggings', 'womens-leggings', 'Comfortable and stylish leggings for women', true),
('Women''s Sarees & Shapewear', 'womens-sarees-shapewear', 'Traditional sarees and modern shapewear', true),
('Women''s Night Wear', 'womens-night-wear', 'Comfortable nightwear for women', true),
('Women''s Innerwear', 'womens-innerwear', 'Quality innerwear and undergarments', true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for reference
DO $$
DECLARE
    mens_tshirts_id uuid;
    mens_bottomwear_id uuid;
    womens_leggings_id uuid;
    womens_sarees_id uuid;
    womens_nightwear_id uuid;
    womens_innerwear_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO mens_tshirts_id FROM categories WHERE slug = 'mens-t-shirts';
    SELECT id INTO mens_bottomwear_id FROM categories WHERE slug = 'mens-bottomwear';
    SELECT id INTO womens_leggings_id FROM categories WHERE slug = 'womens-leggings';
    SELECT id INTO womens_sarees_id FROM categories WHERE slug = 'womens-sarees-shapewear';
    SELECT id INTO womens_nightwear_id FROM categories WHERE slug = 'womens-night-wear';
    SELECT id INTO womens_innerwear_id FROM categories WHERE slug = 'womens-innerwear';

    -- MEN'S T-SHIRTS CATEGORY
    INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count) VALUES
    ('Men''s Round Neck T-Shirt', 'Premium quality round neck t-shirt made from 100% cotton', mens_tshirts_id, 399, 499, 'MEN-RN-TSH-001', 'mens-round-neck-tshirt', true, true, 5, 45),
    ('Men''s V-Neck T-Shirt', 'Stylish V-neck t-shirt crafted from premium cotton blend', mens_tshirts_id, 449, 549, 'MEN-VN-TSH-002', 'mens-v-neck-tshirt', true, false, 4, 32),
    ('Men''s Polo T-Shirt (Collar)', 'Classic polo t-shirt with collar for smart casual look', mens_tshirts_id, 599, 699, 'MEN-PO-TSH-003', 'mens-polo-tshirt', true, true, 5, 28),
    ('Men''s Long Sleeve T-Shirt', 'Comfortable long sleeve t-shirt for all seasons', mens_tshirts_id, 549, 649, 'MEN-LS-TSH-004', 'mens-long-sleeve-tshirt', true, false, 4, 19),
    ('Men''s Sleeveless T-Shirt', 'Perfect sleeveless t-shirt for workouts and summer', mens_tshirts_id, 349, 429, 'MEN-SL-TSH-005', 'mens-sleeveless-tshirt', true, false, 4, 22),
    ('Men''s Full Hand T-Shirt', 'Full sleeve t-shirt with modern fit', mens_tshirts_id, 579, 679, 'MEN-FH-TSH-006', 'mens-full-hand-tshirt', true, false, 4, 15);

    -- MEN'S BOTTOMWEAR
    INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count) VALUES
    ('Men''s Track Pants', 'Comfortable track pants made from moisture-wicking fabric', mens_bottomwear_id, 699, 899, 'MEN-TRK-PNT-001', 'mens-track-pants', true, true, 5, 38),
    ('Men''s Shorts', 'Casual shorts perfect for summer and sports activities', mens_bottomwear_id, 449, 549, 'MEN-SHT-001', 'mens-shorts', true, false, 4, 25);

    -- WOMEN'S LEGGINGS
    INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count) VALUES
    ('Women''s Flat Ankle Leggings', 'Comfortable flat ankle leggings for daily wear', womens_leggings_id, 349, 449, 'WOM-FA-LEG-001', 'womens-flat-ankle-leggings', true, true, 5, 52),
    ('Women''s Full Length Leggings', 'Premium full length leggings with perfect fit', womens_leggings_id, 399, 499, 'WOM-FL-LEG-002', 'womens-full-length-leggings', true, false, 4, 43),
    ('Churidhar Ankle Leggings', 'Traditional churidhar style ankle leggings', womens_leggings_id, 329, 419, 'WOM-CH-LEG-003', 'churidhar-ankle-leggings', true, false, 4, 31),
    ('Churidhar Full Length Leggings', 'Full length churidhar leggings for ethnic wear', womens_leggings_id, 369, 469, 'WOM-CH-FL-004', 'churidhar-full-length', true, false, 4, 27),
    ('Shimmer Leggings (Cotton Printed)', 'Stylish shimmer leggings with cotton print', womens_leggings_id, 449, 549, 'WOM-SH-LEG-005', 'shimmer-leggings', true, true, 5, 35),
    ('Women''s 3/4 Leggings', 'Comfortable 3/4 length leggings for casual wear', womens_leggings_id, 319, 399, 'WOM-34-LEG-006', 'womens-3-4-leggings', true, false, 4, 18);

    -- WOMEN'S SAREES & SHAPEWEAR
    INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count) VALUES
    ('Lycra Cotton Shapewear', 'High-quality lycra cotton shapewear for perfect fit', womens_sarees_id, 599, 699, 'WOM-LC-SHP-001', 'lycra-cotton-shapewear', true, false, 4, 22),
    ('Poliston Shapewear', 'Premium poliston shapewear for body shaping', womens_sarees_id, 649, 749, 'WOM-PO-SHP-002', 'poliston-shapewear', true, false, 4, 19),
    ('Shimmer Shapewear', 'Elegant shimmer shapewear for special occasions', womens_sarees_id, 699, 799, 'WOM-SH-SHP-003', 'shimmer-shapewear', true, true, 5, 28);

    -- WOMEN'S NIGHT WEAR
    INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count) VALUES
    ('Women''s Night T-Shirt (Top)', 'Comfortable night t-shirt for peaceful sleep', womens_nightwear_id, 299, 379, 'WOM-NT-TSH-001', 'womens-night-tshirt', true, false, 4, 33),
    ('Women''s 3/4 Leggings (Night)', 'Soft 3/4 leggings perfect for nightwear', womens_nightwear_id, 279, 349, 'WOM-NT-34L-002', 'womens-night-3-4-leggings', true, false, 4, 26),
    ('Women''s Shorts (Night)', 'Comfortable shorts for night time comfort', womens_nightwear_id, 249, 319, 'WOM-NT-SHT-003', 'womens-night-shorts', true, false, 4, 21);

    -- WOMEN'S INNERWEAR
    INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count) VALUES
    ('Basic Slips', 'Essential basic slips for everyday comfort', womens_innerwear_id, 199, 249, 'WOM-BS-SLP-001', 'basic-slips', true, false, 4, 41),
    ('Adjustment Slips', 'Adjustable slips with perfect fit technology', womens_innerwear_id, 249, 319, 'WOM-AD-SLP-002', 'adjustment-slips', true, false, 4, 29),
    ('Panties', 'Comfortable cotton panties for daily wear', womens_innerwear_id, 149, 199, 'WOM-PAN-001', 'panties', true, false, 4, 36);

    RAISE NOTICE 'All products have been added successfully!';
END $$;

-- Now add comprehensive product variants with all sizes and colors
INSERT INTO product_variants (product_id, size, color_name, color_code, stock_quantity, is_active)
SELECT 
    p.id as product_id,
    size_data.size,
    color_data.color_name,
    color_data.color_code,
    CASE 
        WHEN p.is_hot_sale THEN 25  -- Hot sale products get more stock
        ELSE 15 
    END as stock_quantity,
    true as is_active
FROM products p
CROSS JOIN (
    -- Size variations based on category
    SELECT 'S' as size, 'mens-t-shirts' as category_slug
    UNION ALL SELECT 'M', 'mens-t-shirts'
    UNION ALL SELECT 'L', 'mens-t-shirts'
    UNION ALL SELECT 'XL', 'mens-t-shirts'
    UNION ALL SELECT 'XXL', 'mens-t-shirts'
    
    UNION ALL SELECT 'M', 'mens-bottomwear'
    UNION ALL SELECT 'L', 'mens-bottomwear'
    UNION ALL SELECT 'XL', 'mens-bottomwear'
    UNION ALL SELECT 'XXL', 'mens-bottomwear'
    
    UNION ALL SELECT 'S', 'womens-leggings'
    UNION ALL SELECT 'M', 'womens-leggings'
    UNION ALL SELECT 'L', 'womens-leggings'
    UNION ALL SELECT 'XL', 'womens-leggings'
    UNION ALL SELECT 'XXL', 'womens-leggings'
    UNION ALL SELECT '3XL', 'womens-leggings'
    UNION ALL SELECT '4XL', 'womens-leggings'
    UNION ALL SELECT '5XL', 'womens-leggings'
    
    UNION ALL SELECT 'S', 'womens-sarees-shapewear'
    UNION ALL SELECT 'M', 'womens-sarees-shapewear'
    UNION ALL SELECT 'L', 'womens-sarees-shapewear'
    UNION ALL SELECT 'XL', 'womens-sarees-shapewear'
    UNION ALL SELECT 'XXL', 'womens-sarees-shapewear'
    
    UNION ALL SELECT 'S', 'womens-night-wear'
    UNION ALL SELECT 'M', 'womens-night-wear'
    UNION ALL SELECT 'L', 'womens-night-wear'
    UNION ALL SELECT 'XL', 'womens-night-wear'
    UNION ALL SELECT 'XXL', 'womens-night-wear'
    
    UNION ALL SELECT 'S', 'womens-innerwear'
    UNION ALL SELECT 'M', 'womens-innerwear'
    UNION ALL SELECT 'L', 'womens-innerwear'
    UNION ALL SELECT 'XL', 'womens-innerwear'
    UNION ALL SELECT 'XXL', 'womens-innerwear'
) as size_data
CROSS JOIN (
    -- All the colors from your catalog
    VALUES 
    ('White', '#FFFFFF'),
    ('Black', '#000000'),
    ('Pink', '#FF69B4'),
    ('Lt-Green', '#90EE90'),
    ('Navy', '#000080'),
    ('Yellow', '#FFFF00'),
    ('Maroon', '#800000'),
    ('T-Blue', '#008B8B'),
    ('Tea Rose', '#F4C2C2'),
    ('Green', '#008000'),
    ('Dark Rain', '#2F4F4F'),
    ('Gray', '#808080'),
    ('Lavender', '#E6E6FA'),
    ('Purple', '#800080'),
    ('Orange', '#FFA500'),
    ('Aqua', '#00FFFF'),
    ('Wine', '#722F37'),
    ('Royal', '#4169E1'),
    ('Cream', '#FFFDD0'),
    ('Rani Pink', '#FF1493'),
    ('Brown', '#A52A2A'),
    ('Red', '#FF0000'),
    ('Skin', '#FDBCB4'),
    ('Stone', '#918E85'),
    ('Mastered', '#8B4513'),
    ('Gajari', '#FF6347')
) as color_data(color_name, color_code)
JOIN categories c ON c.slug = size_data.category_slug
WHERE p.category_id = c.id
AND p.is_active = true
ON CONFLICT (product_id, size, color_name) DO NOTHING;

-- Add sample product images (you can replace these URLs with actual product images)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT 
    p.id,
    CASE 
        WHEN p.slug LIKE '%mens%tshirt%' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop'
        WHEN p.slug LIKE '%mens%track%' THEN 'https://images.unsplash.com/photo-1506629905962-d997d54d4702?w=400&h=600&fit=crop'
        WHEN p.slug LIKE '%mens%shorts%' THEN 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop'
        WHEN p.slug LIKE '%womens%leggings%' THEN 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=600&fit=crop'
        WHEN p.slug LIKE '%shapewear%' THEN 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=600&fit=crop'
        WHEN p.slug LIKE '%night%' THEN 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=600&fit=crop'
        ELSE 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=600&fit=crop'
    END as image_url,
    p.name as alt_text,
    true as is_primary,
    1 as sort_order
FROM products p
WHERE p.is_active = true
AND NOT EXISTS (
    SELECT 1 FROM product_images pi 
    WHERE pi.product_id = p.id AND pi.is_primary = true
);

-- Create a summary view for verification
CREATE OR REPLACE VIEW catalog_summary AS
SELECT 
    c.name as category,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT pv.id) as variant_count,
    COUNT(DISTINCT pi.id) as image_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY c.name;

-- Grant public access to the summary view
GRANT SELECT ON catalog_summary TO authenticated, anon;
