import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabase.js'
import { useAuthStore } from '../stores/useAuthStore.js'
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
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const [form, setForm] = useState(camposVacios)
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    setSubiendoImagen(true)
    setError(null)

    const nombreArchivo = `${user.id}/${Date.now()}-${archivo.name}`

    const { error: uploadError } = await supabase.storage
      .from('imagenes-ejercicios')
      .upload(nombreArchivo, archivo)

    if (uploadError) {
      setError(`Error al subir imagen: ${uploadError.message}`)
      setSubiendoImagen(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('imagenes-ejercicios')
      .getPublicUrl(nombreArchivo)

    setForm((prev) => ({ ...prev, imagen: urlData.publicUrl }))
    setSubiendoImagen(false)
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
      categoria: form.categoria || null,
      duracion: form.duracion !== '' ? parseInt(form.duracion) : null,
      imagen: form.imagen || null,
      user_id: user.id,
    }

    let resultado
    if (esEdicion) {
      resultado = await supabase.from('ejercicios').update(payload).eq('id', id).select().single()
    } else {
      resultado = await supabase.from('ejercicios').insert(payload).select().single()
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
      <div className="dashboard-bg" aria-hidden="true" />
      <div className="dashboard-overlay" aria-hidden="true" />
      <Navbar showSidebar={true} />

      <main className="form-main" id="main-content">
        <button
          className="back-btn"
          onClick={() => navigate(esEdicion ? `/app/ejercicios/${id}` : '/app/ejercicios')}
          aria-label="Volver"
        >
          ← Volver
        </button>

        {cargando ? (
          <div className="list-empty" role="status" aria-live="polite">
            <span className="list-empty-icon" aria-hidden="true">⏳</span>
            <p>Cargando ejercicio...</p>
          </div>
        ) : (
          <div className="auth-card form-card">
            <h2>{esEdicion ? '✏️ Editar Ejercicio' : '➕ Nuevo Ejercicio'}</h2>

            <form onSubmit={handleSubmit} noValidate aria-label={esEdicion ? 'Formulario editar ejercicio' : 'Formulario nuevo ejercicio'}>
              <div className="form-group">
                <label htmlFor="ej-nombre">Nombre <span aria-hidden="true">*</span></label>
                <input
                  id="ej-nombre"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Press de banca"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ej-descripcion">Descripción</label>
                <textarea
                  id="ej-descripcion"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el ejercicio, músculos trabajados, etc."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ej-categoria">Categoría</label>
                  <select id="ej-categoria" name="categoria" value={form.categoria} onChange={handleChange}>
                    <option value="">— Sin categoría —</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="ej-duracion">Duración (minutos)</label>
                  <input
                    id="ej-duracion"
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
                <label htmlFor="ej-imagen">Imagen</label>
                <input
                  id="ej-imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={subiendoImagen}
                />
                {subiendoImagen && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                    Subiendo imagen...
                  </p>
                )}
              </div>

              {form.imagen && (
                <div className="form-preview">
                  <img src={form.imagen} alt="Vista previa de la imagen del ejercicio" />
                </div>
              )}

              {error && (
                <p className="auth-error" role="alert" aria-live="assertive">
                  {error}
                </p>
              )}

              <button type="submit" className="auth-primary-btn" disabled={guardando || subiendoImagen} aria-busy={guardando}>
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
