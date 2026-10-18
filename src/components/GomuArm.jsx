import { useEffect, useRef, useState } from 'react'
import { Fist } from './art'

// ============================================================================
//  GOMU GOMU NO… SCROLL !
//  Le bras de Luffy sert d'indicateur de défilement : il part de l'épaule
//  (manche rouge, en haut à droite) et s'étire à mesure qu'on descend.
//  Un ressort amorti donne l'effet caoutchouc : le bras dépasse un peu puis
//  revient, et s'affine quand il s'étire vite. Clic sur le poing = retour en
//  haut (le bras se rétracte d'un coup).
//  Sur mobile, le même bras s'étire horizontalement sous la barre de navigation.
// ============================================================================

const STIFFNESS = 0.08
const DAMPING = 0.78

export default function GomuArm() {
  const [state, setState] = useState({ len: 0, thin: 0, shout: false })
  const target = useRef(0)
  const len = useRef(0)
  const vel = useRef(0)
  const raf = useRef(0)
  const shoutTimer = useRef()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const readTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target.current = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }

    const tick = () => {
      if (reduced) {
        len.current = target.current
        vel.current = 0
      } else {
        vel.current = (vel.current + (target.current - len.current) * STIFFNESS) * DAMPING
        len.current += vel.current
      }
      const speed = Math.abs(vel.current)
      setState(s => ({ ...s, len: Math.max(0, len.current), thin: Math.min(1, speed * 40) }))
      if (Math.abs(target.current - len.current) > 0.0005 || speed > 0.0005) {
        raf.current = requestAnimationFrame(tick)
      } else {
        raf.current = 0
      }
    }

    const onScroll = () => {
      const before = target.current
      readTarget()
      // Gros coup de molette → « GOMU GOMU NO… » s'affiche un instant.
      if (Math.abs(target.current - before) > 0.04) {
        setState(s => ({ ...s, shout: true }))
        clearTimeout(shoutTimer.current)
        shoutTimer.current = setTimeout(() => setState(s => ({ ...s, shout: false })), 900)
      }
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    }

    readTarget()
    len.current = target.current
    raf.current = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf.current)
      clearTimeout(shoutTimer.current)
    }
  }, [])

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const { len: p, thin, shout } = state
  // L'avant-bras s'affine quand il s'étire vite (caoutchouc).
  const armW = 12 - thin * 5

  return (
    <>
      {/* ----- Bureau : bras vertical à droite ----- */}
      <div className="hidden md:block fixed right-3 top-[76px] bottom-6 z-40 w-12 pointer-events-none" aria-hidden="true">
        {/* Épaule : manche du gilet rouge */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-9 h-8 rounded-t-xl rounded-b-md bg-ribbon border-2 border-[#1E150E] shadow-md">
          <span className="absolute inset-x-1 bottom-1 h-px bg-[#1E150E]/40" />
        </div>
        {/* Bras + poing */}
        <div className="absolute left-0 right-0 top-7 bottom-10">
          <div
            className="absolute left-1/2 top-0 rounded-b-full bg-skin border-x-2 border-[#1E150E]"
            style={{
              width: armW,
              height: `${p * 100}%`,
              transform: 'translateX(-50%)',
              backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,.12), transparent 40%, rgba(255,255,255,.25) 60%, rgba(0,0,0,.08))',
            }}
          />
          <button
            onClick={toTop}
            title="Gomu Gomu no… retour en haut !"
            className="pointer-events-auto absolute left-1/2 group"
            style={{ top: `${p * 100}%`, transform: 'translate(-50%, -6px)' }}
          >
            <Fist className="w-12 h-11 rotate-90 drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
            {shout && (
              <span className="absolute right-12 top-1 whitespace-nowrap font-brush text-sm text-primary bg-surface/90 border-2 border-ink/15 rounded-full px-3 py-1 shadow-card animate-impact">
                Gomu Gomu no…
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ----- Mobile : bras horizontal sous la barre de navigation ----- */}
      <div className="md:hidden fixed left-0 right-0 top-[60px] z-40 h-5 pointer-events-none" aria-hidden="true">
        <div className="absolute left-0 top-0.5 w-4 h-4 rounded-r-md bg-ribbon border-2 border-l-0 border-[#1E150E]" />
        <div className="absolute left-3 right-7 top-1.5 h-2.5">
          <div
            className="absolute left-0 top-0 h-full bg-skin border-y-2 border-[#1E150E] rounded-r-full"
            style={{ width: `${p * 100}%`, height: Math.max(6, armW - 3) }}
          />
          <Fist className="absolute w-6 h-5 -top-1.5" style={{ left: `calc(${p * 100}% - 4px)` }} />
        </div>
      </div>
    </>
  )
}
