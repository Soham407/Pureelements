-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        rating INTEGER NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        comment TEXT,
        author_name TEXT,
        -- For guest reviews or imported reviews
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
-- Policies
-- Public read access
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR
SELECT USING (true);
-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
-- Users can update/delete their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE
UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();