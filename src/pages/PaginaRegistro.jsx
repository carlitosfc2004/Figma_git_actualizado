import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../data/authContext.jsx'
import './Paginas.css'

const PaginaRegistro = () => {
  const [email, setEmail] = useState('')
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (usuario.trim()) {
      login(usuario)
      navigate('/app')
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
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-primary-btn">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaginaRegistro