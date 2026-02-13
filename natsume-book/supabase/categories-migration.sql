-- User-defined blog categories/columns

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(author_id, slug)
);

alter table public.categories enable row level security;

drop policy if exists "categories read own" on public.categories;
create policy "categories read own"
on public.categories
for select
to authenticated
using (author_id = auth.uid());

drop policy if exists "categories insert own" on public.categories;
create policy "categories insert own"
on public.categories
for insert
to authenticated
with check (author_id = auth.uid());

drop policy if exists "categories update own" on public.categories;
create policy "categories update own"
on public.categories
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "categories delete own" on public.categories;
create policy "categories delete own"
on public.categories
for delete
to authenticated
using (author_id = auth.uid());

alter table public.posts
add column if not exists category_id uuid references public.categories(id) on delete set null;
