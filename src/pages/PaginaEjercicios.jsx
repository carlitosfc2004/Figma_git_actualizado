import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore.js'
import { useEjerciciosStore } from '../stores/useEjerciciosStore.js'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const CATEGORIAS = ['Todas', 'Fuerza', 'Cardio', 'Flexibilidad', 'HIIT', 'Otro']

const PaginaEjercicios = () => {
  const user = useAuthStore((s) => s.user)
  const { ejercicios, cargando, error, cargar, eliminar } = useEjerciciosStore()
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cargar()
  }, [user])

  const handleEliminar = async (id, e) => {
    e.stopPropagation()
    if (!confirm('¿Seguro que quieres eliminar este ejercicio?')) return
    try {
      await eliminar(id)
    } catch {
      alert('Error al eliminar')
    }
  }

  const ejerciciosFiltrados = ejercicios.filter((ej) => {
    const coincideCategoria = filtro === 'Todas' || ej.categoria === filtro
    const coincideBusqueda = ej.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (
    <div className="list-page">
      <div className="dashboard-bg" aria-hidden="true" />
      <div className="dashboard-overlay" aria-hidden="true" />
      <Navbar showSidebar={true} />

      <main className="list-main" id="main-content">
        <div className="list-header">
          <h1 className="list-title">Mis Ejercicios</h1>
          <button
            className="list-add-btn"
            onClick={() => navigate('/app/ejercicios/nuevo')}
            aria-label="Añadir nuevo ejercicio"
          >
            + Nuevo Ejercicio
          </button>
        </div>

        <div className="list-controls">
          <label htmlFor="busqueda-ejercicio" className="sr-only">Buscar ejercicio</label>
          <input
            id="busqueda-ejercicio"
            className="list-search"
            type="search"
            placeholder="Buscar ejercicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar ejercicio por nombre"
          />
          <div className="list-filtros" role="group" aria-label="Filtrar por categoría">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                className={`filtro-btn ${filtro === cat ? 'active' : ''}`}
                onClick={() => setFiltro(cat)}
                aria-pressed={filtro === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        {cargando ? (
          <div className="list-empty" role="status" aria-live="polite">
            <span className="list-empty-icon" aria-hidden="true">⏳</span>
            <p>Cargando ejercicios...</p>
          </div>
        ) : ejerciciosFiltrados.length === 0 ? (
          <div className="list-empty">
            <span className="list-empty-icon" aria-hidden="true">🏋️</span>
            <p>No hay ejercicios{busqueda || filtro !== 'Todas' ? ' con ese filtro' : ' todavía'}.</p>
            {!busqueda && filtro === 'Todas' && (
              <button
                className="auth-primary-btn"
                style={{ marginTop: 16, maxWidth: 220 }}
                onClick={() => navigate('/app/ejercicios/nuevo')}
              >
                Añadir el primero
              </button>
            )}
          </div>
        ) : (
          <section aria-label="Lista de ejercicios">
            <div className="ejercicios-grid">
              {ejerciciosFiltrados.map((ej, i) => (
                <article
                  key={ej.id}
                  className="ejercicio-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => navigate(`/app/ejercicios/${ej.id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/app/ejercicios/${ej.id}`)}
                  aria-label={`Ejercicio: ${ej.nombre}${ej.categoria ? ', ' + ej.categoria : ''}${ej.duracion ? ', ' + ej.duracion + ' minutos' : ''}`}
                >
                  <div className="ejercicio-img-wrapper">
                    {ej.imagen ? (
                      <img src={ej.imagen} alt="" aria-hidden="true" />
                    ) : (
                      <div className="ejercicio-img-placeholder" aria-hidden="true">🏋️</div>
                    )}
                  </div>
                  <div className="ejercicio-info">
                    <h3 className="ejercicio-nombre">{ej.nombre}</h3>
                    <div className="ejercicio-meta">
                      {ej.categoria && <span className="ejercicio-badge">{ej.categoria}</span>}
                      {ej.duracion && <span className="ejercicio-duracion">⏱ {ej.duracion} min</span>}
                    </div>
                    {ej.descripcion && <p className="ejercicio-desc">{ej.descripcion}</p>}
                  </div>
                  <div className="ejercicio-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="action-btn edit"
                      onClick={() => navigate(`/app/ejercicios/${ej.id}/editar`)}
                      aria-label={`Editar ${ej.nombre}`}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={(e) => handleEliminar(ej.id, e)}
                      aria-label={`Eliminar ${ej.nombre}`}
                    >
                      🗑️
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default PaginaEjercicios
