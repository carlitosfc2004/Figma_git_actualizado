import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabase.js'
import { useAuthStore } from '../stores/useAuthStore.js'
import Navbar from '../components/Navbar.jsx'

const NIVELES = ['Principiante', 'Intermedio', 'Avanzado']
const OBJETIVOS = ['Perder peso', 'Ganar masa muscular', 'Mejorar resistencia', 'Mantenimiento', 'Otro']

const camposVacios = {
  nombre: '',
  descripcion: '',
  nivel: '',
  dias_semana: '',
  objetivo: '',
}

const PaginaRutinaForm = () => {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const [form, setForm] = useState(camposVacios)
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (esEdicion) cargarRutina()
  }, [user, id])

  const cargarRutina = async () => {
    const { data, error } = await supabase
      .from('rutinas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      setError('No se pudo cargar la rutina')
    } else {
      setForm({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        nivel: data.nivel || '',
        dias_semana: data.dias_semana ?? '',
        objetivo: data.objetivo || '',
      })
    }
    setCargando(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
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
      nivel: form.nivel || null,
      dias_semana: form.dias_semana !== '' ? parseInt(form.dias_semana) : null,
      objetivo: form.objetivo || null,
      user_id: user.id,
    }

    let resultado
    if (esEdicion) {
      resultado = await supabase.from('rutinas').update(payload).eq('id', id).select().single()
    } else {
      resultado = await supabase.from('rutinas').insert(payload).select().single()
    }

    setGuardando(false)

    if (resultado.error) {
      setError('Error al guardar. Comprueba los datos.')
      return
    }

    navigate(esEdicion ? `/app/rutinas/${id}` : '/app/rutinas')
  }

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--input-border)',
    color: 'var(--text)',
    borderRadius: '0.5rem',
    padding: '0.65rem 0.875rem',
    width: '100%',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '0.375rem',
    color: 'var(--text-muted)',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="dashboard-bg" aria-hidden="true" />
      <div className="dashboard-overlay" aria-hidden="true" />
      <Navbar showSidebar={true} />

      <main className="pt-20 px-4 pb-10 max-w-xl mx-auto" id="main-content">
        <button
          className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 rounded"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => navigate(esEdicion ? `/app/rutinas/${id}` : '/app/rutinas')}
          aria-label="Volver"
        >
          ← Volver
        </button>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
            <span className="text-5xl" aria-hidden="true">⏳</span>
            <p style={{ color: 'var(--text-muted)' }}>Cargando rutina...</p>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text-heading)', letterSpacing: '0.05em' }}>
              {esEdicion ? '✏️ Editar Rutina' : '➕ Nueva Rutina'}
            </h2>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
              aria-label={esEdicion ? 'Formulario editar rutina' : 'Formulario nueva rutina'}
            >
              {/* Nombre */}
              <div>
                <label htmlFor="rut-nombre" style={labelStyle}>
                  Nombre <span aria-hidden="true" style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  id="rut-nombre"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Rutina de fuerza 3 días"
                  required
                  aria-required="true"
                  style={inputStyle}
                />
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="rut-descripcion" style={labelStyle}>Descripción</label>
                <textarea
                  id="rut-descripcion"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe los objetivos, estructura, notas importantes..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Nivel y Días/semana */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rut-nivel" style={labelStyle}>Nivel</label>
                  <select
                    id="rut-nivel"
                    name="nivel"
                    value={form.nivel}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">— Sin nivel —</option>
                    {NIVELES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rut-dias" style={labelStyle}>Días / semana</label>
                  <input
                    id="rut-dias"
                    type="number"
                    name="dias_semana"
                    value={form.dias_semana}
                    onChange={handleChange}
                    placeholder="Ej: 3"
                    min="1"
                    max="7"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Objetivo */}
              <div>
                <label htmlFor="rut-objetivo" style={labelStyle}>Objetivo</label>
                <select
                  id="rut-objetivo"
                  name="objetivo"
                  value={form.objetivo}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">— Sin objetivo —</option>
                  {OBJETIVOS.map((obj) => (
                    <option key={obj} value={obj}>{obj}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p
                  className="text-sm px-4 py-3 rounded-lg"
                  style={{ background: '#ff444420', color: '#ff6666', border: '1px solid #ff444440' }}
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={guardando}
                aria-busy={guardando}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)' }}
              >
                {guardando
                  ? (esEdicion ? 'Guardando...' : 'Creando...')
                  : (esEdicion ? '💾 Guardar cambios' : '✅ Crear rutina')}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default PaginaRutinaForm
