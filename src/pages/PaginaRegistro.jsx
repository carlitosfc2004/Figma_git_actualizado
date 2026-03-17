import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../data/authContext.jsx'
import './Paginas.css'

const PaginaRegistro = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [cargando, setCargando] = useState(false)
  const { registro } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMensaje(null)

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    try {
      await registro(email, password)
      setMensaje('Registro exitoso, revisa tu email para confirmar la cuenta')
    } catch (err) {
      setError('Error al registrarse, prueba con otro email')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-page">
      <Navbar showSidebar={false} />
      <div className="auth-bg" />
      <div className="auth-overlay" />

      <div className="auth-content">
        <h1 className="auth-hero-title">Tu bienestar día a día</h1>
        <div className="auth-actions-top">
          <Link to="/login" className="auth-switch-btn">
            Iniciar Sesión
          </Link>
        </div>
        <div className="auth-card">
          <h2>Registrarse</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                required
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            {mensaje && <p className="auth-success">{mensaje}</p>}
            <button type="submit" className="auth-primary-btn" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <Link to="/login" className="auth-link">
            ¿Ya tienes cuenta? Inicia sesión.
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaginaRegistro