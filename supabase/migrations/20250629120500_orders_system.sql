/*
  # Orders and Order Items Management

  1. New Tables
    - `orders` table for order information
    - `order_items` table for individual items in orders
    
  2. Security
    - Enable RLS on both tables
    - Add policies for users to view their own orders
    - Add policies for admins to manage all orders
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_method text NOT NULL,
  shipping_address jsonb NOT NULL,
  order_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid,
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  size text,
  image text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (is_admin());

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all order items" ON order_items
  FOR UPDATE USING (is_admin());

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  order_num text;
  counter integer;
BEGIN
  -- Get the current date in YYYYMMDD format
  order_num := 'ORD' || to_char(now(), 'YYYYMMDD');
  
  -- Get the count of orders created today
  SELECT COUNT(*) + 1 INTO counter
  FROM orders
  WHERE order_number LIKE order_num || '%';
  
  -- Add a 4-digit counter
  order_num := order_num || lpad(counter::text, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Add updated_at trigger for orders
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Grant permissions
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
