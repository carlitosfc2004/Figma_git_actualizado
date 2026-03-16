import { Link } from 'react-router-dom'
import './Paginas.css'

const PaginaError = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <p className="error-msg">Página no encontrada</p>
        <Link to="/" className="error-btn">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default PaginaError