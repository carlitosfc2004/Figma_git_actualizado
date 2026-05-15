import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuthStore } from '../stores/useAuthStore.js'
import './Paginas.css'

const PaginaLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await login(email, password)
      navigate('/app')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-page">
      <Navbar showSidebar={false} />
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-overlay" aria-hidden="true" />

      <div className="auth-content">
        <h1 className="auth-hero-title">Tu bienestar día a día</h1>
        <div className="auth-actions-top">
          <Link to="/registro" className="auth-switch-btn">
            Registro
          </Link>
        </div>
        <div className="auth-card">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="auth-error" role="alert" aria-live="assertive">
                {error}
              </p>
            )}
            <button type="submit" className="auth-primary-btn" disabled={cargando} aria-busy={cargando}>
              {cargando ? 'Entrando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <Link to="/registro" className="auth-link">
            ¿No tienes cuenta? Regístrate ahora.
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaginaLogin
