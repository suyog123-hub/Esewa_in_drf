import apiClient from './client'

// Mirrors esewa_app/views.py -> ProductListAPIView & ProductDetailAPIView
export const productApi = {
  // GET /product/
  list: async () => {
    const { data } = await apiClient.get('/product/')
    return data
  },

  // GET /product/<product_id>/
  getById: async (productId) => {
    const { data } = await apiClient.get(`/product/${productId}/`)
    return data
  },

  // POST /product/
  create: async (payload) => {
    const { data } = await apiClient.post('/product/', payload)
    return data
  },
}
