-- guestbook likes (cloud count + per-visitor toggle)
create table if not exists public.guestbook_likes (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.guestbook_messages(id) on delete cascade,
  user_key text not null,
  created_at timestamptz not null default now(),
  unique (message_id, user_key)
);

alter table public.guestbook_likes enable row level security;

drop policy if exists "guestbook_likes_select" on public.guestbook_likes;
create policy "guestbook_likes_select"
  on public.guestbook_likes
  for select
  using (true);

drop policy if exists "guestbook_likes_insert" on public.guestbook_likes;
create policy "guestbook_likes_insert"
  on public.guestbook_likes
  for insert
  with check (true);

drop policy if exists "guestbook_likes_delete" on public.guestbook_likes;
create policy "guestbook_likes_delete"
  on public.guestbook_likes
  for delete
  using (true);

create index if not exists idx_guestbook_likes_message_id on public.guestbook_likes(message_id);
create index if not exists idx_guestbook_likes_user_key on public.guestbook_likes(user_key);
