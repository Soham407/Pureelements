-- 011_fix_admin_policy.sql
-- The previous policy caused infinite recursion because it queried the table itself.
-- We will change it so users can only see their OWN admin record.
-- This is sufficient to check "Am I an admin?".
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
CREATE POLICY "Admins can view self" ON public.admins FOR
SELECT USING (auth.uid() = user_id);