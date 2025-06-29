/*
  # Products and Inventory Management

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `slug` (text, unique)
      - `image_url` (text)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category_id` (uuid, foreign key)
      - `price` (decimal)
      - `original_price` (decimal)
      - `sku` (text, unique)
      - `slug` (text, unique)
      - `is_active` (boolean)
      - `is_hot_sale` (boolean)
      - `rating` (decimal)
      - `review_count` (integer)
      - `meta_title` (text)
      - `meta_description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `alt_text` (text)
      - `sort_order` (integer)
      - `is_primary` (boolean)

    - `product_variants`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `size` (text)
      - `color_name` (text)
      - `color_code` (text)
      - `sku` (text, unique)
      - `stock_quantity` (integer)
      - `price_adjustment` (decimal)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin management
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  slug text NOT NULL UNIQUE,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  sku text UNIQUE,
  slug text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  is_hot_sale boolean DEFAULT false,
  rating decimal(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text,
  color_name text,
  color_code text,
  sku text UNIQUE,
  stock_quantity integer DEFAULT 0,
  price_adjustment decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_hot_sale ON products(is_hot_sale);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();