import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabase.js'
import { useAuth } from '../data/authContext.jsx'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const CATEGORIAS = ['Todas', 'Fuerza', 'Cardio', 'Flexibilidad', 'HIIT', 'Otro']

const PaginaEjercicios = () => {
const { user } = useAuth()
const navigate = useNavigate()
const [ejercicios, setEjercicios] = useState([])
const [cargando, setCargando] = useState(true)
const [filtro, setFiltro] = useState('Todas')
const [busqueda, setBusqueda] = useState('')
const [error, setError] = useState(null)

useEffect(() => {
    if (!user) { navigate('/login'); return }
    cargarEjercicios()
}, [user])

const cargarEjercicios = async () => {
    setCargando(true)
    setError(null)
    const { data, error } = await supabase
    .from('ejercicios')
    .select('*')
    .order('nombre', { ascending: true })

    if (error) setError('Error al cargar ejercicios')
    else setEjercicios(data || [])
    setCargando(false)
}

const eliminarEjercicio = async (id, e) => {
    e.stopPropagation()
    if (!confirm('¿Seguro que quieres eliminar este ejercicio?')) return
    const { error } = await supabase.from('ejercicios').delete().eq('id', id)
    if (error) { alert('Error al eliminar'); return }
    setEjercicios(prev => prev.filter(ej => ej.id !== id))
}

const ejerciciosFiltrados = ejercicios.filter(ej => {
    const coincideCategoria = filtro === 'Todas' || ej.categoria === filtro
    const coincideBusqueda = ej.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
})

return (
    <div className="list-page">
    <div className="dashboard-bg" />
    <div className="dashboard-overlay" />
    <Navbar showSidebar={true} />

    <main className="list-main">
        <div className="list-header">
        <h1 className="list-title">Mis Ejercicios</h1>
        <button
            className="list-add-btn"
            onClick={() => navigate('/app/ejercicios/nuevo')}
        >
            + Nuevo Ejercicio
        </button>
        </div>

        <div className="list-controls">
        <input
            className="list-search"
            type="text"
            placeholder="Buscar ejercicio..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
        />
        <div className="list-filtros">
            {CATEGORIAS.map(cat => (
            <button
                key={cat}
                className={`filtro-btn ${filtro === cat ? 'active' : ''}`}
                onClick={() => setFiltro(cat)}
            >
                {cat}
            </button>
            ))}
        </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        {cargando ? (
        <div className="list-empty">
            <span className="list-empty-icon">⏳</span>
            <p>Cargando ejercicios...</p>
        </div>
        ) : ejerciciosFiltrados.length === 0 ? (
        <div className="list-empty">
            <span className="list-empty-icon">🏋️</span>
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
        <div className="ejercicios-grid">
            {ejerciciosFiltrados.map((ej, i) => (
            <div
                key={ej.id}
                className="ejercicio-card"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/app/ejercicios/${ej.id}`)}
            >
                <div className="ejercicio-img-wrapper">
                {ej.imagen ? (
                    <img src={ej.imagen} alt={ej.nombre} />
                ) : (
                    <div className="ejercicio-img-placeholder">🏋️</div>
                )}
                </div>
                <div className="ejercicio-info">
                <h3 className="ejercicio-nombre">{ej.nombre}</h3>
                <div className="ejercicio-meta">
                    {ej.categoria && (
                    <span className="ejercicio-badge">{ej.categoria}</span>
                    )}
                    {ej.duracion && (
                    <span className="ejercicio-duracion">⏱ {ej.duracion} min</span>
                    )}
                </div>
                {ej.descripcion && (
                    <p className="ejercicio-desc">{ej.descripcion}</p>
                )}
                </div>
                <div className="ejercicio-actions" onClick={e => e.stopPropagation()}>
                <button
                    className="action-btn edit"
                    onClick={() => navigate(`/app/ejercicios/${ej.id}/editar`)}
                >
                    ✏️
                </button>
                <button
                    className="action-btn delete"
                    onClick={e => eliminarEjercicio(ej.id, e)}
                >
                    🗑️
                </button>
                </div>
            </div>
            ))}
        </div>
        )}
    </main>
    </div>
)
}

export default PaginaEjercicios