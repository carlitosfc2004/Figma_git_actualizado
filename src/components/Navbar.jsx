import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle.jsx'
import { useAuth } from '../data/authContext.jsx'
import './Navbar.css'

const Navbar = ({ showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { username } = useAuth()
  const location = useLocation()

  const navLinks = username
    ? [
        { label: 'Inicio', path: '/app' },
        { label: 'Mi Dieta', path: '/app' },
        { label: 'Mis Ejercicios', path: '/app' },
        { label: 'Rutinas Predeterminadas', path: '/app' },
        { label: 'Suplementación', path: '/app' },
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
            <div className="avatar">
              <img src="https://i.pravatar.cc/40" alt="avatar" />
            </div>
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
                <span>¡Bienvenido {username}!</span>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  )
}

export default Navbar