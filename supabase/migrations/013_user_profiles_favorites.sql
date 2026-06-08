alter table public.profiles add column if not exists city text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.favorites (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, business_id)
);

create index favorites_business_idx on public.favorites(business_id);

alter table public.favorites enable row level security;

create policy "users read own favorites" on public.favorites
for select using (profile_id = auth.uid());

create policy "users create own favorites" on public.favorites
for insert with check (profile_id = auth.uid());

create policy "users delete own favorites" on public.favorites
for delete using (profile_id = auth.uid());

grant select, insert, delete on public.favorites to authenticated;
grant insert on public.profiles to authenticated;
grant update (display_name, avatar_url, city, updated_at) on public.profiles to authenticated;
