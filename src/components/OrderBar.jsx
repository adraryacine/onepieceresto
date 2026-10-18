import { useCart } from '../context/CartContext'
import { siteConfig, waHeader } from '../data/siteConfig'

// Boutons flottants d'appel rapide (mobile).
export default function OrderBar() {
  const { count } = useCart()
  const waUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(waHeader)}`
  const telUrl = `tel:+${siteConfig.phones[0].e164}`

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 md:hidden">
      <div className="flex items-center gap-2 bg-surface/95 backdrop-blur border-2 border-ink/15 rounded-full p-1.5 shadow-card">
        <a href={telUrl} className="flex items-center gap-1.5 rounded-full bg-ink text-page px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wide">
          🐌 Appeler
        </a>
        <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-[#25D366] text-white px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wide">
          💬 WhatsApp
        </a>
        <a href="#commander" aria-label="Mon panier" className="relative flex items-center justify-center w-11 h-11 rounded-full bg-primary text-on-primary text-lg">
          🛒
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-ink text-page text-[11px] font-extrabold border-2 border-surface">
              {count}
            </span>
          )}
        </a>
      </div>
    </div>
  )
}
