-- 016_cleanup_cron.sql
-- Function to clean up stale orders
CREATE OR REPLACE FUNCTION public.cleanup_stale_orders() RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN -- Release stock for stale pending orders (> 1 hour)
UPDATE public.products p
SET stock = p.stock + oi.quantity
FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
WHERE o.status = 'Pending'
    AND o.created_at < NOW() - INTERVAL '1 hour'
    AND oi.product_id = p.id;
-- Mark orders as Cancelled
UPDATE public.orders
SET status = 'Cancelled'
WHERE status = 'Pending'
    AND created_at < NOW() - INTERVAL '1 hour';
END;
$$;
-- Schedule cron job (every 10 minutes)
-- cron.schedule updates existing job if name matches
SELECT cron.schedule(
        'cleanup_stale_orders',
        '*/10 * * * *',
        $$SELECT public.cleanup_stale_orders() $$
    );