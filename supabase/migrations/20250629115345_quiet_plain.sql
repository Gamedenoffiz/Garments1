/*
  # Storage Setup for Product Images

  1. Storage Bucket Creation
    - Create product-images bucket (this needs to be done via Supabase dashboard)
    
  2. Helper Functions
    - Ensure is_admin function exists for RLS policies
    
  3. Notes
    - Storage bucket and RLS policies need to be configured via Supabase dashboard
    - This migration ensures supporting functions exist
*/

-- Create or replace the is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
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

-- Note: The storage bucket 'product-images' and its RLS policies need to be created
-- via the Supabase dashboard at: Storage > Create bucket
-- 
-- Bucket settings:
-- - Name: product-images
-- - Public: true
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
--
-- RLS Policies to create via dashboard:
-- 1. "Admin users can upload product images" (INSERT) - authenticated users where is_admin() = true
-- 2. "Anyone can view product images" (SELECT) - public access
-- 3. "Admin users can delete product images" (DELETE) - authenticated users where is_admin() = true
-- 4. "Admin users can update product images" (UPDATE) - authenticated users where is_admin() = true
</parameter>