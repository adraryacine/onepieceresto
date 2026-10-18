import { useEffect, useState } from 'react'
import { siteConfig, openStatus } from '../data/siteConfig'
import { useNow } from '../lib/hooks'
import { AnchorO, Wheel, Compass, Waves, Ship } from './art'
import Wanted from './Wanted'

// Défilement de la page (px), limité à la hauteur du hero, pour les effets de parallaxe.
function useHeroScroll() {
  const [y, setY] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setY(Math.min(window.scrollY, window.innerHeight * 1.2))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return y
}

export default function Hero() {
  const y = useHeroScroll()
  const now = useNow()
  const status = openStatus(now)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const shipX = 6 + (y / vh) * 110 // le navire traverse l'écran en scrollant

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col overflow-hidden paper vignette">
      <div className="absolute inset-0 chart-lines" aria-hidden="true" />

      {/* Rose des vents géante en filigrane, tourne au scroll */}
      <div
        className="absolute -right-24 -top-16 w-[420px] md:w-[560px] aspect-square pointer-events-none"
        style={{ transform: `rotate(${y * 0.15}deg)` }}
        aria-hidden="true"
      >
        <Compass className="w-full h-full text-gold/20" />
      </div>

      <div className="relative flex-1 max-w-7xl w-full mx-auto px-5 md:px-8 pt-28 md:pt-32 pb-10 grid lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-8 items-center">
        {/* ----- Texte ----- */}
        <div className="text-center lg:text-left" style={{ transform: `translateY(${y * 0.12}px)` }}>
          <div className="animate-rise">
            <p className="font-serif text-[11px] md:text-xs font-bold tracking-[0.4em] text-gold uppercase">
              Restaurant · Café · Lounge — Béjaïa
            </p>

            {/* Enseigne : ancre en guise de « O », gouvernail entre les deux mots */}
            <h1 className="mt-5 font-serif font-black text-ink leading-[0.9] tracking-wide flex flex-wrap items-center justify-center lg:justify-start gap-x-3 text-[clamp(3.2rem,11vw,7.5rem)]">
              <span className="inline-flex items-center">
                <AnchorO className="w-[0.82em] h-[0.82em] text-ink" />
                <span>NE</span>
              </span>
              <Wheel className="w-[0.62em] h-[0.62em] text-primary" spin={y * 0.6} />
              <span>PIECE</span>
            </h1>

            <div className="mt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="h-px w-10 bg-gold" />
              <p className="font-serif text-sm md:text-base tracking-[0.35em] text-gold uppercase">{siteConfig.tagline}</p>
              <span className="h-px w-10 bg-gold" />
            </div>

            <p className="mt-7 inline-block brush font-brush text-xl md:text-3xl px-4 py-1 -rotate-1">
              Mangez comme un vrai pirate !
            </p>

            <p className="mt-6 max-w-lg mx-auto lg:mx-0 font-sans text-[15px] text-ink/65 leading-relaxed">
              Burgers signatures, pizzas au four traditionnel, sushis & ramen de Wano,
              grillades et cocktails de la Grand Line — dans une salle couverte d'avis de recherche.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <a href="#menu" className="btn-primary text-sm">🗺️ Voir la carte</a>
              <a href="#commander" className="btn-ghost text-sm">🛒 Commander</a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start font-sans text-xs text-ink/60">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-surface/70 px-3 py-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${status.open ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {status.label}
                {status.open && status.until && <span className="font-normal text-ink/50">jusqu'à {status.until}</span>}
                {!status.open && status.opensAt && <span className="font-normal text-ink/50">ouvre à {status.opensAt}</span>}
              </span>
              <span>⏰ 7j/7 · 9h → 00h <span className="text-ink/40">(ven. 18h → 00h)</span></span>
            </div>
          </div>
        </div>

        {/* ----- Avis de recherche : la façade ----- */}
        <div className="relative mx-auto w-[min(86vw,360px)]" style={{ transform: `translateY(${y * -0.06}px)` }}>
          <div className="animate-rise" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-6 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="animate-float">
              <Wanted
                photo="/images/gallery/facade.jpg"
                name="One Piece"
                alias="Le resto le plus recherché de Béjaïa"
                bounty="UN FESTIN"
                unit=""
                tilt={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ----- Mer + navire qui traverse au scroll ----- */}
      <div className="relative h-28 md:h-32 mt-auto" aria-hidden="true">
        <div className="absolute bottom-10 md:bottom-12 w-24 md:w-32" style={{ left: `${shipX}%` }}>
          <Ship className="w-full animate-bob" />
        </div>
        <Waves className="absolute bottom-0 inset-x-0 !h-24 md:!h-28" />
      </div>

      {/* Invitation à défiler */}
      <a href="#about" className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 font-serif text-[10px] tracking-[0.3em] text-ink/50 hover:text-primary transition-colors">
        LARGUEZ LES AMARRES
        <span className="animate-bounce text-base">⚓</span>
      </a>
    </section>
  )
}
