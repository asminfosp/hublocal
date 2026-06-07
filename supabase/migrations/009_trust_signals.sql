create type public.trust_signal_type as enum ('verified', 'featured', 'top_rated');
create type public.trust_signal_source as enum ('system', 'admin');

create table public.trust_signals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.trust_signal_type not null,
  source public.trust_signal_source not null,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trust_signals_valid_window check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index trust_signals_business_active_idx on public.trust_signals(business_id, active);
