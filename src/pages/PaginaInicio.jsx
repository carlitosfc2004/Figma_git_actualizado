import { Link } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle.jsx'
import './Paginas.css'

const PaginaInicio = () => {
  return (
    <div className="inicio-page">
      <div className="inicio-bg" />
      <div className="inicio-overlay" />

      <div className="inicio-content">
        <h1 className="inicio-title">FitTrack</h1>
        <p className="inicio-subtitle">
          Transforma tu cuerpo y tu energía, entrenando con<br />
          constancia y siguiendo tu progreso con FitTrack
        </p>
        <Link to="/login" className="inicio-btn">
          Comenzar
        </Link>
        <div className="inicio-toggle">
          <DarkModeToggle />
        </div>
      </div>
    </div>
  )
}

export default PaginaInicio