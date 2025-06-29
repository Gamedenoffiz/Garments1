/*
  # Storage Setup Helper Script
  
  This script should be run after the database migrations to set up
  storage bucket policies for product image uploads.
  
  Run this in the Supabase SQL editor or via the JavaScript client.
*/

-- First, ensure the storage bucket exists (this might need to be done via dashboard)
-- Bucket name: product-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- Storage policies (run these in Supabase SQL editor after bucket creation)

-- Allow admins to insert/upload images
INSERT INTO storage.policies (name, bucket_id, operation, target_roles, using_expression, with_check_expression)
VALUES (
  'Admin users can upload product images',
  'product-images',
  'INSERT',
  '{authenticated}',
  'can_upload_product_images()',
  'can_upload_product_images()'
) ON CONFLICT (bucket_id, name) DO UPDATE SET
  operation = EXCLUDED.operation,
  target_roles = EXCLUDED.target_roles,
  using_expression = EXCLUDED.using_expression,
  with_check_expression = EXCLUDED.with_check_expression;

-- Allow admins to update images
INSERT INTO storage.policies (name, bucket_id, operation, target_roles, using_expression, with_check_expression)
VALUES (
  'Admin users can update product images',
  'product-images', 
  'UPDATE',
  '{authenticated}',
  'can_upload_product_images()',
  'can_upload_product_images()'
) ON CONFLICT (bucket_id, name) DO UPDATE SET
  operation = EXCLUDED.operation,
  target_roles = EXCLUDED.target_roles,
  using_expression = EXCLUDED.using_expression,
  with_check_expression = EXCLUDED.with_check_expression;

-- Allow admins to delete images
INSERT INTO storage.policies (name, bucket_id, operation, target_roles, using_expression, with_check_expression)
VALUES (
  'Admin users can delete product images',
  'product-images',
  'DELETE', 
  '{authenticated}',
  'can_upload_product_images()',
  'can_upload_product_images()'
) ON CONFLICT (bucket_id, name) DO UPDATE SET
  operation = EXCLUDED.operation,
  target_roles = EXCLUDED.target_roles,
  using_expression = EXCLUDED.using_expression,
  with_check_expression = EXCLUDED.with_check_expression;

-- Allow everyone to view/select images (public access)
INSERT INTO storage.policies (name, bucket_id, operation, target_roles, using_expression)
VALUES (
  'Anyone can view product images',
  'product-images',
  'SELECT',
  '{public, authenticated}',
  'true'
) ON CONFLICT (bucket_id, name) DO UPDATE SET
  operation = EXCLUDED.operation,
  target_roles = EXCLUDED.target_roles,
  using_expression = EXCLUDED.using_expression;
