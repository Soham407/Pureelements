import { supabase } from '../lib/supabase';
import { Order } from '../types';

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
    
    const orders = (data || []) as any[];
    
    // Transform the data to match Order type
    return orders.map(order => ({
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: order.status as Order['status'],
      total: order.total,
      items: (order.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
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
    
    const orderData = data as any;
    
    return {
      id: orderData.id,
      date: new Date(orderData.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: orderData.status as Order['status'],
      total: orderData.total,
      items: (orderData.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }))
    };
  },

  async create(order: {
    user_id: string;
    items: { productId: number; quantity: number }[];
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_pincode: string;
    payment_method: string;
  }): Promise<Order> {
    // Prepare items for RPC
    const rpcItems = order.items.map(item => ({
      product_id: item.productId,
      quantity: item.quantity
    }));

    // Call the secure RPC function
    const { data, error } = await (supabase as any).rpc('create_order', {
      p_user_id: order.user_id,
      p_items: rpcItems,
      p_shipping_address: order.shipping_address,
      p_shipping_city: order.shipping_city,
      p_shipping_state: order.shipping_state,
      p_shipping_pincode: order.shipping_pincode,
      p_payment_method: order.payment_method
    });

    if (error) throw error;
    if (!data) throw new Error('Failed to create order');

    const result = data as any;

    // Return a partial order object (or fetch full if needed, but this is usually enough for UI confirmation)
    return {
      id: result.id,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: result.status,
      total: result.total,
      items: [] // We don't need to return items here for the confirmation page usually, or we can pass them back from args
    } as Order;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const { data, error } = await (supabase
      .from('orders') as any)
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
    
    const orderData = data as any;
    
    return {
      id: orderData.id,
      date: new Date(orderData.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: orderData.status as Order['status'],
      total: orderData.total,
      items: (orderData.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }))
    };
  }
};
