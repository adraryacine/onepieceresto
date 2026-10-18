import { createContext, useContext, useEffect, useState } from 'react'

// Deux ambiances : « light » = Parchemin (affiches menu), « dark » = Nuit
// (affiche des horaires, noir & or). Le choix est mémorisé sur l'appareil.
const ThemeContext = createContext(null)

function readTheme() {
  const t = document.documentElement.dataset.theme
  return t === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0B0A08' : '#F2E2BE')
    try { localStorage.setItem('op-theme', theme) } catch { /* stockage indisponible */ }
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme doit être utilisé dans un <ThemeProvider>')
  return ctx
}
