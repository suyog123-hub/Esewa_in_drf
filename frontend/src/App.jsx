import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/Cart'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="footer">
          <span>DRF Backend: <code>http://127.0.0.1:8000</code></span>
          <span>•</span>
          <span>Endpoints: <code>/product/</code>, <code>/product/:id/</code>, <code>/cart/view/:uid/</code>, <code>/cart/add/:uid/</code>, <code>/cart/remove/:uid/</code>, <code>/cart/clear/:uid/</code></span>
        </footer>
      </CartProvider>
    </BrowserRouter>
  )
}
