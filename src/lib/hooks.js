import { useEffect, useRef, useState } from 'react'

// Ajoute la classe « is-visible » quand l'élément entre dans l'écran (une fois).
export function useReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible')
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

// Progression 0 → 1 d'un élément pendant qu'il traverse l'écran :
// 0 quand son haut touche le bas de l'écran, 1 quand son centre atteint
// `endAt` (fraction de la hauteur d'écran, 0.5 = milieu).
export function useSectionProgress(endAt = 0.45) {
  const ref = useRef(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh
      const end = vh * endAt - r.height / 2
      const v = (start - r.top) / (start - end)
      setP(Math.min(1, Math.max(0, v)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [endAt])
  return [ref, p]
}

// Heure courante rafraîchie chaque minute (statut « Ouvert maintenant »).
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
