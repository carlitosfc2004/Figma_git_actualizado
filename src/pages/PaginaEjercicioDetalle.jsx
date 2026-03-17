import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabase.js'
import { useAuth } from '../data/authContext.jsx'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const PaginaEjercicioDetalle = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ejercicio, setEjercicio] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cargarEjercicio()
  }, [user, id])

  const cargarEjercicio = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('ejercicios')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) setError('Ejercicio no encontrado')
    else setEjercicio(data)
    setCargando(false)
  }

  const eliminar = async () => {
    if (!confirm('¿Seguro que quieres eliminar este ejercicio?')) return
    const { error } = await supabase.from('ejercicios').delete().eq('id', id)
    if (error) { alert('Error al eliminar'); return }
    navigate('/app/ejercicios')
  }

  return (
    <div className="list-page">
      <div className="dashboard-bg" />
      <div className="dashboard-overlay" />
      <Navbar showSidebar={true} />

      <main className="detalle-main">
        <button className="back-btn" onClick={() => navigate('/app/ejercicios')}>
          ← Volver a ejercicios
        </button>

        {cargando ? (
          <div className="list-empty">
            <span className="list-empty-icon">⏳</span>
            <p>Cargando...</p>
          </div>
        ) : error ? (
          <div className="list-empty">
            <span className="list-empty-icon">❌</span>
            <p>{error}</p>
          </div>
        ) : (
          <div className="detalle-card">
            {ejercicio.imagen && (
              <div className="detalle-img-wrapper">
                <img src={ejercicio.imagen} alt={ejercicio.nombre} />
              </div>
            )}
            <div className="detalle-body">
              <div className="detalle-top">
                <h1 className="detalle-nombre">{ejercicio.nombre}</h1>
                <div className="detalle-badges">
                  {ejercicio.categoria && (
                    <span className="ejercicio-badge">{ejercicio.categoria}</span>
                  )}
                  {ejercicio.duracion && (
                    <span className="ejercicio-badge">
                      ⏱ {ejercicio.duracion} min
                    </span>
                  )}
                </div>
              </div>

              {ejercicio.descripcion && (
                <p className="detalle-descripcion">{ejercicio.descripcion}</p>
              )}

              <div className="detalle-actions">
                <button
                  className="auth-primary-btn detalle-edit-btn"
                  onClick={() => navigate(`/app/ejercicios/${id}/editar`)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="detalle-delete-btn"
                  onClick={eliminar}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PaginaEjercicioDetalle