import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle.jsx'
import { useAuthStore } from '../stores/useAuthStore.js'
import './Navbar.css'

const Navbar = ({ showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const username = useAuthStore((s) => s.username)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setSidebarOpen(false)
    await logout()
    navigate('/')
  }

  const navLinks = username
    ? [
        { label: 'Inicio', path: '/app' },
        { label: 'Mis Ejercicios', path: '/app/ejercicios' },
        { label: 'Mis Rutinas', path: '/app/rutinas' },
      ]
    : [
        { label: 'Inicio', path: '/' },
        { label: 'Iniciar Sesión', path: '/login' },
        { label: 'Registrarse', path: '/registro' },
      ]

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Navegación principal">
        {showSidebar && (
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={sidebarOpen}
          >
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        )}
        <Link className="navbar-brand" to={username ? '/app' : '/'} aria-label="FitTrack - Ir al inicio">
          FitTrack
        </Link>
        <div className="navbar-right">
          <DarkModeToggle />
          {username && (
            <>
              <button className="logout-btn" onClick={handleLogout} aria-label="Cerrar sesión">
                Salir
              </button>
              <div className="avatar" aria-label={`Usuario: ${username}`}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} alt={`Avatar de ${username}`} />
              </div>
            </>
          )}
        </div>
      </nav>

      {showSidebar && (
        <>
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={`sidebar ${sidebarOpen ? 'open' : ''}`}
            aria-label="Menú lateral"
            aria-hidden={!sidebarOpen}
          >
            <nav>
              <ul role="list">
                {navLinks.map((link) => (
                  <li
                    key={link.label}
                    className={location.pathname === link.path ? 'active' : ''}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Link to={link.path} aria-current={location.pathname === link.path ? 'page' : undefined}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {username && (
              <div className="sidebar-user">
                <span aria-hidden="true">👤</span>
                <span style={{ flex: 1, fontSize: 12 }}>{username}</span>
                <button
                  style={{ background: 'none', border: 'none', color: '#ff6666', fontSize: 13, cursor: 'pointer' }}
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  )
}

export default Navbar
