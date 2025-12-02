export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          description: string | null
          category: string
          image: string
          created_at: string
          full_description: string | null
          images: string[] | null
          stock: number
          features: string[] | null
          ingredients: string[] | null
          benefits: string[] | null
          original_price: number | null
          how_to_use: string | null
          is_new: boolean
          is_best_seller: boolean
          is_sold_out: boolean
          rating: number | null
          main_category: string | null
          sub_category: string | null
          marketing_images: string[] | null
          size: string | null
          legal_info: string | null
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          category: string
          image: string
          created_at?: string
          full_description?: string | null
          images?: string[] | null
          stock?: number
          features?: string[] | null
          ingredients?: string[] | null
          benefits?: string[] | null
          original_price?: number | null
          how_to_use?: string | null
          is_new?: boolean
          is_best_seller?: boolean
          is_sold_out?: boolean
          rating?: number | null
          main_category?: string | null
          sub_category?: string | null
          marketing_images?: string[] | null
          size?: string | null
          legal_info?: string | null
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          category?: string
          image?: string
          created_at?: string
          full_description?: string | null
          images?: string[] | null
          stock?: number
          features?: string[] | null
          ingredients?: string[] | null
          benefits?: string[] | null
          original_price?: number | null
          how_to_use?: string | null
          is_new?: boolean
          is_best_seller?: boolean
          is_sold_out?: boolean
          rating?: number | null
          main_category?: string | null
          sub_category?: string | null
          marketing_images?: string[] | null
          size?: string | null
          legal_info?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total: number
          status: string
          created_at: string
          shipping_address: string | null
          shipping_city: string | null
          shipping_state: string | null
          shipping_pincode: string | null
          payment_method: string | null
        }
        Insert: {
          id?: string
          user_id: string
          total: number
          status: string
          created_at?: string
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_pincode?: string | null
          payment_method?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          total?: number
          status?: string
          created_at?: string
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_pincode?: string | null
          payment_method?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: number
          order_id: string
          product_id: number
          quantity: number
          price: number
          product_name: string
          image: string
        }
        Insert: {
          id?: number
          order_id: string
          product_id: number
          quantity: number
          price: number
          product_name: string
          image: string
        }
        Update: {
          id?: number
          order_id?: string
          product_id?: number
          quantity?: number
          price?: number
          product_name?: string
          image?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      nav_items: {
        Row: {
          id: number
          name: string
          has_dropdown: boolean
          sub_items: string[] | null
          order_index: number
        }
        Insert: {
          id?: number
          name: string
          has_dropdown?: boolean
          sub_items?: string[] | null
          order_index?: number
        }
        Update: {
          id?: number
          name?: string
          has_dropdown?: boolean
          sub_items?: string[] | null
          order_index?: number
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          id: number
          image: string
          title: string
          subtitle: string
          description: string
          buttonText: string
          order_index: number
        }
        Insert: {
          id?: number
          image: string
          title: string
          subtitle: string
          description: string
          buttonText: string
          order_index?: number
        }
        Update: {
          id?: number
          image?: string
          title?: string
          subtitle?: string
          description?: string
          buttonText?: string
          order_index?: number
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          quantity?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      wishlist_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          pincode: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          pincode: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          pincode?: string
          is_default?: boolean
          created_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          created_at: string
        }
        Insert: {
          email: string
          created_at?: string
        }
        Update: {
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          product_id: number
          user_id: string
          rating: number
          comment: string
          created_at: string
          user_name: string
        }
        Insert: {
          id?: string
          product_id: number
          user_id: string
          rating: number
          comment: string
          created_at?: string
          user_name: string
        }
        Update: {
          id?: string
          product_id?: number
          user_id?: string
          rating?: number
          comment?: string
          created_at?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_: string]: {
        Row: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Functions: {
      get_bestsellers: {
        Args: {
          limit_count: number
        }
        Returns: {
          id: number
          name: string
          price: number
          description: string | null
          category: string
          image: string
          created_at: string
          full_description: string | null
          images: string[] | null
          stock: number
          features: string[] | null
          ingredients: string[] | null
          benefits: string[] | null
          original_price: number | null
          how_to_use: string | null
          is_new: boolean
          is_best_seller: boolean
          is_sold_out: boolean
          rating: number | null
          main_category: string | null
          sub_category: string | null
          marketing_images: string[] | null
          size: string | null
          legal_info: string | null
        }[]
      }
    }
    Enums: {
      [_: string]: never
    }
    CompositeTypes: {
      [_: string]: never
    }
  }
}
