import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("[AuthProvider] Checking for token...")
    const token = localStorage.getItem('cui_token')
    console.log("[AuthProvider] Token found:", !!token)
    if (token) {
      api.me()
        .then(data => {
          console.log("[AuthProvider] api.me() success, user:", data.user)
          setUser(data.user)
        })
        .catch((err) => {
          console.error('Session verification failed:', err.message)
          localStorage.removeItem('cui_token')
        })
        .finally(() => setLoading(false))
    } else {
      console.log("[AuthProvider] No token, setting loading=false")
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      console.log("[useAuth.login] Calling api.login with:", email)
      const data = await api.login({ email, password })
      console.log("[useAuth.login] api.login response:", data)
      
      // If login is successful and we get a token
      if (data.token) {
        console.log("[useAuth.login] Setting token and user")
        localStorage.setItem('cui_token', data.token)
        setUser(data.user)
      }
      console.log("[useAuth.login] Returning user:", data.user)
      return data.user
    } catch (err) {
      // Enhanced logging for debugging
      console.error('Login error in useAuth:', {
        status: err.status,
        message: err.message
      })
      throw err
    }
  }

  const register = async (formData) => {
    try {
      const data = await api.register(formData)
      
      // If registration returns a token (e.g. for faculty auto-approval)
      if (data.token) {
        localStorage.setItem('cui_token', data.token)
        setUser(data.user)
      }
      return data
    } catch (err) {
      console.error('Registration error in useAuth:', err.message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('cui_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
