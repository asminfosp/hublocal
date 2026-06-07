create type public.business_status as enum ('draft', 'pending_review', 'published', 'suspended', 'archived');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  specialty text,
  phone text,
  whatsapp text,
  email citext,
  website text,
  verified boolean not null default false,
  status public.business_status not null default 'draft',
  trusted_since date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index businesses_published_idx on public.businesses(created_at desc) where status = 'published';
create index businesses_name_search_idx on public.businesses using gin (to_tsvector('simple', name || ' ' || description || ' ' || coalesce(specialty, '')));
