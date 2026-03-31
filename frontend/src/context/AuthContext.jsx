import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [showSessionAlert, setShowSessionAlert] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  const lastActivityRef = useRef(Date.now())
  const idleTimerRef = useRef(null)

  // Idle timeout - 5 minutes
  const IDLE_TIMEOUT = 5 * 60 * 1000

  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now()
  }

  const checkIdleTimeout = () => {
    if (user && Date.now() - lastActivityRef.current > IDLE_TIMEOUT) {
      logout()
      alert('Session expired due to inactivity')
    }
  }

  useEffect(() => {
    if (!user) return

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer)
    })

    // Check idle timeout every 30 seconds
    idleTimerRef.current = setInterval(checkIdleTimeout, 30000)

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer)
      })
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current)
      }
    }
  }, [user])

  const login = async (email, password, forceLogout = false) => {
    const res = await authApi.login(email, password, forceLogout)
    const { token, fullName, hasActiveSession, sessionId } = res.data

    if (hasActiveSession && !forceLogout) {
      setSessionData({ email, password, sessionId })
      setShowSessionAlert(true)
      return { hasActiveSession: true }
    }

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ email, fullName }))
      localStorage.setItem('sessionId', sessionId)
      setUser({ email, fullName })
      setShowSessionAlert(false)
      lastActivityRef.current = Date.now()
      return { hasActiveSession: false }
    }
  }

  const logout = async () => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      try {
        await authApi.logoutSession(sessionId)
      } catch (err) {
        console.error('Logout error:', err)
      }
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('sessionId')
    sessionStorage.removeItem('chatMessages')
    sessionStorage.removeItem('lastResult')
    setUser(null)
  }

  const forceLogoutOtherSession = async () => {
    if (sessionData) {
      await login(sessionData.email, sessionData.password, true)
      setShowSessionAlert(false)
      setSessionData(null)
    }
  }

  const cancelLogin = () => {
    setShowSessionAlert(false)
    setSessionData(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      showSessionAlert,
      forceLogoutOtherSession,
      cancelLogin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
