// Central barrel - mirrors backend's esewa_app/urls.py routing table
// Export all API domains so components can do: import { productApi, cartApi } from '@/api'
export { default as apiClient, API_BASE_URL } from './client'
export { productApi } from './products'
export { cartApi } from './cart'
