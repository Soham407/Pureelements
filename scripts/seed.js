import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// 👇 CHANGE THIS LINE to use the Service Role Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ... keep the rest of the file exactly the same ...
// --- DATA FROM YOUR CONSTANTS.TS ---

const NAV_ITEMS = [
  { name: 'ABOUT US', hasDropdown: false },
  { name: 'SKIN CARE', hasDropdown: true, subItems: ['Face Wash', 'Face Creams', 'Serums', 'Sunscreen', 'Face Packs'] },
  { name: 'HAIR-CARE', hasDropdown: true, subItems: ['Hair Conditioners & Masks', 'Hair Gels', 'Hair Oils', 'Shampoos'] },
  { name: 'BODY-CARE', hasDropdown: true, subItems: ['Body Wash', 'Body Lotions', 'Soaps', 'Scrubs'] },
  { name: 'MENS CARE', hasDropdown: false },
  { name: 'KIDS-CARE', hasDropdown: true, subItems: ['Baby Wash', 'Baby Lotion', 'Baby Oil'] },
  { name: 'GIFTING', hasDropdown: false },
  { name: 'OFFERS', hasDropdown: false },
  { name: 'REGIMES', hasDropdown: false },
  { name: 'WELLNESS', hasDropdown: true, subItems: ['Essential Oils', 'Diffusers', 'Incense Sticks'] },
  { name: 'PERFUMES', hasDropdown: true, subItems: ['For Him', 'For Her', 'Unisex', 'Solid Perfumes'] },
  { name: 'STORES', hasDropdown: false },
];

const HERO_SLIDES = [
  {
    image: "/images/Hero Section/Kumkumadi-Oil-Website-Banner-1.jpg",
    subtitle: "NEW LAUNCH",
    title: "Kumkumadi \nFace Cleanser",
    description: "Goodness of Saffron for Cleaner & Brighter Skin.",
    buttonText: "Shop Now"
  },
  {
    image: "/images/Hero Section/suncreen-2-web-size-2048x798.png", 
    subtitle: "LUXURY COLLECTION",
    title: "Signature \nPerfumes",
    description: "Indulge in the essence of togetherness.",
    buttonText: "Explore Collection"
  },
  {
    image: "/images/Hero Section/sunscreen-desktop.jpg", 
    subtitle: "PURE & NATURAL",
    title: "Ayurvedic \nBody Care",
    description: "Ancient wisdom for modern wellness.",
    buttonText: "Discover More"
  }
];

const CATEGORIES = [
  { name: "Skin Care", image: "/images/Category/ICON_1-1.png" },
  { name: "Hair Care", image: "/images/Category/ICON_2-1.png" },
  { name: "Body Care", image: "/images/Category/ICON_3-1.png" },
  { name: "Men's Care", image: "/images/Category/ICON_4-1.png" },
  { name: "Wellness", image: "/images/Category/ICON_5-1.png" },
  { name: "Kids Care", image: "/images/Category/ICON_6-1.png" },
  { name: "Gifting Collection", image: "/images/Category/ICON_7-1.png" },
  { name: "Luxury Perfumes", image: "/images/Category/ICON_8-1.png" },
];

