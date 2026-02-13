-- Add sort order for draggable category arrangement
alter table public.categories
add column if not exists sort_order integer not null default 0;

-- backfill existing rows with stable order
with ordered as (
  select id, row_number() over (order by created_at asc, id asc) - 1 as rn
  from public.categories
)
update public.categories c
set sort_order = o.rn
from ordered o
where c.id = o.id;
