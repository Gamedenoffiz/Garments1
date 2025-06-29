import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Product {
  id: string
  name: string
  description: string | null
  category_id: string | null
  subcategory: string | null
  price: number
  original_price: number | null
  sku: string | null
  slug: string
  is_active: boolean
  is_hot_sale: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
  category?: {
    name: string
    slug: string
  }
  images: Array<{
    id: string
    image_url: string
    alt_text: string | null
    is_primary: boolean
    sort_order: number
  }>
  variants: Array<{
    id: string
    size: string | null
    color_name: string | null
    color_code: string | null
    stock_quantity: number
    price_adjustment: number
    is_active: boolean
  }>
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching product:', err)
      return null
    }
  }

  const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('category.slug', categorySlug)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching products by category:', err)
      return []
    }
  }

  const getHotSaleProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('is_hot_sale', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching hot sale products:', err)
      return []
    }
  }

  const getAllProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching all products:', err)
      return []
    }
  }

  const getRelatedProducts = async (categoryId: string, excludeProductId: string, limit: number = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('category_id', categoryId)
        .neq('id', excludeProductId)
        .eq('is_active', true)
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching related products:', err)
      return []
    }
  }

  const getRecommendedProducts = async (limit: number = 6): Promise<Product[]> => {
    try {
      // Get a mix of hot sale and popular products for recommendations
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .or('is_hot_sale.eq.true,rating.gte.4')
        .limit(limit)
        .order('rating', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching recommended products:', err)
      return []
    }
  }

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching product by id:', err)
      return null
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getProductBySlug,
    getProductsByCategory,
    getHotSaleProducts,
    getAllProducts,
    getRelatedProducts,
    getRecommendedProducts,
    getProductById
  }
}