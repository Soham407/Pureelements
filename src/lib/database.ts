import { supabase } from './supabase';
import { Product, Order, User, NavItem, Slide, Category, Review } from '../types';

// ==================== PRODUCTS ====================
// Helper function to convert Product from camelCase to snake_case for database
const productToDbFormat = (product: Partial<Product>): any => {
  const dbProduct: any = {};
  
  // Only include fields that are explicitly set (not undefined)
  // Allow null and empty strings to be passed through for clearing values
  if (product.name !== undefined) dbProduct.name = product.name;
  if (product.category !== undefined) dbProduct.category = product.category;
  if (product.price !== undefined) dbProduct.price = product.price;
  if (product.originalPrice !== undefined) dbProduct.original_price = product.originalPrice;
  if (product.image !== undefined) dbProduct.image = product.image;
  if (product.images !== undefined) dbProduct.images = product.images;
  if (product.description !== undefined) dbProduct.description = product.description;
  if (product.ingredients !== undefined) dbProduct.ingredients = product.ingredients;
  if (product.howToUse !== undefined) dbProduct.how_to_use = product.howToUse;
  if (product.isNew !== undefined) dbProduct.is_new = product.isNew;
  if (product.isBestSeller !== undefined) dbProduct.is_best_seller = product.isBestSeller;
  if (product.isSoldOut !== undefined) dbProduct.is_sold_out = product.isSoldOut;
  if (product.rating !== undefined) dbProduct.rating = product.rating;
  if (product.mainCategory !== undefined) dbProduct.main_category = product.mainCategory;
  if (product.subCategory !== undefined) dbProduct.sub_category = product.subCategory;
  if (product.marketingImages !== undefined) dbProduct.marketing_images = product.marketingImages;
  if (product.size !== undefined) dbProduct.size = product.size;
  if (product.fullDescription !== undefined) dbProduct.full_description = product.fullDescription;
  if (product.legalInfo !== undefined) dbProduct.legal_info = product.legalInfo;
  
  return dbProduct;
};

// Helper function to convert Product from snake_case (database) to camelCase (frontend)
const productFromDbFormat = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category || '',
    price: parseFloat(dbProduct.price) || 0,
    originalPrice: dbProduct.original_price ? parseFloat(dbProduct.original_price) : undefined,
    image: dbProduct.image || '',
    images: dbProduct.images || undefined,
    description: dbProduct.description || undefined,
    ingredients: dbProduct.ingredients || undefined,
    howToUse: dbProduct.how_to_use || undefined,
    isNew: dbProduct.is_new || false,
    isBestSeller: dbProduct.is_best_seller || false,
    isSoldOut: dbProduct.is_sold_out || false,
    rating: dbProduct.rating ? parseFloat(dbProduct.rating) : undefined,
    mainCategory: dbProduct.main_category || undefined,
    subCategory: dbProduct.sub_category || undefined,
    marketingImages: dbProduct.marketing_images || undefined,
    size: dbProduct.size || undefined,
    fullDescription: dbProduct.full_description || undefined,
    legalInfo: dbProduct.legal_info || undefined,
    reviews: dbProduct.reviews ? dbProduct.reviews.map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id,
      rating: r.rating,
      comment: r.comment,
      authorName: r.author_name,
      isVerified: r.is_verified,
      createdAt: r.created_at
    })) : undefined,
  };
};

