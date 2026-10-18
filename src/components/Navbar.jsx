import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { JollyRoger } from './art'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Le navire', href: '#about' },
  { label: 'Primes', href: '#primes' },
  { label: 'La carte', href: '#menu' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Nous trouver', href: '#visite' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] md:h-[68px] transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-page/95 backdrop-blur-sm border-b-2 border-ink/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl h-full mx-auto px-4 md:px-5 flex items-center justify-between gap-3">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <JollyRoger className="w-10 h-10 md:w-11 md:h-11 transition-transform duration-500 group-hover:rotate-[-12deg]" />
          <span className="leading-none">
            <span className="block font-serif font-black text-lg md:text-xl tracking-wide text-ink">ONE PIECE</span>
            <span className="hidden sm:block font-serif text-[9px] tracking-[0.35em] text-gold uppercase mt-0.5">Grand Line Cuisine</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-[12px] font-semibold tracking-wider uppercase text-ink/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#commander" className="hidden md:inline-flex btn-primary text-[11px] !py-2.5 !px-5">
            🛒 Commander
            {count > 0 && (
              <span className="ml-1 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-on-primary text-primary text-[11px] font-extrabold">
                {count}
              </span>
            )}
          </a>
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 rounded bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 rounded bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 rounded bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-page border-y-2 border-ink/10 px-6 py-6 flex flex-col gap-5 shadow-card">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm font-semibold tracking-wide uppercase text-ink/80 hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#commander" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
            🛒 Commander{count > 0 ? ` (${count})` : ''}
          </a>
        </div>
      )}
    </nav>
  )
}
