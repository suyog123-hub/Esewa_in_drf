import apiClient from './client'

// Mirrors esewa_app/views.py -> CartDetailAPIView, AddToCartAPIView, RemoveFromCartAPIView, CartClearAPIView
export const cartApi = {
  // GET /cart/view/<user_id>/
  getCart: async (userId) => {
    const { data } = await apiClient.get(`/cart/view/${userId}/`)
    return data
  },

  // POST /cart/add/<user_id>/  body: {product_id}
  addToCart: async (userId, productId) => {
    const { data } = await apiClient.post(`/cart/add/${userId}/`, {
      product_id: productId,
    })
    return data
  },

  // POST /cart/remove/<user_id>/  body: {item_id}
  removeFromCart: async (userId, itemId) => {
    const { data } = await apiClient.post(`/cart/remove/${userId}/`, {
      item_id: itemId,
    })
    return data
  },

  // POST /cart/clear/<user_id>/  body: {}
  clearCart: async (userId) => {
    const { data } = await apiClient.post(`/cart/clear/${userId}/`, {})
    return data
  },
}
