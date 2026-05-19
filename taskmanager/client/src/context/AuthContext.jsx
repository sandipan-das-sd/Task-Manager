import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/taskManagerApi'
import { STORAGE_KEY } from '../constants/task'
import { safeJsonParse } from '../utils/taskUtils'
import { AuthContext } from './auth-context-value'

function getInitialSession() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? safeJsonParse(stored) : null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getInitialSession)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const runAuthAction = useCallback(async (action) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const nextSession = await action()
      setSession(nextSession)
      return nextSession
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const login = useCallback(
    (payload) => runAuthAction(() => authApi.login(payload)),
    [runAuthAction],
  )

  const register = useCallback(
    (payload) => runAuthAction(() => authApi.register(payload)),
    [runAuthAction],
  )

  const logout = useCallback(() => {
    setSession(null)
    setAuthError('')
  }, [])

  const clearAuthError = useCallback(() => {
    setAuthError('')
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      authLoading,
      authError,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [
      session,
      authLoading,
      authError,
      login,
      register,
      logout,
      clearAuthError,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