const ALL_PRODUCTS = [
  // Featured
  { name: "Tea Tree Body Wash for MEN", category: "Body Wash", price: 400, image: "https://picsum.photos/id/10/400/500", mainCategory: "MENS CARE", subCategory: "Body Wash", rating: 4 },
  { name: "Pure Fragrances For Him", category: "Perfumes", price: 1180, image: "https://picsum.photos/id/1070/800/800", mainCategory: "PERFUMES", subCategory: "For Him", rating: 5 },
  { name: "Natural Incense Sticks", category: "Wellness",price: 160, image: "https://picsum.photos/id/30/400/500", mainCategory: "WELLNESS", subCategory: "Incense Sticks", rating: 3 },
  { name: "Exotic Chocolate Creamy Bath Gel", category: "Body Wash", price: 550, image: "https://picsum.photos/id/40/400/500", mainCategory: "BODY-CARE", subCategory: "Body Wash", rating: 4 },
  { name: "Saffron & Turmeric Face Cream", category: "Face Creams", price: 850, image: "https://picsum.photos/id/50/400/500", mainCategory: "SKIN CARE", subCategory: "Face Creams", rating: 5 },
  { name: "Hibiscus Hair Oil", category: "Hair Oils", price: 450, image: "https://picsum.photos/id/60/400/500", mainCategory: "HAIR-CARE", subCategory: "Hair Oils", rating: 4 },
  { name: "Charcoal Face Wash", category: "Face Wash", price: 350, image: "https://picsum.photos/id/70/400/500", mainCategory: "SKIN CARE", subCategory: "Face Wash", rating: 4 },
  { name: "Lavender Body Mist", category: "Body Care", price: 600, image: "https://picsum.photos/id/80/400/500", mainCategory: "BODY-CARE", subCategory: "Body Lotions", rating: 5 },
  
  // Bestsellers
  { name: "Oudh & White Rose Luxury Bath Bar", category: "Luxury Ayurvedic Soap", price: 250.00, originalPrice: 640.00, image: "https://picsum.photos/id/201/400/400", isBestSeller: true, mainCategory: "BODY-CARE", subCategory: "Soaps", rating: 5 },
  { name: "Kumkumadi Face Oil", category: "Skin Lightening | Moisturising", price: 2380.00, originalPrice: 3000.00, image: "https://picsum.photos/id/202/400/400", isBestSeller: true, mainCategory: "SKIN CARE", subCategory: "Serums", rating: 4 },
  { name: "Aalaap Unisex Perfume", category: "Signature Unisex Perfume", price: 1290.00, image: "https://picsum.photos/id/203/400/400", isBestSeller: true, mainCategory: "PERFUMES", subCategory: "Unisex", rating: 5 },
  { name: "Neem & Basil Face Cleanser", category: "Acne Control", price: 450.00, image: "https://picsum.photos/id/204/400/400", isBestSeller: true, mainCategory: "SKIN CARE", subCategory: "Face Wash", rating: 4 },
  { name: "Bhringraj Hair Oil", category: "Hair Growth", price: 650.00, image: "https://picsum.photos/id/206/400/400", isBestSeller: true, mainCategory: "HAIR-CARE", subCategory: "Hair Oils", rating: 5 },
  { name: "Sandalwood Face Pack", category: "Skin Brightening", price: 550.00, image: "https://picsum.photos/id/208/400/400", isBestSeller: true, mainCategory: "SKIN CARE", subCategory: "Face Packs", rating: 4 },
  { name: "Rose Water Toner", category: "Pore Tightening", price: 350.00, image: "https://picsum.photos/id/209/400/400", isBestSeller: true, mainCategory: "SKIN CARE", subCategory: "Toners", rating: 5 },
  { name: "Aloe Vera Gel", category: "Hydrating", price: 300.00, image: "https://picsum.photos/id/210/400/400", isBestSeller: true, mainCategory: "SKIN CARE", subCategory: "Moisturizers", rating: 4 },

  // Offers
  { name: "Hair Strengthening Kit", category: "Hair Wellness", price: 1580, originalPrice: 1880, image: "https://picsum.photos/id/177/400/500", isSoldOut: true, mainCategory: "HAIR-CARE", rating: 4 },
  { name: "Anti Pigmentation Kit", category: "Dark Spots | Pigmentation", price: 1740, originalPrice: 2150, image: "https://picsum.photos/id/129/400/500", mainCategory: "SKIN CARE", rating: 5 },
  { name: "Anti-Ageing Kit", category: "Anti-Ageing / Firming", price: 3180, originalPrice: 3700, image: "https://picsum.photos/id/64/400/500", mainCategory: "SKIN CARE", rating: 3 },
  { name: "Ultimate Hair Wellness", category: "Complete Hair Care", price: 1560, originalPrice: 1950, image: "https://picsum.photos/id/445/400/500", mainCategory: "HAIR-CARE", rating: 4 },
  { name: "Glow Getter Combo", category: "Radiance", price: 1200, originalPrice: 1500, image: "https://picsum.photos/id/446/400/500", mainCategory: "SKIN CARE", rating: 5 },
  { name: "Body Polishing Kit", category: "Body Care", price: 1800, originalPrice: 2200, image: "https://picsum.photos/id/447/400/500", mainCategory: "BODY-CARE", rating: 4 },
  { name: "Daily Essentials", category: "Everyday Care", price: 999, originalPrice: 1200, image: "https://picsum.photos/id/448/400/500", mainCategory: "SKIN CARE", rating: 5 },
  { name: "Travel Mini Kit", category: "Travel Friendly", price: 750, originalPrice: 900, image: "https://picsum.photos/id/449/400/500", mainCategory: "SKIN CARE", rating: 4 },
  
  // Extra
  { name: "Age Defying Advance Face Serum", category: "Skin Care", price: 1300, image: "https://picsum.photos/id/1011/400/500", mainCategory: "SKIN CARE", subCategory: "Serums", rating: 5 },
  { name: "Age Defying Night Cream", category: "Skin Care", price: 1800, image: "https://picsum.photos/id/1012/400/500", mainCategory: "SKIN CARE", subCategory: "Face Creams", rating: 4 },
];

async function seedData() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed Nav Items
  console.log('... Seeding Navigation');
  const navItems = NAV_ITEMS.map((item, index) => ({
    name: item.name,
    has_dropdown: item.hasDropdown,
    sub_items: item.subItems || [],
    order_index: index
  }));
  
  const { error: navError } = await supabase.from('nav_items').insert(navItems);
  if (navError) console.error('Error seeding nav:', navError);

  // 2. Seed Categories
  console.log('... Seeding Categories');
  const { error: catError } = await supabase.from('categories').insert(CATEGORIES);
  if (catError) console.error('Error seeding categories:', catError);

  // 3. Seed Hero Slides
  console.log('... Seeding Hero Slides');
  const slides = HERO_SLIDES.map((slide, index) => ({
    image: slide.image,
    subtitle: slide.subtitle,
    title: slide.title,
    description: slide.description,
    button_text: slide.buttonText,
    order_index: index
  }));
  const { error: heroError } = await supabase.from('hero_slides').insert(slides);
  if (heroError) console.error('Error seeding hero:', heroError);

  // 4. Seed Products
  console.log('... Seeding Products');
  // Add defaults for missing fields
  const products = ALL_PRODUCTS.map(p => ({
    name: p.name,
    category: p.category,
    main_category: p.mainCategory,
    sub_category: p.subCategory,
    price: p.price,
    original_price: p.originalPrice,
    image: p.image,
    rating: p.rating,
    is_sold_out: p.isSoldOut || false,
    is_best_seller: p.isBestSeller || false,
    description: "Experience the purity of nature with this meticulously crafted Ayurvedic formulation.",
    ingredients: "Aqua, Aloe Barbadensis Leaf Extract, Glycerin, Sweet Almond Oil, Saffron Extract."
  }));

  const { error: prodError } = await supabase.from('products').insert(products);
  if (prodError) console.error('Error seeding products:', prodError);

  console.log('✅ Seeding Complete!');
}

seedData();