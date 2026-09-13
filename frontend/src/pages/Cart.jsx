import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import ErrorBanner from '../components/ErrorBanner'
import { useState } from 'react'

export default function CartPage() {
  const { cart, loading, error, fetchCart, removeFromCart, clearCart, userId } = useCart()
  const [actionMsg, setActionMsg] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const handleRemove = async (itemId) => {
    setBusyId(itemId)
    setActionMsg(null)
    const res = await removeFromCart(itemId)
    setBusyId(null)
    setActionMsg(res.success ? 'Item removed' : res.error)
    setTimeout(() => setActionMsg(null), 2000)
  }

  const handleClear = async () => {
    if (!confirm('Clear all items from cart?')) return
    setBusyId('clear')
    const res = await clearCart()
    setBusyId(null)
    setActionMsg(res.success ? 'Cart cleared' : res.error)
  }

  if (loading) return <Loader label="Loading cart..." />
  if (error) return <ErrorBanner message={error} onRetry={fetchCart} />

  const items = cart?.items ?? []
  const total = cart?.total_price ?? '0.00'

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p className="muted">
          API: <code>GET /cart/view/{userId}/</code> • User #{userId} • {items.length} item(s)
        </p>
      </div>

      {actionMsg && <div className="toast ok">{actionMsg}</div>}

      {items.length === 0 ? (
        <div className="empty-box">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.product_name}</td>
                    <td>Rs. {item.product_price}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.total_price}</td>
                    <td>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={busyId === item.id}
                        className="btn btn-danger btn-sm"
                        title="API: POST /cart/remove/<user_id>/ {item_id}"
                      >
                        {busyId === item.id ? '...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'right', fontWeight: 700 }}>Grand Total</td>
                  <td colSpan="2" style={{ fontWeight: 800 }}>Rs. {total}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="cart-actions">
            <button onClick={handleClear} disabled={busyId === 'clear'} className="btn btn-danger">
              {busyId === 'clear' ? 'Clearing...' : 'Clear Cart'} (POST /cart/clear/{userId}/)
            </button>
            <span className="muted">APIs: POST /cart/add/ &amp; POST /cart/remove/ &amp; POST /cart/clear/</span>
          </div>
        </>
      )}
    </div>
  )
}
