import './DarkModeToggle.css'
import { useAuthStore } from '../stores/useAuthStore.js'

const DarkModeToggle = () => {
  const isDark = useAuthStore((s) => s.isDark)
  const toggleDark = useAuthStore((s) => s.toggleDark)

  return (
    <button
      className="toggle-wrapper"
      onClick={toggleDark}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="toggle-label">{isDark ? 'Oscuro' : 'Claro'}</span>
      <div className={`toggle-track ${isDark ? 'on' : 'off'}`} aria-hidden="true">
        <div className="toggle-knob" />
      </div>
    </button>
  )
}

export default DarkModeToggle