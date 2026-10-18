import { useEffect, useState } from 'react'
import { useCart, parsePrice } from '../context/CartContext'
import { menu, tabs, CURRENCY, FRIDAY_TABS, findItem } from '../data/menu'
import { isFriday } from '../data/siteConfig'
import { useNow } from '../lib/hooks'
import { JollyRoger, CompassDivider } from './art'

const tabIcon = id => tabs.find(t => t.id === id)?.icon || '🏴‍☠️'

// Prix en pastille rouge (comme sur les affiches). « — » = prix pas encore communiqué.
export function Price({ value, big }) {
  if (value === '—') {
    return <span className="font-sans text-xs italic text-ink/45 whitespace-nowrap">Prix sur place</span>
  }
  return (
    <span className={`price-pill ${big ? 'text-3xl px-5 py-2' : 'text-[15px]'}`}>
      {value}<span className={big ? 'text-base ml-1' : 'text-[10px] ml-0.5'}>{CURRENCY}</span>
    </span>
  )
}

// Ligne de panier pour un plat.
function cartEntry(item, cat) {
  return {
    key: `${cat.category}::${item.name}`,
    name: item.name,
    category: cat.category,
    tab: cat.tab,
    variant: null,
    price: parsePrice(item.price),
    priceLabel: item.price,
    photo: item.photo || null,
  }
}

// Le vendredi, seuls les burgers et pizzas sont servis.
const isFridayBlocked = (tab, now) => isFriday(now) && !FRIDAY_TABS.includes(tab)

