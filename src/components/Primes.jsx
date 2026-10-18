import { useState } from 'react'
import { bounties, findItem } from '../data/menu'
import { ItemModal } from './Menu'
import GomuPunch from './GomuPunch'
import Wanted from './Wanted'

// Inclinaisons des affiches (punaisées un peu de travers, comme au mur du resto).
const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5]

// ============================================================================
//  LES PRIMES DE L'ÉQUIPAGE — les plats signatures en avis de recherche.
//  La prime = le prix. Clic sur une affiche = fiche du plat.
// ============================================================================
export default function Primes() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="primes" className="relative py-20 overflow-hidden bg-surface2/50">
      {/* Planches de bois du mur */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgb(var(--ink)) 0 2px, transparent 2px 90px)' }}
        aria-hidden="true"
      />

      <GomuPunch>
        <div className="text-center">
          <p className="section-label">Avis de recherche</p>
          <h2 className="section-title">
            Les primes<br className="sm:hidden" /> de l’<span className="text-primary">équipage</span>
          </h2>
        </div>
      </GomuPunch>

      <p className="relative text-center font-sans text-sm text-ink/55 max-w-md mx-auto px-6 -mt-2">
        Nos plats les plus recherchés. Récompense : un estomac de pirate comblé.
      </p>

      <div className="relative max-w-6xl mx-auto px-6 mt-12 grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-10">
        {bounties.map((b, i) => {
          const found = findItem(b.tab, b.name)
          if (!found) return null
          return (
            <Wanted
              key={b.name}
              emoji={b.emoji}
              photo={found.item.photo}
              name={b.name}
              alias={b.alias}
              bounty={found.item.price}
              tilt={TILTS[i % TILTS.length]}
              onClick={() => setSelected(found)}
            />
          )
        })}
      </div>

      {selected && (
        <ItemModal item={selected.item} cat={selected.cat} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
