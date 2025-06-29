/*
  # Admin Debug Helper Functions
  
  These functions help debug admin permission issues
*/

-- Function to get current user's admin status with details
CREATE OR REPLACE FUNCTION debug_admin_status()
RETURNS TABLE (
  user_id uuid,
  is_authenticated boolean,
  admin_record_exists boolean,
  is_active boolean,
  role text,
  final_is_admin boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    auth.uid() as user_id,
    auth.uid() IS NOT NULL as is_authenticated,
    EXISTS(SELECT 1 FROM admin_users WHERE id = auth.uid()) as admin_record_exists,
    COALESCE((SELECT is_active FROM admin_users WHERE id = auth.uid()), false) as is_active,
    COALESCE((SELECT role FROM admin_users WHERE id = auth.uid()), 'none') as role,
    is_admin() as final_is_admin;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION debug_admin_status() TO authenticated;

-- Function to check storage permissions
CREATE OR REPLACE FUNCTION debug_storage_permissions()
RETURNS TABLE (
  can_upload boolean,
  is_admin_result boolean,
  user_id uuid
)
LANGUAGE sql
SECURITY DEFINER  
AS $$
  SELECT 
    can_upload_product_images() as can_upload,
    is_admin() as is_admin_result,
    auth.uid() as user_id;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION debug_storage_permissions() TO authenticated;
