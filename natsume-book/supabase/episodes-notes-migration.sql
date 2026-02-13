-- Episodes private notes + public reviews
create extension if not exists pgcrypto;

create table if not exists public.episode_notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  season text not null,
  episode_no int not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(author_id, season, episode_no)
);

create table if not exists public.episode_reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  season text not null,
  episode_no int not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(author_id, season, episode_no)
);

alter table public.episode_notes enable row level security;
alter table public.episode_reviews enable row level security;

-- private notes: only owner can read/write

drop policy if exists "episode_notes_owner_select" on public.episode_notes;
create policy "episode_notes_owner_select"
on public.episode_notes
for select
to authenticated
using (auth.uid() = author_id);

drop policy if exists "episode_notes_owner_insert" on public.episode_notes;
create policy "episode_notes_owner_insert"
on public.episode_notes
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "episode_notes_owner_update" on public.episode_notes;
create policy "episode_notes_owner_update"
on public.episode_notes
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "episode_notes_owner_delete" on public.episode_notes;
create policy "episode_notes_owner_delete"
on public.episode_notes
for delete
to authenticated
using (auth.uid() = author_id);

-- public reviews: everyone can read, only owner can write

drop policy if exists "episode_reviews_public_read" on public.episode_reviews;
create policy "episode_reviews_public_read"
on public.episode_reviews
for select
using (true);

drop policy if exists "episode_reviews_owner_insert" on public.episode_reviews;
create policy "episode_reviews_owner_insert"
on public.episode_reviews
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "episode_reviews_owner_update" on public.episode_reviews;
create policy "episode_reviews_owner_update"
on public.episode_reviews
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "episode_reviews_owner_delete" on public.episode_reviews;
create policy "episode_reviews_owner_delete"
on public.episode_reviews
for delete
to authenticated
using (auth.uid() = author_id);
