create table public.business_domains (
  business_id uuid not null references public.businesses(id) on delete cascade,
  domain_id text not null references public.domains(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (business_id, domain_id)
);

create table public.category_domains (
  category_id uuid not null references public.categories(id) on delete cascade,
  domain_id text not null references public.domains(id) on delete restrict,
  primary key (category_id, domain_id)
);

create table public.business_categories (
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (business_id, category_id)
);

create unique index business_domains_one_primary_idx on public.business_domains(business_id) where is_primary = true;
create unique index business_categories_one_primary_idx on public.business_categories(business_id) where is_primary = true;
create index business_domains_domain_idx on public.business_domains(domain_id);
create index category_domains_domain_idx on public.category_domains(domain_id);
create index business_categories_category_idx on public.business_categories(category_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_set_updated_at before update on public.businesses
for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger locations_set_updated_at before update on public.locations
for each row execute function public.set_updated_at();
create trigger offerings_set_updated_at before update on public.offerings
for each row execute function public.set_updated_at();
create trigger trust_signals_set_updated_at before update on public.trust_signals
for each row execute function public.set_updated_at();
