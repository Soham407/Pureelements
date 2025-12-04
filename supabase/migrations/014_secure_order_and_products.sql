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