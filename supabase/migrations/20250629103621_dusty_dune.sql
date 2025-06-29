/*
  # Orders and Shopping Cart Management

  1. New Tables
    - `addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text) - 'shipping' or 'billing'
      - `first_name` (text)
      - `last_name` (text)
      - `company` (text)
      - `address_line_1` (text)
      - `address_line_2` (text)
      - `city` (text)
      - `state` (text)
      - `postal_code` (text)
      - `country` (text)
      - `phone` (text)
      - `is_default` (boolean)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `order_number` (text, unique)
      - `status` (text)
      - `subtotal` (decimal)
      - `tax_amount` (decimal)
      - `shipping_amount` (decimal)
      - `discount_amount` (decimal)
      - `total_amount` (decimal)
      - `currency` (text)
      - `payment_method` (text)
      - `payment_status` (text)
      - `shipping_address` (jsonb)
      - `billing_address` (jsonb)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `variant_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_price` (decimal)
      - `product_snapshot` (jsonb)

    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `variant_id` (uuid, foreign key)
      - `quantity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access to their own data
*/

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('shipping', 'billing')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  phone text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) NOT NULL DEFAULT 0,
  shipping_amount decimal(10,2) NOT NULL DEFAULT 0,
  discount_amount decimal(10,2) NOT NULL DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  payment_method text CHECK (payment_method IN ('razorpay', 'cod', 'upi', 'card')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  product_snapshot jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

-- Enable RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create policies for cart items
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  counter integer;
BEGIN
  -- Get current date in YYYYMMDD format
  SELECT 'ORD' || to_char(now(), 'YYYYMMDD') || LPAD((
    SELECT COALESCE(MAX(CAST(RIGHT(order_number, 4) AS integer)), 0) + 1
    FROM orders 
    WHERE order_number LIKE 'ORD' || to_char(now(), 'YYYYMMDD') || '%'
  )::text, 4, '0') INTO new_order_number;
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Create triggers for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);