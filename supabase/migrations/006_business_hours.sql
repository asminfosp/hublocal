create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  weekday smallint not null,
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  timezone text not null default 'America/Sao_Paulo',
  constraint business_hours_weekday check (weekday between 0 and 6),
  constraint business_hours_times check (
    (is_closed and opens_at is null and closes_at is null)
    or (not is_closed and opens_at is not null and closes_at is not null)
  ),
  unique (business_id, weekday, opens_at)
);

create index business_hours_business_idx on public.business_hours(business_id);
