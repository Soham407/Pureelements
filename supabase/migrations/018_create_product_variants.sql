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