import { useSectionProgress } from '../lib/hooks'
import { Fist } from './art'

// Bras élastique horizontal ; `reach` = 0 → 1 (longueur relative au conteneur).
function Arm({ reach, hit }) {
  return (
    <div className="relative h-full" style={{ width: `${reach * 100}%` }}>
      {/* manche du gilet */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-8 h-11 rounded-r-lg bg-ribbon border-2 border-l-0 border-[#1E150E]" />
      {/* bras (s'affine en s'étirant) */}
      <div
        className="absolute left-6 right-10 top-1/2 -translate-y-1/2 bg-skin border-y-2 border-[#1E150E] rounded-r-full"
        style={{
          height: 16 - reach * 6,
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,.35), transparent 45%, rgba(0,0,0,.12))',
        }}
      />
      <Fist className={`absolute -right-1 top-1/2 -translate-y-1/2 w-14 h-12 drop-shadow-lg ${hit ? 'animate-shake' : ''}`} />
    </div>
  )
}

// ============================================================================
//  « GOMU GOMU NO PISTOL ! »
//  Un bras surgit du bord gauche de l'écran et s'étire en suivant le scroll
//  jusqu'à frapper le titre — puis « DON ! » à l'impact.
//  À placer HORS du conteneur centré (il doit occuper toute la largeur).
// ============================================================================
export default function GomuPunch({ children }) {
  const [ref, p] = useSectionProgress(0.5)
  // Le bras traîne puis part d'un coup (coup de poing).
  const reach = p < 0.6 ? p * 0.5 : 0.3 + ((p - 0.6) / 0.4) * 0.7
  const hit = p >= 0.995

  return (
    <div ref={ref} className="relative w-full overflow-hidden py-8">
      {/* Mobile : le bras passe au-dessus du titre */}
      <div className="md:hidden h-12 mb-3 pr-10" aria-hidden="true">
        <Arm reach={reach} hit={hit} />
      </div>

      <div className="flex items-center">
        <div className="hidden md:block flex-1 h-12" aria-hidden="true">
          <Arm reach={reach} hit={hit} />
        </div>
        <div className={`relative shrink-0 px-6 mx-auto ${hit ? 'animate-shake' : ''}`}>
          {hit && (
            <span
              className="absolute -top-8 -right-4 md:-right-14 rotate-[-6deg] font-brush text-4xl md:text-6xl text-primary animate-impact select-none pointer-events-none"
              style={{ textShadow: '3px 3px 0 rgb(var(--ink) / .85)' }}
              aria-hidden="true"
            >
              DON !
            </span>
          )}
          {children}
        </div>
        <div className="hidden md:block flex-1" />
      </div>
    </div>
  )
}
