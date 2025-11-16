-- =============================================================================
-- Migration: Payments table for payment provider integrations
-- Description: Creates dedicated payments table to track payment provider
--              transactions (Wave, Orange Money, Free Money)
-- =============================================================================

create extension if not exists "pgcrypto";

-- Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  provider text not null check (provider in ('wave', 'orange_money', 'free_money')),
  amount integer not null check (amount > 0),
  currency text not null default 'XOF',
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')
  ),
  provider_payment_id text,
  transaction_id text,
  checkout_url text,
  customer_phone text,
  customer_email text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  
  -- Ensure unique provider payment IDs per provider
  unique(provider, provider_payment_id)
);

-- Indexes for performance
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists payments_provider_idx on public.payments(provider);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_provider_payment_id_idx on public.payments(provider_payment_id);
create index if not exists payments_created_at_idx on public.payments(created_at desc);

-- Enable RLS
alter table public.payments enable row level security;

-- RLS Policies
-- Users can read payments for their own orders
create policy "Users can read payments for own orders"
  on public.payments
  for select
  using (
    exists (
      select 1
      from public.orders
      where orders.id = payments.order_id
        and orders.user_id = auth.uid()
    )
  );

-- System can insert/update payments (via service role)
-- Note: In production, use service role key for API routes
create policy "Service can manage payments"
  on public.payments
  for all
  using (true)
  with check (true);

-- Update trigger for updated_at
create or replace function update_payments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger payments_updated_at
  before update on public.payments
  for each row
  execute function update_payments_updated_at();

comment on table public.payments is 'Payment records for provider integrations (Wave, Orange Money, Free Money)';

