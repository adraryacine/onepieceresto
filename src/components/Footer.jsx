import { siteConfig } from '../data/siteConfig'
import { JollyRoger, Waves } from './art'

export default function Footer() {
  return (
    <footer className="relative">
      <Waves />
      <div className="bg-sea text-white pb-28 md:pb-10">
        <div className="max-w-6xl mx-auto px-6 pt-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <JollyRoger className="w-14 h-14" />
              <div className="leading-none">
                <p className="font-serif font-black text-2xl tracking-wide">ONE PIECE</p>
                <p className="font-serif text-[10px] tracking-[0.35em] uppercase text-white/70 mt-1">Restaurant & Lounge</p>
              </div>
            </div>
            <p className="font-script text-xl text-white/85 mt-4">Good food, good adventure</p>
          </div>

          <div className="font-sans text-sm space-y-1.5">
            <p className="font-serif font-bold text-xs tracking-widest uppercase text-white/60 mb-3">Nous trouver</p>
            <p>{siteConfig.address.line}</p>
            <p>{siteConfig.address.city}</p>
            <p className="pt-2 text-white/80">7j/7 · 9h → 00h</p>
            <p className="text-white/80">Vendredi · 18h → 00h <span className="text-white/60">(burgers & pizzas)</span></p>
          </div>

          <div className="font-sans text-sm space-y-1.5">
            <p className="font-serif font-bold text-xs tracking-widest uppercase text-white/60 mb-3">Contact</p>
            {siteConfig.phones.map(p => (
              <a key={p.e164} href={`tel:+${p.e164}`} className="block hover:underline">🐌 {p.display}</a>
            ))}
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="block hover:underline pt-2">
              📷 {siteConfig.social.instagramHandle}
            </a>
            <a href={siteConfig.directionsLink} target="_blank" rel="noopener noreferrer" className="block hover:underline">🧭 Itinéraire</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 font-sans text-[11px] text-white/60">
          <p>© {new Date().getFullYear()} {siteConfig.fullName} — Béjaïa</p>
          <a href="#/admin" className="hover:text-white transition-colors">⚓ Espace équipage</a>
        </div>
      </div>
    </footer>
  )
}
