import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../data/siteConfig'
import { useReveal } from '../lib/hooks'
import { CompassDivider } from './art'

const photos = [
  { src: '/images/gallery/cocktail-rouge.jpg', alt: 'Cocktail rouge, Zoro et Luffy montent la garde' },
  { src: '/images/gallery/facade.jpg', alt: 'La façade du One Piece, de nuit' },
  { src: '/images/gallery/crepe-choco-1.jpg', alt: 'Crêpes roulées chocolat-pistache' },
  { src: '/images/gallery/cocktail-citron.jpg', alt: 'Frappé citron, Sabo, Ace et Luffy' },
  { src: '/images/gallery/cocktail-blue.jpg', alt: 'Cocktail bleu Grand Line' },
  { src: '/images/gallery/crepe-choco-2.jpg', alt: 'Dessert devant le navire' },
]

const posters = [
  { src: '/images/menu/couverture.jpg', alt: 'Couverture du menu' },
  { src: '/images/menu/menus-composes-2.jpg', alt: 'Menus composés : étudiant, kids, Wano' },
  { src: '/images/menu/menus-composes-1.jpg', alt: 'Menus composés : Mugiwara, familial, capitaine' },
  { src: '/images/menu/entrees.jpg', alt: 'Entrées' },
  { src: '/images/menu/wano.jpg', alt: 'Escale à Wano — univers asiatique' },
  { src: '/images/menu/burgers.jpg', alt: 'Burgers' },
  { src: '/images/menu/pizzas.jpg', alt: 'Pizzas' },
  { src: '/images/menu/plats-pates.jpg', alt: 'Plats principaux, grillades & pâtes' },
  { src: '/images/menu/crispy-tacos-frites.jpg', alt: 'Crispy, tacos & frites' },
]

function Lightbox({ list, index, onClose, onNav }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onNav])

  const item = list[index]
  return (
    <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 animate-overlay-in" onClick={onClose}>
      <img
        key={item.src}
        src={item.src}
        alt={item.alt}
        className="max-h-[86vh] max-w-full rounded-lg shadow-2xl animate-modal-in"
        onClick={e => e.stopPropagation()}
      />
      <p className="absolute bottom-5 inset-x-0 text-center font-sans text-sm text-white/70 px-6">{item.alt}</p>
      <button onClick={onClose} aria-label="Fermer" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white text-xl hover:bg-white/20">✕</button>
      <button onClick={e => { e.stopPropagation(); onNav(-1) }} aria-label="Précédente" className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white text-xl hover:bg-white/20">‹</button>
      <button onClick={e => { e.stopPropagation(); onNav(1) }} aria-label="Suivante" className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white text-xl hover:bg-white/20">›</button>
    </div>
  )
}

export default function Gallery() {
  const [view, setView] = useState('photos')
  const [open, setOpen] = useState(null)
  const list = view === 'photos' ? photos : posters
  const ref = useReveal()

  const nav = useCallback(d => setOpen(i => (i + d + list.length) % list.length), [list.length])
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="gallery" className="relative py-24">
      <div ref={ref} className="reveal max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="section-label">Journal de bord</p>
          <h2 className="section-title">
            La <span className="text-primary">galerie</span>
          </h2>
          <CompassDivider />
          <div className="inline-flex rounded-full border-2 border-ink/15 bg-surface p-1">
            {[['photos', '📸 À bord'], ['posters', '🗺️ Les affiches du menu']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`rounded-full px-4 py-2 font-sans text-xs font-bold tracking-wide transition-all ${
                  view === id ? 'bg-primary text-on-primary' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div key={view} className="columns-2 md:columns-3 gap-4 animate-rise">
          {list.map((p, i) => (
            <button
              key={p.src}
              onClick={() => setOpen(i)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border-2 border-ink/10 shadow-card"
            >
              <img src={p.src} alt={p.alt} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-left font-sans text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {p.alt}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
            📷 Suivre {siteConfig.social.instagramHandle}
          </a>
        </div>
      </div>

      {open !== null && <Lightbox list={list} index={open} onClose={close} onNav={nav} />}
    </section>
  )
}
