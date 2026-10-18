import { useReveal } from '../lib/hooks'
import { menu } from '../data/menu'
import { CompassDivider, StrawHat } from './art'

const dishCount = Object.values(menu).flat().reduce((n, cat) => n + cat.items.length, 0)

const features = [
  {
    icon: '🍔',
    title: 'Cuisine de la Grand Line',
    text: 'Burgers signatures, pizzas pâte américaine au four traditionnel, grillades, pâtes… de quoi rassasier tout l’équipage.',
  },
  {
    icon: '🍣',
    title: 'Escale à Wano',
    text: 'Sushis, makis, ramen, gyoza, nems, poulet karaagé, teriyaki ou coréen : l’univers asiatique du chef.',
  },
  {
    icon: '🏴‍☠️',
    title: 'Une salle 100 % One Piece',
    text: 'Murs couverts d’avis de recherche, navire en bois, figurines de l’équipage, lustre-gouvernail. On y mange comme un vrai pirate.',
  },
]

const stats = [
  { value: `${dishCount}+`, label: 'plats à la carte' },
  { value: '7j/7', label: 'jusqu’à minuit' },
  { value: '2 600+', label: 'pirates sur Instagram' },
]

export default function About() {
  const textRef = useReveal()
  const photosRef = useReveal()

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        {/* Collage photos */}
        <div ref={photosRef} className="reveal relative h-[440px] md:h-[520px] order-2 lg:order-1">
          <figure className="absolute left-0 top-6 w-[62%] rotate-[-4deg] bg-[#F7EEDC] p-2.5 pb-10 shadow-card">
            <img src="/images/gallery/cocktail-blue.jpg" alt="Cocktail bleu entouré des figurines de Luffy" loading="lazy" className="w-full aspect-[4/5] object-cover" />
            <figcaption className="absolute bottom-2 left-4 font-script text-lg text-[#2A1C10]">Blue Grand Line</figcaption>
          </figure>
          <figure className="absolute right-0 bottom-0 w-[58%] rotate-[5deg] bg-[#F7EEDC] p-2.5 pb-10 shadow-card">
            <img src="/images/gallery/crepe-choco-3.jpg" alt="Crêpes roulées au chocolat devant le navire" loading="lazy" className="w-full aspect-[4/5] object-cover" />
            <figcaption className="absolute bottom-2 inset-x-0 text-center font-script text-lg text-[#2A1C10]">Nos sucrés</figcaption>
          </figure>
          <StrawHat className="absolute right-[18%] top-0 w-28 rotate-12 drop-shadow-lg animate-float" />
        </div>

        {/* Texte */}
        <div ref={textRef} className="reveal order-1 lg:order-2 text-center lg:text-left">
          <p className="section-label">Le navire</p>
          <h2 className="section-title">
            Embarquez<br />à bord <span className="text-primary">!</span>
          </h2>
          <CompassDivider className="lg:mx-0" />
          <p className="font-sans text-[15px] text-ink/70 leading-relaxed">
            Au 4ème Quartier Dallas à Béjaïa, le <strong className="text-ink">One Piece</strong> a
            jeté l’ancre : un restaurant-café-lounge inspiré de l’univers du célèbre manga,
            où chaque plat a son nom de pirate et chaque mur son avis de recherche.
          </p>
          <p className="font-script text-2xl text-gold mt-5">« Good food, good adventure »</p>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {stats.map(s => (
              <div key={s.label} className="card px-3 py-4 text-center">
                <p className="font-display font-extrabold text-3xl text-primary leading-none">{s.value}</p>
                <p className="font-sans text-[10px] text-ink/50 uppercase tracking-wider mt-1.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Points forts */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-5 mt-16">
        {features.map((f, i) => (
          <Feature key={f.title} {...f} delay={i * 120} />
        ))}
      </div>
    </section>
  )
}

function Feature({ icon, title, text, delay }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      <div className="card h-full p-6 group hover:-translate-y-1 transition-transform duration-300">
        <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center text-2xl border-[3px] border-gold/70 transition-transform duration-500 group-hover:rotate-[20deg]">
          {icon}
        </div>
        <h3 className="font-display font-bold text-xl text-ink mt-4">{title}</h3>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mt-1.5">{text}</p>
      </div>
    </div>
  )
}
