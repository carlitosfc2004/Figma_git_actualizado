import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabase.js'
import { useAuth } from '../data/authContext.jsx'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const CATEGORIAS = ['Fuerza', 'Cardio', 'Flexibilidad', 'HIIT', 'Otro']

const camposVacios = {
  nombre: '',
  descripcion: '',
  categoria: '',
  duracion: '',
  imagen: '',
}

const PaginaEjercicioForm = () => {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(camposVacios)
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (esEdicion) cargarEjercicio()
  }, [user, id])

  const cargarEjercicio = async () => {
    const { data, error } = await supabase
      .from('ejercicios')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      setError('No se pudo cargar el ejercicio')
    } else {
      setForm({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        categoria: data.categoria || '',
        duracion: data.duracion ?? '',
        imagen: data.imagen || '',
      })
    }
    setCargando(false)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    setGuardando(true)

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      categoria: form.categoria || null,
      duracion: form.duracion !== '' ? parseInt(form.duracion) : null,
      imagen: form.imagen.trim() || null,
      user_id: user.id,
    }

    let resultado
    if (esEdicion) {
      resultado = await supabase
        .from('ejercicios')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    } else {
      resultado = await supabase
        .from('ejercicios')
        .insert(payload)
        .select()
        .single()
    }

    setGuardando(false)

    if (resultado.error) {
      setError('Error al guardar. Comprueba los datos.')
      return
    }

    navigate(esEdicion ? `/app/ejercicios/${id}` : '/app/ejercicios')
  }

  return (
    <div className="list-page">
      <div className="dashboard-bg" />
      <div className="dashboard-overlay" />
      <Navbar showSidebar={true} />

      <main className="form-main">
        <button
          className="back-btn"
          onClick={() => navigate(esEdicion ? `/app/ejercicios/${id}` : '/app/ejercicios')}
        >
          ← Volver
        </button>

        {cargando ? (
          <div className="list-empty">
            <span className="list-empty-icon">⏳</span>
            <p>Cargando ejercicio...</p>
          </div>
        ) : (
          <div className="auth-card form-card">
            <h2>{esEdicion ? '✏️ Editar Ejercicio' : '➕ Nuevo Ejercicio'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Press de banca"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el ejercicio, músculos trabajados, etc."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                  >
                    <option value="">— Sin categoría —</option>
                    {CATEGORIAS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duración (minutos)</label>
                  <input
                    type="number"
                    name="duracion"
                    value={form.duracion}
                    onChange={handleChange}
                    placeholder="Ej: 30"
                    min="1"
                    max="999"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de imagen</label>
                <input
                  type="url"
                  name="imagen"
                  value={form.imagen}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              {form.imagen && (
                <div className="form-preview">
                  <img src={form.imagen} alt="Preview" />
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="auth-primary-btn"
                disabled={guardando}
              >
                {guardando
                  ? (esEdicion ? 'Guardando...' : 'Creando...')
                  : (esEdicion ? '💾 Guardar cambios' : '✅ Crear ejercicio')}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default PaginaEjercicioForm