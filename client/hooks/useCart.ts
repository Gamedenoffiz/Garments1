import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  updated_at: string
  product: {
    id: string
    name: string
    price: number
    slug: string
    images: Array<{
      image_url: string
      is_primary: boolean
    }>
  }
  variant?: {
    id: string
    size: string | null
    color_name: string | null
    color_code: string | null
    stock_quantity: number
  }
}

export function useCart() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([])
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            id,
            name,
            price,
            slug,
            images:product_images(image_url, is_primary)
          ),
          variant:product_variants(
            id,
            size,
            color_name,
            color_code,
            stock_quantity
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCartItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, variantId?: string, quantity: number = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart')
    }

    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('variant_id', variantId || null)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            variant_id: variantId || null,
            quantity
          })

        if (error) throw error
      }

      await fetchCartItems()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add item to cart')
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId)
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update quantity')
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove item')
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
      setCartItems([])
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to clear cart')
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  useEffect(() => {
    fetchCartItems()
  }, [user])

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    refetch: fetchCartItems
  }
}