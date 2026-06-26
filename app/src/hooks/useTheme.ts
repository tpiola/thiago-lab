import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('thiagolab-theme')
      if (stored === 'light' || stored === 'dark') return stored
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('thiagolab-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle, isDark: theme === 'dark' }
}
