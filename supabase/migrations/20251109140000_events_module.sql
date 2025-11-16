-- ============================================================================
-- Migration: Event management module (events, zones, attendees, scans)
-- ============================================================================

create extension if not exists "uuid-ossp";

-- --------------------------------------------------------------------------
-- Table: events
-- --------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  location text,
  location_address text,
  max_attendees int,
  status text not null default 'draft' check (
    status in ('draft', 'published', 'ongoing', 'completed', 'cancelled')
  ),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- Table: event_zones
-- --------------------------------------------------------------------------
create table if not exists public.event_zones (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  type text check (type in ('general', 'vip', 'backstage', 'expo', 'conference')),
  capacity int,
  access_levels text[] not null default array['attendee'],
  description text,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- Table: event_attendees
-- --------------------------------------------------------------------------
create table if not exists public.event_attendees (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company text,
  badge_id text not null unique,
  access_level text not null default 'attendee' check (
    access_level in ('attendee', 'vip', 'staff', 'exhibitor', 'speaker')
  ),
  checked_in boolean not null default false,
  check_in_time timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, email)
);

-- --------------------------------------------------------------------------
-- Table: access_scans
-- --------------------------------------------------------------------------
create table if not exists public.access_scans (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  attendee_id uuid references public.event_attendees(id) on delete cascade,
  zone_id uuid references public.event_zones(id) on delete set null,
  scanned_at timestamptz not null default now(),
  scanner_device text,
  access_granted boolean not null,
  denial_reason text,
  metadata jsonb not null default '{}'::jsonb
);

-- --------------------------------------------------------------------------
-- Indexes
-- --------------------------------------------------------------------------
create index if not exists idx_events_organization on public.events(organization_id);
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_dates on public.events(start_date, end_date);

create index if not exists idx_event_zones_event on public.event_zones(event_id);

create index if not exists idx_event_attendees_event on public.event_attendees(event_id);
create index if not exists idx_event_attendees_badge on public.event_attendees(badge_id);
create index if not exists idx_event_attendees_email on public.event_attendees(email);

create index if not exists idx_access_scans_event on public.access_scans(event_id);
create index if not exists idx_access_scans_attendee on public.access_scans(attendee_id);
create index if not exists idx_access_scans_time on public.access_scans(scanned_at);

-- --------------------------------------------------------------------------
-- Row Level Security Policies
-- --------------------------------------------------------------------------
alter table public.events enable row level security;

create policy "Organization members can view events"
  on public.events for select
  using (
    exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = events.organization_id
        and organization_members.user_id = auth.uid()
    )
    or status = 'published'
  );

create policy "Organization admins can create events"
  on public.events for insert
  with check (
    exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = events.organization_id
        and organization_members.user_id = auth.uid()
        and organization_members.role in ('owner', 'admin')
    )
  );

create policy "Organization admins can update events"
  on public.events for update
  using (
    exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = events.organization_id
        and organization_members.user_id = auth.uid()
        and organization_members.role in ('owner', 'admin')
    )
  );

create policy "Organization admins can delete events"
  on public.events for delete
  using (
    exists (
      select 1
      from public.organization_members
      where organization_members.organization_id = events.organization_id
        and organization_members.user_id = auth.uid()
        and organization_members.role in ('owner', 'admin')
    )
  );

alter table public.event_zones enable row level security;

create policy "Event org members can manage zones"
  on public.event_zones for all
  using (
    exists (
      select 1
      from public.events
      join public.organization_members
        on organization_members.organization_id = events.organization_id
      where events.id = event_zones.event_id
        and organization_members.user_id = auth.uid()
    )
  );

alter table public.event_attendees enable row level security;

create policy "Event org members can manage attendees"
  on public.event_attendees for all
  using (
    exists (
      select 1
      from public.events
      join public.organization_members
        on organization_members.organization_id = events.organization_id
      where events.id = event_attendees.event_id
        and organization_members.user_id = auth.uid()
    )
  );

alter table public.access_scans enable row level security;

create policy "Event org members can view scans"
  on public.access_scans for select
  using (
    exists (
      select 1
      from public.events
      join public.organization_members
        on organization_members.organization_id = events.organization_id
      where events.id = access_scans.event_id
        and organization_members.user_id = auth.uid()
    )
  );

create policy "Scanner can insert scans"
  on public.access_scans for insert
  with check (true);

-- --------------------------------------------------------------------------
-- updated_at triggers
-- --------------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_events_updated_at
  before update on public.events
  for each row
  execute function public.update_updated_at_column();

create trigger update_event_attendees_updated_at
  before update on public.event_attendees
  for each row
  execute function public.update_updated_at_column();

