import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import ProductForm from '../components/ProductForm'
import Loader from '../components/Loader'
import ErrorBanner from '../components/ErrorBanner'

export default function ProductList() {
  const { products, loading, error, refresh } = useProducts()

  if (loading) return <Loader label="Loading products..." />
  if (error) return <ErrorBanner message={error} />

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
        <p className="muted">API: <code>GET /product/</code> • Showing {products.length} items</p>
      </div>

      <ProductForm onCreated={refresh} />

      {products.length === 0 ? (
        <p className="empty">No products yet. Use the form above to create one.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
