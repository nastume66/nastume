create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  content text not null,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at before update on public.posts
for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

-- 公开只读已发布
create policy if not exists "public can read published posts"
on public.posts
for select
to anon
using (status = 'published');

-- 登录用户可全权限（你自己的后台账号）
create policy if not exists "authenticated full access"
on public.posts
for all
to authenticated
using (true)
with check (true);
