import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore.js'
import { useRutinasStore } from '../stores/useRutinasStore.js'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const NIVELES = ['Todos', 'Principiante', 'Intermedio', 'Avanzado']

const NIVEL_COLOR = {
  Principiante: '#4ade80',
  Intermedio: '#facc15',
  Avanzado: '#f87171',
}

const PaginaRutinas = () => {
  const user = useAuthStore((s) => s.user)
  const { rutinas, cargando, error, cargar, eliminar } = useRutinasStore()
  const navigate = useNavigate()
  const [filtroNivel, setFiltroNivel] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cargar(user.id)
  }, [user])

  const handleEliminar = async (id, nombre, e) => {
    e.stopPropagation()
    if (!confirm(`¿Seguro que quieres eliminar la rutina "${nombre}"?`)) return
    try {
      await eliminar(id, user.id)
    } catch {
      alert('Error al eliminar la rutina')
    }
  }

  const rutinasFiltradas = rutinas.filter((r) => {
    const coincideNivel = filtroNivel === 'Todos' || r.nivel === filtroNivel
    const coincideBusqueda = r.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideNivel && coincideBusqueda
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="dashboard-bg" aria-hidden="true" />
      <div className="dashboard-overlay" aria-hidden="true" />
      <Navbar showSidebar={true} />

      <main className="pt-20 px-4 pb-10 max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 2 }} id="main-content">

        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text-heading)', letterSpacing: '0.05em' }}>
            Mis Rutinas
          </h1>
          <button
            className="px-5 py-2 rounded-lg font-semibold text-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            onClick={() => navigate('/app/rutinas/nueva')}
            aria-label="Crear nueva rutina"
          >
            + Nueva Rutina
          </button>
        </div>

        {/* Controles de búsqueda y filtro */}
        <div className="flex flex-col gap-4 mb-8">
          <label htmlFor="busqueda-rutina" className="sr-only">Buscar rutina</label>
          <input
            id="busqueda-rutina"
            type="search"
            placeholder="Buscar rutina..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            aria-label="Buscar rutina por nombre"
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por nivel">
            {NIVELES.map((nivel) => (
              <button
                key={nivel}
                onClick={() => setFiltroNivel(nivel)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2"
                style={{
                  background: filtroNivel === nivel ? 'var(--btn-bg)' : 'var(--surface)',
                  color: filtroNivel === nivel ? 'var(--btn-text)' : 'var(--text)',
                  border: '1px solid var(--border)',
                }}
                aria-pressed={filtroNivel === nivel}
              >
                {nivel}
              </button>
            ))}
          </div>
        </div>

        {/* Errores */}
        {error && <p className="auth-error mb-4" role="alert">{error}</p>}

        {/* Estado de carga */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
            <span className="text-5xl" aria-hidden="true">⏳</span>
            <p style={{ color: 'var(--text-muted)' }}>Cargando rutinas...</p>
          </div>
        ) : rutinasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-6xl" aria-hidden="true">🏃</span>
            <p style={{ color: 'var(--text-muted)' }}>
              {busqueda || filtroNivel !== 'Todos'
                ? 'No hay rutinas con ese filtro.'
                : 'Aún no tienes rutinas. ¡Crea la primera!'}
            </p>
            {!busqueda && filtroNivel === 'Todos' && (
              <button
                className="mt-2 px-6 py-2 rounded-lg font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-2"
                style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                onClick={() => navigate('/app/rutinas/nueva')}
              >
                Crear mi primera rutina
              </button>
            )}
          </div>
        ) : (
          <section aria-label="Lista de rutinas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rutinasFiltradas.map((rutina, i) => (
                <article
                  key={rutina.id}
                  className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col gap-3 relative"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow)',
                    animation: 'fadeUp 0.4s ease both',
                    animationDelay: `${i * 0.06}s`,
                  }}
                  onClick={() => navigate(`/app/rutinas/${rutina.id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/app/rutinas/${rutina.id}`)}
                  aria-label={`Rutina: ${rutina.nombre}${rutina.nivel ? ', nivel ' + rutina.nivel : ''}`}
                >
                  {/* Nivel badge */}
                  {rutina.nivel && (
                    <span
                      className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: NIVEL_COLOR[rutina.nivel] + '22',
                        color: NIVEL_COLOR[rutina.nivel],
                        border: `1px solid ${NIVEL_COLOR[rutina.nivel]}44`,
                      }}
                    >
                      {rutina.nivel}
                    </span>
                  )}

                  <h3 className="text-lg font-semibold pr-20" style={{ color: 'var(--text-heading)' }}>
                    {rutina.nombre}
                  </h3>

                  {rutina.descripcion && (
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {rutina.descripcion}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {rutina.dias_semana && (
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                        📅 {rutina.dias_semana} días/semana
                      </span>
                    )}
                    {rutina.objetivo && (
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                        🎯 {rutina.objetivo}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div
                    className="flex gap-2 mt-1"
                    onClick={(e) => e.stopPropagation()}
                    role="group"
                    aria-label={`Acciones para ${rutina.nombre}`}
                  >
                    <button
                      className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80 focus:outline-none focus:ring-2"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      onClick={() => navigate(`/app/rutinas/${rutina.id}/editar`)}
                      aria-label={`Editar ${rutina.nombre}`}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80 focus:outline-none focus:ring-2"
                      style={{ background: '#ff444422', border: '1px solid #ff444444', color: '#ff6666' }}
                      onClick={(e) => handleEliminar(rutina.id, rutina.nombre, e)}
                      aria-label={`Eliminar ${rutina.nombre}`}
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

export default PaginaRutinas
