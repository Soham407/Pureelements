
import { Category, Product, Testimonial, Store, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { name: 'ABOUT US', hasDropdown: false },
  { 
    name: 'SKIN CARE', 
    hasDropdown: true,
    subItems: ['Face Wash', 'Face Creams', 'Serums', 'Sunscreen', 'Face Packs']
  },
  { 
    name: 'HAIR-CARE', 
    hasDropdown: true, 
    subItems: ['Hair Conditioners & Masks', 'Hair Gels', 'Hair Oils', 'Shampoos']
  },
  { 
    name: 'BODY-CARE', 
    hasDropdown: true,
    subItems: ['Body Wash', 'Body Lotions', 'Soaps', 'Scrubs']
  },
  { name: 'MENS CARE', hasDropdown: false },
  { 
    name: 'KIDS-CARE', 
    hasDropdown: true,
    subItems: ['Baby Wash', 'Baby Lotion', 'Baby Oil']
  },
  { name: 'GIFTING', hasDropdown: false },
  { name: 'OFFERS', hasDropdown: false },
  { name: 'REGIMES', hasDropdown: false },
  { 
    name: 'WELLNESS', 
    hasDropdown: true,
    subItems: ['Essential Oils', 'Diffusers', 'Incense Sticks']
  },
  { 
    name: 'PERFUMES', 
    hasDropdown: true,
    subItems: ['For Him', 'For Her', 'Unisex', 'Solid Perfumes']
  },
  { name: 'STORES', hasDropdown: false },
];

export const CATEGORIES: Category[] = [
  { id: 1, name: "Skin Care", image: "https://picsum.photos/id/1011/200/200" },
  { id: 2, name: "Hair Care", image: "https://picsum.photos/id/1027/200/200" },
  { id: 3, name: "Body Care", image: "https://picsum.photos/id/1059/200/200" },
  { id: 4, name: "Men's Care", image: "https://picsum.photos/id/1005/200/200" },
  { id: 5, name: "Wellness", image: "https://picsum.photos/id/1062/200/200" },
  { id: 6, name: "Kids Care", image: "https://picsum.photos/id/1069/200/200" },
  { id: 7, name: "Gifting Collection", image: "https://picsum.photos/id/1070/200/200" },
  { id: 8, name: "Luxury Perfumes", image: "https://picsum.photos/id/1080/200/200" },
];

const DEFAULT_DESCRIPTION = "Experience the purity of nature with this meticulously crafted Ayurvedic formulation. Enriched with potent herbs and natural extracts, it provides deep nourishment and rejuvenates your skin from within. Free from harmful chemicals, parabens, and sulfates.";
const DEFAULT_INGREDIENTS = "Aqua, Aloe Barbadensis Leaf Extract, Glycerin, Sweet Almond Oil, Saffron Extract, Vitamin E, Essential Oils.";
const DEFAULT_HOW_TO_USE = "Take a small amount and apply gently on the affected area. Massage in circular motions until fully absorbed. Use daily for best results.";

