import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string | null
  username: string
  role: string
}

const TOKEN_KEY = 'tl_auth_v3'
const USER_KEY = 'tl_user_v3'

function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

function setToken(token: string | null) {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY) } catch { /* */ }
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setStoredUser(user: User | null) {
  try { user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY) } catch { /* */ }
}

export { getToken }

export function useAuth() {
  const [user, setUserState] = useState<User | null>(getStoredUser)
  const [isLoading, setIsLoading] = useState(!getStoredUser())
  const [loginError, setLoginError] = useState<string | null>(null)

  // Verify token on mount
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    fetch('/api/trpc/auth.me', {
      method: 'GET',
      headers: { 'x-auth-token': token },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.result?.data) {
          const u = data.result.data as User
          setUserState(u)
          setStoredUser(u)
        } else {
          // Token invalid, clear
          setToken(null)
          setStoredUser(null)
          setUserState(null)
        }
      })
      .catch(() => {
        setToken(null)
        setStoredUser(null)
        setUserState(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const setUser = (u: User | null) => {
    setUserState(u)
    setStoredUser(u)
  }

  const login = async (username: string, password: string) => {
    setLoginError(null)
    try {
      const res = await fetch('/api/trpc/auth.login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (data?.error) {
        setLoginError(data.error.message || 'Erro de autenticacao')
        return null
      }

      const result = data?.result?.data
      if (result?.token && result?.user) {
        setToken(result.token)
        setUser(result.user as User)
        setLoginError(null)
        window.location.reload()
        return result
      } else {
        setLoginError('Resposta invalida do servidor')
        return null
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro de rede')
      return null
    }
  }

  const logout = () => {
    setToken(null)
    setStoredUser(null)
    setUserState(null)
    window.location.reload()
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    loginError,
  }
}
