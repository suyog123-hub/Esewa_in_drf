import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleAdd = async () => {
    setAdding(true)
    setFeedback(null)
    const res = await addToCart(product.id)
    setAdding(false)
    if (res.success) {
      setFeedback('Added ✓')
      setTimeout(() => setFeedback(null), 1500)
    } else {
      setFeedback(res.error || 'Failed')
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">Rs. {product.price}</p>
        <p className="card-meta">ID: {product.id} • {new Date(product.created_at).toLocaleDateString()}</p>
      </div>
      <div className="card-actions">
        <Link to={`/product/${product.id}`} className="btn btn-outline">
          View
        </Link>
        <button onClick={handleAdd} disabled={adding} className="btn btn-primary">
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
      {feedback && <div className={`toast ${feedback.includes('✓') ? 'ok' : 'err'}`}>{feedback}</div>}
    </div>
  )
}
