-- =============================================================================
-- Migration: Payments integration upgrade
-- Description: Adds payment tracking columns to orders table and creates
--              audit_logs table to track payment provider events.
-- =============================================================================

-- Ensure pgcrypto is available for gen_random_uuid
create extension if not exists "pgcrypto";

alter table public.orders
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_method text,
  add column if not exists payment_id text,
  add column if not exists transaction_id text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_payment_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_payment_status_check
      check (payment_status in ('pending', 'processing', 'paid', 'failed', 'refunded'));
  end if;
end $$;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  provider text not null,
  order_id uuid null references public.orders(id) on delete set null,
  payment_id text null,
  transaction_id text null,
  payload jsonb,
  metadata jsonb,
  source text not null default 'system',
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_order_id_idx on public.audit_logs(order_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

