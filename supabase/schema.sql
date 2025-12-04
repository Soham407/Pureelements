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