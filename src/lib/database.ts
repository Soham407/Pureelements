import { supabase } from './supabase';
import { Database } from '../types/supabase';
import { Product, Order, User, NavItem, Slide, Category, Review, Address, ContentBlock, ProductVariant } from '../types';
import { productsService, productFromDbFormat, productToDbFormat } from '../services/products.service';
import { ordersService } from '../services/orders.service';

export { productsService, ordersService };

// ==================== NAV ITEMS ====================
export const navItemsService = {
  async getAll(): Promise<NavItem[]> {
    const { data, error } = await supabase
      .from('nav_items')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    // Transform snake_case from Supabase to camelCase for TypeScript
    return ((data as any) || []).map((item: any) => ({
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
      .insert(itemsWithOrder as any)
      .select();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return ((data as any) || []).map((item: any) => ({
      name: item.name,
      hasDropdown: item.has_dropdown || false,
      subItems: item.sub_items || []
    }));
  }
};

// ... (existing code for other services) ...



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
      .insert(slidesWithOrder as any)
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
  },

  async update(id: number, updates: Partial<Category>): Promise<Category> {
    const { id: _, ...safeUpdates } = updates;
    const { data, error } = await (supabase
      .from('categories') as any)
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAll(categories: Category[]): Promise<Category[]> {
    // Update each category individually
    const updatedCategories: Category[] = [];
    for (const category of categories) {
      const { id, ...updates } = category;
      if (id) {
        const updated = await this.update(id, updates);
        updatedCategories.push(updated);
      }
    }
    return updatedCategories;
  }
};

// ==================== CART ====================
export const cartService = {
  async getCart(userId: string): Promise<Array<{ product: Product; quantity: number; variant?: ProductVariant }>> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        variant_id,
        products (*),
        variant:product_variants (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const cartItems = (data || []) as any[];

    return cartItems.map(item => ({
      product: productFromDbFormat(item.products),
      quantity: item.quantity,
      variant: item.variant ? {
        id: item.variant.id,
        productId: item.variant.product_id,
        size: item.variant.size,
        price: item.variant.price,
        stock: item.variant.stock,
        sku: item.variant.sku,
        isDefault: item.variant.is_default
      } : undefined
    }));
  },

  async addToCart(userId: string, productId: number, quantity: number, variantId?: number): Promise<void> {
    // Check if item already exists
    let query = supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (variantId) {
      query = query.eq('variant_id', variantId);
    } else {
      query = query.is('variant_id', null);
    }

    const { data: existing } = await query.single();
    
    if (existing) {
      // Update quantity
      const { error } = await (supabase
        .from('cart_items') as any)
        .update({ quantity: (existing as any).quantity + quantity })
        .eq('id', (existing as any).id);
      
      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          variant_id: variantId
        } as any);
      
      if (error) throw error;
    }
  },

  async updateQuantity(userId: string, productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(userId, productId);
      return;
    }
    
    const { error } = await (supabase
      .from('cart_items') as any)
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
    const wishlistItems = (data || []) as any[];
    return wishlistItems.map(item => productFromDbFormat(item.products));
  },

  async addToWishlist(userId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId
      } as any);
    
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


// ==================== ADDRESSES ====================
export const addressesService = {
  async getAll(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false }) // Default first
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return ((data as any) || []).map((addr: any) => ({
      id: addr.id,
      userId: addr.user_id,
      fullName: addr.full_name,
      phone: addr.phone,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.is_default
    }));
  },

  async create(address: Omit<Address, 'id'>): Promise<Address> {
    // If setting as default, unset others first
    if (address.isDefault) {
      await this.unsetDefault(address.userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: address.userId,
        full_name: address.fullName,
        phone: address.phone,
        address_line1: address.addressLine1,
        address_line2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        is_default: address.isDefault
      } as any)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create address');

    const safeData = data as any;

    return {
      id: safeData.id,
      userId: safeData.user_id,
      fullName: safeData.full_name,
      phone: safeData.phone,
      addressLine1: safeData.address_line1,
      addressLine2: safeData.address_line2,
      city: safeData.city,
      state: safeData.state,
      pincode: safeData.pincode,
      isDefault: safeData.is_default
    };
  },

  async update(id: string, updates: Partial<Address>): Promise<Address> {
    // If setting as default, unset others first
    if (updates.isDefault && updates.userId) {
      await this.unsetDefault(updates.userId);
    }

    const dbUpdates: any = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.addressLine1 !== undefined) dbUpdates.address_line1 = updates.addressLine1;
    if (updates.addressLine2 !== undefined) dbUpdates.address_line2 = updates.addressLine2;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.pincode !== undefined) dbUpdates.pincode = updates.pincode;
    if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault;

    const { data, error } = await (supabase
      .from('addresses') as any)
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update address');

    const safeData = data as any;

    return {
      id: safeData.id,
      userId: safeData.user_id,
      fullName: safeData.full_name,
      phone: safeData.phone,
      addressLine1: safeData.address_line1,
      addressLine2: safeData.address_line2,
      city: safeData.city,
      state: safeData.state,
      pincode: safeData.pincode,
      isDefault: safeData.is_default
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async unsetDefault(userId: string): Promise<void> {
    const { error } = await (supabase
      .from('addresses') as any)
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// ==================== NEWSLETTER ====================
export const newsletterService = {
  async subscribe(email: string): Promise<void> {
    const { error } = await supabase
      .from('subscribers')
      .insert({ email } as any);
    
    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('You are already subscribed!');
      }
      throw error;
    }
  }
};

// ==================== CONTENT MANAGEMENT ====================
export const contentService = {
  async getBlock(sectionName: string): Promise<any> {
    const { data, error } = await (supabase
      .from('content_blocks' as any) as any)
      .select('content')
      .eq('section_name', sectionName)
      .single();
    
    if (error) {
      // Return null instead of throwing if block doesn't exist yet
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data?.content;
  },

  async getAllBlocks(): Promise<ContentBlock[]> {
    const { data, error } = await (supabase
      .from('content_blocks' as any) as any)
      .select('*')
      
    if (error) throw error;
    return (data as any) || [];
  },

  async updateBlock(sectionName: string, content: any): Promise<void> {
    // Check if exists
    const { data: existing } = await (supabase
      .from('content_blocks' as any) as any)
      .select('id')
      .eq('section_name', sectionName)
      .single();

    if (existing) {
       const { error } = await (supabase
        .from('content_blocks' as any) as any)
        .update({ content, updated_at: new Date().toISOString() })
        .eq('section_name', sectionName);
       if (error) throw error;
    } else {
       const { error } = await (supabase
        .from('content_blocks' as any) as any)
        .insert({ section_name: sectionName, content } as any);
       if (error) throw error;
    }
  }
};
