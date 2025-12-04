-- 010_create_order_function.sql
-- Create a type for the order items input
CREATE TYPE public.order_item_input AS (product_id BIGINT, quantity INTEGER);
-- Create the secure order creation function
CREATE OR REPLACE FUNCTION public.create_order(
        p_user_id UUID,
        p_items public.order_item_input [],
        p_shipping_address TEXT,
        p_shipping_city TEXT,
        p_shipping_state TEXT,
        p_shipping_pincode TEXT,
        p_payment_method TEXT
    ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER -- Runs with privileges of the creator (postgres/admin)
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
-- Check Stock (Assuming 'stock' column exists, if not we might need to add it or skip)
-- For now, assuming stock management is desired.
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