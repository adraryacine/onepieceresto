import { useState } from 'react'
import { useCart, formatPrice } from '../context/CartContext'
import { siteConfig, waHeader, isFriday, openStatus } from '../data/siteConfig'
import { CURRENCY, FRIDAY_TABS } from '../data/menu'
import { addOrder, ORDER_MODES } from '../data/orders'
import { isSupabaseConfigured } from '../lib/supabase'
import { useNow } from '../lib/hooks'
import { CompassDivider, JollyRoger } from './art'

const MODE_ICON = { 'Sur place': '🍽️', 'À emporter': '🥡', 'Livraison': '🛵' }

// Message WhatsApp de secours (si l'enregistrement en ligne est indisponible).
function whatsappUrl(form, items, total) {
  const lines = [
    waHeader,
    '',
    ...items.map(i => `• ${i.qty} × ${i.name} — ${formatPrice(i.price * i.qty)} ${CURRENCY}`),
    '',
    `Total : ${formatPrice(total)} ${CURRENCY}`,
    `Nom : ${form.name}`,
    `Tél : ${form.phone}`,
    `Mode : ${form.mode}${form.mode === 'Sur place' && form.table ? ` (table ${form.table})` : ''}`,
    form.mode === 'Livraison' ? `Adresse : ${form.address}` : null,
    form.notes ? `Note : ${form.notes}` : null,
  ].filter(l => l !== null)
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function Order() {
  const { items, updateQty, removeItem, total, clear } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', mode: 'À emporter', table: '', address: '', notes: '' })
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const now = useNow()
  const status = openStatus(now)

  // Vendredi : uniquement burgers & pizzas.
  const fridayOff = isFriday(now) ? items.filter(i => i.tab && !FRIDAY_TABS.includes(i.tab)) : []

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (items.length === 0 || saving || fridayOff.length) return

    if (!isSupabaseConfigured) {
      window.open(whatsappUrl(form, items, total), '_blank', 'noopener')
      return
    }

    setSaving(true)
    setError(false)
    try {
      await addOrder({
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          mode: form.mode,
          table: form.mode === 'Sur place' ? form.table.trim() : '',
          address: form.mode === 'Livraison' ? form.address.trim() : '',
          notes: form.notes.trim(),
        },
        items: items.map(i => ({
          name: i.name, category: i.category, qty: i.qty,
          unitPrice: i.price, lineTotal: i.price * i.qty,
        })),
        total,
      })
      setSent(true)
      clear()
    } catch (err) {
      console.error('[One Piece] Enregistrement commande échoué :', err)
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section id="commander" className="relative py-24 bg-surface2/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-label">Sur place · À emporter · Livraison</p>
          <h2 className="section-title">
            Passer <span className="text-primary">commande</span>
          </h2>
          <CompassDivider />
          <p className="font-sans text-sm text-ink/55">
            Composez votre panier depuis la carte — validez, nous vous rappelons pour confirmer
          </p>
          {!status.open && (
            <p className="mt-3 inline-block rounded-full bg-primary/10 border border-primary/30 px-4 py-1.5 font-sans text-xs text-ink/70">
              🌙 Le restaurant est fermé pour le moment{status.opensAt ? ` — réouverture à ${status.opensAt}` : ''}. Votre commande sera traitée à l’ouverture.
            </p>
          )}
        </div>

        {sent ? (
          <div className="card flex flex-col items-center justify-center text-center py-16 px-8 max-w-lg mx-auto">
            <JollyRoger className="w-24 h-24 mb-6 animate-bob" />
            <h3 className="font-display font-extrabold text-4xl text-ink mb-3">Commande reçue !</h3>
            <p className="font-sans text-sm text-ink/65 leading-relaxed">
              Merci moussaillon ! Votre commande a bien été enregistrée. 📞 Nous vous
              <span className="font-semibold text-ink"> rappelons au numéro indiqué </span>
              pour la confirmer et vous donner le délai. À tout de suite à bord ! 🏴‍☠️
            </p>
            <button onClick={() => setSent(false)} className="btn-primary mt-9 text-sm">
              Nouvelle commande
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Panier */}
            <div className="card p-7">
              <p className="font-display font-extrabold text-2xl text-ink mb-6">🛒 Mon panier</p>

              {items.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-ink/15 px-6 py-12 text-center">
                  <p className="text-4xl opacity-50 mb-4 select-none">🍖</p>
                  <p className="font-sans text-sm text-ink/55 mb-6">Votre panier est vide… Luffy a tout mangé ?</p>
                  <a href="#menu" className="btn-primary text-sm">Voir la carte</a>
                </div>
              ) : (
                <>
                  <div>
                    {items.map(i => {
                      const off = fridayOff.includes(i)
                      return (
                        <div key={i.key} className={`flex items-center gap-3 py-3.5 border-b border-ink/10 ${off ? 'opacity-60' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm font-semibold text-ink leading-snug">{i.name}</p>
                            <p className="font-sans text-[11px] text-ink/50 mt-0.5">
                              {i.category} · {formatPrice(i.price)} {CURRENCY}
                              {off && <span className="text-primary font-bold"> · pas servi le vendredi</span>}
                            </p>
                          </div>

                          <div className="flex items-center rounded-full border-2 border-ink/15 bg-surface2/60">
                            <button
                              onClick={() => updateQty(i.key, -1)}
                              aria-label="Retirer un"
                              className="w-7 h-7 flex items-center justify-center text-ink/60 hover:text-primary transition-colors"
                            >−</button>
                            <span className="w-7 text-center font-sans text-sm font-bold text-ink">{i.qty}</span>
                            <button
                              onClick={() => updateQty(i.key, 1)}
                              aria-label="Ajouter un"
                              className="w-7 h-7 flex items-center justify-center text-ink/60 hover:text-primary transition-colors"
                            >+</button>
                          </div>

                          <p className="font-display font-bold text-lg text-primary w-20 text-right whitespace-nowrap">
                            {formatPrice(i.price * i.qty)}<span className="text-[10px] ml-0.5">{CURRENCY}</span>
                          </p>

                          <button
                            onClick={() => removeItem(i.key)}
                            aria-label="Supprimer"
                            className="text-ink/30 hover:text-primary transition-colors text-lg leading-none"
                          >✕</button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-4 border-t-2 border-dashed border-ink/20">
                    <span className="font-sans text-xs font-bold text-ink/50 tracking-widest uppercase">Total</span>
                    <span className="font-display font-extrabold text-3xl text-primary">
                      {formatPrice(total)}<span className="text-base ml-1">{CURRENCY}</span>
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Formulaire */}
            <div className="card p-7">
              <p className="font-display font-extrabold text-2xl text-ink mb-6">📝 Vos coordonnées</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="o-name">Nom</label>
                  <input id="o-name" type="text" name="name" value={form.name} onChange={handleChange} required
                    className="field" placeholder="Votre nom de pirate" autoComplete="name" />
                </div>

                <div>
                  <label className="field-label" htmlFor="o-phone">Téléphone</label>
                  <input id="o-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    pattern="[0-9 +]{9,16}" className="field" placeholder="06 XX XX XX XX" autoComplete="tel" />
                </div>

                <div>
                  <span className="field-label">Mode</span>
                  <div className="grid grid-cols-3 gap-2">
                    {ORDER_MODES.map(mode => (
                      <button
                        key={mode} type="button"
                        onClick={() => setForm(prev => ({ ...prev, mode }))}
                        className={`rounded-full border-2 px-2 py-2.5 font-sans text-[11px] font-bold tracking-wide uppercase transition-all duration-300 ${
                          form.mode === mode
                            ? 'border-primary bg-primary text-on-primary'
                            : 'border-ink/15 text-ink/55 hover:border-primary/40'
                        }`}
                      >
                        {MODE_ICON[mode]} {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {form.mode === 'Sur place' && (
                  <div>
                    <label className="field-label" htmlFor="o-table">N° de table (si déjà installé)</label>
                    <input id="o-table" type="text" name="table" value={form.table} onChange={handleChange}
                      className="field" placeholder="ex. 4" inputMode="numeric" />
                  </div>
                )}

                {form.mode === 'Livraison' && (
                  <div>
                    <label className="field-label" htmlFor="o-address">Adresse</label>
                    <input id="o-address" type="text" name="address" value={form.address} onChange={handleChange} required
                      className="field" placeholder="Adresse de livraison" autoComplete="street-address" />
                  </div>
                )}

                <div>
                  <label className="field-label" htmlFor="o-notes">Note (optionnel)</label>
                  <textarea id="o-notes" name="notes" value={form.notes} onChange={handleChange} rows={2}
                    className="field resize-none" placeholder="Sans oignon, sauce à part, etc." />
                </div>

                {fridayOff.length > 0 && (
                  <p className="rounded-xl border-2 border-primary/30 bg-primary/10 px-4 py-2.5 font-sans text-xs text-ink/75">
                    📅 Aujourd’hui vendredi : seuls les <strong>burgers et pizzas</strong> sont servis.
                    Retirez les articles marqués pour valider.
                  </p>
                )}

                <button type="submit" disabled={items.length === 0 || saving || fridayOff.length > 0} className="btn-primary w-full text-sm">
                  {items.length === 0
                    ? 'Panier vide'
                    : saving
                      ? 'Envoi en cours…'
                      : isSupabaseConfigured
                        ? `Valider ma commande · ${formatPrice(total)} ${CURRENCY}`
                        : `Commander sur WhatsApp · ${formatPrice(total)} ${CURRENCY}`}
                </button>
                {error && (
                  <div className="text-center">
                    <p className="font-sans text-[11px] text-red-600">
                      Une erreur est survenue. Vérifiez votre connexion et réessayez —
                    </p>
                    <a href={whatsappUrl(form, items, total)} target="_blank" rel="noopener noreferrer" className="font-sans text-[11px] font-bold text-primary underline">
                      ou envoyez la commande par WhatsApp
                    </a>
                  </div>
                )}
                <p className="font-sans text-[11px] text-ink/45 text-center">
                  📞 Vous serez rappelé pour confirmer — aucun paiement en ligne,
                  vous réglez sur place ou à la livraison.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
