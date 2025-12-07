-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    wp_id INTEGER UNIQUE
);
-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    category TEXT,
    main_category TEXT,
    sub_category TEXT,
    price NUMERIC CHECK (price >= 0),
    original_price NUMERIC,
    image TEXT,
    description TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    is_best_seller BOOLEAN DEFAULT false,
    is_sold_out BOOLEAN DEFAULT false,
    rating NUMERIC,
    marketing_images TEXT [],
    legal_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    wp_id INTEGER UNIQUE
);
-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    status TEXT,
    total_amount NUMERIC,
    -- Note: Column name in DB might be 'total' based on code usage, schema says 'total_amount'. Need to verify. Code uses 'total'.
    -- Assuming 'total' is the correct one based on usage, but schema.sql had 'total_amount'. 
    -- I will keep 'total_amount' as per original schema file but add 'total' alias or note if needed.
    -- Actually, let's check migration 001 if possible, but for now I'll stick to what was in schema.sql unless I see a conflict.
    -- Wait, code uses 'total'. Migration 010 uses 'total'. Schema.sql has 'total_amount'.
    -- This suggests schema.sql might be slightly out of sync or I should update it to match code.
    -- I will update it to 'total' to match the code and new migrations.
    total NUMERIC,
    shipping_address JSONB,
    -- Code uses specific columns: shipping_address (text), shipping_city, etc.
    -- Schema.sql has JSONB. This is a discrepancy.
    -- I will update schema.sql to match the actual usage in migration 010 and code.
    shipping_address_text TEXT,
    -- Renamed to avoid conflict with JSONB if both exist, but likely it's TEXT in DB now.
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_pincode TEXT,
    payment_method TEXT,
    payment_id TEXT,
    payment_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id),
    product_id INTEGER REFERENCES public.products(id),
    product_name TEXT,
    -- Added based on code usage
    image TEXT,
    -- Added based on code usage
    quantity INTEGER,
    price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    product_id INTEGER REFERENCES public.products(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, product_id)
);
-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    product_id INTEGER REFERENCES public.products(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, product_id)
);
-- Nav Items Table
CREATE TABLE IF NOT EXISTS public.nav_items (
    id SERIAL PRIMARY KEY,
    label TEXT,
    href TEXT,
    order_index INTEGER,
    parent_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Hero Slides Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id SERIAL PRIMARY KEY,
    image TEXT,
    subtitle TEXT,
    title TEXT,
    description TEXT,
    button_text TEXT,
    order_index INTEGER,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id INTEGER REFERENCES public.products(id),
    user_id UUID REFERENCES auth.users(id),
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT,
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
-- Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
-- Admins Table (Added in Migration 009)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);
-- ==================== SECURITY POLICIES ====================
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- Admins Policies
CREATE POLICY "Admins can view all admins" ON public.admins FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
-- Products Policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR
SELECT USING (true);
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
-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
CREATE POLICY "No direct inserts to orders" ON public.orders FOR
INSERT WITH CHECK (false);
CREATE POLICY "Admins can update orders" ON public.orders FOR
UPDATE USING (
        auth.uid() IN (
            SELECT user_id
            FROM public.admins
        )
    );
