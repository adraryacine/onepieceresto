import { useState, useEffect, useMemo, useRef } from 'react'
import { formatPrice } from '../context/CartContext'
import { CURRENCY } from '../data/menu'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  loadOrders, setOrderStatus, deleteOrder, clearOrders, subscribeOrders, checkIsStaff,
  ORDER_STATUSES, ORDER_CANCELLED, ORDER_LOST, ALL_STATUSES, TERMINAL_STATUSES,
} from '../data/orders'
import { startAlarm, stopAlarm, unlockAudio } from '../lib/alarm'
import { JollyRoger } from './art'
import ThemeToggle from './ThemeToggle'

// Statut d'une commande fraîchement reçue, non encore traitée par le personnel.
const ORDER_RECEIVED = ORDER_STATUSES[0] // « Reçue »

// Couleurs de pastille par statut.
const STATUS_STYLE = {
  'Reçue':      'bg-primary/15 text-primary border-primary/40',
  'En cuisine': 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  'Prête':      'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
  'Terminée':   'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  'Annulée':    'bg-ink/10 text-ink/45 border-ink/20',
  'Perdue':     'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
}

// Libellés courts pour les boutons de progression.
const SHORT_LABEL = { 'Reçue': 'Reçue', 'En cuisine': 'Cuisine', 'Prête': 'Prête', 'Terminée': 'Terminée' }

const MODE_LABEL = { 'Sur place': '🍽️ Sur place', 'À emporter': '🥡 À emporter', 'Livraison': '🛵 Livraison' }

const fmtNumber = n => (n ? `#${String(n).padStart(4, '0')}` : '')

const isToday = iso => {
  const d = new Date(iso)
  const n = new Date()
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
}

const fmtTime = iso =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })

/* ---------------------------------------------------------------- Utilitaires de dates */
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const endOfDay   = d => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x }
const addDays    = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }

