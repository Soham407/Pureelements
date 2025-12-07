-- Add concerns column to products table as text array
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS concerns TEXT [] DEFAULT '{}';
-- Index for array operations
CREATE INDEX IF NOT EXISTS idx_products_concerns ON public.products USING GIN (concerns);