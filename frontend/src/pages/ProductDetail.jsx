import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import ErrorBanner from '../components/ErrorBanner'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState(null)

  const handleAdd = async () => {
    setAdding(true)
    setMsg(null)
    const res = await addToCart(product.id)
    setAdding(false)
    setMsg(res.success ? 'Added to cart ✓' : res.error)
  }

  if (loading) return <Loader label="Loading product..." />
  if (error) return <ErrorBanner message={error} />
  if (!product) return <p>Not found</p>

  return (
    <div className="page">
      <Link to="/" className="back">← Back to products</Link>
      <div className="detail-card">
        <h1>{product.name}</h1>
        <p className="price-lg">Rs. {product.price}</p>
        <p className="muted">Product ID: {product.id} • Created: {new Date(product.created_at).toLocaleString()}</p>
        <p className="muted">API: <code>GET /product/{product.id}/</code></p>

        <div className="detail-actions">
          <button onClick={handleAdd} disabled={adding} className="btn btn-primary btn-lg">
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          <Link to="/cart" className="btn btn-outline btn-lg">View Cart</Link>
        </div>
        {msg && <div className={`toast ${msg.includes('✓') ? 'ok' : 'err'}`}>{msg}</div>}
      </div>
    </div>
  )
}
