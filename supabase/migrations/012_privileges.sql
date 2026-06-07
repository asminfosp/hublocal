revoke update on public.businesses from authenticated;
grant update (name, description, specialty, phone, whatsapp, email, website, updated_at)
  on public.businesses to authenticated;

revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url, updated_at) on public.profiles to authenticated;

grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on public.locations, public.business_hours, public.business_media, public.offerings
  to authenticated;

grant insert, update, delete on public.domains, public.categories, public.category_domains,
  public.business_domains, public.business_categories, public.business_members, public.trust_signals
  to authenticated;

create or replace function public.admin_moderate_business(
  target_business_id uuid,
  target_status public.business_status,
  target_verified boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;

  update public.businesses
  set status = target_status,
      verified = target_verified,
      updated_at = now()
  where id = target_business_id;
end;
$$;

revoke all on function public.admin_moderate_business(uuid, public.business_status, boolean) from public;
grant execute on function public.admin_moderate_business(uuid, public.business_status, boolean) to authenticated;

alter default privileges in schema public revoke all on tables from anon, authenticated;
