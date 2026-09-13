import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../api/cart'

const CartContext = createContext(null)

// Default to user_id = 1. Backend uses User FK; ensure this user exists via Django admin or shell.
// We store chosen userId in localStorage so frontend persists across reloads.
const DEFAULT_USER_ID = Number(localStorage.getItem('userId')) || 1

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(DEFAULT_USER_ID)
  const [cart, setCart] = useState(null) // shape: {id, user, created_at, items: [], total_price}
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Keep localStorage in sync when userId changes
  useEffect(() => {
    localStorage.setItem('userId', String(userId))
  }, [userId])

  const fetchCart = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await cartApi.getCart(userId)
      setCart(data)
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to fetch cart'
      setError(msg)
      // If cart not found (e.g. user not exists) keep null
      console.error(msg)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId) => {
    try {
      await cartApi.addToCart(userId, productId)
      await fetchCart()
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      return { success: false, error: msg }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      await cartApi.removeFromCart(userId, itemId)
      await fetchCart()
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      return { success: false, error: msg }
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clearCart(userId)
      await fetchCart()
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      return { success: false, error: msg }
    }
  }

  const cartCount = cart?.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) ?? 0
  const cartTotal = cart?.total_price ?? '0.00'

  return (
    <CartContext.Provider
      value={{
        userId,
        setUserId,
        cart,
        cartCount,
        cartTotal,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
