import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Database } from '../types/supabase';

type ProductRow = Database['public']['Tables']['products']['Row'];

// Helper function to convert Product from camelCase to snake_case for database
export const productToDbFormat = (product: Partial<Product>): any => {
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
  if (product.isFeatured !== undefined) dbProduct.is_featured = product.isFeatured;
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
export const productFromDbFormat = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category || '',
    price: dbProduct.price || 0,
    originalPrice: dbProduct.original_price ? dbProduct.original_price : undefined,
    image: dbProduct.image || '',
    images: dbProduct.images || undefined,
    description: dbProduct.description || undefined,
    ingredients: dbProduct.ingredients || undefined,
    howToUse: dbProduct.how_to_use || undefined,
    isNew: dbProduct.is_new || false,
    isBestSeller: dbProduct.is_best_seller || false,
    isFeatured: dbProduct.is_featured || false,
    isSoldOut: dbProduct.is_sold_out || false,
    rating: dbProduct.rating ? dbProduct.rating : undefined,
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
      authorName: r.user_name,
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
      products: ((data as any) || []).map(productFromDbFormat),
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

  async getByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids);
    
    if (error) throw error;
    return ((data as any) || []).map(productFromDbFormat);
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const dbProduct = productToDbFormat(product);
    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct as any)
      .select()
      .single();
    
    if (error) throw error;
    // Transform from snake_case to camelCase
    return productFromDbFormat(data);
  },

  async update(id: number, updates: Partial<Product>): Promise<Product> {
    // Exclude id from updates and convert to snake_case
    const { id: _, ...updatesWithoutId } = updates;
    const dbUpdates = productToDbFormat(updatesWithoutId);
    
    // Check if we have any fields to update
    if (Object.keys(dbUpdates).length === 0) {
      throw new Error('No fields to update');
    }
    
    // Perform the update and get the updated row
    const { data, error } = await (supabase
      .from('products') as any)
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

  async getByCategory(category: string, subCategory?: string, page: number = 1, limit: number = 20, sort?: string): Promise<{ products: Product[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (category === 'OFFERS') {
       query = query.not('original_price', 'is', null);
    } else if (category !== 'All') {
       query = query.eq('main_category', category);
    }
    
    if (subCategory) {
      query = query.eq('sub_category', subCategory);
    }
    
    // Sorting
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;
    // Transform from snake_case to camelCase
    return {
      products: ((data as any) || []).map(productFromDbFormat),
      total: count || 0
    };
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
      products: ((data as any) || []).map(productFromDbFormat),
      total: count || 0
    };
  },

  async getBestsellers(limit: number = 5): Promise<Product[]> {
    // 1. Try to get manually marked bestsellers first
    const { data: manualBestsellers, error: manualError } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .limit(limit);

    if (!manualError && manualBestsellers && manualBestsellers.length > 0) {
      return manualBestsellers.map(productFromDbFormat);
    }

    // 2. Fallback to sales-based bestsellers if no manual ones found
    const { data, error } = await (supabase as any).rpc('get_bestsellers', { limit_count: limit });
    
    if (error) {
      console.warn('get_bestsellers RPC function error or not found:', error);
      return [];
    }
    
    if (!data) return [];
    return (data as any).map(productFromDbFormat);
  },

  async getFeatured(limit: number = 4): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return (data || []).map(productFromDbFormat);
  }
};
