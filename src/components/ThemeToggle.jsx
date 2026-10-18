import { useTheme } from '../context/ThemeContext'

// Interrupteur Jour (parchemin) / Nuit (noir & or) : le soleil se couche,
// la lanterne s'allume.
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Passer en mode jour' : 'Passer en mode nuit'}
      title={isDark ? 'Mode jour — parchemin' : 'Mode nuit — lanterne'}
      className={`relative w-[60px] h-8 shrink-0 rounded-full border-2 transition-colors duration-500 ${
        isDark ? 'bg-[#1a160f] border-gold/50' : 'bg-[#bfe0f5] border-ink/20'
      } ${className}`}
    >
      {/* étoiles / nuages du fond */}
      <span className={`absolute left-2 top-1.5 text-[9px] transition-opacity duration-500 ${isDark ? 'opacity-90' : 'opacity-0'}`}>✦</span>
      <span className={`absolute left-4 top-3.5 text-[6px] text-gold transition-opacity duration-500 ${isDark ? 'opacity-90' : 'opacity-0'}`}>✦</span>
      <span className={`absolute right-2 top-1 text-[11px] transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-80'}`}>☁️</span>
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
          isDark ? 'translate-x-7 bg-[#2a2216] shadow-[0_0_12px_rgba(212,170,92,.8)]' : 'translate-x-0 bg-[#ffd25a] shadow-[0_0_10px_rgba(255,190,60,.8)]'
        }`}
      >
        <span className={isDark ? 'animate-flicker' : ''}>{isDark ? '🏮' : '☀️'}</span>
      </span>
    </button>
  )
}
