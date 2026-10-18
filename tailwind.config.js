/** @type {import('tailwindcss').Config} */

// Les couleurs passent par des variables CSS (voir src/index.css) :
// le thème « Parchemin » (jour) et le thème « Nuit » (noir & or, repris de
// l'affiche des horaires) partagent ainsi exactement les mêmes classes.
const v = name => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Variantes dark: actives quand <html data-theme="dark">.
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        page: v('page'),          // fond de page (parchemin / noir)
        surface: v('surface'),    // cartes
        surface2: v('surface-2'), // champs, zones en retrait
        ink: v('ink'),            // texte principal
        primary: v('primary'),    // rouge pinceau (jour) / or (nuit)
        'primary-dark': v('primary-dark'),
        'on-primary': v('on-primary'),
        gold: v('gold'),
        sea: v('sea'),            // bleu des vagues
        straw: '#E8B64C',         // paille du chapeau
        ribbon: '#C8102E',        // ruban rouge du chapeau
        skin: '#F3C08F',          // bras de Luffy
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        brush: ['"Permanent Marker"', 'cursive'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      boxShadow: {
        card: '0 18px 40px -22px rgb(var(--shadow) / 0.55)',
        pop: '0 12px 30px -10px rgb(var(--primary) / 0.55)',
      },
    },
  },
  plugins: [],
}
