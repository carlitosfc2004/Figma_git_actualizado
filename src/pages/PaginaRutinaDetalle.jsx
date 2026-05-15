import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabase.js'
import { useAuthStore } from '../stores/useAuthStore.js'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const NIVEL_COLOR = {
  Principiante: '#4ade80',
  Intermedio: '#facc15',
  Avanzado: '#f87171',
}

const PaginaRutinaDetalle = () => {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [rutina, setRutina] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cargarRutina()
  }, [user, id])

  const cargarRutina = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('rutinas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) setError('Rutina no encontrada')
    else setRutina(data)
    setCargando(false)
  }

  const eliminar = async () => {
    if (!confirm('¿Seguro que quieres eliminar esta rutina?')) return
    const { error } = await supabase.from('rutinas').delete().eq('id', id)
    if (error) { alert('Error al eliminar'); return }
    navigate('/app/rutinas')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="dashboard-bg" aria-hidden="true" />
      <div className="dashboard-overlay" aria-hidden="true" />
      <Navbar showSidebar={true} />

      <main className="pt-20 px-4 pb-10 max-w-2xl mx-auto" style={{ position: 'relative', zIndex: 2 }} id="main-content">
        <button
          className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 rounded"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => navigate('/app/rutinas')}
          aria-label="Volver a la lista de rutinas"
        >
          ← Volver a rutinas
        </button>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
            <span className="text-5xl" aria-hidden="true">⏳</span>
            <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" role="alert">
            <span className="text-5xl" aria-hidden="true">❌</span>
            <p>{error}</p>
          </div>
        ) : (
          <article
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            aria-label={`Detalle de la rutina: ${rutina.nombre}`}
          >
            {/* Cabecera de la tarjeta */}
            <div className="p-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text-heading)', letterSpacing: '0.05em' }}>
                  {rutina.nombre}
                </h1>
                {rutina.nivel && (
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: NIVEL_COLOR[rutina.nivel] + '22',
                      color: NIVEL_COLOR[rutina.nivel],
                      border: `1px solid ${NIVEL_COLOR[rutina.nivel]}44`,
                    }}
                  >
                    {rutina.nivel}
                  </span>
                )}
              </div>
            </div>

            {/* Cuerpo */}
            <div className="p-6 flex flex-col gap-5">
              {/* Descripción */}
              {rutina.descripcion && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                    Descripción
                  </h2>
                  <p style={{ color: 'var(--text)', lineHeight: 1.7 }}>{rutina.descripcion}</p>
                </section>
              )}

              {/* Detalles */}
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                  Detalles
                </h2>
                <dl className="grid grid-cols-2 gap-3">
                  {rutina.dias_semana && (
                    <div
                      className="flex flex-col gap-1 rounded-xl p-3"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      <dt className="text-xs" style={{ color: 'var(--text-muted)' }}>Días / semana</dt>
                      <dd className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
                        📅 {rutina.dias_semana}
                      </dd>
                    </div>
                  )}
                  {rutina.objetivo && (
                    <div
                      className="flex flex-col gap-1 rounded-xl p-3"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      <dt className="text-xs" style={{ color: 'var(--text-muted)' }}>Objetivo</dt>
                      <dd className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
                        🎯 {rutina.objetivo}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Acciones */}
              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2"
                  style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  onClick={() => navigate(`/app/rutinas/${id}/editar`)}
                  aria-label={`Editar rutina ${rutina.nombre}`}
                >
                  ✏️ Editar
                </button>
                <button
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2"
                  style={{ background: '#ff444422', border: '1px solid #ff444444', color: '#ff6666' }}
                  onClick={eliminar}
                  aria-label={`Eliminar rutina ${rutina.nombre}`}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}

export default PaginaRutinaDetalle
