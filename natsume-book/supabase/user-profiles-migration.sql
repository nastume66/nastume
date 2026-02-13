-- User profiles for nickname/avatar in public episode reviews
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles_public_read" on public.user_profiles;
create policy "user_profiles_public_read"
on public.user_profiles
for select
using (true);

drop policy if exists "user_profiles_owner_insert" on public.user_profiles;
create policy "user_profiles_owner_insert"
on public.user_profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "user_profiles_owner_update" on public.user_profiles;
create policy "user_profiles_owner_update"
on public.user_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
