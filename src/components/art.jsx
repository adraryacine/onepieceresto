// ============================================================================
//  Illustrations SVG maison (aucune image externe) : drapeau pirate au chapeau
//  de paille, boussole, ancre, gouvernail, vagues, navire, poing.
//  Elles suivent le thème via currentColor / variables CSS.
// ============================================================================

// Drapeau de l'équipage : tête de mort coiffée du chapeau de paille.
export function JollyRoger({ className = '', title = 'One Piece' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      {/* Os croisés */}
      <g fill="#F7EEDC" stroke="#1E150E" strokeWidth="2.5">
        <g transform="rotate(35 50 60)">
          <rect x="10" y="55" width="80" height="10" rx="5" />
          <circle cx="11" cy="54" r="6" /><circle cx="11" cy="66" r="6" />
          <circle cx="89" cy="54" r="6" /><circle cx="89" cy="66" r="6" />
        </g>
        <g transform="rotate(-35 50 60)">
          <rect x="10" y="55" width="80" height="10" rx="5" />
          <circle cx="11" cy="54" r="6" /><circle cx="11" cy="66" r="6" />
          <circle cx="89" cy="54" r="6" /><circle cx="89" cy="66" r="6" />
        </g>
      </g>
      {/* Crâne */}
      <g stroke="#1E150E" strokeWidth="2.5">
        <path d="M50 30c-15 0-25 10-25 24 0 8 4 13 9 16v8h32v-8c5-3 9-8 9-16 0-14-10-24-25-24z" fill="#F7EEDC" />
        <ellipse cx="41" cy="55" rx="6" ry="7" fill="#1E150E" />
        <ellipse cx="59" cy="55" rx="6" ry="7" fill="#1E150E" />
        <path d="M50 62l-3 6h6z" fill="#1E150E" strokeWidth="1.5" />
        <path d="M40 72v6M45 72v6M50 72v6M55 72v6M60 72v6" strokeWidth="1.8" fill="none" />
      </g>
      {/* Chapeau de paille */}
      <g stroke="#1E150E" strokeWidth="2.5">
        <ellipse cx="50" cy="35" rx="33" ry="7.5" fill="#E8B64C" />
        <path d="M30 35c0-14 9-22 20-22s20 8 20 22z" fill="#E8B64C" />
        <path d="M30.6 29.5h38.8c.4 1.7.6 3.6.6 5.5H30c0-1.9.2-3.8.6-5.5z" fill="#C8102E" />
      </g>
    </svg>
  )
}

// Chapeau de paille seul (décor, bouton de thème…).
export function StrawHat({ className = '' }) {
  return (
    <svg viewBox="0 0 100 50" className={className} aria-hidden="true">
      <g stroke="#1E150E" strokeWidth="2.5">
        <ellipse cx="50" cy="38" rx="46" ry="10" fill="#E8B64C" />
        <path d="M24 38c0-20 12-32 26-32s26 12 26 32z" fill="#E8B64C" />
        <path d="M24.8 29h50.4c.5 2.8.8 5.8.8 9H24c0-3.2.3-6.2.8-9z" fill="#C8102E" />
        <path d="M14 40c10 4 62 4 72 0" fill="none" strokeWidth="1.2" opacity=".5" />
      </g>
    </svg>
  )
}

// Rose des vents (en-têtes d'affiche, décors).
export function Compass({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="46" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="40" strokeWidth="0.8" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="22" strokeWidth="0.8" />
      <path d="M50 4v92M4 50h92" strokeWidth="0.6" opacity=".6" />
      <path d="M50 8L56 44 50 50 44 44zM50 92L44 56 50 50 56 56z" fill="currentColor" strokeWidth="0.8" />
      <path d="M92 50L56 56 50 50 56 44zM8 50L44 44 50 50 44 56z" strokeWidth="0.8" />
      <path d="M50 8L56 44 50 50zM50 92L44 56 50 50z" fill="currentColor" opacity=".35" />
      <path d="M76 24L54 46M24 76L46 54M76 76L54 54M24 24L46 46" strokeWidth="1" opacity=".7" />
    </svg>
  )
}

// Ancre dans un cercle — le « O » de l'enseigne lumineuse de la façade.
export function AnchorO({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="44" strokeWidth="7" />
      <g strokeWidth="6">
        <circle cx="50" cy="24" r="6" />
        <path d="M50 30v48M36 40h28M24 58c4 14 14 20 26 20s22-6 26-20" />
        <path d="M24 58l-5 6M24 58l7 3M76 58l5 6M76 58l-7 3" />
      </g>
    </svg>
  )
}

// Gouvernail (entre « ONE » et « PIECE » sur l'enseigne).
export function Wheel({ className = '', spin = 0 }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: '50% 50%' }}>
        <circle cx="50" cy="50" r="28" strokeWidth="6" />
        <circle cx="50" cy="50" r="8" strokeWidth="6" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <g key={a} transform={`rotate(${a} 50 50)`}>
            <path d="M50 42V8" strokeWidth="5" />
            <circle cx="50" cy="6" r="4" fill="currentColor" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  )
}

// Vagues façon estampe (bas des affiches), animées horizontalement.
export function Waves({ className = '' }) {
  const crest =
    'M0 40 Q 25 10 50 30 T 100 30 T 150 30 T 200 30 T 250 30 T 300 30 T 350 30 T 400 30 V 80 H 0 Z'
  return (
    <div className={`pointer-events-none relative h-20 overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-full w-[200%]" style={{ animation: 'wave-x 14s linear infinite' }}>
        <path d={crest} fill="rgb(var(--sea) / 0.35)" />
        <path d={crest} transform="translate(200 0)" fill="rgb(var(--sea) / 0.35)" />
      </svg>
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-[75%] w-[200%]" style={{ animation: 'wave-x 9s linear infinite reverse' }}>
        <path d={crest} fill="rgb(var(--sea) / 0.65)" />
        <path d={crest} transform="translate(200 0)" fill="rgb(var(--sea) / 0.65)" />
        <path d="M0 34 Q 25 8 50 28 T 100 28 T 150 28 T 200 28 T 250 28 T 300 28 T 350 28 T 400 28" stroke="#fff" strokeOpacity=".7" strokeWidth="2" fill="none" />
      </svg>
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-[45%] w-[200%]" style={{ animation: 'wave-x 6s linear infinite' }}>
        <path d={crest} fill="rgb(var(--sea))" />
        <path d={crest} transform="translate(200 0)" fill="rgb(var(--sea))" />
      </svg>
    </div>
  )
}

// Petit navire pirate (voile frappée du drapeau).
export function Ship({ className = '' }) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden="true">
      <g stroke="#1E150E" strokeWidth="2.5" strokeLinejoin="round">
        {/* mâts */}
        <path d="M80 12v92M40 40v62M120 40v62" fill="none" />
        {/* voiles */}
        <path d="M84 18c22 4 28 26 22 52H84z" fill="#F7EEDC" />
        <path d="M76 18c-22 4-28 26-22 52h22z" fill="#F7EEDC" />
        <path d="M43 44c14 4 16 18 12 34H43z" fill="#F7EEDC" />
        <path d="M117 44c-14 4-16 18-12 34h12z" fill="#F7EEDC" />
        {/* drapeau */}
        <path d="M80 12h18l-4 5 4 5H80z" fill="#1E150E" />
        {/* coque */}
        <path d="M14 96h132l-14 26H30z" fill="#9A5B2B" />
        <path d="M18 104h124" fill="none" strokeWidth="1.5" />
        <circle cx="50" cy="112" r="3" fill="#1E150E" /><circle cx="80" cy="112" r="3" fill="#1E150E" /><circle cx="110" cy="112" r="3" fill="#1E150E" />
        {/* figure de proue (tête de mouton façon Vogue Merry) */}
        <circle cx="146" cy="92" r="8" fill="#F7EEDC" />
      </g>
      {/* tête de mort sur la grande voile */}
      <g transform="translate(66 30) scale(.28)">
        <JollyRogerMark />
      </g>
    </svg>
  )
}

function JollyRogerMark() {
  return (
    <g stroke="#1E150E" strokeWidth="5" fill="none">
      <circle cx="50" cy="50" r="22" fill="#1E150E" />
      <path d="M20 85L80 20M20 20l60 65" />
    </g>
  )
}

// Poing (bout du bras élastique). Pointé vers la droite par défaut :
// paume à gauche (côté bras), 4 phalanges empilées à droite, pouce replié dessous.
export function Fist({ className = '', style }) {
  return (
    <svg viewBox="0 0 64 56" className={className} style={style} aria-hidden="true">
      <g stroke="#1E150E" strokeWidth="2.5" strokeLinejoin="round" fill="#F3C08F">
        <rect x="3" y="9" width="40" height="38" rx="12" />
        <rect x="32" y="6" width="26" height="12" rx="6" />
        <rect x="34" y="17" width="27" height="12" rx="6" />
        <rect x="34" y="28" width="26" height="12" rx="6" />
        <rect x="32" y="39" width="22" height="11" rx="5.5" />
        <path d="M12 38c4-6 14-8 24-5" fill="none" />
        <path d="M5 22c6 1 9 4 10 8" fill="none" strokeWidth="1.6" opacity=".55" />
      </g>
    </svg>
  )
}

// Petit séparateur de section : ligne · boussole · ligne (en-tête des affiches).
export function CompassDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 max-w-xs mx-auto my-6 text-ink ${className}`} aria-hidden="true">
      <span className="divider-line" />
      <Compass className="w-9 h-9 animate-spin-slow" />
      <span className="divider-line" />
    </div>
  )
}
