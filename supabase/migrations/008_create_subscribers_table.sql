-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
-- Create policies
-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR
INSERT WITH CHECK (true);
-- Only admins (service role) can view subscribers (for now, or authenticated users if we had an admin role)
-- For simplicity in this project structure where admin is client-side protected, we might allow public read if needed, 
-- but for privacy, let's keep it restricted. 
-- Actually, since the admin panel uses a hardcoded pin and no auth, we might need to allow public read 
-- OR just rely on the fact that the admin panel currently doesn't fetch subscribers.
-- Let's just allow insert for now.