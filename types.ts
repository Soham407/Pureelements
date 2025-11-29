
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
  marketingImages?: string[];
  size?: string;
  fullDescription?: string;
  legalInfo?: {
    genericName?: string;
    usp?: string;
    bestBefore?: string;
    manufacturedBy?: string;
    mfgLicNo?: string;
    countryOfOrigin?: string;
  };
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

export interface Slide {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'UPI' | 'CARD' | 'COD';
}