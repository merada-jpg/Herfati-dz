-- Herfati DZ: production PostgreSQL foundation
-- Intended for Supabase/PostgreSQL. Apply after creating the project.

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','artisan','moderator','admin');
create type public.verification_status as enum ('unverified','pending','verified','rejected','suspended');
create type public.booking_status as enum ('pending','accepted','in_progress','completed','cancelled','rejected');
create type public.review_status as enum ('pending','published','rejected','flagged');
create type public.emergency_status as enum ('open','assigned','resolved','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  display_name text not null,
  phone text,
  wilaya_code text,
  commune text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artisan_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  craft_id text not null,
  bio_ar text,
  bio_fr text,
  years_experience integer not null default 0 check (years_experience >= 0 and years_experience <= 100),
  hourly_rate_dzd integer check (hourly_rate_dzd is null or hourly_rate_dzd >= 0),
  daily_rate_dzd integer check (daily_rate_dzd is null or daily_rate_dzd >= 0),
  verification_status public.verification_status not null default 'unverified',
  insurance_verified boolean not null default false,
  available_emergency boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verification_cases (
  id uuid primary key default gen_random_uuid(),
  artisan_user_id uuid not null references public.artisan_profiles(user_id) on delete cascade,
  status public.verification_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  notes text
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references public.profiles(id),
  artisan_user_id uuid not null references public.artisan_profiles(user_id),
  service_description text not null check (length(trim(service_description)) between 5 and 2000),
  scheduled_at timestamptz,
  address_text text,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  customer_user_id uuid not null references public.profiles(id),
  artisan_user_id uuid not null references public.artisan_profiles(user_id),
  rating integer not null check (rating between 1 and 5),
  comment text check (comment is null or length(comment) <= 2000),
  status public.review_status not null default 'pending',
  verified_booking boolean generated always as (true) stored,
  created_at timestamptz not null default now()
);

create table public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references public.profiles(id),
  artisan_user_id uuid references public.artisan_profiles(user_id),
  category_id text not null,
  description text not null check (length(trim(description)) between 5 and 2000),
  wilaya_code text not null,
  commune text,
  status public.emergency_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.profiles(id),
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index bookings_customer_idx on public.bookings(customer_user_id);
create index bookings_artisan_idx on public.bookings(artisan_user_id);
create index bookings_status_idx on public.bookings(status);
create index verification_artisan_idx on public.verification_cases(artisan_user_id);
create index reviews_artisan_idx on public.reviews(artisan_user_id);
create index emergency_status_idx on public.emergency_requests(status);

-- RLS is enabled by default for all application tables.
alter table public.profiles enable row level security;
alter table public.artisan_profiles enable row level security;
alter table public.verification_cases enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.emergency_requests enable row level security;
alter table public.audit_events enable row level security;

-- Basic least-privilege policies. Sensitive moderation/verification writes remain server-side.
create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

create policy "public artisan directory read" on public.artisan_profiles for select
using (verification_status = 'verified');

create policy "customers read own bookings" on public.bookings for select
using (auth.uid() = customer_user_id);
create policy "artisans read assigned bookings" on public.bookings for select
using (auth.uid() = artisan_user_id);
create policy "customers create bookings" on public.bookings for insert
with check (auth.uid() = customer_user_id and status = 'pending');

create policy "published reviews public read" on public.reviews for select
using (status = 'published');

-- Review creation is deliberately constrained to completed bookings.
create policy "customer reviews completed booking" on public.reviews for insert
with check (
  auth.uid() = customer_user_id
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and b.customer_user_id = auth.uid()
      and b.artisan_user_id = reviews.artisan_user_id
      and b.status = 'completed'
  )
);

create policy "customers read own emergencies" on public.emergency_requests for select
using (auth.uid() = customer_user_id);
create policy "customers create emergencies" on public.emergency_requests for insert
with check (auth.uid() = customer_user_id);

-- Audit events are append-only from trusted server contexts.
create policy "users read own audit events" on public.audit_events for select
using (auth.uid() = actor_user_id);

-- Prevent clients from mutating verification, review status, and audit history through normal RLS paths.
revoke update, delete on public.verification_cases from anon, authenticated;
revoke update, delete on public.audit_events from anon, authenticated;
revoke update, delete on public.reviews from anon, authenticated;
