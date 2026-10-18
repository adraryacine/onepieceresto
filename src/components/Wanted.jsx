// Avis de recherche façon One Piece (les murs du resto en sont couverts).
// Le papier reste « parchemin » dans les deux thèmes — sur fond noir il ressort
// comme les affiches éclairées de la salle.
export default function Wanted({
  photo, emoji, name, alias, bounty, unit = 'DA',
  tilt = 0, className = '', onClick, children,
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`wanted group relative block w-full rounded-[3px] px-3 sm:px-4 pt-7 pb-4 [container-type:inline-size] text-center transition-transform duration-500 ${
        onClick ? 'cursor-pointer hover:!rotate-0 hover:-translate-y-2 hover:scale-[1.03]' : ''
      } ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <p className="font-serif font-black text-[clamp(1.2rem,17cqw,2.6rem)] leading-none tracking-[0.08em]">WANTED</p>

      <div className="relative mt-3 aspect-[4/3] overflow-hidden border-[3px] border-[#2A1C10] bg-[#2A1C10]/10">
        {photo ? (
          <img src={photo} alt={name} loading="lazy" className="w-full h-full object-cover sepia-[.25] transition-all duration-700 group-hover:sepia-0 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl md:text-7xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            {emoji}
          </div>
        )}
        {children}
      </div>

      <p className="font-serif font-bold text-[10px] tracking-[0.3em] mt-2 opacity-80">DEAD OR ALIVE</p>
      <p className="font-display font-extrabold text-[clamp(.9rem,8cqw,1.25rem)] leading-tight mt-1 uppercase">{name}</p>
      {alias && <p className="font-script text-base leading-tight opacity-75">« {alias} »</p>}
      {bounty && (
        <p className="mt-2 flex items-baseline justify-center gap-1.5 font-serif font-black text-[clamp(1.1rem,10cqw,1.5rem)] tracking-wide">
          <span className="text-base opacity-70">฿</span>
          {bounty}
          <span className="text-sm">{unit}</span>
        </p>
      )}
      <p className="font-serif text-[8px] tracking-[0.4em] mt-1.5 opacity-50">MARINE</p>
    </Tag>
  )
}
