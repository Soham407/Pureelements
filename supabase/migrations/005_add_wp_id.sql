-- Add wp_id column to map legacy data
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS wp_id INTEGER UNIQUE;
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS wp_id INTEGER UNIQUE;
-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_wp_id ON public.products(wp_id);
CREATE INDEX IF NOT EXISTS idx_categories_wp_id ON public.categories(wp_id);