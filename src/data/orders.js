// ============================================================================
//  ONE PIECE — COMMANDES (Supabase)
//  Toutes les commandes sont stockées dans la table `orders` de Supabase.
//  La sécurité est gérée par les règles RLS (voir supabase/schema.sql) :
//   - tout le monde peut CRÉER une commande depuis le site,
//   - seul le personnel (table `staff`) peut LIRE / MODIFIER / SUPPRIMER.
// ============================================================================

import { supabase } from '../lib/supabase'

// Progression normale d'une commande, dans l'ordre.
export const ORDER_STATUSES = ['Reçue', 'En cuisine', 'Prête', 'Terminée']

// États spéciaux (hors progression).
export const ORDER_CANCELLED = 'Annulée' // annulée avant préparation -> supprimable
export const ORDER_LOST = 'Perdue'       // préparée mais jamais récupérée / non payée

export const ALL_STATUSES = [...ORDER_STATUSES, ORDER_CANCELLED, ORDER_LOST]

// Statuts « terminés » (n'apparaissent plus dans « en cours »).
export const TERMINAL_STATUSES = [ORDER_STATUSES[3], ORDER_CANCELLED, ORDER_LOST]

export const ORDER_MODES = ['Sur place', 'À emporter', 'Livraison']

// Transforme une ligne Supabase (snake_case) en objet utilisé par l'UI.
function fromRow(row) {
  return {
    id: row.id,
    number: row.number,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer || {},
    items: row.items || [],
    total: Number(row.total) || 0,
  }
}

// Vrai si l'utilisateur connecté figure dans la table `staff`.
export async function checkIsStaff() {
  const { data, error } = await supabase.rpc('is_staff')
  if (error) throw error
  return Boolean(data)
}

// Lit toutes les commandes (les plus récentes en premier).
export async function loadOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(fromRow)
}

// Ajoute une nouvelle commande depuis le site public.
// Pas de .select() ici : un client anonyme n'a pas le droit de LIRE les
// commandes (RLS), relire la ligne insérée renverrait une erreur 42501.
export async function addOrder(order) {
  const { error } = await supabase
    .from('orders')
    .insert({
      status: ORDER_STATUSES[0],
      customer: order.customer || {},
      items: order.items || [],
      total: order.total || 0,
    })
  if (error) throw error
}

export async function setOrderStatus(id, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw error
}

export async function clearOrders() {
  // `neq` sur une colonne toujours renseignée => cible toutes les lignes.
  const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}

// S'abonne aux changements en temps réel (INSERT / UPDATE / DELETE).
// Renvoie une fonction de nettoyage.
export function subscribeOrders(onChange) {
  const channel = supabase
    .channel('orders-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
      onChange(payload)
    })
    .subscribe()
  return () => supabase.removeChannel(channel)
}
