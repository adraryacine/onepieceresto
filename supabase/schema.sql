-- ============================================================================
--  ONE PIECE — SCHÉMA SUPABASE (commandes + personnel)
--  À exécuter une fois dans : Supabase → SQL Editor → New query → Run.
--  Ré-exécutable sans risque (idempotent).
-- ============================================================================

-- ----- Personnel autorisé ---------------------------------------------------
-- Seuls les comptes listés ici accèdent au tableau de bord. Un simple compte
-- Supabase Auth ne suffit PAS : quelqu'un qui créerait un compte par lui-même
-- ne verrait aucune commande.
create table if not exists public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;

drop policy if exists "staff lit sa ligne" on public.staff;
create policy "staff lit sa ligne" on public.staff
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- ----- Commandes ------------------------------------------------------------
create table if not exists public.orders (
  id         uuid        primary key default gen_random_uuid(),
  number     bigint      generated always as identity,          -- n° court affiché (#0042)
  created_at timestamptz not null default now(),
  status     text        not null default 'Reçue',
  customer   jsonb       not null default '{}'::jsonb,  -- { name, phone, mode, address, table, notes }
  items      jsonb       not null default '[]'::jsonb,  -- [{ name, category, qty, unitPrice, lineTotal }]
  total      numeric     not null default 0
);

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('Reçue', 'En cuisine', 'Prête', 'Terminée', 'Annulée', 'Perdue'));

alter table public.orders drop constraint if exists orders_shape_check;
alter table public.orders add constraint orders_shape_check
  check (
    jsonb_typeof(customer) = 'object'
    and jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 60
    and total >= 0
  );

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ----- Sécurité (RLS) -------------------------------------------------------
alter table public.orders enable row level security;

-- 1) Le public peut CRÉER une commande, uniquement au statut « Reçue ».
drop policy if exists "public cree commande" on public.orders;
create policy "public cree commande" on public.orders
  for insert to anon, authenticated
  with check (status = 'Reçue');

-- 2) Seul le personnel lit / modifie / supprime.
drop policy if exists "staff lit commandes" on public.orders;
create policy "staff lit commandes" on public.orders
  for select to authenticated using (public.is_staff());

drop policy if exists "staff modifie commandes" on public.orders;
create policy "staff modifie commandes" on public.orders
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff supprime commandes" on public.orders;
create policy "staff supprime commandes" on public.orders
  for delete to authenticated using (public.is_staff());

-- ----- Temps réel -----------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null;
end $$;

-- ============================================================================
--  AJOUTER UN MEMBRE DU PERSONNEL
--  1. Supabase → Authentication → Users → « Add user » (cocher Auto Confirm).
--  2. Puis exécuter (en remplaçant l'email) :
--
--     insert into public.staff (user_id)
--     select id from auth.users where email = 'capitaine@onepiece.dz'
--     on conflict do nothing;
-- ============================================================================
