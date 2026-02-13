-- Guestbook optional identity fields (nickname/avatar/author)
alter table public.guestbook_messages
  add column if not exists author_id uuid references auth.users(id) on delete set null,
  add column if not exists nickname text,
  add column if not exists avatar_url text;
