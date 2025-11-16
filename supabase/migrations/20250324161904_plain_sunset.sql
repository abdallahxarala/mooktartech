/*
  # Virtual Cards Schema

  1. New Tables
    - `virtual_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `title` (text)
      - `company` (text)
      - `photo_url` (text)
      - `template_id` (text)
      - `metadata` (jsonb)
      - `is_public` (boolean)
      - `version` (integer)
      - `short_id` (text)
      - `qr_code_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `card_templates`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `preview_url` (text)
      - `category` (text)
      - `layout` (jsonb)
      - `colors` (jsonb)
      - `fonts` (jsonb)
      - `is_premium` (boolean)
      
    - `card_analytics`
      - `id` (uuid, primary key)
      - `card_id` (uuid, references virtual_cards)
      - `event_type` (text)
      - `metadata` (jsonb)
      - `ip_address` (text)
      - `user_agent` (text)
      - `location` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for card access and analytics
*/

-- Virtual Cards table
create table if not exists public.virtual_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  name text not null,
  title text,
  company text,
  photo_url text,
  template_id text not null,
  metadata jsonb default '{}',
  is_public boolean default true,
  version integer default 1,
  short_id text unique not null,
  qr_code_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.virtual_cards enable row level security;

-- Card Templates table
create table if not exists public.card_templates (
  id text primary key,
  name text not null,
  description text,
  preview_url text,
  category text not null,
  layout jsonb not null,
  colors jsonb not null,
  fonts jsonb not null,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.card_templates enable row level security;

-- Card Analytics table
create table if not exists public.card_analytics (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references public.virtual_cards(id) not null,
  event_type text not null,
  metadata jsonb default '{}',
  ip_address text,
  user_agent text,
  location text,
  created_at timestamptz default now()
);

alter table public.card_analytics enable row level security;

-- RLS Policies

-- Virtual Cards policies
create policy "Users can read own cards"
  on virtual_cards
  for select
  using (auth.uid() = user_id);

create policy "Anyone can read public cards"
  on virtual_cards
  for select
  using (is_public = true);

create policy "Users can create own cards"
  on virtual_cards
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cards"
  on virtual_cards
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own cards"
  on virtual_cards
  for delete
  using (auth.uid() = user_id);

-- Card Templates policies
create policy "Anyone can read templates"
  on card_templates
  for select
  using (true);

create policy "Only admins can modify templates"
  on card_templates
  using (auth.jwt() ->> 'role' = 'admin');

-- Card Analytics policies
create policy "Users can read own card analytics"
  on card_analytics
  for select
  using (
    exists (
      select 1 from virtual_cards
      where virtual_cards.id = card_id
      and virtual_cards.user_id = auth.uid()
    )
  );

create policy "Users can create analytics for public cards"
  on card_analytics
  for insert
  with check (
    exists (
      select 1 from virtual_cards
      where virtual_cards.id = card_id
      and (virtual_cards.is_public = true or virtual_cards.user_id = auth.uid())
    )
  );