import './DarkModeToggle.css'
import { useAuth } from '../data/authContext.jsx'

const DarkModeToggle = () => {
  const { isDark, toggleDark } = useAuth()

  return (
    <div className="toggle-wrapper" onClick={toggleDark}>
        <span className="toggle-label">Modo Oscuro</span>
        <div className={`toggle-track ${isDark ? 'on' : 'off'}`}>
            <div className="toggle-knob" />
        </div>
    </div>
  )
}

export default DarkModeToggle