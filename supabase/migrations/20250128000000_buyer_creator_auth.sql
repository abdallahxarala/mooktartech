/*
  # Dual-Level Authentication System (Buyer + Creator)

  Cette migration ajoute le support pour deux types de comptes :
  1. BUYER (Acheteur) : Commande produits, suivi livraisons, favoris
  2. CREATOR (Créateur) : Bibliothèque designs, templates, exports

  Un utilisateur peut avoir LES DEUX rôles (hybrid account).

  L'inscription progressive est déclenchée à la "valeur maximale" :
  - Pour BUYER : lors de la première commande > valeur minimale
  - Pour CREATOR : lors du 3e design sauvegardé ou export

  Schema Changes:
  - Ajout colonnes `buyer_role_activated` et `creator_role_activated` dans users
  - Création table `buyer_profiles` pour données acheteur
  - Création table `creator_profiles` pour données créateur
  - Création table `user_activity` pour tracking inscriptions progressives
  - Création table `buyer_favorites` pour favoris produits
  - Création table `buyer_addresses` pour adresses sauvegardées
  - Création table `creator_designs` pour bibliothèque designs
  - Création table `creator_templates` pour templates personnels
*/

-- 1. Mettre à jour la table users pour supporter les rôles multiples
alter table public.users
  add column if not exists buyer_role_activated boolean default false,
  add column if not exists creator_role_activated boolean default false,
  add column if not exists buyer_activated_at timestamptz,
  add column if not exists creator_activated_at timestamptz;

-- Commentaire sur la colonne role existante
comment on column public.users.role is 'Role principal: customer, admin, ou null pour hybrid accounts';

