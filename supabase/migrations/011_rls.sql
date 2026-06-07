create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.owns_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where business_id = target_business_id
      and profile_id = auth.uid()
      and role = 'owner'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.owns_business(uuid) from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.owns_business(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.domains enable row level security;
alter table public.categories enable row level security;
alter table public.business_domains enable row level security;
alter table public.category_domains enable row level security;
alter table public.business_categories enable row level security;
alter table public.locations enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_media enable row level security;
alter table public.offerings enable row level security;
alter table public.trust_signals enable row level security;

create policy "public reads active domains" on public.domains for select using (active);
create policy "admin manages domains" on public.domains for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads active categories" on public.categories for select using (active);
create policy "admin manages categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads category domains" on public.category_domains for select using (true);
create policy "admin manages category domains" on public.category_domains for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published businesses" on public.businesses for select using (status = 'published');
create policy "owners read own businesses" on public.businesses for select using (public.owns_business(id));
create policy "owners update own businesses" on public.businesses for update using (public.owns_business(id)) with check (public.owns_business(id));
create policy "admin manages businesses" on public.businesses for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'user');
create policy "admin manages profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "owners read own membership" on public.business_members for select using (profile_id = auth.uid());
create policy "admin manages memberships" on public.business_members for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published business domains" on public.business_domains for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "admin manages business domains" on public.business_domains for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads published business categories" on public.business_categories for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "admin manages business categories" on public.business_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published locations" on public.locations for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "owners manage own locations" on public.locations for all using (public.owns_business(business_id)) with check (public.owns_business(business_id));
create policy "admin manages locations" on public.locations for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published hours" on public.business_hours for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "owners manage own hours" on public.business_hours for all using (public.owns_business(business_id)) with check (public.owns_business(business_id));
create policy "admin manages hours" on public.business_hours for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published media" on public.business_media for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "owners manage own media" on public.business_media for all using (public.owns_business(business_id)) with check (public.owns_business(business_id));
create policy "admin manages media" on public.business_media for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads active published offerings" on public.offerings for select using (
  active and exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "owners manage own offerings" on public.offerings for all using (public.owns_business(business_id)) with check (public.owns_business(business_id));
create policy "admin manages offerings" on public.offerings for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads active published trust signals" on public.trust_signals for select using (
  active
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at > now())
  and exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "admin manages trust signals" on public.trust_signals for all using (public.is_admin()) with check (public.is_admin());
