-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS (extends Supabase Auth) ====================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== CATEGORIES ====================
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== PRODUCTS ====================
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  main_category TEXT,
  sub_category TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image TEXT NOT NULL,
  images TEXT[],
  description TEXT,
  full_description TEXT,
  ingredients TEXT,
  how_to_use TEXT,
  size TEXT,
  is_new BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_sold_out BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2, 1),
  marketing_images TEXT[],
  legal_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== NAV ITEMS ====================
CREATE TABLE IF NOT EXISTS public.nav_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  has_dropdown BOOLEAN DEFAULT FALSE,
  sub_items TEXT[],
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== HERO SLIDES ====================
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ORDERS ====================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ORDER ITEMS ====================
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== CART ITEMS ====================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ==================== WISHLIST ITEMS ====================
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_products_main_category ON public.products(main_category);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON public.products(sub_category);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON public.products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: Public read, authenticated write (admin only in practice)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items: Users can see items of their own orders
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Order items are insertable by authenticated users" ON public.order_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Cart items: Users can only see/modify their own cart
CREATE POLICY "Users can view own cart" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist items: Users can only see/modify their own wishlist
CREATE POLICY "Users can view own wishlist" ON public.wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items" ON public.wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items" ON public.wishlist_items
  FOR DELETE USING (auth.uid() = user_id);

-- Nav items: Public read, authenticated write
CREATE POLICY "Nav items are viewable by everyone" ON public.nav_items
  FOR SELECT USING (true);

CREATE POLICY "Nav items are modifiable by authenticated users" ON public.nav_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Hero slides: Public read, authenticated write
CREATE POLICY "Hero slides are viewable by everyone" ON public.hero_slides
  FOR SELECT USING (true);

CREATE POLICY "Hero slides are modifiable by authenticated users" ON public.hero_slides
  FOR ALL USING (auth.role() = 'authenticated');

-- Categories: Public read, authenticated write
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are modifiable by authenticated users" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- ==================== FUNCTIONS ====================
-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

