create policy "owners read members of own businesses" on public.business_members
for select using (profile_id = auth.uid() or public.owns_business(business_id));

create policy "owners read own business domains" on public.business_domains
for select using (public.owns_business(business_id));

create policy "owners read own business categories" on public.business_categories
for select using (public.owns_business(business_id));

create or replace function public.create_business_with_owner(
  business_name text,
  business_description text,
  primary_category_slug text,
  requested_capabilities text[] default '{}'
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
begin
  if current_profile_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into category_record
  from public.categories
  where slug = primary_category_slug and active;

  if category_record.id is null then
    raise exception 'invalid_primary_category' using errcode = '22023';
  end if;

  generated_slug := trim(both '-' from regexp_replace(lower(business_name), '[^a-z0-9]+', '-', 'g'))
    || '-' || substr(gen_random_uuid()::text, 1, 8);

  insert into public.businesses (slug, name, description, status, verified)
  values (generated_slug, business_name, business_description, 'draft', false)
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

  update public.business_capabilities
  set enabled = capability_id = any(requested_capabilities),
      configured_by = current_profile_id,
      updated_at = now()
  where business_id = created_business_id;

  return created_business_id;
end;
$$;

revoke all on function public.create_business_with_owner(text, text, text, text[]) from public;
grant execute on function public.create_business_with_owner(text, text, text, text[]) to authenticated;
