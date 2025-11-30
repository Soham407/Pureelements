-- Update products RLS policies to allow admin operations
-- NOTE: This allows unauthenticated inserts/updates. For production, consider:
-- 1. Making admin panel require Supabase authentication
-- 2. Using a backend API with service role key
-- 3. Adding an is_admin field to user_profiles and checking it in policies

-- Drop existing policies
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by authenticated users" ON public.products;

-- Allow inserts/updates/deletes for authenticated users OR allow all (for admin panel)
-- For production, you should restrict this to authenticated users only
CREATE POLICY "Products are insertable by everyone" ON public.products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Products are updatable by everyone" ON public.products
  FOR UPDATE USING (true);

CREATE POLICY "Products are deletable by everyone" ON public.products
  FOR DELETE USING (true);

