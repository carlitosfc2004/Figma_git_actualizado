import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore.js'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const cards = [
  {
    id: 'ejercicios',
    label: 'Mis Ejercicios',
    path: '/app/ejercicios',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
  },
  {
    id: 'rutinas',
    label: 'Mis Rutinas',
    path: '/app/rutinas',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    id: 'dieta',
    label: 'Mi Dieta',
    path: '/app',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
  {
    id: 'suplementacion',
    label: 'Suplementación',
    path: '/app',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  },
]

const PaginaApp = () => {
  const username = useAuthStore((s) => s.username)
  const navigate = useNavigate()

  if (!username) {
    navigate('/login')
    return null
  }

  return (
    <div className="dashboard-page">
      <Navbar showSidebar={true} />
      <div className="dashboard-bg" aria-hidden="true" />
      <div className="dashboard-overlay" aria-hidden="true" />

      <main className="dashboard-main" id="main-content">
        <div className="dashboard-grid" role="list" aria-label="Secciones de la aplicación">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="dashboard-card"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => navigate(card.path)}
              role="listitem button"
              tabIndex={0}
              aria-label={card.label}
              onKeyDown={(e) => e.key === 'Enter' && navigate(card.path)}
            >
              <div className="card-image-wrapper">
                <img src={card.image} alt="" aria-hidden="true" />
              </div>
              <span className="card-label">{card.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default PaginaApp
