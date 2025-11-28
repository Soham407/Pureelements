
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  ingredients?: string;
  howToUse?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSoldOut?: boolean;
  rating?: number;
  mainCategory?: string;
  subCategory?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  thumbnail: string;
  videoUrl?: string;
  platform: 'YouTube' | 'Instagram';
}

export interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
}

export interface NavItem {
  name: string;
  hasDropdown: boolean;
  subItems?: string[];
}
