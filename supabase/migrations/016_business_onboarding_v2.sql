alter table public.businesses
  add column if not exists business_kind text not null default 'company',
  add column if not exists document_type text,
  add column if not exists document_number text,
  add column if not exists trust_level integer not null default 0,
  add column if not exists business_archetype text not null default 'service_provider',
  add column if not exists instagram text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_business_kind_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_business_kind_check
      check (business_kind in ('individual', 'company'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_document_type_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_document_type_check
      check (document_type is null or document_type in ('cpf', 'cnpj'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_trust_level_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_trust_level_check
      check (trust_level between 0 and 3);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_business_archetype_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_business_archetype_check
      check (business_archetype in ('service_provider', 'appointment_business', 'catalog_business', 'food_business'));
  end if;
end $$;

create unique index if not exists businesses_unique_document_idx
  on public.businesses(document_type, document_number)
  where document_type is not null and document_number is not null;

with onboarding_categories (slug, name, description, parent_slug, domain_id, sort_order) as (
  values
    ('barbearia', 'Barbearia', 'Corte e barba.', 'beleza', 'services', 1001),
    ('salao', 'Salao', 'Cabelo e beleza.', 'beleza', 'services', 1002),
    ('restaurante', 'Restaurante', 'Restaurante familiar.', 'alimentacao', 'shop', 1003),
    ('pet-shop', 'Pet Shop', 'Produtos pet.', 'pet', 'shop', 1004),
    ('eletricista', 'Eletricista', 'Eletrica residencial.', 'servicos', 'services', 1005),
    ('dentista', 'Dentista', 'Clinica odontologica.', 'saude', 'services', 1006),
    ('mecanico', 'Mecanico', 'Mecanica e revisao.', 'automotivo', 'services', 1007),
    ('autopeca', 'Autopecas', 'Pecas e acessorios automotivos.', 'automotivo', 'shop', 1008)
)
insert into public.categories (slug, name, description, parent_id, sort_order, active)
select
  onboarding_category.slug,
  onboarding_category.name,
  onboarding_category.description,
  parent_category.id,
  onboarding_category.sort_order,
  true
from onboarding_categories onboarding_category
left join public.categories parent_category on parent_category.slug = onboarding_category.parent_slug
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    active = true;

with onboarding_category_domains (slug, domain_id) as (
  values
    ('barbearia', 'services'),
    ('salao', 'services'),
    ('restaurante', 'shop'),
    ('pet-shop', 'shop'),
    ('eletricista', 'services'),
    ('dentista', 'services'),
    ('mecanico', 'services'),
    ('autopeca', 'shop')
)
insert into public.category_domains (category_id, domain_id)
select category.id, onboarding_category_domain.domain_id
from onboarding_category_domains onboarding_category_domain
join public.categories category on category.slug = onboarding_category_domain.slug
on conflict (category_id, domain_id) do nothing;

update public.businesses business
set business_archetype = case category.slug
  when 'barbearia' then 'appointment_business'
  when 'salao' then 'appointment_business'
  when 'manicure' then 'appointment_business'
  when 'estetica' then 'appointment_business'
  when 'dentista' then 'appointment_business'
  when 'clinica-medica' then 'appointment_business'
  when 'pet-shop' then 'catalog_business'
  when 'loja' then 'catalog_business'
  when 'mercado' then 'catalog_business'
  when 'autopeca' then 'catalog_business'
  when 'moda' then 'catalog_business'
  when 'restaurante' then 'food_business'
  when 'pizzaria' then 'food_business'
  when 'hamburgueria' then 'food_business'
  when 'acaiteria' then 'food_business'
  when 'lanchonete' then 'food_business'
  else 'service_provider'
end
from public.business_categories business_category
join public.categories category on category.id = business_category.category_id
where business.id = business_category.business_id
  and business_category.is_primary;

revoke select on public.businesses from anon, authenticated;
grant update (name, description, phone, whatsapp, website, instagram, updated_at)
  on public.businesses to authenticated;
grant select (
  id,
  slug,
  name,
  description,
  specialty,
  phone,
  whatsapp,
  email,
  website,
  instagram,
  verified,
  status,
  trusted_since,
  created_at,
  updated_at,
  business_kind,
  business_archetype,
  document_type,
  trust_level
) on public.businesses to anon, authenticated;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'businesses'
      and column_name = 'status_reason'
  ) then
    grant select (status_reason) on public.businesses to authenticated;
  end if;
end $$;

create or replace function public.create_business_with_owner(
  business_name text,
  business_description text,
  primary_category_slug text,
  requested_capabilities text[] default '{}',
  business_kind text default 'company',
  document_type text default null,
  document_number text default null,
  contact_whatsapp text default null,
  contact_phone text default null,
  contact_instagram text default null,
  contact_website text default null,
  location_postal_code text default null,
  location_city text default null,
  location_state_code text default null,
  location_neighborhood text default null,
  location_address_line text default null,
  location_service_area text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile_id uuid := auth.uid();
  category_record public.categories%rowtype;
  created_business_id uuid;
  generated_slug text;
  derived_archetype text;
  p_business_name text := $1;
  p_business_description text := $2;
  p_primary_category_slug text := $3;
  p_requested_capabilities text[] := $4;
  p_business_kind text := $5;
  p_document_type text := $6;
  p_document_number text := $7;
  p_contact_whatsapp text := $8;
  p_contact_phone text := $9;
  p_contact_instagram text := $10;
  p_contact_website text := $11;
  p_location_postal_code text := $12;
  p_location_city text := $13;
  p_location_state_code text := $14;
  p_location_neighborhood text := $15;
  p_location_address_line text := $16;
  p_location_service_area text := $17;
  clean_document text := nullif(regexp_replace(coalesce(p_document_number, ''), '\D', '', 'g'), '');
begin
  if current_profile_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_business_kind not in ('individual', 'company') then
    raise exception 'invalid_business_kind' using errcode = '22023';
  end if;

  if p_document_type is not null and p_document_type not in ('cpf', 'cnpj') then
    raise exception 'invalid_document_type' using errcode = '22023';
  end if;

  if clean_document is not null and exists (
    select 1
    from public.businesses existing_business
    where existing_business.document_type = p_document_type
      and existing_business.document_number = clean_document
      and existing_business.status <> 'archived'
  ) then
    raise exception 'document_already_registered' using errcode = '23505';
  end if;

  select * into category_record
  from public.categories
  where slug = p_primary_category_slug and active;

  if category_record.id is null then
    raise exception 'invalid_primary_category' using errcode = '22023';
  end if;

  derived_archetype := case category_record.slug
    when 'barbearia' then 'appointment_business'
    when 'salao' then 'appointment_business'
    when 'manicure' then 'appointment_business'
    when 'estetica' then 'appointment_business'
    when 'dentista' then 'appointment_business'
    when 'clinica-medica' then 'appointment_business'
    when 'pet-shop' then 'catalog_business'
    when 'loja' then 'catalog_business'
    when 'mercado' then 'catalog_business'
    when 'autopeca' then 'catalog_business'
    when 'moda' then 'catalog_business'
    when 'restaurante' then 'food_business'
    when 'pizzaria' then 'food_business'
    when 'hamburgueria' then 'food_business'
    when 'acaiteria' then 'food_business'
    when 'lanchonete' then 'food_business'
    else 'service_provider'
  end;

  generated_slug := trim(both '-' from regexp_replace(lower(p_business_name), '[^a-z0-9]+', '-', 'g'))
    || '-' || substr(gen_random_uuid()::text, 1, 8);

  insert into public.businesses (
    slug,
    name,
    description,
    phone,
    whatsapp,
    website,
    instagram,
    business_kind,
    business_archetype,
    document_type,
    document_number,
    trust_level,
    status,
    verified
  )
  values (
    generated_slug,
    p_business_name,
    p_business_description,
    nullif(p_contact_phone, ''),
    nullif(p_contact_whatsapp, ''),
    nullif(p_contact_website, ''),
    nullif(p_contact_instagram, ''),
    p_business_kind,
    derived_archetype,
    p_document_type,
    clean_document,
    0,
    'pending_review',
    false
  )
  returning id into created_business_id;

  insert into public.business_members (business_id, profile_id, role, is_primary)
  values (created_business_id, current_profile_id, 'owner', true);

  insert into public.business_categories (business_id, category_id, is_primary)
  values (created_business_id, category_record.id, true);

  insert into public.business_domains (business_id, domain_id, is_primary)
  select created_business_id, category_domain.domain_id, row_number() over (order by category_domain.domain_id) = 1
  from public.category_domains category_domain
  where category_domain.category_id = category_record.id
    and category_domain.domain_id in ('services', 'shop');

  insert into public.locations (
    business_id,
    label,
    city,
    state_code,
    neighborhood,
    address_line,
    postal_code,
    service_area,
    is_primary
  )
  values (
    created_business_id,
    'Principal',
    coalesce(nullif(p_location_city, ''), 'Nao informado'),
    upper(coalesce(nullif(p_location_state_code, ''), 'SP')),
    coalesce(nullif(p_location_neighborhood, ''), 'Nao informado'),
    coalesce(nullif(p_location_address_line, ''), 'Atendimento por area'),
    nullif(p_location_postal_code, ''),
    nullif(p_location_service_area, ''),
    true
  );

  update public.business_capabilities business_capability
  set enabled = business_capability.capability_id = any(p_requested_capabilities),
      configured_by = current_profile_id,
      updated_at = now()
  where business_capability.business_id = created_business_id;

  return created_business_id;
end;
$$;

revoke all on function public.create_business_with_owner(
  text, text, text, text[], text, text, text, text, text, text, text, text, text, text, text, text, text
) from public;
grant execute on function public.create_business_with_owner(
  text, text, text, text[], text, text, text, text, text, text, text, text, text, text, text, text, text
) to authenticated;
