import { useNavigate } from 'react-router-dom'
import { useAuth } from '../data/authContext.jsx'
import Navbar from '../components/Navbar.jsx'
import './Paginas.css'

const cards = [
  {
    id: 'dieta',
    label: 'Mi Dieta',
    path: '/app',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
  {
    id: 'ejercicios',
    label: 'Mis Ejercicios',
    path: '/app/ejercicios',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
  },
  {
    id: 'rutinas',
    label: 'Rutinas Predeterminadas',
    path: '/app',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    id: 'suplementacion',
    label: 'Suplementación',
    path: '/app',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  },
]

const PaginaApp = () => {
  const { username } = useAuth()
  const navigate = useNavigate()

  if (!username) {
    navigate('/login')
    return null
  }

  return (
    <div className="dashboard-page">
      <Navbar showSidebar={true} />
      <div className="dashboard-bg" />
      <div className="dashboard-overlay" />

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="dashboard-card"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => navigate(card.path)}
            >
              <div className="card-image-wrapper">
                <img src={card.image} alt={card.label} />
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