create table public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  label text,
  city text not null,
  state_code char(2) not null,
  neighborhood text not null,
  address_line text not null,
  postal_code text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  service_area text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint locations_longitude_range check (longitude is null or longitude between -180 and 180)
);

create unique index locations_one_primary_idx on public.locations(business_id) where is_primary = true;
create index locations_business_idx on public.locations(business_id);
create index locations_city_neighborhood_idx on public.locations(city, neighborhood);
