/*
  # Fix Admin Function and Storage Permissions

  1. Fix is_admin function conflict
  2. Add proper storage permissions for product image uploads
  3. Ensure admin users can upload to storage bucket
*/

-- Drop the conflicting function and recreate properly
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_admin(uuid);

-- Create the correct is_admin function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  );
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;

-- Ensure the super admin function exists
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'super_admin'
  );
$$;

-- Grant execute permission on super admin function
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated, anon;

-- Create function specifically for storage permissions
CREATE OR REPLACE FUNCTION can_upload_product_images()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT is_admin();
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION can_upload_product_images() TO authenticated, anon;

-- Ensure product_images table policies are correct
DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Ensure products table policies are correct  
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Note: Storage bucket policies need to be set via Supabase dashboard
-- or via the storage API. The following is a reference for what should be created:
--
-- Bucket: product-images
-- Policy Name: Admin users can upload product images
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Using expression: can_upload_product_images()
--
-- Policy Name: Admin users can update product images  
-- Allowed operation: UPDATE
-- Target roles: authenticated
-- Using expression: can_upload_product_images()
--
-- Policy Name: Admin users can delete product images
-- Allowed operation: DELETE  
-- Target roles: authenticated
-- Using expression: can_upload_product_images()
--
-- Policy Name: Anyone can view product images
-- Allowed operation: SELECT
-- Target roles: public
-- Using expression: true
