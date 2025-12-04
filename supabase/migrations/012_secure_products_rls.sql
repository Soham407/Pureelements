-- 012_secure_products_rls.sql
-- Enforce strict RLS on products table, ensuring only admins can modify data.
-- 1. Drop any insecure policies that might exist (from 002 or others)
DROP POLICY IF EXISTS "Products are insertable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
-- 2. Drop existing admin policies to recreate them cleanly
DROP POLICY IF EXISTS "Products are insertable by admins only" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by admins only" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by admins only" ON public.products;
-- 3. Public Read Access
CREATE POLICY "Products are viewable by everyone" ON public.products FOR
SELECT USING (true);
-- 4. Admin Write Access (Insert, Update, Delete)
-- Requires existence of 'admins' table (created in 009)
CREATE POLICY "Products are insertable by admins only" ON public.products FOR
INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
CREATE POLICY "Products are updatable by admins only" ON public.products FOR
UPDATE USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
CREATE POLICY "Products are deletable by admins only" ON public.products FOR DELETE USING (
    auth.uid() IN (
        SELECT user_id
        FROM public.admins
    )
);