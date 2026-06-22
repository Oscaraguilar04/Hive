-- Starter Supabase schema for the current Expo client.
-- Review and tighten policies before production launch.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  date_label text not null,
  location text not null,
  city text,
  state text,
  address text,
  age_policy text,
  description text,
  image text not null,
  creator_id uuid references auth.users (id) on delete set null,
  featured boolean not null default false,
  interested integer not null default 0 check (interested >= 0),
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists public.event_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  status text not null check (status in ('interested', 'going')),
  created_at timestamptz not null default now(),
  unique (user_id, event_id, status)
);

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_featured_idx on public.events (featured desc);
create index if not exists events_city_idx on public.events (city);
create index if not exists events_category_idx on public.events (category);
create index if not exists saved_events_user_id_idx on public.saved_events (user_id);
create index if not exists event_interests_user_id_status_idx
  on public.event_interests (user_id, status);

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.saved_events enable row level security;
alter table public.event_interests enable row level security;

drop policy if exists "profiles are readable by authenticated users" on public.profiles;
create policy "profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "events are readable by authenticated users" on public.events;
create policy "events are readable by authenticated users"
  on public.events for select
  to authenticated
  using (true);

drop policy if exists "users can create events" on public.events;
create policy "users can create events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = creator_id);

drop policy if exists "creators can update their events" on public.events;
create policy "creators can update their events"
  on public.events for update
  to authenticated
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

drop policy if exists "creators can delete their events" on public.events;
create policy "creators can delete their events"
  on public.events for delete
  to authenticated
  using (auth.uid() = creator_id);

drop policy if exists "users can read their saved events" on public.saved_events;
create policy "users can read their saved events"
  on public.saved_events for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can save events" on public.saved_events;
create policy "users can save events"
  on public.saved_events for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users can unsave their events" on public.saved_events;
create policy "users can unsave their events"
  on public.saved_events for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can read their event interests" on public.event_interests;
create policy "users can read their event interests"
  on public.event_interests for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can mark event interest" on public.event_interests;
create policy "users can mark event interest"
  on public.event_interests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users can remove event interest" on public.event_interests;
create policy "users can remove event interest"
  on public.event_interests for delete
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('event-images', 'event-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "avatar images are public" on storage.objects;
create policy "avatar images are public"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "users can upload their avatar" on storage.objects;
create policy "users can upload their avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "users can update their avatar" on storage.objects;
create policy "users can update their avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "event images are public" on storage.objects;
create policy "event images are public"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "authenticated users can upload event images" on storage.objects;
create policy "authenticated users can upload event images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-images');

drop policy if exists "authenticated users can update event images" on storage.objects;
create policy "authenticated users can update event images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-images')
  with check (bucket_id = 'event-images');
