import axios from 'axios'

// Base URL - mirrors Django backend at http://127.0.0.1:8000
// All DRF endpoints are mounted at root (see payment/urls.py + esewa_app/urls.py)
//   GET  /product/                     -> list products
//   GET  /product/<id>/                -> product detail
//   GET  /cart/view/<user_id>/         -> cart detail
//   POST /cart/add/<user_id>/          -> add to cart  {product_id}
//   POST /cart/remove/<user_id>/       -> remove item {item_id}
//   POST /cart/clear/<user_id>/        -> clear cart
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: false // keep false unless SessionAuthentication needed
})

// Global response interceptor for error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.error || error.response?.data?.detail || error.message
    console.error('[API Error]', error.config?.method?.toUpperCase(), error.config?.url, '->', msg)
    return Promise.reject(error)
  }
)

export default apiClient
export { API_BASE_URL }
