/*
  # Payment and Subscriptions Schema

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `plan_id` (text)
      - `status` (text)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at` (timestamptz)
      - `canceled_at` (timestamptz)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text)
      - `provider` (text)
      - `last4` (text)
      - `expiry` (text)
      - `is_default` (boolean)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `amount` (integer)
      - `currency` (text)
      - `status` (text)
      - `payment_method_id` (uuid, references payment_methods)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for payment and subscription management
*/

-- Subscriptions table
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  plan_id text not null,
  status text not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at timestamptz,
  canceled_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

-- Payment Methods table
create table if not exists public.payment_methods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  type text not null,
  provider text not null,
  last4 text,
  expiry text,
  is_default boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.payment_methods enable row level security;

-- Transactions table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  amount integer not null,
  currency text not null default 'XOF',
  status text not null,
  payment_method_id uuid references public.payment_methods(id),
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.transactions enable row level security;

-- RLS Policies

-- Subscriptions policies
create policy "Users can read own subscriptions"
  on subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on subscriptions
  for update
  using (auth.uid() = user_id);

-- Payment Methods policies
create policy "Users can read own payment methods"
  on payment_methods
  for select
  using (auth.uid() = user_id);

create policy "Users can create payment methods"
  on payment_methods
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own payment methods"
  on payment_methods
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own payment methods"
  on payment_methods
  for delete
  using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can read own transactions"
  on transactions
  for select
  using (auth.uid() = user_id);

create policy "Users can create transactions"
  on transactions
  for insert
  with check (auth.uid() = user_id);

-- Indexes for performance
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_status_idx on subscriptions(status);
create index if not exists subscriptions_plan_id_idx on subscriptions(plan_id);

create index if not exists payment_methods_user_id_idx on payment_methods(user_id);
create index if not exists payment_methods_provider_idx on payment_methods(provider);

create index if not exists transactions_user_id_idx on transactions(user_id);
create index if not exists transactions_status_idx on transactions(status);
create index if not exists transactions_created_at_idx on transactions(created_at);