-- 2. Créer la table buyer_profiles
create table if not exists public.buyer_profiles (
  id uuid primary key references public.users(id) on delete cascade,
  total_orders integer default 0,
  total_spent integer default 0, -- en centimes/CFA
  favorite_categories text[] default '{}',
  default_shipping_address_id uuid,
  reward_points integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.buyer_profiles enable row level security;

-- 3. Créer la table creator_profiles
create table if not exists public.creator_profiles (
  id uuid primary key references public.users(id) on delete cascade,
  total_designs integer default 0,
  total_exports integer default 0,
  total_templates integer default 0,
  public_profile_url text unique,
  bio text,
  specialties text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.creator_profiles enable row level security;

-- 4. Créer la table user_activity pour tracking inscriptions progressives
create table if not exists public.user_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  activity_type text not null, -- 'first_order', 'third_design', 'export', etc.
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_user_activity_user_id on public.user_activity(user_id);
create index if not exists idx_user_activity_type on public.user_activity(activity_type);

alter table public.user_activity enable row level security;

-- 5. Créer la table buyer_favorites
create table if not exists public.buyer_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  added_at timestamptz default now(),
  unique(user_id, product_id)
);

create index if not exists idx_buyer_favorites_user_id on public.buyer_favorites(user_id);

alter table public.buyer_favorites enable row level security;

-- 6. Créer la table buyer_addresses
create table if not exists public.buyer_addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  is_default boolean default false,
  label text, -- 'Maison', 'Bureau', etc.
  street_address text not null,
  city text not null,
  postal_code text,
  country text default 'SN',
  phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_buyer_addresses_user_id on public.buyer_addresses(user_id);

alter table public.buyer_addresses enable row level security;

-- 7. Créer la table creator_designs
create table if not exists public.creator_designs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  design_data jsonb not null, -- Sauvegarde du design
  thumbnail_url text,
  is_public boolean default false,
  is_favorite boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_creator_designs_user_id on public.creator_designs(user_id);
create index if not exists idx_creator_designs_is_public on public.creator_designs(is_public);

alter table public.creator_designs enable row level security;

-- 8. Créer la table creator_templates
create table if not exists public.creator_templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  thumbnail_url text,
  template_data jsonb not null,
  is_public boolean default false,
  is_premium boolean default false,
  downloads_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_creator_templates_user_id on public.creator_templates(user_id);
create index if not exists idx_creator_templates_is_public on public.creator_templates(is_public);

alter table public.creator_templates enable row level security;

-- RLS Policies

-- Buyer Profiles
create policy "Users can read own buyer profile"
  on buyer_profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own buyer profile"
  on buyer_profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert own buyer profile"
  on buyer_profiles
  for insert
  with check (auth.uid() = id);

-- Creator Profiles
create policy "Users can read own creator profile"
  on creator_profiles
  for select
  using (auth.uid() = id);

create policy "Anyone can read public creator profiles"
  on creator_profiles
  for select
  using (public_profile_url is not null);

create policy "Users can update own creator profile"
  on creator_profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert own creator profile"
  on creator_profiles
  for insert
  with check (auth.uid() = id);

-- User Activity
create policy "Users can read own activity"
  on user_activity
  for select
  using (auth.uid() = user_id);

create policy "Users can create own activity"
  on user_activity
  for insert
  with check (auth.uid() = user_id);

-- Buyer Favorites
create policy "Users can manage own favorites"
  on buyer_favorites
  for all
  using (auth.uid() = user_id);

-- Buyer Addresses
create policy "Users can manage own addresses"
  on buyer_addresses
  for all
  using (auth.uid() = user_id);

-- Creator Designs
create policy "Users can manage own designs"
  on creator_designs
  for all
  using (auth.uid() = user_id);

create policy "Anyone can read public designs"
  on creator_designs
  for select
  using (is_public = true);

-- Creator Templates
create policy "Users can manage own templates"
  on creator_templates
  for all
  using (auth.uid() = user_id);

create policy "Anyone can read public templates"
  on creator_templates
  for select
  using (is_public = true);

-- Functions pour activer les rôles progressivement

-- Fonction pour activer le rôle Buyer
create or replace function public.activate_buyer_role(user_uuid uuid)
returns void as $$
begin
  update public.users
  set 
    buyer_role_activated = true,
    buyer_activated_at = now()
  where id = user_uuid;

  -- Créer le profil buyer s'il n'existe pas
  insert into public.buyer_profiles (id)
  values (user_uuid)
  on conflict (id) do nothing;
end;
$$ language plpgsql security definer;

-- Fonction pour activer le rôle Creator
create or replace function public.activate_creator_role(user_uuid uuid)
returns void as $$
begin
  update public.users
  set 
    creator_role_activated = true,
    creator_activated_at = now()
  where id = user_uuid;

  -- Créer le profil creator s'il n'existe pas
  insert into public.creator_profiles (id)
  values (user_uuid)
  on conflict (id) do nothing;
end;
$$ language plpgsql security definer;

-- Trigger pour mettre à jour updated_at automatiquement
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_buyer_profiles_updated_at
  before update on buyer_profiles
  for each row
  execute function update_updated_at_column();

create trigger update_creator_profiles_updated_at
  before update on creator_profiles
  for each row
  execute function update_updated_at_column();

create trigger update_buyer_addresses_updated_at
  before update on buyer_addresses
  for each row
  execute function update_updated_at_column();

create trigger update_creator_designs_updated_at
  before update on creator_designs
  for each row
  execute function update_updated_at_column();

create trigger update_creator_templates_updated_at
  before update on creator_templates
  for each row
  execute function update_updated_at_column();

-- Index pour optimiser les requêtes
create index if not exists idx_users_buyer_role on public.users(buyer_role_activated);
create index if not exists idx_users_creator_role on public.users(creator_role_activated);

-- Commentaires pour documentation
comment on table buyer_profiles is 'Profils détaillés des utilisateurs avec rôle Acheteur';
comment on table creator_profiles is 'Profils détaillés des utilisateurs avec rôle Créateur';
comment on table user_activity is 'Historique des activités déclenchant inscriptions progressives';
comment on table buyer_favorites is 'Produits favoris des acheteurs';
comment on table buyer_addresses is 'Adresses sauvegardées des acheteurs';
comment on table creator_designs is 'Bibliothèque de designs des créateurs';
comment on table creator_templates is 'Templates personnels des créateurs';

