create type public.profile_role as enum ('user', 'admin');
create type public.business_member_role as enum ('owner', 'manager');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.profile_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.business_member_role not null default 'owner',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (business_id, profile_id)
);

create unique index business_members_one_primary_owner_idx
  on public.business_members(business_id)
  where role = 'owner' and is_primary = true;
create index business_members_profile_idx on public.business_members(profile_id);
