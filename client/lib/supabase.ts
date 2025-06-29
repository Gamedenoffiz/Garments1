import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          price: number
          original_price: number | null
          sku: string | null
          slug: string
          is_active: boolean
          is_hot_sale: boolean
          rating: number
          review_count: number
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id?: string | null
          price: number
          original_price?: number | null
          sku?: string | null
          slug: string
          is_active?: boolean
          is_hot_sale?: boolean
          rating?: number
          review_count?: number
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          price?: number
          original_price?: number | null
          sku?: string | null
          slug?: string
          is_active?: boolean
          is_hot_sale?: boolean
          rating?: number
          review_count?: number
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color_name: string | null
          color_code: string | null
          sku: string | null
          stock_quantity: number
          price_adjustment: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size?: string | null
          color_name?: string | null
          color_code?: string | null
          sku?: string | null
          stock_quantity?: number
          price_adjustment?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string | null
          color_name?: string | null
          color_code?: string | null
          sku?: string | null
          stock_quantity?: number
          price_adjustment?: number
          is_active?: boolean
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          currency: string
          payment_method: 'razorpay' | 'cod' | 'upi' | 'card' | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address: any | null
          billing_address: any | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          currency?: string
          payment_method?: 'razorpay' | 'cod' | 'upi' | 'card' | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address?: any | null
          billing_address?: any | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          currency?: string
          payment_method?: 'razorpay' | 'cod' | 'upi' | 'card' | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address?: any | null
          billing_address?: any | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}