export const productsService = {
  async getAll(page: number = 1, limit: number = 20): Promise<{ products: Product[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Get paginated data
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    // Transform from snake_case to camelCase
    return {
      products: (data || []).map(productFromDbFormat),
      total: count || 0
    };
  },

  async getById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        reviews (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    // Transform from snake_case to camelCase
    return productFromDbFormat(data);
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const dbProduct = productToDbFormat(product);
    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct)
      .select()
      .single();
    
    if (error) throw error;
    // Transform from snake_case to camelCase
    return productFromDbFormat(data);
  },

  async update(id: number, updates: Partial<Product>): Promise<Product> {
    // Exclude id from updates and convert to snake_case
    const { id: _, ...updatesWithoutId } = updates as any;
    const dbUpdates = productToDbFormat(updatesWithoutId);
    
    // Check if we have any fields to update
    if (Object.keys(dbUpdates).length === 0) {
      throw new Error('No fields to update');
    }
    
    // Perform the update and get the updated row
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Database update error:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Product with id ${id} not found or update failed`);
    }
    
    // Transform from snake_case to camelCase
    return productFromDbFormat(data);
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getByCategory(category: string, subCategory?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('main_category', category);
    
    if (subCategory) {
      query = query.eq('sub_category', subCategory);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    // Transform from snake_case to camelCase
    return (data || []).map(productFromDbFormat);
  },

  async search(query: string, page: number = 1, limit: number = 20): Promise<{ products: Product[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
    
    if (countError) throw countError;
    
    // Get paginated search results
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    // Transform from snake_case to camelCase
    return {
      products: (data || []).map(productFromDbFormat),
      total: count || 0
    };
  },

  async getBestsellers(limit: number = 5): Promise<Product[]> {
    // Call Supabase RPC function for bestsellers
    // If the function doesn't exist yet, fall back to client-side calculation
    const { data, error } = await supabase.rpc('get_bestsellers', { limit_count: limit });
    
    if (error) {
      // If RPC function doesn't exist, return empty array (will be handled by fallback)
      console.warn('get_bestsellers RPC function not found. Please create it in Supabase.', error);
      return [];
    }
    
    if (!data) return [];
    // Transform from snake_case to camelCase
    return data.map(productFromDbFormat);
  }
};

// ==================== ORDERS ====================
export const ordersService = {
  async getAll(userId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_id,
          product_name,
          quantity,
          price,
          image
        )
      `)
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Transform the data to match Order type
    return (data || []).map(order => ({
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: order.status,
      total: parseFloat(order.total),
      items: (order.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        image: item.image
      }))
    }));
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_id,
          product_name,
          quantity,
          price,
          image
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      date: new Date(data.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: data.status,
      total: parseFloat(data.total),
      items: (data.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        image: item.image
      }))
    };
  },

  async create(order: {
    user_id: string;
    total: number;
    status: Order['status'];
    items: Order['items'];
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_pincode: string;
    payment_method: string;
  }): Promise<Order> {
    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_pincode: order.shipping_pincode,
        payment_method: order.payment_method
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return {
      id: orderData.id,
      date: new Date(orderData.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: orderData.status,
      total: parseFloat(orderData.total),
      items: order.items
    };
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        order_items (
          product_id,
          product_name,
          quantity,
          price,
          image
        )
      `)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      date: new Date(data.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: data.status,
      total: parseFloat(data.total),
      items: (data.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        image: item.image
      }))
    };
  }
};

// ==================== NAV ITEMS ====================
export const navItemsService = {
  async getAll(): Promise<NavItem[]> {
    const { data, error } = await supabase
      .from('nav_items')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    // Transform snake_case from Supabase to camelCase for TypeScript
    return (data || []).map((item: any) => ({
      name: item.name,
      hasDropdown: item.has_dropdown || false,
      subItems: item.sub_items || []
    }));
  },

  async updateAll(items: NavItem[]): Promise<NavItem[]> {
    // Delete all existing
    await supabase.from('nav_items').delete().neq('id', 0);
    
    // Transform camelCase to snake_case for Supabase
    const itemsWithOrder = items.map((item, index) => ({
      name: item.name,
      has_dropdown: item.hasDropdown,
      sub_items: item.subItems || [],
      order_index: index
    }));
    
    const { data, error } = await supabase
      .from('nav_items')
      .insert(itemsWithOrder)
      .select();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return (data || []).map((item: any) => ({
      name: item.name,
      hasDropdown: item.has_dropdown || false,
      subItems: item.sub_items || []
    }));
  }
};

// ==================== HERO SLIDES ====================
export const heroSlidesService = {
  async getAll(): Promise<Slide[]> {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async updateAll(slides: Slide[]): Promise<Slide[]> {
    // Delete all existing
    await supabase.from('hero_slides').delete().neq('id', 0);
    
    // Insert new ones
    const slidesWithOrder = slides.map((slide, index) => ({
      ...slide,
      order_index: index
    }));
    
    const { data, error } = await supabase
      .from('hero_slides')
      .insert(slidesWithOrder)
      .select();
    
    if (error) throw error;
    return data || [];
  }
};

// ==================== CATEGORIES ====================
export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
};

// ==================== CART ====================
export const cartService = {
  async getCart(userId: string): Promise<Array<{ product: Product; quantity: number }>> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        products (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      product: item.products as Product,
      quantity: item.quantity
    }));
  },

  async addToCart(userId: string, productId: number, quantity: number): Promise<void> {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    
    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      
      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity
        });
      
      if (error) throw error;
    }
  },

  async updateQuantity(userId: string, productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(userId, productId);
      return;
    }
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  async removeFromCart(userId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// ==================== WISHLIST ====================
export const wishlistService = {
  async getWishlist(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        products (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data || []).map(item => item.products as Product);
  },

  async addToWishlist(userId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId
      });
    
    if (error) throw error;
  },

  async removeFromWishlist(userId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
  }
};

