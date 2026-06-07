create type public.media_type as enum ('cover', 'avatar', 'gallery');

create table public.business_media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.media_type not null,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index business_media_business_sort_idx on public.business_media(business_id, sort_order);
create unique index business_media_one_cover_idx on public.business_media(business_id) where type = 'cover';
create unique index business_media_one_avatar_idx on public.business_media(business_id) where type = 'avatar';
