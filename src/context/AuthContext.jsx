import { createContext, useState, useContext, useEffect } from 'react'
import { logoutUsuario } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null
  })

  const login = (datosUsuario) => {
    const usuarioSimplificado = {
      id: datosUsuario.id,
      nombre: datosUsuario.nombre,
      email: datosUsuario.email,
      rolId: datosUsuario.rolId
    }

    setUser(usuarioSimplificado)
    localStorage.setItem("user", JSON.stringify(usuarioSimplificado))

    // 🔐 Guardar el token recibido
    if (datosUsuario.token) {
      setToken(datosUsuario.token)
      localStorage.setItem("token", datosUsuario.token)
    }
  }

  const logout = async () => {
    try {
      await logoutUsuario()
    } catch (error) {
      console.error("Error cerrando sesión en backend:", error)
    }

    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      setUser(storedUser ? JSON.parse(storedUser) : null)
      setToken(storedToken || null)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
