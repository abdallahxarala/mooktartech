/*
  # Initial Schema Setup

  1. Authentication and Users
    - Enable auth schema and RLS
    - Create users table with profile data
    - Set up auth policies

  2. Products
    - Create products table
    - Categories and inventory tracking
    - RLS policies for product access

  3. Orders
    - Orders and order items tables
    - Payment tracking
    - Shipping information
*/

-- Enable RLS
alter database postgres set "auth.enabled" = true;

-- Create users table
create table if not exists public.users (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  company text,
  role text default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

alter table public.users enable row level security;

-- User policies
create policy "Users can read own data" on users
  for select using (auth.uid() = id);

create policy "Users can update own data" on users
  for update using (auth.uid() = id);

-- Products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price integer not null,
  category text not null,
  image_url text,
  stock integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

-- Product policies
create policy "Anyone can read products" on products
  for select using (true);

create policy "Only admins can modify products" on products
  using (auth.jwt() ->> 'role' = 'admin');

-- Orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id),
  status text default 'pending',
  total integer not null,
  shipping_address jsonb,
  payment_intent_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

-- Order items table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id),
  product_id uuid references public.products(id),
  quantity integer not null,
  price integer not null,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

-- Order policies
create policy "Users can read own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id);

-- Order items policies
create policy "Users can read own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create own order items" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );