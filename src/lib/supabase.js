import { createClient } from '@supabase/supabase-js'

// Identifiants du projet Supabase — voir .env (jamais commités).
// Récupérer ces valeurs dans : Supabase → Project Settings → API.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Message clair en dev si le .env n'est pas configuré.
  console.warn(
    '[One Piece] Supabase non configuré : renseignez VITE_SUPABASE_URL et ' +
    'VITE_SUPABASE_ANON_KEY dans un fichier .env (voir .env.example).'
  )
}

// createClient() refuse une URL vide : sans .env on passe des valeurs factices
// pour que le site public s'affiche quand même (commande via WhatsApp).
export const supabase = createClient(url || 'http://localhost:54321', anonKey || 'not-configured')

// Vrai si les identifiants sont présents (permet d'afficher un message d'aide).
export const isSupabaseConfigured = Boolean(url && anonKey)
