-- Run this after initial schema.sql to enable per-user ownership isolation

alter table public.posts
add column if not exists author_id uuid references auth.users(id) on delete cascade;

-- Backfill existing rows to current authenticated user is not possible in SQL editor safely,
-- so existing old rows may have null author_id; keep them readable if published, but not editable.

-- Drop old broad policy
DROP POLICY IF EXISTS "authenticated full access" ON public.posts;

-- New owner-based policies
DROP POLICY IF EXISTS "authors can read own posts" ON public.posts;
create policy "authors can read own posts"
on public.posts
for select
to authenticated
using (author_id = auth.uid());

DROP POLICY IF EXISTS "authors can insert own posts" ON public.posts;
create policy "authors can insert own posts"
on public.posts
for insert
to authenticated
with check (author_id = auth.uid());

DROP POLICY IF EXISTS "authors can update own posts" ON public.posts;
create policy "authors can update own posts"
on public.posts
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

DROP POLICY IF EXISTS "authors can delete own posts" ON public.posts;
create policy "authors can delete own posts"
on public.posts
for delete
to authenticated
using (author_id = auth.uid());
