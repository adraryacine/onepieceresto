// ============================================================================
//  ONE PIECE — CARTE
//  Relevée intégralement depuis les affiches du restaurant (photos/menu). Prix en DA.
//  Pour ajouter une photo à un plat : renseigne `photo: '/images/xxx.jpg'`.
//  `price: '—'` = prix pas encore communiqué → affiché « Prix sur place »,
//  le plat ne peut pas être ajouté au panier.
// ============================================================================

export const CURRENCY = 'DA'

export const tabs = [
  { id: 'menus', label: 'Menus composés', icon: '🏴‍☠️' },
  { id: 'entrees', label: 'Entrées', icon: '🥗' },
  { id: 'wano', label: 'Escale à Wano', icon: '🍜' },
  { id: 'burgers', label: 'Burgers', icon: '🍔' },
  { id: 'pizzas', label: 'Pizzas', icon: '🍕' },
  { id: 'plats', label: 'Plats & Pâtes', icon: '🍖' },
  { id: 'snacks', label: 'Crispy & Tacos', icon: '🍗' },
  { id: 'douceurs', label: 'Boissons & Douceurs', icon: '🍹' },
]

// Le vendredi (18h → 00h) le restaurant ne sert que les burgers et les pizzas.
export const FRIDAY_TABS = ['burgers', 'pizzas']

export const menu = {
  menus: [
    {
      category: 'Formules',
      subtitle: '« Formules à partager ou à savourer seul » — entrée + plat, prix avantageux',
      items: [
        { name: 'Menu Étudiant', desc: '1 chicken burger · Frites ou potatoes · Boisson 33 cl', price: '500', tag: 'Offre étudiant',
          promo: { title: 'Offre étudiant', text: 'Le menu complet à petit prix pour les moussaillons étudiants' } },
        { name: 'Menu Mugiwara Kids', desc: 'Mini tacos, mini burger ou nuggets ×3 · Frites ou potatoes · Boisson, crêpe, glace ou petit jouet au choix', price: '600' },
        { name: 'Menu Wano', desc: 'Gyoza ou nems au choix · Poulet teriyaki, yakitori ou coréen au choix', price: '1 950' },
      ],
    },
    {
      category: 'Formules de l’équipage',
      subtitle: '« Pour ceux qui veulent hisser le drapeau avec classe »',
      items: [
        { name: 'Menu Capitaine', desc: 'Onigiris (2 pcs) · Burger One Piece signature maison · Boisson 33 cl · Dessert au choix', price: '2 100' },
        { name: 'Menu Mugiwara Karaagé', desc: 'Soupe miso · Nems poulet, bœuf ou crevettes (4 pcs) · Poulet karaagé', price: '2 300' },
        { name: 'Menu Familial', desc: '15 wings · 10 tenders · 4 barquettes de frites ou potatoes · 1 boisson format GM', price: '2 900' },
      ],
    },
  ],

  entrees: [
    {
      category: 'Entrées',
      subtitle: '« Pour ouvrir les hostilités »',
      items: [
        { name: 'Soupe miso', price: '500' },
        { name: 'Salade de riz', price: '600' },
        { name: 'Salade coleslaw', price: '650' },
        { name: 'Salade César', price: '900' },
        { name: 'Onigiris (2 pcs)', desc: "Riz vinaigré enveloppé d'algue nori — saumon, thon mayo ou poulet teriyaki", price: '600' },
      ],
    },
    {
      category: 'Bouchées de Wano',
      subtitle: 'Cette sélection s’agrandira au fil des saisons',
      items: [
        { name: 'Gyoza poulet (6 pcs)', desc: 'Raviolis japonais poêlés, farce au poulet', price: '800' },
        { name: 'Nems poulet (6 pcs)', desc: 'Rouleaux croustillants, sauce nuoc-mâm', price: '900' },
        { name: 'Nems bœuf ou crevettes (6 pcs)', desc: 'Rouleaux croustillants, sauce nuoc-mâm', price: '1 200' },
        { name: 'Assortiment Découverte', desc: '1 onigiri, 2 nems, 2 gyoza — le trio parfait pour découvrir l’univers Wano', price: '950' },
      ],
    },
  ],

  wano: [
    {
      category: 'Sushi & Ramen',
      subtitle: '« Sushi, ramen, yakitori & spécialités du chef »',
      items: [
        { name: 'Ramen Wao-no', desc: 'Bouillon miso, poulet, œuf mariné', price: '1 400' },
        { name: 'Maki saumon (8 pcs)', desc: 'Riz vinaigré, saumon frais, algue nori', price: '1 200' },
        { name: 'California saumon avocat (8 pcs)', desc: 'Riz vinaigré, saumon, avocat, sésame', price: '1 500' },
        { name: 'Crispy roll saumon tempura (8 pcs)', desc: 'Saumon tempura pané, riz, sauce épicée', price: '1 700' },
        { name: 'Plateau Thousand Sunny', desc: 'Assortiment 24 pièces : 10 makis thon, 4 sushis, 6 nems, 4 gyoza', price: '2 500' },
      ],
    },
    {
      category: 'Poulets de Wano',
      subtitle: 'Sélection qui s’élargit au fil des saisons',
      items: [
        { name: 'Poulet Karaagé', desc: 'Poulet frit croustillant façon japonaise', price: '1 600' },
        { name: 'Poulet Teriyaki', desc: 'Sauce teriyaki sucrée-salée', price: '1 600' },
        { name: 'Poulet Yakitori (brochettes)', desc: 'Brochettes grillées, sauce yakitori sucrée-salée', price: '1 600' },
        { name: 'Poulet Coréen', desc: 'Sauce coréenne sucrée-salée et légèrement épicée, gochujang', price: '1 600' },
      ],
    },
  ],

  burgers: [
    {
      category: 'Burgers',
      subtitle: 'Servis chauds, montés à la minute',
      items: [
        { name: 'Moussaillon Burger', desc: 'L’essentiel, sans chichis, pour les petits budgets d’équipage', price: '300' },
        { name: 'Gin Chicken Burger', desc: 'Salade, tomate, galette de poulet, cheddar, sauce fromagère', price: '550' },
        { name: 'Red Hawk Burger', desc: 'Salade, tomate, tenders, fromage', price: '800' },
        { name: 'Cheeseburger', desc: 'Salade, tomate, viande de bœuf, slice et cheddar', price: '800' },
        { name: 'Smoker Burger', desc: 'Salade, tomate, viande de bœuf, fromage et crispy oignons', price: '1 100' },
        { name: 'Double Buggy Burger', desc: 'Salade, tomate, double viande, double slice de fromage', price: '1 300' },
        { name: 'One Piece Burger', desc: 'Signature maison — salade, tomate, viande de bœuf, galette de pomme de terre, mozzarella crispy, oignons caramélisés', price: '1 500', tag: 'Signature' },
      ],
    },
    {
      category: 'Chicken Bowls',
      items: [
        { name: 'Chicken bowl simple', desc: 'Riz, tenders', price: '500' },
        { name: 'Chicken Bowl 2', desc: 'Riz ou frites, tenders, cheddar', price: '700' },
      ],
    },
  ],

  pizzas: [
    {
      category: 'Pizzas',
      subtitle: '« Pâte américaine, cuisson au four traditionnel »',
      items: [
        { name: 'Marguerite', desc: 'Sauce tomate, mozzarella, cheddar', price: '600' },
        { name: 'Végé', desc: 'Sauce tomate, poivrons, oignons, tomate, mozzarella, cheddar', price: '700' },
        { name: 'Thon', desc: 'Sauce tomate, thon, olives, mozzarella, cheddar', price: '750' },
        { name: 'Pollo / Poulet', desc: 'Sauce tomate, poulet, mozzarella, cheddar', price: '800' },
        { name: 'Napolitaine', desc: 'Sauce tomate, anchois, câpres, mozzarella, cheddar', price: '850' },
      ],
    },
    {
      category: 'Pizzas du Capitaine',
      subtitle: 'Les plus garnies de la Grand Line',
      items: [
        { name: 'Campione', desc: 'Sauce tomate, viande hachée, champignons, mozzarella, cheddar', price: '900' },
        { name: 'Orientale', desc: 'Sauce tomate, merguez, poivrons, mozzarella, cheddar', price: '900' },
        { name: '4 saisons', desc: 'Sauce tomate, poulet, légumes, mozzarella, cheddar', price: '1 000' },
        { name: 'Saumon', desc: 'Sauce tomate, saumon, mozzarella, cheddar', price: '1 100' },
        { name: 'Pizza One Piece', desc: 'Spéciale maison — sauce tomate, poulet, viande hachée, merguez, tenders, frites, mozzarella, cheddar', price: '1 400', tag: 'Signature' },
      ],
    },
  ],

  plats: [
    {
      category: 'Plats principaux & Grillades',
      items: [
        { name: 'Bobun', desc: 'Vermicelles de riz, nems, pickles de carottes, aromates', price: '1 300' },
        { name: 'Bœuf coréen (riz blanc)', desc: 'Bœuf mariné, sauce coréenne sucrée-salée, servi avec riz blanc', price: '1 600' },
        { name: 'Escalope de poulet grillé', price: '800' },
        { name: 'Escalope de poulet milanaise', desc: 'Sauce à la crème', price: '1 200' },
        { name: 'Poulet à la crème et champignons', price: '1 300' },
        { name: 'Brochette de bœuf au fromage', desc: 'Sauce yakitori', price: '1 500' },
        { name: 'Entrecôte grillée', price: '2 400' },
        { name: 'Filet de bœuf', price: '2 800' },
      ],
    },
    {
      category: 'Pâtes',
      items: [
        { name: 'Pâtes à la crème', price: '400' },
        { name: 'Pâtes bolognaises', price: '800' },
        { name: 'Pâtes au poulet, crème et champignons', price: '900' },
        { name: 'Pâtes au saumon', price: '1 000' },
      ],
    },
  ],

  snacks: [
    {
      category: 'Crispy & Snacks',
      items: [
        { name: 'Tenders de poulet ×2', price: '400' },
        { name: 'Tenders de poulet ×4', price: '700' },
        { name: 'Wings de poulet ×3', price: '400' },
        { name: 'Wings de poulet ×6', price: '700' },
        { name: 'Nuggets de poulet ×3', price: '400' },
        { name: 'Nuggets de poulet ×6', price: '700' },
      ],
    },
    {
      category: 'Tacos',
      items: [
        { name: 'Tacos de poulet', price: '500' },
        { name: 'Tacos viande hachée', price: '700' },
        { name: 'Tacos mixte', price: '800' },
      ],
    },
    {
      category: 'Frites',
      items: [
        { name: 'Frites simples', price: '200' },
        { name: 'Frites épicées', price: '250' },
        { name: 'Frites fromagères', price: '400' },
      ],
    },
  ],

  // TODO client : noms exacts et prix des cocktails / desserts (vus sur Instagram).
  douceurs: [
    {
      category: 'Cocktails de la Grand Line',
      subtitle: 'Sans alcool — servis avec l’équipage',
      items: [
        { name: 'Cocktail Blue Grand Line', desc: 'Cocktail bleu lagon, citron vert, menthe', price: '—', photo: '/images/gallery/cocktail-blue.jpg' },
        { name: 'Cocktail Red Hawk', desc: 'Fruits rouges, agrumes, menthe fraîche', price: '—', photo: '/images/gallery/cocktail-rouge.jpg' },
        { name: 'Cocktail Citron Mugiwara', desc: 'Frappé citron, citron vert, menthe', price: '—', photo: '/images/gallery/cocktail-citron.jpg' },
      ],
    },
    {
      category: 'Nos sucrés',
      subtitle: 'Pour finir l’aventure en douceur',
      items: [
        { name: 'Crêpes roulées choco-pistache', desc: 'Chocolat, chantilly, éclats de pistache', price: '—', photo: '/images/gallery/crepe-choco-2.jpg' },
      ],
    },
  ],
}

// Les « primes » : plats signatures affichés en avis de recherche (section Primes).
export const bounties = [
  { tab: 'burgers', name: 'One Piece Burger', alias: 'Le Roi des Burgers', emoji: '🍔' },
  { tab: 'wano', name: 'Plateau Thousand Sunny', alias: '24 pièces en cavale', emoji: '🍣' },
  { tab: 'pizzas', name: 'Pizza One Piece', alias: 'La Spéciale Maison', emoji: '🍕' },
  { tab: 'menus', name: 'Menu Mugiwara Karaagé', alias: 'L’équipage au complet', emoji: '🍗' },
  { tab: 'wano', name: 'Ramen Wao-no', alias: 'Le bouillon de Wano', emoji: '🍜' },
  { tab: 'burgers', name: 'Double Buggy Burger', alias: 'Le Clown Double', emoji: '🤡' },
]

// Retrouve un plat (et sa catégorie) par onglet + nom.
export function findItem(tab, name) {
  for (const cat of menu[tab] || []) {
    const item = cat.items.find(i => i.name === name)
    if (item) return { item, cat: { ...cat, tab } }
  }
  return null
}