// Fiche produit : photo (ou placeholder) + ajout au panier.
// Pour une promo (`item.promo`), la fiche détaille l'offre.
export function ItemModal({ item, cat, onClose }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const now = useNow()
  const fridayBlocked = isFridayBlocked(cat.tab, now)
  const noPrice = item.price === '—'

  // Échap ferme la fiche.
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleAdd = () => {
    addItem(cartEntry(item, cat))
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-overlay-in"
      onClick={onClose}
    >
      <div
        className="card relative w-full max-w-md overflow-hidden animate-modal-in"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-surface border-2 border-ink/15 text-ink/60 hover:text-primary hover:border-primary hover:rotate-90 transition-all duration-300"
        >
          ✕
        </button>

        {item.photo ? (
          <div className="relative h-60 overflow-hidden">
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="relative h-48 flex flex-col items-center justify-center gap-3 overflow-hidden bg-[#14110d] chart-lines">
            <span className="absolute inset-0 opacity-30 text-[140px] flex items-center justify-center select-none" aria-hidden="true">{tabIcon(cat.tab)}</span>
            <JollyRoger className="relative w-20 h-20 animate-float" />
            <p className="relative font-serif text-[11px] text-[#F1E6CF]/70 tracking-widest uppercase">
              Photo bientôt disponible
            </p>
          </div>
        )}

        {item.promo && (
          <div className="relative bg-primary text-on-primary px-7 py-3 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🎓</span>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-lg uppercase">{item.promo.title}</p>
              <p className="font-sans text-[11px] opacity-85">{item.promo.text}</p>
            </div>
          </div>
        )}

        <div className="relative px-7 pb-7 pt-6">
          <span className="inline-block rounded-full bg-primary/10 border border-primary/30 px-3 py-1 font-sans text-[10px] font-bold text-primary tracking-widest uppercase">
            {cat.category}
          </span>
          <h3 className="font-display font-extrabold text-3xl text-ink leading-none mt-3">{item.name}</h3>
          {item.promo && item.desc ? (
            <ul className="mt-3 space-y-1.5">
              {item.desc.split(' · ').map(part => (
                <li key={part} className="flex items-center gap-2 font-sans text-sm text-ink/75">
                  <span className="text-primary">✔</span> {part}
                </li>
              ))}
            </ul>
          ) : item.desc && (
            <p className="font-sans text-[13px] text-ink/60 mt-2 leading-relaxed">{item.desc}</p>
          )}

          <div className="mt-5 mb-6">
            <Price value={item.price} big />
          </div>

          {fridayBlocked && (
            <p className="mb-3 rounded-xl border-2 border-primary/25 bg-primary/10 px-4 py-2.5 font-sans text-xs text-ink/70">
              🏴‍☠️ Le vendredi (18h → 00h), l’équipage ne sert que <strong>burgers et pizzas</strong>.
            </p>
          )}

          <button
            onClick={handleAdd}
            disabled={noPrice || fridayBlocked}
            className="btn-primary w-full text-sm"
          >
            {noPrice
              ? 'Disponible sur place'
              : added ? '✓ Ajouté au panier' : '🛒 Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Ligne de la carte : clic = fiche du plat ; bouton « + » = ajout direct au panier.
function MenuRow({ item, cat, onOpen }) {
  const { items, addItem } = useCart()
  const [added, setAdded] = useState(false)
  const now = useNow()
  const noPrice = item.price === '—'
  const blocked = isFridayBlocked(cat.tab, now)
  const inCart = items.find(i => i.key === `${cat.category}::${item.name}`)?.qty || 0

  const quickAdd = e => {
    e.stopPropagation()
    addItem(cartEntry(item, cat))
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <div
      onClick={onOpen}
      className="flex items-center gap-3 py-2.5 border-b border-ink/5 last:border-0 -mx-2 px-2 rounded-lg cursor-pointer group hover:bg-primary/[0.07] transition-colors"
    >
      <div className="w-10 h-10 shrink-0 overflow-hidden rounded-lg border-2 border-ink/10 group-hover:border-primary/50 transition-colors">
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink/[0.06] text-lg opacity-60 group-hover:opacity-100 transition-opacity">
            {tabIcon(cat.tab)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
          {item.name}
          {item.tag && (
            <span className="ml-2 align-middle inline-block rounded-full border border-gold/50 px-1.5 py-px font-serif text-[9px] font-bold tracking-wider text-gold uppercase">
              {item.tag}
            </span>
          )}
        </p>
        {item.desc && (
          <p className="font-sans text-[11px] text-ink/50 leading-tight mt-0.5 truncate">{item.desc}</p>
        )}
      </div>

      <Price value={item.price} />

      {!noPrice && (
        <button
          onClick={quickAdd}
          disabled={blocked}
          aria-label={`Ajouter ${item.name} au panier`}
          title={blocked ? 'Pas servi le vendredi' : 'Ajouter au panier'}
          className={`relative w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
            added
              ? 'bg-emerald-500 text-white scale-110'
              : 'bg-primary text-on-primary hover:bg-primary-dark hover:scale-110 shadow-pop'
          } disabled:opacity-30 disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed`}
        >
          <span key={added ? 'ok' : 'add'} className={added ? 'animate-impact' : ''}>{added ? '✓' : '+'}</span>
          {inCart > 0 && !added && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-ink text-page text-[10px] font-extrabold border-2 border-surface">
              {inCart}
            </span>
          )}
        </button>
      )}
    </div>
  )
}

function MenuCategory({ cat, tab, onItemClick }) {
  return (
    <div className="card break-inside-avoid mb-6 p-5 pt-6">
      {/* En-tête : médaillon noir + bandeau coup de pinceau (comme les affiches) */}
      <div className="flex items-center gap-3 pb-3 mb-2 border-b-2 border-dashed border-ink/15">
        <span className="w-11 h-11 shrink-0 rounded-full bg-[#14110d] border-2 border-gold/70 flex items-center justify-center text-xl shadow-md">
          {tabIcon(tab)}
        </span>
        <div className="min-w-0">
          <h3 className="brush inline-block font-display font-extrabold text-xl uppercase leading-none px-2 pt-1.5 pb-1">
            {cat.category}
          </h3>
          {cat.subtitle && (
            <p className="font-script text-[15px] text-ink/60 leading-snug mt-2">{cat.subtitle}</p>
          )}
        </div>
      </div>

      <div>
        {cat.items.map(item => (
          <MenuRow
            key={item.name}
            item={item}
            cat={{ ...cat, tab }}
            onOpen={() => onItemClick(item, { ...cat, tab })}
          />
        ))}
      </div>
    </div>
  )
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('menus')
  const [selected, setSelected] = useState(null)
  const friday = isFriday(useNow())

  return (
    <section id="menu" className="relative py-24 paper">
      <div className="absolute inset-0 chart-lines opacity-60" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="section-label">La carte</p>
          <h2 className="section-title">
            Notre <span className="text-primary">menu</span>
          </h2>
          <CompassDivider />
          <p className="font-sans text-sm text-ink/55">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary text-xs font-bold align-middle">+</span>
            {' '}pour ajouter directement au panier · cliquez sur un plat pour voir sa fiche
          </p>
        </div>

        {/* Bandeaux d'info */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => { setActiveTab('menus'); setSelected(findItem('menus', 'Menu Étudiant')) }}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-surface pl-4 pr-1.5 py-1.5 font-sans text-xs text-ink/75 hover:border-primary hover:-translate-y-0.5 transition-all"
          >
            🎓 <strong className="text-ink">Offre étudiant</strong> : burger + frites + boisson à <strong className="text-primary">500 DA</strong>
            <span className="ml-1 rounded-full bg-primary text-on-primary px-3 py-1 font-bold uppercase tracking-wide text-[10px] group-hover:bg-primary-dark">
              J’en profite →
            </span>
          </button>
          {friday && (
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 px-4 py-2 font-sans text-xs text-ink/80">
              📅 Aujourd’hui vendredi (18h → 00h) : <strong>burgers et pizzas uniquement</strong>
            </span>
          )}
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => {
            const off = friday && !FRIDAY_TABS.includes(tab.id)
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-bold tracking-wide uppercase transition-all duration-300 border-2 ${
                  activeTab === tab.id
                    ? 'border-primary bg-primary text-on-primary shadow-pop'
                    : 'border-ink/15 text-ink/65 hover:border-primary/40 hover:text-ink bg-surface'
                } ${off && activeTab !== tab.id ? 'opacity-50' : ''}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Catégories — grille masonry sur 2 colonnes */}
        <div key={activeTab} className="columns-1 md:columns-2 gap-6 animate-rise">
          {menu[activeTab].map(cat => (
            <MenuCategory
              key={cat.category}
              cat={cat}
              tab={activeTab}
              onItemClick={(item, c) => setSelected({ item, cat: c })}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="font-sans text-xs text-ink/45 mb-6">
            Prix en dinars algériens (DA) · La carte s’agrandit au fil des saisons
          </p>
          <a href="#commander" className="btn-primary text-sm">🛒 Voir ma commande</a>
        </div>
      </div>

      {selected && (
        <ItemModal item={selected.item} cat={selected.cat} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
