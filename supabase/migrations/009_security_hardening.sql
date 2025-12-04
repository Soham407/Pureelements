-- 009_security_hardening.sql
-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);
-- 2. Enable RLS on all critical tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- 3. Policies for Admins Table
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
CREATE POLICY "Admins can view all admins" ON public.admins FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
-- 4. Policies for Products
-- Drop insecure policies from 006 (or previous)
DROP POLICY IF EXISTS "Products are insertable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
-- Drop secure policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Products are insertable by admins only" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by admins only" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by admins only" ON public.products;
-- Public Read
CREATE POLICY "Products are viewable by everyone" ON public.products FOR
SELECT USING (true);
-- Admin Write (Insert, Update, Delete)
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
-- 5. Policies for Orders
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "No direct inserts to orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR
SELECT USING (auth.uid() = user_id);
-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
-- Block direct inserts (use RPC)
CREATE POLICY "No direct inserts to orders" ON public.orders FOR
INSERT WITH CHECK (false);
-- Admins can update orders (e.g. status)
CREATE POLICY "Admins can update orders" ON public.orders FOR
UPDATE USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
-- 6. Policies for Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.orders
            WHERE orders.id = order_items.order_id
                AND orders.user_id = auth.uid()
        )
    );
CREATE POLICY "Admins can view all order items" ON public.order_items FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
-- 7. Constraints
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS price_non_negative;
ALTER TABLE public.products
ADD CONSTRAINT price_non_negative CHECK (price >= 0);
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'products'
        AND column_name = 'stock'
) THEN
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS stock_non_negative;
ALTER TABLE public.products
ADD CONSTRAINT stock_non_negative CHECK (stock >= 0);
END IF;
END $$;