export const FEATURED_PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "Tea Tree Body Wash for MEN", 
    category: "Body Wash", 
    price: 400, 
    image: "https://picsum.photos/id/10/400/500", 
    images: ["https://picsum.photos/id/10/800/800", "https://picsum.photos/id/11/800/800", "https://picsum.photos/id/12/800/800"],
    mainCategory: "MENS CARE", 
    subCategory: "Body Wash", 
    rating: 4,
    description: "A refreshing body wash designed specifically for men's skin. The antibacterial properties of Tea Tree oil help cleanse deep impurities while keeping the skin hydrated.",
    ingredients: "Tea Tree Oil, Neem Extract, Aloe Vera, Glycerin, Aqua.",
    howToUse: "Apply on wet skin, lather well and rinse thoroughly."
  },
  { 
    id: 2, 
    name: "Pure Fragrances For Him", 
    category: "Perfumes", 
    price: 1180, 
    image: "https://picsum.photos/id/1070/800/800", 
    images: ["https://picsum.photos/id/1070/800/800", "https://picsum.photos/id/1071/800/800", "https://picsum.photos/id/1072/800/800"],
    mainCategory: "PERFUMES", 
    subCategory: "For Him", 
    rating: 5,
    description: "A luxurious 5 Eue De Parfums combination for Him! Includes Bairagi, Des, Sarang, Malhar, and Aalap scents.",
    ingredients: "Beeswax, Shea Butter, Essential Oils, Vitamin E.",
    howToUse: "Rub a small amount on pulse points like wrists and neck."
  },
  { 
    id: 3, 
    name: "Natural Incense Sticks", 
    category: "Wellness", 
    price: 160, 
    image: "https://picsum.photos/id/30/400/500", 
    mainCategory: "WELLNESS", 
    subCategory: "Incense Sticks", 
    rating: 3,
    description: DEFAULT_DESCRIPTION,
    ingredients: DEFAULT_INGREDIENTS,
    howToUse: "Light the tip of the incense stick, blow out the flame and place in a holder."
  },
  { 
    id: 4, 
    name: "Exotic Chocolate Creamy Bath Gel", 
    category: "Body Wash", 
    price: 550, 
    image: "https://picsum.photos/id/40/400/500", 
    mainCategory: "BODY-CARE", 
    subCategory: "Body Wash", 
    rating: 4,
    description: "Indulge in the rich aroma of exotic chocolate. This creamy bath gel leaves your skin soft, supple, and smelling delicious.",
    ingredients: "Cocoa Butter, Vanilla Extract, Aloe Vera, Aqua.",
    howToUse: "Pour onto a loofah or palm, lather over body and rinse off."
  },
];

export const CONCERNS = [
  { title: "Anti Aging", image: "https://picsum.photos/id/64/400/400" },
  { title: "Skin Brightening", image: "https://picsum.photos/id/91/400/400" },
  { title: "Anti Pigmentation", image: "https://picsum.photos/id/129/400/400" },
  { title: "Hair Strengthening", image: "https://picsum.photos/id/177/400/400" },
];

