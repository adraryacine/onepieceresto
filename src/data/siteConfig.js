// ============================================================================
//  ONE PIECE — CONFIGURATION DU SITE
//  Toutes les coordonnées se modifient ICI, à un seul endroit.
//  Les valeurs marquées « TODO » sont à confirmer avec le client.
// ============================================================================

export const siteConfig = {
  name: 'One Piece',
  fullName: 'Restaurant One Piece',
  tagline: 'Grand Line Cuisine',
  slogan: 'Good food, good adventure',
  pitch: 'Embarquez à bord du One Piece Restaurant ! Mangez comme un vrai pirate.',

  // ----- Contact (bio Instagram @onepiece_bejaia) -----------------------------
  phones: [
    { display: '0662 20 26 02', e164: '213662202602' },
    { display: '0541 79 85 39', e164: '213541798539' },
  ],
  // TODO : confirmer lequel des deux numéros est sur WhatsApp.
  whatsapp: '213662202602',

  address: {
    line: '4ème Quartier Dallas',
    city: 'Béjaïa 06000, Algérie',
  },

  // Fiche Google Maps « Restaurant One Piece » (lien fourni par le client).
  // Identifiants de la fiche : cid 8936710092542442337 · place_id ChIJaQv5ewAzjRIRYfuj_nqSBXw
  // → la carte, le lien et l'itinéraire ouvrent la FICHE du resto (nom, avis, photos), pas un simple point.
  mapEmbedUrl: 'https://www.google.com/maps?cid=8936710092542442337&output=embed',
  mapLink: 'https://www.google.com/maps/place/Restaurant+One+Piece/@36.7505877,5.050736,664m/data=!3m1!1e3!4m10!1m2!2m1!1sone+piece+4%C3%A8me+quartier+dallas+b%C3%A9ja%C3%AFa!3m6!1s0x128d33007bf90b69:0x7c05927afea3fb61!8m2!3d36.7505877!4d5.0554996!15sCihvbmUgcGllY2UgNMOobWUgcXVhcnRpZXIgZGFsbGFzIGLDqWphw69h4AEA!16s%2Fg%2F11zf4ff_mt?hl=fr-FR',
  directionsLink: 'https://www.google.com/maps/dir/?api=1&destination=Restaurant+One+Piece&destination_place_id=ChIJaQv5ewAzjRIRYfuj_nqSBXw',

  // ----- Horaires (affiche « Horaires de travail ») ---------------------------
  // day : 0 = dimanche … 5 = vendredi. close 24 = minuit.
  hours: [
    { label: 'Tous les jours', days: [0, 1, 2, 3, 4, 6], open: 9, close: 24 },
    { label: 'Vendredi', days: [5], open: 18, close: 24, note: 'uniquement burgers et pizzas' },
  ],

  social: {
    instagram: 'https://www.instagram.com/onepiece_bejaia/',
    instagramHandle: '@onepiece_bejaia',
  },
}

// Statut d'ouverture en direct (« Ouvert », « Ferme bientôt », « Fermé »).
export function openStatus(now = new Date()) {
  const day = now.getDay()
  const h = now.getHours() + now.getMinutes() / 60
  const slot = siteConfig.hours.find(s => s.days.includes(day))
  if (!slot) return { open: false, label: 'Fermé' }
  if (h >= slot.open && h < slot.close) {
    return {
      open: true,
      label: slot.close - h <= 1 ? 'Ferme bientôt' : 'Ouvert maintenant',
      until: slot.close === 24 ? '00h00' : `${slot.close}h00`,
      friday: day === 5,
    }
  }
  return {
    open: false,
    label: 'Fermé',
    opensAt: h < slot.open ? `${slot.open}h00` : null,
  }
}

export const isFriday = (now = new Date()) => now.getDay() === 5

// Message WhatsApp pré-rempli.
export const waHeader = `Ahoy ${siteConfig.fullName} 🏴‍☠️, je souhaite passer commande :`
