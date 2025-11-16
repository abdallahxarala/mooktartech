-- ============================================================================
-- Migration: Lead capture system for multi-tenant organizations
-- ============================================================================

create extension if not exists "uuid-ossp";

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid references public.nfc_cards(id) on delete set null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  captured_by uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  source text not null default 'nfc_scan',
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  contacted_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_org_idx on public.leads(organization_id);
create index if not exists leads_card_idx on public.leads(card_id);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_idx on public.leads(created_at desc);

comment on table public.leads is 'Captured leads tied to NFC scans per organization.';