export const BESTSELLERS: Product[] = [
  { id: 101, name: "Oudh & White Rose Luxury Bath Bar", category: "Luxury Ayurvedic Soap | 100 % VEGAN | Paraben Free", price: 250.00, originalPrice: 640.00, image: "https://picsum.photos/id/201/400/400", isBestSeller: true, mainCategory: "BODY-CARE", subCategory: "Soaps", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 102, name: "Combo Offer- Kumkumadi Saundarya Face Oil (Pack of 2)", category: "Skin Lightening | Moisturising | Anti-Blemish", price: 2380.00, originalPrice: 3000.00, image: "https://picsum.photos/id/202/400/400", isBestSeller: true, mainCategory: "SKIN CARE", subCategory: "Serums", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 103, name: "Aalaap Signature Unisex Perfume", category: "Signature Unisex Perfume", price: 1290.00, image: "https://picsum.photos/id/203/400/400", isBestSeller: true, mainCategory: "PERFUMES", subCategory: "Unisex", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
];

export const OFFER_PRODUCTS: Product[] = [
  { id: 201, name: "Hair Strengthening", category: "₹1,880.00 ₹1,580.00", price: 1580, originalPrice: 1880, image: "https://picsum.photos/id/177/400/500", isSoldOut: true, mainCategory: "HAIR-CARE", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 202, name: "Anti Pigmentation", category: "Dark Spots | Pigmentation", price: 1740, originalPrice: 2150, image: "https://picsum.photos/id/129/400/500", mainCategory: "SKIN CARE", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 203, name: "Anti-Ageing / Post 40 Skin Care", category: "Anti-Ageing / Firming", price: 3180, originalPrice: 3700, image: "https://picsum.photos/id/64/400/500", mainCategory: "SKIN CARE", rating: 3, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 204, name: "Ultimate Hair Wellness Kit", category: "Hair Wellness", price: 1560, originalPrice: 1950, image: "https://picsum.photos/id/445/400/500", mainCategory: "HAIR-CARE", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Customer Review- Pure Elements", thumbnail: "https://picsum.photos/id/338/300/500", platform: "YouTube" },
  { id: 2, name: "Customer Review- Pure Elements", thumbnail: "https://picsum.photos/id/342/300/500", platform: "YouTube" },
  { id: 3, name: "Customer Review- Pure Elements", thumbnail: "https://picsum.photos/id/349/300/500", platform: "YouTube" },
  { id: 4, name: "Customer Review - Pure Elements", thumbnail: "https://picsum.photos/id/355/300/500", platform: "YouTube" },
];

export const STORES: Store[] = [
  { id: 1, name: "Westend Mall, Aundh, Pune", image: "https://picsum.photos/id/401/400/300", location: "Pune" },
  { id: 2, name: "Wakad- Phoenix Mall Of Millennium", image: "https://picsum.photos/id/402/400/300", location: "Pune" },
  { id: 3, name: "Viman Nagar, Pune", image: "https://picsum.photos/id/403/400/300", location: "Pune" },
  { id: 4, name: "Mahabaleshwar Main Market", image: "https://picsum.photos/id/404/400/300", location: "Mahabaleshwar" },
  { id: 5, name: "The Pavillion Mall, Shivajinagar", image: "https://picsum.photos/id/405/400/300", location: "Pune" },
];

// Combine all for listing + generate extra dummies for filtering demonstration
export const ALL_PRODUCTS: Product[] = [
  ...FEATURED_PRODUCTS,
  ...BESTSELLERS,
  ...OFFER_PRODUCTS,
  { id: 301, name: "Age Defying Advance Face Serum", category: "Skin Care", price: 1300, image: "https://picsum.photos/id/1011/400/500", mainCategory: "SKIN CARE", subCategory: "Serums", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 302, name: "Age Defying Night Cream", category: "Skin Care", price: 1800, image: "https://picsum.photos/id/1012/400/500", mainCategory: "SKIN CARE", subCategory: "Face Creams", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 303, name: "Almond Cocoa Lip Butter", category: "Lip Care", price: 270, image: "https://picsum.photos/id/1013/400/500", mainCategory: "SKIN CARE", subCategory: "Lip Care", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 304, name: "Aloe Turmeric Face Cleanser", category: "Face Wash", price: 450, image: "https://picsum.photos/id/1014/400/500", mainCategory: "SKIN CARE", subCategory: "Face Wash", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 305, name: "Kumkumadi Face Cleanser", category: "Face Wash", price: 550, image: "https://picsum.photos/id/1015/400/500", mainCategory: "SKIN CARE", subCategory: "Face Wash", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 306, name: "Clear Skin Anti Pigmentation Serum", category: "Serums", price: 950, image: "https://picsum.photos/id/1016/400/500", mainCategory: "SKIN CARE", subCategory: "Serums", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 307, name: "Green Clay Teatree Deep Cleansing", category: "Face Wash", price: 400, image: "https://picsum.photos/id/1018/400/500", mainCategory: "MENS CARE", subCategory: "Face Wash", rating: 3, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 308, name: "Hair Conditioner & Mask", category: "Hair Care", price: 500, image: "https://picsum.photos/id/1020/400/500", mainCategory: "HAIR-CARE", subCategory: "Hair Conditioners & Masks", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 309, name: "Anti Dandruff Shampoo", category: "Hair Care", price: 450, image: "https://picsum.photos/id/1021/400/500", mainCategory: "HAIR-CARE", subCategory: "Shampoos", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 310, name: "Hair Growth Oil", category: "Hair Care", price: 650, image: "https://picsum.photos/id/1022/400/500", mainCategory: "HAIR-CARE", subCategory: "Hair Oils", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 311, name: "Rose Body Lotion", category: "Body Care", price: 550, image: "https://picsum.photos/id/1023/400/500", mainCategory: "BODY-CARE", subCategory: "Body Lotions", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 312, name: "Coffee Body Scrub", category: "Body Care", price: 450, image: "https://picsum.photos/id/1024/400/500", mainCategory: "BODY-CARE", subCategory: "Scrubs", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 313, name: "Baby Massage Oil", category: "Kids Care", price: 350, image: "https://picsum.photos/id/1025/400/500", mainCategory: "KIDS-CARE", subCategory: "Baby Oil", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 314, name: "Lavender Essential Oil", category: "Wellness", price: 400, image: "https://picsum.photos/id/1026/400/500", mainCategory: "WELLNESS", subCategory: "Essential Oils", rating: 4, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
  { id: 315, name: "Oudh Perfume", category: "Perfumes", price: 1500, image: "https://picsum.photos/id/1027/400/500", mainCategory: "PERFUMES", subCategory: "Unisex", rating: 5, description: DEFAULT_DESCRIPTION, ingredients: DEFAULT_INGREDIENTS, howToUse: DEFAULT_HOW_TO_USE },
];
