-- Allow public updates to products table (for Admin Dashboard without Auth)
-- This is necessary because the Admin Dashboard uses a simple PIN check and doesn't authenticate with Supabase.
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are insertable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by everyone" ON public.products;
-- Create permissive policies
CREATE POLICY "Products are insertable by everyone" ON public.products FOR
INSERT WITH CHECK (true);
CREATE POLICY "Products are updatable by everyone" ON public.products FOR
UPDATE USING (true);
CREATE POLICY "Products are deletable by everyone" ON public.products FOR DELETE USING (true);