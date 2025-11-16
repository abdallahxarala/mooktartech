/*
  # Contacts and Sharing Schema

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `card_id` (uuid, references virtual_cards)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `notes` (text)
      - `tags` (text[])
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `webhooks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `url` (text)
      - `events` (text[])
      - `is_active` (boolean)
      - `secret_key` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for contact management
    - Add policies for webhook configuration
*/

-- Contacts table
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  card_id uuid references public.virtual_cards(id) not null,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  tags text[] default array[]::text[],
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.contacts enable row level security;

-- Webhooks table
create table if not exists public.webhooks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  url text not null,
  events text[] not null,
  is_active boolean default true,
  secret_key text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.webhooks enable row level security;

-- RLS Policies

-- Contacts policies
create policy "Users can read own contacts"
  on contacts
  for select
  using (auth.uid() = user_id);

create policy "Users can create contacts"
  on contacts
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own contacts"
  on contacts
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own contacts"
  on contacts
  for delete
  using (auth.uid() = user_id);

-- Webhooks policies
create policy "Users can read own webhooks"
  on webhooks
  for select
  using (auth.uid() = user_id);

create policy "Users can create webhooks"
  on webhooks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own webhooks"
  on webhooks
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own webhooks"
  on webhooks
  for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists contacts_user_id_idx on contacts(user_id);
create index if not exists contacts_card_id_idx on contacts(card_id);
create index if not exists contacts_email_idx on contacts(email);
create index if not exists contacts_phone_idx on contacts(phone);
create index if not exists contacts_tags_idx on contacts using gin(tags);

create index if not exists webhooks_user_id_idx on webhooks(user_id);
create index if not exists webhooks_events_idx on webhooks using gin(events);