// Date au format « AAAA-MM-JJ » (pour les <input type="date"> et les clés de jour).
const toInputDate = d => {
  const x = new Date(d)
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${x.getFullYear()}-${m}-${day}`
}

const fmtDay = d => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

// Périodes proposées dans le sélecteur.
// (« Aujourd'hui » n'est pas listé ici : le jour même figure déjà dans les
//  cartes du haut. Cette section est dédiée à l'historique.)
const PERIODS = [
  { id: '7d',    label: '7 jours' },
  { id: '30d',   label: '30 jours' },
  { id: 'month', label: 'Ce mois' },
  { id: 'custom', label: 'Personnalisé' },
]

// Renvoie les bornes { from, to } (Date) correspondant à une période.
function rangeForPeriod(period, customFrom, customTo) {
  const now = new Date()
  switch (period) {
    case 'today':  return { from: startOfDay(now), to: endOfDay(now) }
    case '7d':     return { from: startOfDay(addDays(now, -6)), to: endOfDay(now) }
    case '30d':    return { from: startOfDay(addDays(now, -29)), to: endOfDay(now) }
    case 'month':  return { from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), to: endOfDay(now) }
    case 'custom': return {
      from: startOfDay(customFrom ? new Date(customFrom) : now),
      to:   endOfDay(customTo ? new Date(customTo) : now),
    }
    default:       return { from: startOfDay(now), to: endOfDay(now) }
  }
}

/* ---------------------------------------------------------------- Avertissement config */
function NotConfigured() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-page">
      <div className="card p-8 w-full max-w-md text-center">
        <p className="text-4xl mb-4">⚙️</p>
        <h1 className="font-display font-extrabold text-3xl text-ink uppercase">Supabase non configuré</h1>
        <p className="font-sans text-sm text-ink/55 mt-3 leading-relaxed">
          Renseignez <code className="bg-page px-1 rounded">VITE_SUPABASE_URL</code> et
          {' '}<code className="bg-page px-1 rounded">VITE_SUPABASE_ANON_KEY</code> dans un
          fichier <code className="bg-page px-1 rounded">.env</code> (voir
          {' '}<code className="bg-page px-1 rounded">.env.example</code>), puis relancez
          {' '}<code className="bg-page px-1 rounded">npm run dev</code>.
        </p>
        <a href="#hero" className="btn-primary text-sm mt-6">← Retour au site</a>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Compte non autorisé */
function NotStaff({ email }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-page">
      <div className="card p-8 w-full max-w-md text-center">
        <JollyRoger className="w-16 h-16 mx-auto mb-4" />
        <h1 className="font-display font-extrabold text-3xl text-ink">Pas dans l’équipage</h1>
        <p className="font-sans text-sm text-ink/60 mt-3 leading-relaxed">
          Le compte <strong>{email}</strong> est bien connecté, mais il n’est pas encore
          enregistré comme membre du personnel. Ajoutez-le à la table <code className="bg-surface2 px-1 rounded">staff</code> (voir SUPABASE.md).
        </p>
        <button onClick={() => supabase.auth.signOut()} className="btn-primary text-sm mt-6">Se déconnecter</button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Écran de connexion */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Identifiants incorrects')
    setLoading(false)
    // En cas de succès, onAuthStateChange (dans Dashboard) bascule l'affichage.
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-page">
      <form onSubmit={submit} className="card p-8 w-full max-w-sm text-center">
        <JollyRoger className="w-20 h-20 mx-auto mb-4" />
        <h1 className="font-display font-extrabold text-3xl text-ink uppercase">Espace équipage</h1>
        <p className="font-sans text-xs text-ink/50 mt-1 mb-6">Connexion du personnel</p>

        <input
          type="email" autoFocus required value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="Email"
          className="w-full rounded-xl bg-surface border-2 border-ink/10 focus:border-primary px-4 py-3 font-sans text-sm text-ink outline-none mb-3"
        />
        <input
          type="password" required value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          placeholder="Mot de passe"
          className="w-full rounded-xl bg-surface border-2 border-ink/10 focus:border-primary px-4 py-3 font-sans text-sm text-ink outline-none"
        />
        {error && <p className="font-sans text-xs text-red-600 mt-2">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full text-sm mt-5">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        <a href="#hero" className="inline-block font-sans text-xs text-ink/40 hover:text-primary mt-4">← Retour au site</a>
      </form>
    </div>
  )
}

/* ---------------------------------------------------------------- Carte statistique */
function Stat({ label, value, sub }) {
  return (
    <div className="card p-5">
      <p className="font-sans text-[11px] font-bold text-ink/45 tracking-widest uppercase">{label}</p>
      <p className="font-display font-extrabold text-4xl text-ink mt-1.5">{value}</p>
      {sub && <p className="font-sans text-xs text-ink/45 mt-0.5">{sub}</p>}
    </div>
  )
}

/* ---------------------------------------------------------------- Chiffre d'affaires */
function Analytics({ orders }) {
  const [period, setPeriod] = useState('7d')
  const [customFrom, setCustomFrom] = useState(toInputDate(addDays(new Date(), -6)))
  const [customTo, setCustomTo] = useState(toInputDate(new Date()))

  const { from, to } = useMemo(
    () => rangeForPeriod(period, customFrom, customTo),
    [period, customFrom, customTo],
  )

  const data = useMemo(() => {
    const inRange = orders.filter(o => {
      // Le CA exclut les commandes annulées et perdues (non payées).
      if (o.status === ORDER_CANCELLED || o.status === ORDER_LOST) return false
      const t = new Date(o.createdAt).getTime()
      return t >= from.getTime() && t <= to.getTime()
    })
    const revenue = inRange.reduce((s, o) => s + (o.total || 0), 0)
    const count = inRange.length
    const avg = count ? revenue / count : 0

    // Recette cumulée par jour, pour le mini-graphe.
    const byDay = {}
    inRange.forEach(o => {
      const k = toInputDate(o.createdAt)
      byDay[k] = (byDay[k] || 0) + (o.total || 0)
    })
    const spanDays = Math.round((endOfDay(to) - startOfDay(from)) / 86400000) + 1
    const days = []
    // On n'affiche le graphe jour par jour que si la plage reste lisible.
    if (spanDays >= 1 && spanDays <= 62) {
      for (let i = 0; i < spanDays; i++) {
        const d = addDays(from, i)
        const k = toInputDate(d)
        days.push({ key: k, date: d, value: byDay[k] || 0 })
      }
    }
    const maxDay = days.reduce((m, d) => Math.max(m, d.value), 0)
    return { revenue, count, avg, days, maxDay }
  }, [orders, from, to])

  // Recette cumulée depuis le début (hors annulées / perdues).
  const allTime = useMemo(() => {
    const sales = orders.filter(o => o.status !== ORDER_CANCELLED && o.status !== ORDER_LOST)
    return {
      revenue: sales.reduce((s, o) => s + (o.total || 0), 0),
      count: sales.length,
    }
  }, [orders])

  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-ink uppercase">Chiffre d'affaires</h2>
          <p className="font-sans text-xs text-ink/45 mt-0.5">
            Recette totale : <span className="font-bold text-ink/60">{formatPrice(allTime.revenue)} {CURRENCY}</span> · {allTime.count} commande(s)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-bold tracking-wide transition-all ${
                period === p.id ? 'bg-primary text-on-primary' : 'bg-surface border-2 border-ink/15 text-ink/60 hover:border-primary/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {period === 'custom' && (
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <label className="font-sans text-xs font-bold text-ink/60">
            Du
            <input
              type="date" value={customFrom} max={customTo}
              onChange={e => setCustomFrom(e.target.value)}
              className="block mt-1 rounded-xl bg-surface border-2 border-ink/10 focus:border-primary px-3 py-2 font-sans text-sm text-ink outline-none"
            />
          </label>
          <label className="font-sans text-xs font-bold text-ink/60">
            Au
            <input
              type="date" value={customTo} min={customFrom} max={toInputDate(new Date())}
              onChange={e => setCustomTo(e.target.value)}
              className="block mt-1 rounded-xl bg-surface border-2 border-ink/10 focus:border-primary px-3 py-2 font-sans text-sm text-ink outline-none"
            />
          </label>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Recette" value={`${formatPrice(data.revenue)} ${CURRENCY}`} sub={`${fmtDay(from)} – ${fmtDay(to)}`} />
        <Stat label="Commandes" value={data.count} sub={`sur ${data.days.length || '—'} jour(s)`} />
        <Stat label="Panier moyen" value={`${formatPrice(data.avg)} ${CURRENCY}`} />
      </div>

      {data.days.length > 1 && data.maxDay > 0 && (
        <div className="card p-5 mt-4">
          <div className="flex items-end gap-1 h-40">
            {data.days.map(d => (
              <div key={d.key} className="flex-1 flex flex-col justify-end h-full group">
                <div
                  className="w-full rounded-t bg-primary/70 group-hover:bg-primary transition-colors"
                  style={{ height: `${Math.max(2, (d.value / data.maxDay) * 100)}%` }}
                  title={`${d.date.toLocaleDateString('fr-FR')} · ${formatPrice(d.value)} ${CURRENCY}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 font-sans text-[10px] text-ink/40">
            <span>{fmtDay(from)}</span>
            <span>{fmtDay(to)}</span>
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------------------------------------------------------------- Carte commande */
function OrderCard({ order, flash = false, onStatus, onCancel, onLost, onDelete }) {
  const { customer = {}, items = [] } = order
  const isCancelled = order.status === ORDER_CANCELLED
  const isLost = order.status === ORDER_LOST
  return (
    <div className={`card p-5 transition-all duration-300 ${flash ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-page' : ''}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-display font-extrabold text-xl text-ink leading-tight uppercase">
            {customer.name || 'Client'}
            {order.number && <span className="ml-2 font-serif text-sm text-gold">{fmtNumber(order.number)}</span>}
          </p>
          <p className="font-sans text-xs text-ink/50 mt-0.5">
            {customer.phone ? <a href={`tel:${customer.phone}`} className="hover:text-primary">📞 {customer.phone}</a> : '—'}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block rounded-full border px-3 py-1 font-sans text-[10px] font-bold tracking-wide uppercase ${STATUS_STYLE[order.status] || STATUS_STYLE['Reçue']}`}>
            {order.status}
          </span>
          <p className="font-sans text-[11px] text-ink/40 mt-1.5">{fmtTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 font-sans text-[11px]">
        <span className="rounded-full bg-page border border-ink/10 px-2.5 py-1 text-ink/60">
          {MODE_LABEL[customer.mode] || customer.mode || '—'}
        </span>
        {customer.mode === 'Sur place' && customer.table && (
          <span className="rounded-full bg-gold/15 border border-gold/40 px-2.5 py-1 font-bold text-ink/80">Table {customer.table}</span>
        )}
      </div>

      {customer.mode === 'Livraison' && customer.address && (
        <p className="font-sans text-xs text-ink/60 mt-2">📍 {customer.address}</p>
      )}

      <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
        {items.map((it, idx) => (
          <li key={idx} className="flex justify-between gap-3 py-2 font-sans text-sm">
            <span className="text-ink">
              <span className="font-bold text-primary-dark">{it.qty}×</span> {it.name}
              {it.variant ? <span className="text-ink/45"> · {it.variant}</span> : ''}
            </span>
            <span className="text-ink/60 whitespace-nowrap">{formatPrice(it.lineTotal)} {CURRENCY}</span>
          </li>
        ))}
      </ul>

      {customer.notes && (
        <p className="font-sans text-xs text-ink/60 mt-2 italic">📝 {customer.notes}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="font-sans text-[11px] font-bold text-ink/45 tracking-widest uppercase">Total</span>
        <span className="font-display font-extrabold text-2xl text-primary">{formatPrice(order.total)} <span className="text-sm">{CURRENCY}</span></span>
      </div>

      <div className="mt-4 pt-4 border-t border-ink/10">
        {flash && (
          <p className="mb-2 font-sans text-xs font-bold text-emerald-600">✓ Enregistré</p>
        )}
        {/* Progression : Reçue → Livraison → Livré */}
        <div className="flex gap-1.5">
          {ORDER_STATUSES.map(s => {
            const on = order.status === s
            return (
              <button
                key={s}
                onClick={() => onStatus(order.id, s)}
                className={`flex-1 rounded-full px-2 py-2 font-sans text-[11px] font-bold tracking-wide transition-all ${
                  on ? 'bg-ink text-page' : 'bg-page border-2 border-ink/10 text-ink/60 hover:border-primary/50'
                }`}
              >
                {SHORT_LABEL[s]}
              </button>
            )
          })}
        </div>

        {/* Actions spéciales */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {!isCancelled && !isLost && (
            <button
              onClick={() => onCancel(order.id)}
              className="rounded-full border-2 border-ink/10 px-3 py-1.5 font-sans text-[11px] font-bold text-ink/50 hover:border-ink/30 transition-colors"
            >
              Annuler
            </button>
          )}
          {!isLost && (
            <button
              onClick={() => onLost(order.id)}
              className="rounded-full border-2 border-red-200 px-3 py-1.5 font-sans text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              ⚠️ Perdue / non payée
            </button>
          )}
          {isCancelled && (
            <button
              onClick={() => onDelete(order.id)}
              className="ml-auto rounded-full border-2 border-red-200 px-3 py-1.5 font-sans text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              🗑 Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Tableau de bord */
export default function Dashboard() {
  const [session, setSession] = useState(undefined) // undefined = en cours de vérification
  const [orders, setOrders] = useState([])
  const [staff, setStaff] = useState(undefined)     // undefined = vérification en cours
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Reçue') // ouvre sur les nouvelles commandes
  const [query, setQuery] = useState('')
  const [flashId, setFlashId] = useState(null) // confirmation visuelle après action
  const [toast, setToast] = useState(null)     // petit message de confirmation
  const [muted, setMuted] = useState(false)    // sonnerie coupée manuellement
  const toastTimer = useRef()
  const prevPending = useRef(0)                 // suivi du nb de commandes « Reçue »

  // Suit l'état de connexion Supabase.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const refresh = async () => {
    try {
      setOrders(await loadOrders())
    } catch (e) {
      console.error('[One Piece] Chargement des commandes échoué :', e)
    } finally {
      setLoading(false)
    }
  }

  // Le compte connecté fait-il partie de l'équipage (table `staff`) ?
  useEffect(() => {
    if (!session) { setStaff(undefined); return }
    checkIsStaff().then(setStaff).catch(e => { console.error(e); setStaff(false) })
  }, [session])

  // Charge les commandes + s'abonne au temps réel une fois connecté.
  useEffect(() => {
    if (!session || !staff) return
    setLoading(true)
    refresh()
    const unsub = subscribeOrders(() => refresh())
    return unsub
  }, [session, staff])

  const stats = useMemo(() => {
    const today = orders.filter(o => isToday(o.createdAt))
    const active = orders.filter(o => !TERMINAL_STATUSES.includes(o.status))
    // La recette exclut les commandes annulées et perdues (non payées).
    const paidToday = today.filter(o => o.status !== ORDER_CANCELLED && o.status !== ORDER_LOST)
    return {
      todayCount: today.length,
      todayRevenue: paidToday.reduce((s, o) => s + (o.total || 0), 0),
      active: active.length,
      lostCount: orders.filter(o => o.status === ORDER_LOST).length,
    }
  }, [orders])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter(o => {
      if (filter !== 'Toutes' && o.status !== filter) return false
      if (!q) return true
      const hay = `${o.customer?.name} ${o.customer?.phone}`.toLowerCase()
      return hay.includes(q)
    })
  }, [orders, filter, query])

  // Nombre de commandes « Reçue » : c'est ce qui déclenche la sonnerie.
  const pendingCount = useMemo(
    () => orders.filter(o => o.status === ORDER_RECEIVED).length,
    [orders],
  )

  // Débloque l'audio au premier geste de l'utilisateur (politique anti-autoplay).
  useEffect(() => {
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  // Une NOUVELLE commande réactive toujours la sonnerie, même si le personnel
  // avait coupé le son pour la précédente.
  useEffect(() => {
    if (pendingCount > prevPending.current) setMuted(false)
    prevPending.current = pendingCount
  }, [pendingCount])

  // Sonne tant qu'il reste une commande à traiter et que le son n'est pas coupé.
  useEffect(() => {
    if (pendingCount > 0 && !muted) startAlarm()
    else stopAlarm()
    return stopAlarm
  }, [pendingCount, muted])

  // Mise à jour optimiste : l'UI réagit tout de suite, le realtime confirme.
  const flash = id => {
    setFlashId(id)
    setTimeout(() => setFlashId(f => (f === id ? null : f)), 1500)
  }
  const showToast = msg => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }
  const handleStatus = async (id, status) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
    flash(id)
    showToast(`Commande déplacée vers « ${status} »`)
    // Bascule sur la section du nouveau statut : on voit la commande y arriver
    // (avec son contour vert) — sauf si on est sur « Toutes ».
    setFilter(f => (f === 'Toutes' ? f : status))
    try { await setOrderStatus(id, status) } catch (e) { console.error(e); refresh(); showToast('⚠️ Échec — réessayez') }
  }
  const handleCancel = async id => {
    if (!confirm('Annuler cette commande ? (pas encore préparée, aucune perte)')) return
    handleStatus(id, ORDER_CANCELLED)
  }
  const handleLost = async id => {
    if (!confirm('Marquer « Perdue / non payée » ?\n\nLa commande reste enregistrée mais sort du chiffre d\'affaires.')) return
    handleStatus(id, ORDER_LOST)
  }
  const handleDelete = async id => {
    const o = orders.find(x => x.id === id)
    if (o && o.status !== ORDER_CANCELLED) {
      alert('On ne supprime qu\'une commande ANNULÉE.\nPour une commande préparée mais non récupérée, marquez-la « Perdue » afin d\'en garder la trace.')
      return
    }
    if (!confirm('Supprimer définitivement cette commande annulée ?')) return
    setOrders(prev => prev.filter(o => o.id !== id))
    try { await deleteOrder(id) } catch (e) { console.error(e); refresh() }
  }
  const handleClear = async () => {
    if (!confirm('Effacer TOUTES les commandes ? Cette action est irréversible.')) return
    try { await clearOrders(); setOrders([]) } catch (e) { console.error(e) }
  }
  const handleLogout = () => supabase.auth.signOut()

  if (!isSupabaseConfigured) return <NotConfigured />
  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-page font-sans text-sm text-ink/50">Chargement…</div>
  }
  if (!session) return <Login />
  if (staff === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-page font-sans text-sm text-ink/50">Vérification de l’équipage…</div>
  }
  if (!staff) return <NotStaff email={session.user?.email} />

  const tabs = ['Toutes', ...ALL_STATUSES]

  return (
    <div className="min-h-screen bg-page">
      {/* En-tête */}
      <header className="sticky top-0 z-20 bg-[#14110d] text-[#F1E6CF] border-b-2 border-[#D4AA5C]/40">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <JollyRoger className="w-10 h-10" />
            <div className="leading-tight">
              <p className="font-serif font-black text-lg tracking-wide">ONE PIECE</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#D4AA5C]">Tableau de bord</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <ThemeToggle />
            <button onClick={refresh} className="rounded-full border border-[#F1E6CF]/25 px-4 py-2 font-sans text-xs font-bold hover:bg-white/10 transition-colors">↻ Actualiser</button>
            <a href="#hero" className="hidden sm:inline-block rounded-full border border-[#F1E6CF]/25 px-4 py-2 font-sans text-xs font-bold hover:bg-white/10 transition-colors">Site ↗</a>
            <button onClick={handleLogout} className="rounded-full border border-[#F1E6CF]/25 px-4 py-2 font-sans text-xs font-bold hover:bg-white/10 transition-colors">Déconnexion</button>
          </div>
        </div>
      </header>

      {/* Bandeau d'alerte : nouvelles commandes à traiter (sonnerie active) */}
      {pendingCount > 0 && (
        <div className="sticky top-[64px] z-10 bg-primary text-on-primary shadow-pop animate-pulse-soft">
          <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => { setFilter(f => (f === 'Toutes' ? f : ORDER_RECEIVED)); unlockAudio() }}
              className="flex items-center gap-2.5 font-sans text-sm font-bold text-left"
            >
              <span className="text-xl leading-none">🔔</span>
              <span>
                {pendingCount} nouvelle{pendingCount > 1 ? 's' : ''} commande{pendingCount > 1 ? 's' : ''} à valider
                {muted && <span className="font-normal opacity-80"> · son coupé</span>}
              </span>
            </button>
            <button
              onClick={() => setMuted(m => !m)}
              className="shrink-0 rounded-full bg-on-primary/15 hover:bg-on-primary/25 border border-on-primary/30 px-4 py-1.5 font-sans text-xs font-bold transition-colors"
            >
              {muted ? '🔔 Réactiver le son' : '🔕 Couper le son'}
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* ===== Section 1 : Commandes du jour (priorité) ===== */}
        <h2 className="font-display font-extrabold text-2xl text-ink uppercase mb-4">Commandes du jour</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat label="Commandes du jour" value={stats.todayCount} />
          <Stat label="En cours" value={stats.active} sub="à traiter" />
          <Stat label="Recette du jour" value={`${formatPrice(stats.todayRevenue)} ${CURRENCY}`} />
          <Stat label="Non récupérées" value={stats.lostCount} sub="perdues / non payées" />
        </div>

        {/* Filtres + recherche */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map(t => {
              const n = t === 'Toutes' ? orders.length : orders.filter(o => o.status === t).length
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`rounded-full px-3.5 py-2 font-sans text-xs font-bold tracking-wide transition-all ${
                    filter === t ? 'bg-ink text-page' : 'bg-surface border-2 border-ink/15 text-ink/60 hover:border-primary/50'
                  }`}
                >
                  {t} <span className="opacity-60">{n}</span>
                </button>
              )
            })}
          </div>
          <div className="flex-1 min-w-[180px] flex items-center gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="🔍 Nom ou téléphone…"
              className="flex-1 rounded-full bg-surface border-2 border-ink/10 focus:border-primary px-4 py-2 font-sans text-sm text-ink outline-none placeholder:text-ink/30"
            />
            {orders.length > 0 && (
              <button onClick={handleClear} className="rounded-full border-2 border-ink/10 text-ink/40 hover:text-red-600 hover:border-red-300 px-3 py-2 font-sans text-xs font-bold transition-colors whitespace-nowrap">Tout effacer</button>
            )}
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <p className="font-sans text-sm text-ink/50 text-center py-20">Chargement des commandes…</p>
        ) : filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center text-center py-20 px-8">
            <p className="text-5xl opacity-30 mb-4 select-none">🧾</p>
            <p className="font-display font-extrabold text-2xl text-ink uppercase">Aucune commande</p>
            <p className="font-sans text-sm text-ink/50 mt-1">
              {orders.length === 0
                ? 'Les commandes passées depuis le site apparaîtront ici en direct.'
                : 'Aucune commande ne correspond à ce filtre.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(o => (
              <OrderCard
                key={o.id}
                order={o}
                flash={flashId === o.id}
                onStatus={handleStatus}
                onCancel={handleCancel}
                onLost={handleLost}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* ===== Section 2 : Chiffre d'affaires ===== */}
        <div className="pt-8 mt-10 border-t border-ink/10">
          <Analytics orders={orders} />
        </div>
      </main>

      {/* Toast de confirmation */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-modal-in">
          <div className="flex items-center gap-2 rounded-full bg-ink text-page px-6 py-3.5 shadow-pop font-sans text-sm font-bold">
            <span className="text-emerald-300 text-base">✓</span> {toast}
          </div>
        </div>
      )}
    </div>
  )
}
