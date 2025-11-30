-- Create a function to get bestsellers based on order_items quantity
-- This calculates the top selling products by summing quantities from order_items

CREATE OR REPLACE FUNCTION get_bestsellers(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  category TEXT,
  price NUMERIC,
  original_price NUMERIC,
  image TEXT,
  images JSONB,
  description TEXT,
  ingredients TEXT,
  how_to_use TEXT,
  is_new BOOLEAN,
  is_best_seller BOOLEAN,
  is_sold_out BOOLEAN,
  rating NUMERIC,
  main_category TEXT,
  sub_category TEXT,
  marketing_images JSONB,
  size TEXT,
  full_description TEXT,
  legal_info TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.*,
    COALESCE(SUM(oi.quantity), 0) as total_sold
  FROM products p
  LEFT JOIN order_items oi ON p.id = oi.product_id
  GROUP BY p.id
  ORDER BY total_sold DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_bestsellers(INTEGER) TO anon, authenticated;

