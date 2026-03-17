import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle.jsx'
import { useAuth } from '../data/authContext.jsx'
import './Navbar.css'

const Navbar = ({ showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { username, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setSidebarOpen(false)
    await logout()
    navigate('/')
  }

  const navLinks = username
    ? [
        { label: '🏠 Inicio', path: '/app' },
        { label: '🥗 Mi Dieta', path: '/app' },
        { label: '🏋️ Mis Ejercicios', path: '/app/ejercicios' },
        { label: '📋 Rutinas', path: '/app' },
        { label: '💊 Suplementación', path: '/app' },
      ]
    : [
        { label: 'Inicio', path: '/' },
        { label: 'Iniciar Sesión', path: '/login' },
        { label: 'Registrarse', path: '/registro' },
      ]

  return (
    <>
      <nav className="navbar">
        {showSidebar && (
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
        )}
        <Link className="navbar-brand" to={username ? '/app' : '/'}>
          FitTrack
        </Link>
        <div className="navbar-right">
          <DarkModeToggle />
          {username && (
            <>
              <button className="logout-btn" onClick={handleLogout}>
                Salir
              </button>
              <div className="avatar">
                <img src="https://i.pravatar.cc/40" alt="avatar" />
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
          />
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <ul>
              {navLinks.map(link => (
                <li
                  key={link.label}
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
            {username && (
              <div className="sidebar-user">
                <span>👤</span>
                <span style={{ flex: 1, fontSize: 12 }}>{username}</span>
                <button
                  style={{ background: 'none', border: 'none', color: '#ff6666', fontSize: 13, cursor: 'pointer' }}
                  onClick={handleLogout}
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