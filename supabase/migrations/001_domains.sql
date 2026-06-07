create extension if not exists pgcrypto;
create extension if not exists citext;

create table public.domains (
  id text primary key,
  name text not null unique,
  description text not null,
  sort_order integer not null,
  active boolean not null default true,
  constraint domains_official_id check (id in ('services', 'shop', 'mobility'))
);

insert into public.domains (id, name, description, sort_order)
values
  ('services', 'Servicos', 'Prestadores e atividades executadas localmente.', 1),
  ('shop', 'Shop', 'Lojas, comercio local e referencias de produtos.', 2),
  ('mobility', 'Mobilidade', 'Opcoes locais de deslocamento e logistica.', 3);
