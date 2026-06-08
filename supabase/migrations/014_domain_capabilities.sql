create table public.capabilities (
  id text primary key,
  name text not null unique,
  description text not null,
  domain_id text not null references public.domains(id) on delete restrict,
  allowed_category_slugs text[] not null default '{}',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint capabilities_business_domains_only check (domain_id in ('services', 'shop'))
);

create table public.business_capabilities (
  business_id uuid not null references public.businesses(id) on delete cascade,
  capability_id text not null references public.capabilities(id) on delete restrict,
  enabled boolean not null default true,
  configured_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (business_id, capability_id)
);

create index capabilities_active_sort_idx on public.capabilities(active, sort_order);
create index business_capabilities_enabled_idx on public.business_capabilities(business_id) where enabled;

insert into public.capabilities (id, name, description, domain_id, allowed_category_slugs, sort_order)
values
  ('appointment', 'Agendamento', 'Horarios, agenda, reservas e confirmacao.', 'services', array['barbearia', 'salao', 'manicure', 'estetica', 'clinica-medica', 'dentista'], 1),
  ('quote', 'Orcamento', 'Solicitacao de orcamento, envio de informacoes e contato rapido.', 'services', array['eletricista', 'encanador', 'pedreiro', 'pintor', 'marceneiro'], 2),
  ('catalog', 'Catalogo', 'Produtos, vitrines e promocoes.', 'shop', array['loja', 'pet-shop', 'moda', 'brinquedo', 'autopeca', 'pizzaria', 'lanchonete', 'mercado', 'restaurante'], 3),
  ('ordering', 'Pedidos', 'Pedido, carrinho e compra.', 'shop', array['pizzaria', 'lanchonete', 'mercado', 'restaurante'], 4),
  ('delivery', 'Entrega', 'Entrega de pedidos e acompanhamento.', 'shop', '{}', 5),
  ('reservation', 'Reserva', 'Reservas de mesas, espacos e atendimentos.', 'services', '{}', 6),
  ('service_area', 'Area de atendimento', 'Bairros e cidades atendidos.', 'services', array['eletricista', 'encanador', 'assistencia-tecnica', 'pintor'], 7),
  ('call_request', 'Solicitar ligacao', 'Pedido de retorno por telefone.', 'services', '{}', 8);

create or replace function public.activate_primary_category_capabilities()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_primary then
    insert into public.business_capabilities (business_id, capability_id)
    select new.business_id, capability.id
    from public.capabilities capability
    join public.categories category on category.id = new.category_id
    where capability.active and category.slug = any(capability.allowed_category_slugs)
    on conflict (business_id, capability_id) do update set enabled = true, updated_at = now();
  end if;
  return new;
end;
$$;

create trigger business_categories_activate_capabilities
after insert or update of is_primary on public.business_categories
for each row execute function public.activate_primary_category_capabilities();

insert into public.business_capabilities (business_id, capability_id)
select relation.business_id, capability.id
from public.business_categories relation
join public.categories category on category.id = relation.category_id
join public.capabilities capability on category.slug = any(capability.allowed_category_slugs)
where relation.is_primary and capability.active
on conflict (business_id, capability_id) do nothing;

create trigger capabilities_set_updated_at before update on public.capabilities
for each row execute function public.set_updated_at();
create trigger business_capabilities_set_updated_at before update on public.business_capabilities
for each row execute function public.set_updated_at();

alter table public.capabilities enable row level security;
alter table public.business_capabilities enable row level security;

create policy "public reads active capabilities" on public.capabilities
for select using (active);
create policy "admin manages capabilities" on public.capabilities
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads enabled published business capabilities" on public.business_capabilities
for select using (
  enabled and exists (
    select 1 from public.businesses business
    where business.id = business_id and business.status = 'published'
  )
);
create policy "owners manage allowed business capabilities" on public.business_capabilities
for all using (public.owns_business(business_id))
with check (
  public.owns_business(business_id)
  and (configured_by is null or configured_by = auth.uid())
  and exists (
    select 1
    from public.capabilities capability
    join public.business_categories relation on relation.business_id = business_capabilities.business_id and relation.is_primary
    join public.categories category on category.id = relation.category_id
    where capability.id = capability_id and category.slug = any(capability.allowed_category_slugs)
  )
);
create policy "admin manages business capabilities" on public.business_capabilities
for all using (public.is_admin()) with check (public.is_admin());

grant select on public.capabilities, public.business_capabilities to anon, authenticated;
grant insert, update, delete on public.capabilities, public.business_capabilities to authenticated;
