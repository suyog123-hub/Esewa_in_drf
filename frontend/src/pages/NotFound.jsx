import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
      <h1>404 — Not Found</h1>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  )
}
