import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null)
    const [isDark, setIsDark] = useState(true)

    const login = (nombre) => setUsername(nombre)
    const logout = () => setUsername(null)

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
        <AuthContext.Provider value={{ username, isDark, login, logout, toggleDark }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)