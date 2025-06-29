-- Add subcategory column to products table
ALTER TABLE products ADD COLUMN subcategory VARCHAR(255);

-- Update existing products with subcategories based on their names
-- Men's T-Shirts
UPDATE products SET subcategory = 'Round Neck' WHERE name LIKE '%Round Neck%' OR name LIKE '%round neck%';
UPDATE products SET subcategory = 'V-Neck' WHERE name LIKE '%V-Neck%' OR name LIKE '%v-neck%' OR name LIKE '%V Neck%';
UPDATE products SET subcategory = 'Polo (Collar)' WHERE name LIKE '%Polo%' OR name LIKE '%polo%' OR name LIKE '%Collar%';
UPDATE products SET subcategory = 'Long Sleeve' WHERE name LIKE '%Long Sleeve%' OR name LIKE '%long sleeve%' OR name LIKE '%Full Hand%';
UPDATE products SET subcategory = 'Sleeveless' WHERE name LIKE '%Sleeveless%' OR name LIKE '%sleeveless%';

-- Men's Bottomwear
UPDATE products SET subcategory = 'Track Pants' WHERE name LIKE '%Track Pants%' OR name LIKE '%track pants%';
UPDATE products SET subcategory = 'Shorts' WHERE name LIKE '%Shorts%' OR name LIKE '%shorts%' AND name LIKE '%Men%';

-- Women's Leggings
UPDATE products SET subcategory = 'Flat Ankle' WHERE name LIKE '%Flat Ankle%' OR name LIKE '%flat ankle%';
UPDATE products SET subcategory = 'Full Length' WHERE name LIKE '%Full Length%' OR name LIKE '%full length%' AND name NOT LIKE '%Churidhar%';
UPDATE products SET subcategory = 'Churidhar Ankle' WHERE name LIKE '%Churidhar Ankle%' OR name LIKE '%churidhar ankle%';
UPDATE products SET subcategory = 'Churidhar Full Length' WHERE name LIKE '%Churidhar Full Length%' OR name LIKE '%churidhar full length%';
UPDATE products SET subcategory = 'Shimmer' WHERE name LIKE '%Shimmer%' OR name LIKE '%shimmer%';
UPDATE products SET subcategory = '3/4 Length' WHERE name LIKE '%3/4%' OR name LIKE '%3-4%';

-- Women's Shapewear
UPDATE products SET subcategory = 'Lycra Cotton' WHERE name LIKE '%Lycra Cotton%' OR name LIKE '%lycra cotton%';
UPDATE products SET subcategory = 'Polyester' WHERE name LIKE '%Polyester%' OR name LIKE '%polyester%' OR name LIKE '%Poliston%';

-- Women's Night Wear
UPDATE products SET subcategory = 'Night T-Shirt (Top)' WHERE name LIKE '%Night T-Shirt%' OR name LIKE '%night t-shirt%' OR name LIKE '%Night Top%';
UPDATE products SET subcategory = 'Shorts (Night)' WHERE name LIKE '%Shorts%' AND (name LIKE '%Night%' OR name LIKE '%night%');

-- Women's Innerwear
UPDATE products SET subcategory = 'Basic Slips' WHERE name LIKE '%Basic Slip%' OR name LIKE '%basic slip%';
UPDATE products SET subcategory = 'Adjustment Slips' WHERE name LIKE '%Adjustment Slip%' OR name LIKE '%adjustment slip%';
UPDATE products SET subcategory = 'Panties' WHERE name LIKE '%Panties%' OR name LIKE '%panties%';

-- Set default subcategory for products that don't match any pattern
UPDATE products SET subcategory = 'General' WHERE subcategory IS NULL;
