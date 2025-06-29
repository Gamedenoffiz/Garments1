/*
  # Admin System Setup

  1. New Tables
    - `admin_users` - Track admin users and their permissions
    - Add admin-specific policies for product management

  2. Security
    - Enable RLS on admin tables
    - Add policies for admin access to all product operations
    - Create admin check functions
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '{"products": true, "categories": true, "orders": true, "users": true}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Insert the admin user
INSERT INTO admin_users (id, email, role, is_active)
SELECT 
  id, 
  email, 
  'super_admin',
  true
FROM auth.users 
WHERE email = 'elangkumaranbs@gmail.com'
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = now();

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND is_active = true
  );
END;
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role = 'super_admin'
    AND is_active = true
  );
END;
$$;

-- Admin policies for admin_users table
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Admin policies for categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin policies for products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin policies for product_images
CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin policies for product_variants
CREATE POLICY "Admins can manage product variants"
  ON product_variants FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin policies for orders (view and update status)
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin policies for order_items (view only)
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin());

-- Create trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);