-- ============================================================================
-- Migration: Multi-tenant organizations schema
-- ============================================================================

create extension if not exists "uuid-ossp";

create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  max_users int default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

alter table if exists public.organization_members
  add constraint organization_members_user_fk
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

create index if not exists organization_members_user_idx
  on public.organization_members(user_id);

create index if not exists organization_members_org_idx
  on public.organization_members(organization_id);

alter table if exists public.nfc_cards
  add column if not exists organization_id uuid references public.organizations(id),
  add column if not exists assigned_to uuid references auth.users(id);

create table if not exists public.organization_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  design_json jsonb not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists organization_templates_org_idx
  on public.organization_templates(organization_id);

comment on table public.organizations is 'Registered companies/accounts for multi-tenant features.';
comment on table public.organization_members is 'Links users to organizations with roles.';
comment on table public.organization_templates is 'Reusable design templates owned by an organization.';

