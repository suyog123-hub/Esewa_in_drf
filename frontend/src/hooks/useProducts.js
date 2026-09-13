import { useState, useEffect } from 'react'
import { productApi } from '../api/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await productApi.list()
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.detail || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [version])

  return { products, loading, error, refresh: () => setVersion(v => v + 1) }
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await productApi.getById(productId)
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.detail || err.message || 'Product not found')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [productId])

  return { product, loading, error }
}
