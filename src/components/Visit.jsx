import { siteConfig, openStatus } from '../data/siteConfig'
import { useNow, useReveal } from '../lib/hooks'
import { CompassDivider, Compass } from './art'

// Semaine algérienne : du samedi au vendredi.
const WEEK = [
  [6, 'Samedi'], [0, 'Dimanche'], [1, 'Lundi'], [2, 'Mardi'],
  [3, 'Mercredi'], [4, 'Jeudi'], [5, 'Vendredi'],
]

const fmtHour = h => (h === 24 ? '00h00' : `${h}h00`)

export default function Visit() {
  const now = useNow()
  const status = openStatus(now)
  const today = now.getDay()
  const ref = useReveal()

  return (
    <section id="visite" className="relative py-24 overflow-hidden">
      <Compass className="absolute -left-32 bottom-0 w-[420px] text-ink/[0.05] pointer-events-none" />

      <div ref={ref} className="reveal relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-label">Log Pose</p>
          <h2 className="section-title">
            Cap sur le <span className="text-primary">One Piece</span>
          </h2>
          <CompassDivider />
          <p className="font-sans text-sm text-ink/55">{siteConfig.address.line} · {siteConfig.address.city}</p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          {/* Affiche officielle des horaires (version nuit, noir & or) */}
          <figure className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="absolute -inset-3 rounded-3xl bg-gold/15 blur-2xl" aria-hidden="true" />
            <img
              src="/images/gallery/affiche-horaires.jpg"
              alt="Affiche des horaires : tous les jours 9h00 → 00h00, vendredi 18h00 → 00h00 (uniquement burger et pizza)"
              loading="lazy"
              className="relative w-full rounded-2xl border-2 border-gold/40 shadow-card"
            />
          </figure>

          <div className="space-y-6">
            {/* Horaires */}
            <div className="card p-6 md:p-7">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                <h3 className="font-serif font-bold text-xl text-ink tracking-wide">Horaires de travail</h3>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-sans text-xs font-bold ${
                  status.open ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/15 text-red-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${status.open ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {status.label}
                </span>
              </div>
              <ul className="divide-y divide-ink/10">
                {WEEK.map(([d, name]) => {
                  const slot = siteConfig.hours.find(s => s.days.includes(d))
                  const isToday = d === today
                  return (
                    <li key={d} className={`flex items-center justify-between gap-3 py-2.5 font-sans text-sm ${isToday ? 'font-bold text-ink' : 'text-ink/65'}`}>
                      <span className="flex items-center gap-2">
                        {isToday && <span className="text-primary">➤</span>}
                        {name}
                        {slot?.note && <span className="font-script text-[15px] font-normal text-gold">— {slot.note}</span>}
                      </span>
                      <span className="font-serif tracking-wide whitespace-nowrap">
                        {fmtHour(slot.open)} → {fmtHour(slot.close)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">
              {siteConfig.phones.map((p, i) => (
                <a key={p.e164} href={`tel:+${p.e164}`} className="card p-5 flex items-center gap-4 group hover:border-primary/50 transition-colors">
                  <span className="text-3xl transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true">🐌</span>
                  <span>
                    <span className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ink/45">
                      Den Den Mushi {i + 1}
                    </span>
                    <span className="block font-display font-bold text-xl text-ink group-hover:text-primary transition-colors">{p.display}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Carte + itinéraire */}
        <div className="mt-14">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="section-label">Carte au trésor</p>
              <h3 className="font-display font-extrabold text-3xl text-ink">
                Notre <span className="text-primary">emplacement</span>
              </h3>
              <p className="font-sans text-sm text-ink/55 mt-1">{siteConfig.address.line}, {siteConfig.address.city}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={siteConfig.directionsLink} target="_blank" rel="noopener noreferrer" className="btn-sea">
                🧭 Itinéraire
              </a>
              <a href={siteConfig.mapLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Ouvrir dans Maps ↗
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl border-4 border-surface overflow-hidden shadow-card">
            <iframe
              title="Localisation du restaurant One Piece"
              src={siteConfig.mapEmbedUrl}
              className="w-full h-[340px] md:h-[440px] dark:[filter:invert(.9)_hue-rotate(180deg)_saturate(.6)]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* « X » de la carte au trésor */}
            <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-surface/90 border-2 border-ink/15 px-3 py-1 font-brush text-sm text-primary shadow-card">
              ✕ Le trésor est ici
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
