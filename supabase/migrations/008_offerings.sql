create type public.offering_type as enum ('service', 'product_reference', 'mobility_capability');

create table public.offerings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type public.offering_type not null,
  name text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index offerings_business_active_idx on public.offerings(business_id, active);
create index offerings_category_idx on public.offerings(category_id);
