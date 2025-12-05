-- Create content_blocks table for dynamic page content
CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_name TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
-- Create policies (viewable by everyone, editable only by admins/authenticated users for now - assuming open RLS for prototype or specific admin role)
-- For now allowing public read, and authenticated insert/update (since we have an admin panel that is likely authenticated)
CREATE POLICY "Public read access for content_blocks" ON content_blocks FOR
SELECT USING (true);
CREATE POLICY "Authenticated update access for content_blocks" ON content_blocks FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert access for content_blocks" ON content_blocks FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
-- Initial Seed Data for Home Page Sections
-- 1. Shop By Concerns
INSERT INTO content_blocks (section_name, content)
VALUES (
        'shop_by_concerns',
        '
[
  { "title": "Anti Aging", "image": "https://picsum.photos/id/64/400/400", "link": "/shop/ANTI_AGING" },
  { "title": "Skin Brightening", "image": "https://picsum.photos/id/91/400/400", "link": "/shop/SKIN_BRIGHTENING" },
  { "title": "Anti Pigmentation", "image": "https://picsum.photos/id/129/400/400", "link": "/shop/ANTI_PIGMENTATION" },
  { "title": "Hair Strengthening", "image": "https://picsum.photos/id/177/400/400", "link": "/shop/HAIR_STRENGTHENING" }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 2. Gifting Collection
INSERT INTO content_blocks (section_name, content)
VALUES (
        'gifting_collection',
        '
[
  {
    "title": "Oudh", 
    "subtitle": "Luxurious Ayurvedic Gift Set", 
    "image": "https://picsum.photos/id/1070/800/600",
    "link": "/shop/GIFTING"
  },
  {
    "title": "Utsav",
    "subtitle": "A Set of Four Signature Perfumes",
    "image": "https://picsum.photos/id/1071/800/600",
    "link": "/shop/GIFTING"
  },
  {
    "title": "Sapphire",
    "subtitle": "Luxurious Ayurvedic Gift Set",
    "image": "https://picsum.photos/id/1072/800/600",
    "link": "/shop/GIFTING"
  }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 3. Bestsellers Section Config
INSERT INTO content_blocks (section_name, content)
VALUES (
        'bestsellers_config',
        '
{
  "backgroundImage": "/src/assets/bestsellers-bg.png",
  "title": "Our\nBestsellers",
  "buttonText": "View All"
}
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 4. Video Section Config
INSERT INTO content_blocks (section_name, content)
VALUES (
        'video_section',
        '
{
  "thumbnail": "https://picsum.photos/id/452/1280/720",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
  "title": "Soulful Scents of Pure Elements",
  "subtitle": "Luxury Collection"
}
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 5. Testimonials
INSERT INTO content_blocks (section_name, content)
VALUES (
        'testimonials',
        '
[
  { "id": 1, "name": "Customer Review- Pure Elements", "thumbnail": "https://picsum.photos/id/338/300/500", "platform": "YouTube", "videoUrl": "" },
  { "id": 2, "name": "Customer Review- Pure Elements", "thumbnail": "https://picsum.photos/id/342/300/500", "platform": "YouTube", "videoUrl": "" },
  { "id": 3, "name": "Customer Review- Pure Elements", "thumbnail": "https://picsum.photos/id/349/300/500", "platform": "YouTube", "videoUrl": "" },
  { "id": 4, "name": "Customer Review - Pure Elements", "thumbnail": "https://picsum.photos/id/355/300/500", "platform": "YouTube", "videoUrl": "" }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;
-- 6. Stores
INSERT INTO content_blocks (section_name, content)
VALUES (
        'stores',
        '
[
  { "id": 1, "name": "Westend Mall, Aundh, Pune", "image": "https://picsum.photos/id/401/400/300", "location": "Pune" },
  { "id": 2, "name": "Wakad- Phoenix Mall Of Millennium", "image": "https://picsum.photos/id/402/400/300", "location": "Pune" },
  { "id": 3, "name": "Viman Nagar, Pune", "image": "https://picsum.photos/id/403/400/300", "location": "Pune" },
  { "id": 4, "name": "Mahabaleshwar Main Market", "image": "https://picsum.photos/id/404/400/300", "location": "Mahabaleshwar" },
  { "id": 5, "name": "The Pavillion Mall, Shivajinagar", "image": "https://picsum.photos/id/405/400/300", "location": "Pune" }
]
'::jsonb
    ) ON CONFLICT (section_name) DO NOTHING;