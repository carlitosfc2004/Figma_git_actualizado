import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from './supabase.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
const [username, setUsername] = useState(null)
const [user, setUser] = useState(null)
const [isDark, setIsDark] = useState(true)

useEffect(() => {
    // Comprueba si hay sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        setUser(session.user)
        setUsername(session.user.email)
    }
    })

    // Escucha cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
        setUser(session.user)
        setUsername(session.user.email)
    } else {
        setUser(null)
        setUsername(null)
    }
    })

    return () => listener.subscription.unsubscribe()
}, [])

const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

const registro = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}

const logout = async () => {
    await supabase.auth.signOut()
}

const toggleDark = () => {
    setIsDark(prev => {
    if (prev) {
        document.documentElement.classList.add('light')
    } else {
        document.documentElement.classList.remove('light')
    }
    return !prev
    })
}

return (
    <AuthContext.Provider value={{ username, user, isDark, login, registro, logout, toggleDark }}>
    {children}
    </AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext)