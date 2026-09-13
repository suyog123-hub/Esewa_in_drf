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
  const pay = cart?.payment ?? {}

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

          <div className="cart-summary">
            <div className="summary-row"><span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span><span>Rs. {pay.amount ?? total}</span></div>
            <div className="summary-row"><span>VAT (13%)</span><span>Rs. {pay.tax_amount ?? '0.00'}</span></div>
            <div className="summary-row"><span>Delivery</span><span>Rs. {pay.product_delivery_charge ?? '0.00'}</span></div>
            <div className="summary-row total"><span>Total to Pay</span><span>Rs. {pay.total_amount ?? total}</span></div>
          </div>

          <div className="cart-actions">
            <button onClick={handleClear} disabled={busyId === 'clear'} className="btn btn-danger">
              {busyId === 'clear' ? 'Clearing...' : 'Clear Cart'} (POST /cart/clear/{userId}/)
            </button>
            <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" encType="application/x-www-form-urlencoded">
              <input type="hidden" name="amount" value={pay.amount ?? total} />
              <input type="hidden" name="tax_amount" value={pay.tax_amount ?? 0} />
              <input type="hidden" name="total_amount" value={pay.total_amount ?? total} />
              <input type="hidden" name="transaction_uuid" value={pay.transaction_uuid ?? ''} />
              <input type="hidden" name="product_code" value={pay.product_code ?? 'EPAYTEST'} />
              <input type="hidden" name="product_service_charge" value={pay.product_service_charge ?? 0} />
              <input type="hidden" name="product_delivery_charge" value={pay.product_delivery_charge ?? 0} />
              <input type="hidden" name="success_url" value={pay.success_url ?? 'https://developer.esewa.com.np/success'} />
              <input type="hidden" name="failure_url" value={pay.failure_url ?? 'https://developer.esewa.com.np/failure'} />
              <input type="hidden" name="signed_field_names" value={pay.signed_field_names ?? 'total_amount,transaction_uuid,product_code'} />
              <input type="hidden" name="signature" value={pay.signature ?? ''} />
              <button type="submit" className="btn btn-primary btn-lg">Pay with eSewa</button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
