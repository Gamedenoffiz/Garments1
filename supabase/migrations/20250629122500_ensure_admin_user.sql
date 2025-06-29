/*
  # Ensure Default Admin User Exists
  
  This migration ensures there's a default admin user for testing.
  Replace the email with your actual admin email.
*/

-- Function to create admin user if authenticated user doesn't have admin record
CREATE OR REPLACE FUNCTION ensure_admin_user(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var uuid;
BEGIN
  -- Get the user ID from auth.users table
  SELECT id INTO user_id_var 
  FROM auth.users 
  WHERE email = admin_email;
  
  -- If user exists but not in admin_users table, add them
  IF user_id_var IS NOT NULL THEN
    INSERT INTO admin_users (id, email, role, permissions, is_active)
    VALUES (
      user_id_var,
      admin_email,
      'super_admin',
      '{
        "products": true,
        "categories": true,
        "orders": true,
        "users": true,
        "settings": true
      }'::jsonb,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      is_active = true,
      role = EXCLUDED.role,
      permissions = EXCLUDED.permissions;
      
    RAISE NOTICE 'Admin user created/updated for: %', admin_email;
  ELSE
    RAISE NOTICE 'User with email % not found in auth.users', admin_email;
  END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION ensure_admin_user(text) TO authenticated;

-- NOTE: After running this migration, you need to call the function manually
-- with your admin email address. Example:
-- SELECT ensure_admin_user('your-admin-email@example.com');
--
-- Or you can uncomment the line below and replace with your actual admin email:
-- SELECT ensure_admin_user('admin@example.com');
