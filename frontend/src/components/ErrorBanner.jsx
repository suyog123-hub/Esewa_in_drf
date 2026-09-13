export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="error-banner">
      <span>⚠️ {message}</span>
      {onRetry && <button onClick={onRetry} className="btn btn-sm">Retry</button>}
    </div>
  )
}
