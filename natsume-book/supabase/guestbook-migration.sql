-- Guestbook: cloud-synced messages
create extension if not exists pgcrypto;

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.guestbook_messages enable row level security;

drop policy if exists "guestbook public read" on public.guestbook_messages;
create policy "guestbook public read"
on public.guestbook_messages
for select
using (true);

drop policy if exists "guestbook public insert" on public.guestbook_messages;
create policy "guestbook public insert"
on public.guestbook_messages
for insert
to anon, authenticated
with check (true);
