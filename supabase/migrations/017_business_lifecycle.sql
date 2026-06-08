-- Official lifecycle statuses:
-- draft -> pending_review -> approved -> published -> suspended -> rejected
alter type public.business_status add value if not exists 'approved';
alter type public.business_status add value if not exists 'rejected';

alter table public.businesses
  add column if not exists status_reason text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid;

create table if not exists public.business_status_history (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  old_status public.business_status,
  new_status public.business_status not null,
  changed_at timestamptz not null default now(),
  changed_by uuid,
  reason text
);

create index if not exists business_status_history_business_idx
  on public.business_status_history(business_id, changed_at desc);

create or replace function public.record_business_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.business_status_history (
      business_id,
      old_status,
      new_status,
      changed_by,
      reason
    )
    values (
      new.id,
      old.status,
      new.status,
      auth.uid(),
      new.status_reason
    );
  end if;

  return new;
end;
$$;

drop trigger if exists businesses_status_history on public.businesses;
create trigger businesses_status_history
after update of status on public.businesses
for each row execute function public.record_business_status_change();

create or replace function public.transition_business_status(
  target_business_id uuid,
  target_status public.business_status,
  target_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile_id uuid := auth.uid();
begin
  if current_profile_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if not (public.is_admin() or public.owns_business(target_business_id)) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  update public.businesses
  set status = target_status,
      status_reason = nullif(target_reason, ''),
      reviewed_at = case
        when target_status::text in ('approved', 'published', 'suspended', 'rejected') then now()
        else reviewed_at
      end,
      reviewed_by = case
        when target_status::text in ('approved', 'published', 'suspended', 'rejected') then current_profile_id
        else reviewed_by
      end,
      updated_at = now()
  where id = target_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = '02000';
  end if;
end;
$$;

revoke all on function public.transition_business_status(uuid, public.business_status, text) from public;
grant execute on function public.transition_business_status(uuid, public.business_status, text) to authenticated;

revoke all on function public.record_business_status_change() from public;

grant select on public.business_status_history to authenticated;
grant select (status_reason) on public.businesses to authenticated;
grant update (status_reason, reviewed_at, reviewed_by, updated_at) on public.businesses to authenticated;

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
