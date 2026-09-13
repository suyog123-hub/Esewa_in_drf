import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cartCount, cartTotal, userId, setUserId } = useCart()

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">🛒</span> PaymentShop
        </Link>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
            Cart <span className="badge">{cartCount}</span>
          </NavLink>
        </div>

        <div className="nav-meta">
          <span className="cart-total">Rs. {cartTotal}</span>
          <label className="user-switch">
            User ID
            <input
              type="number"
              min="1"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value) || 1)}
              title="Backend expects user_id in URL (e.g. /cart/view/<user_id>/)"
            />
          </label>
        </div>
      </div>
    </nav>
  )
}
