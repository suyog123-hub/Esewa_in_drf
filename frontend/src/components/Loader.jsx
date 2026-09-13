export default function Loader({ label = 'Loading...' }) {
  return <div className="loader"><span className="spinner" /> {label}</div>
}
