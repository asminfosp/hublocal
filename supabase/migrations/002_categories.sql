create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_not_self_parent check (parent_id is null or parent_id <> id)
);

create index categories_parent_id_idx on public.categories(parent_id);
create index categories_active_sort_idx on public.categories(active, sort_order);
