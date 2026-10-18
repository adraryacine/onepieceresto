// ============================================================================
//  ONE PIECE — ALARME NOUVELLES COMMANDES
//  Petite sonnerie répétée jouée dans le tableau de bord tant qu'une commande
//  reste « Reçue » (non traitée par le personnel). Le son est généré à la volée
//  via la Web Audio API : aucun fichier audio à charger, fonctionne hors-ligne.
//
//  Note navigateur : un AudioContext démarre « suspended » et ne peut jouer
//  qu'après une interaction de l'utilisateur (politique anti-autoplay). On
//  appelle donc unlockAudio() au premier clic / touche dans le dashboard.
// ============================================================================

let ctx = null
let timer = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

// Débloque le contexte audio (à appeler depuis un geste utilisateur).
export function unlockAudio() {
  const c = getCtx()
  if (c && c.state === 'suspended') c.resume().catch(() => {})
}

// Joue un « bip-bip » court (deux tons).
function beep() {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => {})
  const now = c.currentTime
  ;[[0, 880], [0.18, 1175]].forEach(([offset, freq]) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, now + offset)
    gain.gain.exponentialRampToValueAtTime(0.3, now + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.15)
    osc.connect(gain).connect(c.destination)
    osc.start(now + offset)
    osc.stop(now + offset + 0.16)
  })
}

// Démarre la sonnerie répétée (idempotent).
export function startAlarm() {
  if (timer) return
  beep()
  timer = setInterval(beep, 1500)
}

// Arrête la sonnerie.
export function stopAlarm() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
