ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);