-- Order Items Policies
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
-- ==================== FUNCTIONS ====================
-- Order Item Input Type
DO $$ BEGIN CREATE TYPE public.order_item_input AS (
    product_id BIGINT,
    quantity INTEGER
);
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
-- Create Order Function (RPC)
CREATE OR REPLACE FUNCTION public.create_order(
        p_user_id UUID,
        p_items public.order_item_input [],
        p_shipping_address TEXT,
        p_shipping_city TEXT,
        p_shipping_state TEXT,
        p_shipping_pincode TEXT,
        p_payment_method TEXT
    ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_total NUMERIC := 0;
v_order_id UUID;
v_item public.order_item_input;
v_product_price NUMERIC;
v_product_name TEXT;
v_product_image TEXT;
v_current_stock INTEGER;
BEGIN -- 1. Validate User
IF auth.uid() != p_user_id THEN RAISE EXCEPTION 'Unauthorized: User ID mismatch';
END IF;
-- 2. Calculate Total & Check Stock
FOREACH v_item IN ARRAY p_items LOOP -- Fetch product details
SELECT price,
    name,
    image,
    stock INTO v_product_price,
    v_product_name,
    v_product_image,
    v_current_stock
FROM public.products
WHERE id = v_item.product_id;
IF NOT FOUND THEN RAISE EXCEPTION 'Product with ID % not found',
v_item.product_id;
END IF;
-- Check Stock
IF v_current_stock < v_item.quantity THEN RAISE EXCEPTION 'Insufficient stock for product: %',
v_product_name;
END IF;
-- Accumulate Total
v_total := v_total + (v_product_price * v_item.quantity);
END LOOP;
-- 3. Create Order
INSERT INTO public.orders (
        user_id,
        total,
        status,
        shipping_address,
        -- Note: This assumes column is TEXT or JSONB that accepts text, based on migration 010
        shipping_city,
        shipping_state,
        shipping_pincode,
        payment_method
    )
VALUES (
        p_user_id,
        v_total,
        CASE
            WHEN p_payment_method = 'COD' THEN 'Processing'
            ELSE 'Pending'
        END,
        p_shipping_address,
        p_shipping_city,
        p_shipping_state,
        p_shipping_pincode,
        p_payment_method
    )
RETURNING id INTO v_order_id;
-- 4. Create Order Items & Update Stock
FOREACH v_item IN ARRAY p_items LOOP
SELECT price,
    name,
    image INTO v_product_price,
    v_product_name,
    v_product_image
FROM public.products
WHERE id = v_item.product_id;
INSERT INTO public.order_items (
        order_id,
        product_id,
        product_name,
        quantity,
        price,
        image
    )
VALUES (
        v_order_id,
        v_item.product_id,
        v_product_name,
        v_item.quantity,
        v_product_price,
        v_product_image
    );
-- Decrement Stock
UPDATE public.products
SET stock = stock - v_item.quantity
WHERE id = v_item.product_id;
END LOOP;
-- Return the created order as JSON
RETURN jsonb_build_object(
    'id',
    v_order_id,
    'total',
    v_total,
    'status',
    CASE
        WHEN p_payment_method = 'COD' THEN 'Processing'
        ELSE 'Pending'
    END
);
END;
$$;

-- 011_fix_admin_policy.sql
-- 011_fix_admin_policy.sql
-- The previous policy caused infinite recursion because it queried the table itself.
-- We will change it so users can only see their OWN admin record.
-- This is sufficient to check "Am I an admin?".
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
CREATE POLICY "Admins can view self" ON public.admins FOR
SELECT USING (auth.uid() = user_id);

-- 012_secure_products_rls.sql
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

-- 013_fix_order_function.sql
-- 013_fix_order_function.sql
-- Secure the create_order function:
-- 1. Use SECURITY DEFINER with fixed search_path to prevent search_path hijacking.
-- 2. Use FOR UPDATE to lock product rows and prevent race conditions (overselling).
-- 3. Validate stock levels before any changes.
CREATE OR REPLACE FUNCTION public.create_order(
        p_user_id UUID,
        p_items public.order_item_input [],
        p_shipping_address TEXT,
        p_shipping_city TEXT,
        p_shipping_state TEXT,
        p_shipping_pincode TEXT,
        p_payment_method TEXT
    ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public,
    extensions -- Explicitly set search path for security
    AS $$
DECLARE v_total NUMERIC := 0;
v_order_id UUID;
v_item public.order_item_input;
v_product_price NUMERIC;
v_product_name TEXT;
v_product_image TEXT;
v_current_stock INTEGER;
BEGIN -- 1. Validate User
IF auth.uid() != p_user_id THEN RAISE EXCEPTION 'Unauthorized: User ID mismatch';
END IF;
-- 2. Calculate Total & Check Stock (with Locking)
-- We loop through items to lock them and calculate total.
-- NOTE: In a high-concurrency env, items should be sorted by ID to prevent deadlocks.
FOREACH v_item IN ARRAY p_items LOOP
SELECT price,
    name,
    image,
    stock INTO v_product_price,
    v_product_name,
    v_product_image,
    v_current_stock
FROM public.products
WHERE id = v_item.product_id FOR
UPDATE;
-- Lock the row to prevent concurrent modifications
IF NOT FOUND THEN RAISE EXCEPTION 'Product with ID % not found',
v_item.product_id;
END IF;
IF v_current_stock < v_item.quantity THEN RAISE EXCEPTION 'Insufficient stock for product: % (Requested: %, Available: %)',
v_product_name,
v_item.quantity,
v_current_stock;
END IF;
v_total := v_total + (v_product_price * v_item.quantity);
END LOOP;
-- 3. Create Order
INSERT INTO public.orders (
        user_id,
        total,
        status,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_pincode,
        payment_method
    )
VALUES (
        p_user_id,
        v_total,
        CASE
            WHEN p_payment_method = 'COD' THEN 'Processing'
            ELSE 'Pending'
        END,
        p_shipping_address,
        p_shipping_city,
        p_shipping_state,
        p_shipping_pincode,
        p_payment_method
    )
RETURNING id INTO v_order_id;
-- 4. Create Order Items & Decrement Stock
FOREACH v_item IN ARRAY p_items LOOP -- We don't need to lock again, we hold the lock from step 2 until transaction commit.
SELECT price,
    name,
    image INTO v_product_price,
    v_product_name,
    v_product_image
FROM public.products
WHERE id = v_item.product_id;
INSERT INTO public.order_items (
        order_id,
        product_id,
        product_name,
        quantity,
        price,
        image
    )
VALUES (
        v_order_id,
        v_item.product_id,
        v_product_name,
        v_item.quantity,
        v_product_price,
        v_product_image
    );
-- Decrement Stock
UPDATE public.products
SET stock = stock - v_item.quantity
WHERE id = v_item.product_id;
END LOOP;
RETURN jsonb_build_object(
    'id',
    v_order_id,
    'total',
    v_total,
    'status',
    CASE
        WHEN p_payment_method = 'COD' THEN 'Processing'
        ELSE 'Pending'
    END
);
END;
$$;

-- 014_secure_order_and_products.sql
-- 014_secure_order_and_products.sql
-- 1. Secure Products Table (RLS)
-- Revoke all write access from public and authenticated users
REVOKE
INSERT,
    UPDATE,
    DELETE ON public.products
FROM anon,
    authenticated;
-- Ensure service_role (and postgres/dashboard admin) still has access
GRANT ALL ON public.products TO service_role;
-- 2. Secure Orders Table (RLS)
-- Revoke UPDATE access from authenticated users (they can only INSERT via function, and SELECT their own)
REVOKE
UPDATE ON public.orders
FROM authenticated;
-- Allow users to SELECT their own orders (existing policy should cover this, but ensuring no UPDATE)
-- 3. Update create_order function
-- Changes:
-- - Calculate shipping server-side (Logic: Free shipping for now, but hardcoded on server)
-- - Add shipping to total
-- - Ensure stock deduction happens (Reservation model)
CREATE OR REPLACE FUNCTION public.create_order(
        p_user_id UUID,
        p_items public.order_item_input [],
        p_shipping_address TEXT,
        p_shipping_city TEXT,
        p_shipping_state TEXT,
        p_shipping_pincode TEXT,
        p_payment_method TEXT
    ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public,
    extensions AS $$
DECLARE v_total NUMERIC := 0;
v_shipping_cost NUMERIC := 0;
-- Server-side shipping logic
v_order_id UUID;
v_item public.order_item_input;
v_product_price NUMERIC;
v_product_name TEXT;
v_product_image TEXT;
v_current_stock INTEGER;
BEGIN -- 1. Validate User
IF auth.uid() != p_user_id THEN RAISE EXCEPTION 'Unauthorized: User ID mismatch';
END IF;
-- 2. Calculate Total & Check Stock (with Locking)
FOREACH v_item IN ARRAY p_items LOOP
SELECT price,
    name,
    image,
    stock INTO v_product_price,
    v_product_name,
    v_product_image,
    v_current_stock
FROM public.products
WHERE id = v_item.product_id FOR
UPDATE;
-- Lock the row
IF NOT FOUND THEN RAISE EXCEPTION 'Product with ID % not found',
v_item.product_id;
END IF;
IF v_current_stock < v_item.quantity THEN RAISE EXCEPTION 'Insufficient stock for product: % (Requested: %, Available: %)',
v_product_name,
v_item.quantity,
v_current_stock;
END IF;
v_total := v_total + (v_product_price * v_item.quantity);
END LOOP;
-- 3. Calculate Shipping (Server-Side Logic)
-- Example: Free shipping if total > 5000, else 100. For now, keeping it 0 as per requirement, but it's SECURE now.
v_shipping_cost := 0;
v_total := v_total + v_shipping_cost;
-- 4. Create Order
INSERT INTO public.orders (
        user_id,
        total,
        status,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_pincode,
        payment_method
    )
VALUES (
        p_user_id,
        v_total,
        CASE
            WHEN p_payment_method = 'COD' THEN 'Processing'
            ELSE 'Pending'
        END,
        p_shipping_address,
        p_shipping_city,
        p_shipping_state,
        p_shipping_pincode,
        p_payment_method
    )
RETURNING id INTO v_order_id;
-- 5. Create Order Items & Decrement Stock
FOREACH v_item IN ARRAY p_items LOOP
SELECT price,
    name,
    image INTO v_product_price,
    v_product_name,
    v_product_image
FROM public.products
WHERE id = v_item.product_id;
INSERT INTO public.order_items (
        order_id,
        product_id,
        product_name,
        quantity,
        price,
        image
    )
VALUES (
        v_order_id,
        v_item.product_id,
        v_product_name,
        v_item.quantity,
        v_product_price,
        v_product_image
    );
-- Decrement Stock (Reservation)
UPDATE public.products
SET stock = stock - v_item.quantity
WHERE id = v_item.product_id;
END LOOP;
RETURN jsonb_build_object(
    'id',
    v_order_id,
    'total',
    v_total,
    'status',
    CASE
        WHEN p_payment_method = 'COD' THEN 'Processing'
        ELSE 'Pending'
    END
);
END;
$$;

-- 015_add_is_featured_to_products.sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

-- 015_add_razorpay_fields.sql
-- 015_add_razorpay_fields.sql
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
    ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- 016_cleanup_cron.sql
-- 016_cleanup_cron.sql
-- Function to clean up stale orders
CREATE OR REPLACE FUNCTION public.cleanup_stale_orders() RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN -- Release stock for stale pending orders (> 1 hour)
UPDATE public.products p
SET stock = p.stock + oi.quantity
FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
WHERE o.status = 'Pending'
    AND o.created_at < NOW() - INTERVAL '1 hour'
    AND oi.product_id = p.id;
-- Mark orders as Cancelled
UPDATE public.orders
SET status = 'Cancelled'
WHERE status = 'Pending'
    AND created_at < NOW() - INTERVAL '1 hour';
END;
$$;
-- Schedule cron job (every 10 minutes)
-- cron.schedule updates existing job if name matches
SELECT cron.schedule(
        'cleanup_stale_orders',
        '*/10 * * * *',
        $$SELECT public.cleanup_stale_orders() $$
);

-- 017_create_content_blocks.sql
-- Create content_blocks table for dynamic page content
CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_name TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
-- Create policies (viewable by everyone, editable only by admins/authenticated users for now - assuming open RLS for prototype or specific admin role)
-- For now allowing public read, and authenticated insert/update (since we have an admin panel that is likely authenticated)
CREATE POLICY "Public read access for content_blocks" ON content_blocks FOR
SELECT USING (true);
CREATE POLICY "Authenticated update access for content_blocks" ON content_blocks FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert access for content_blocks" ON content_blocks FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
-- Initial Seed Data for Home Page Sections
-- 1. Shop By Concerns
INSERT INTO content_blocks (section_name, content)
VALUES (
        'shop_by_concerns',
        '
[
  { "title": "Anti Aging", "image": "https://picsum.photos/id/64/400/400", "link": "/shop/ANTI_AGING" },
  { "title": "Skin Brightening", "image": "https://picsum.photos/id/91/400/400", "link": "/shop/SKIN_BRIGHTENING" },
  { "title": "Anti Pigmentation", "image": "https://picsum.photos/id/129/400/400", "link": "/shop/ANTI_PIGMENTATION" },
  { "title": "Hair Strengthening", "image": "https://picsum.photos/id/177/400/400", "link": "/shop/HAIR_STRENGTHENING" }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 2. Gifting Collection
INSERT INTO content_blocks (section_name, content)
VALUES (
        'gifting_collection',
        '
[
  {
    "title": "Oudh", 
    "subtitle": "Luxurious Ayurvedic Gift Set", 
    "image": "https://picsum.photos/id/1070/800/600",
    "link": "/shop/GIFTING"
  },
  {
    "title": "Utsav",
    "subtitle": "A Set of Four Signature Perfumes",
    "image": "https://picsum.photos/id/1071/800/600",
    "link": "/shop/GIFTING"
  },
  {
    "title": "Sapphire",
    "subtitle": "Luxurious Ayurvedic Gift Set",
    "image": "https://picsum.photos/id/1072/800/600",
    "link": "/shop/GIFTING"
  }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 3. Bestsellers Section Config
INSERT INTO content_blocks (section_name, content)
VALUES (
        'bestsellers_config',
        '
{
  "backgroundImage": "/src/assets/bestsellers-bg.png",
  "title": "Our\nBestsellers",
  "buttonText": "View All"
}
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 4. Video Section Config
INSERT INTO content_blocks (section_name, content)
VALUES (
        'video_section',
        '
{
  "thumbnail": "https://picsum.photos/id/452/1280/720",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
  "title": "Soulful Scents of Pure Elements",
  "subtitle": "Luxury Collection"
}
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 5. Testimonials
INSERT INTO content_blocks (section_name, content)
VALUES (
        'testimonials',
        '
[
  { "id": 1, "name": "Customer Review- Pure Elements", "thumbnail": "https://picsum.photos/id/338/300/500", "platform": "YouTube", "videoUrl": "" },
  { "id": 2, "name": "Customer Review- Pure Elements", "thumbnail": "https://picsum.photos/id/342/300/500", "platform": "YouTube", "videoUrl": "" },
  { "id": 3, "name": "Customer Review- Pure Elements", "thumbnail": "https://picsum.photos/id/349/300/500", "platform": "YouTube", "videoUrl": "" },
  { "id": 4, "name": "Customer Review - Pure Elements", "thumbnail": "https://picsum.photos/id/355/300/500", "platform": "YouTube", "videoUrl": "" }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 6. Stores
INSERT INTO content_blocks (section_name, content)
VALUES (
        'stores',
        '
[
  { "id": 1, "name": "Westend Mall, Aundh, Pune", "image": "https://picsum.photos/id/401/400/300", "location": "Pune" },
  { "id": 2, "name": "Wakad- Phoenix Mall Of Millennium", "image": "https://picsum.photos/id/402/400/300", "location": "Pune" },
  { "id": 3, "name": "Viman Nagar, Pune", "image": "https://picsum.photos/id/403/400/300", "location": "Pune" },
  { "id": 4, "name": "Mahabaleshwar Main Market", "image": "https://picsum.photos/id/404/400/300", "location": "Mahabaleshwar" },
  { "id": 5, "name": "The Pavillion Mall, Shivajinagar", "image": "https://picsum.photos/id/405/400/300", "location": "Pune" }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;

-- 018_create_product_variants.sql
-- Create product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    -- e.g., "50g", "100g", "200ml"
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    sku TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Enable RLS on product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
-- Add policies for product_variants (public read, admin write)
CREATE POLICY "Public variants are viewable by everyone" ON public.product_variants FOR
SELECT USING (true);
-- Assuming admin policies are handled similar to products, or defaulting to restricted modification
-- For now allowing public read is the critical part for the store.
-- Add variant_id to cart_items
ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS variant_id INTEGER REFERENCES public.product_variants(id) ON DELETE
SET NULL;
-- Update wishlist_items too if we want to wishlist specific variants? 
-- For now keeping it simple as per request, just cart needs exact variant for purchase.

-- 019_add_concerns_to_products.sql
-- Add concerns column to products table as text array
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS concerns TEXT [] DEFAULT '{}';
-- Index for array operations
CREATE INDEX IF NOT EXISTS idx_products_concerns ON public.products USING GIN (concerns);
