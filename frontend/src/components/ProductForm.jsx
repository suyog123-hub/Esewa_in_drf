import { useState } from 'react'
import { productApi } from '../api/products'

export default function ProductForm({ onCreated }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    try {
      const created = await productApi.create({ name, price })
      setMessage({ type: 'ok', text: `Created "${created.name}" (ID ${created.id})` })
      setName('')
      setPrice('')
      onCreated?.()
    } catch (err) {
      const detail = err.response?.data
      const msg = detail?.name?.join(', ') || detail?.price?.join(', ') || 'Failed to create product'
      setMessage({ type: 'err', text: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      <div className="form-row">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Laptop"
            required
          />
        </label>
        <label>
          Price
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 999.99"
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Product'}
        </button>
      </div>
      {message && <p className={`toast ${message.type}`}>{message.text}</p>}
    </form>
  )
}