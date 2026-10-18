# Configuration Supabase — One Piece

Le site enregistre les commandes dans Supabase et le tableau de bord
(`#/admin`, lien « ⚓ Espace équipage » en bas de page) les affiche **en temps réel**,
avec une sonnerie tant qu'une commande reste « Reçue ».

> Sans `.env`, le site fonctionne quand même : le bouton de commande ouvre
> WhatsApp avec le panier pré-rempli.

## 1. Créer le projet
https://supabase.com → **New project** (gratuit), région proche, attendre ~1 min.

## 2. Créer les tables + la sécurité
**SQL Editor** → **New query** → coller [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
Crée `orders` (avec un n° court `#0042`), `staff`, les règles RLS et le temps réel.

## 3. Clés → fichier `.env`
**Project Settings → API**, puis copier `.env.example` en `.env` :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```
Relancer `npm run dev`.

## 4. Ajouter l'équipage (personnel)
1. **Authentication → Users → Add user** (email + mot de passe, cocher **Auto Confirm User**).
2. Dans le SQL Editor :
   ```sql
   insert into public.staff (user_id)
   select id from auth.users where email = 'capitaine@onepiece.dz'
   on conflict do nothing;
   ```
Un compte qui n'est pas dans `staff` voit « Pas dans l'équipage » et n'a accès à
aucune commande (même s'il s'est inscrit tout seul).

## Statuts
`Reçue` → `En cuisine` → `Prête` → `Terminée` · plus `Annulée` (supprimable) et
`Perdue` (préparée mais jamais récupérée / non payée, exclue du CA).

## Dépannage
| Symptôme | Cause probable |
|---|---|
| « Supabase non configuré » | `.env` manquant ou `npm run dev` pas relancé |
| « Identifiants incorrects » | compte pas créé ou non confirmé |
| « Pas dans l'équipage » | étape 4.2 non faite pour cet email |
| Les commandes n'arrivent pas en direct | le bloc « Temps réel » du SQL n'a pas tourné |
