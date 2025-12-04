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
    price NUMERIC,
    original_price NUMERIC,
    image TEXT,
    description TEXT,
    stock INTEGER DEFAULT 0,
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
    shipping_address JSONB,
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