-- Hub Local Staging hotfix seed.
-- Fictitious data only. Safe to reapply: it replaces only businesses prefixed with stg-.

begin;

delete from public.businesses where slug like 'stg-%';

insert into public.domains (id, name, description, sort_order, active)
values
  ('services', 'Servicos', 'Prestadores e atividades executadas localmente.', 1, true),
  ('shop', 'Shop', 'Lojas, comercio local e referencias de produtos.', 2, true),
  ('mobility', 'Mobilidade', 'Opcoes locais de deslocamento e logistica.', 3, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  active = excluded.active;

insert into public.categories (slug, name, description, sort_order, active)
values
  ('eletricistas', 'Eletricistas', 'Instalacoes e manutencao eletrica.', 1, true),
  ('encanadores', 'Encanadores', 'Reparos e instalacoes hidraulicas.', 2, true),
  ('mecanicas', 'Mecanicas', 'Manutencao automotiva local.', 3, true),
  ('beleza', 'Beleza', 'Barbearias, saloes e autocuidado.', 4, true),
  ('pizzarias', 'Pizzarias', 'Pizzas e sabores locais.', 5, true),
  ('pet-shops', 'Pet Shops', 'Produtos e cuidados para pets.', 6, true),
  ('lojas-locais', 'Lojas Locais', 'Comercio e produtos da regiao.', 7, true),
  ('fretes-locais', 'Fretes Locais', 'Fretes, coletas e transporte local.', 8, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  active = excluded.active;

insert into public.category_domains (category_id, domain_id)
select category.id, mapping.domain_id
from (
  values
    ('eletricistas', 'services'),
    ('encanadores', 'services'),
    ('mecanicas', 'services'),
    ('beleza', 'services'),
    ('pizzarias', 'shop'),
    ('pet-shops', 'shop'),
    ('lojas-locais', 'shop'),
    ('fretes-locais', 'mobility')
) as mapping(category_slug, domain_id)
join public.categories category on category.slug = mapping.category_slug
on conflict do nothing;

create temporary table staging_businesses (
  slug text primary key,
  name text not null,
  description text not null,
  category_slug text not null,
  domain_id text not null,
  city text not null,
  neighborhood text not null,
  address_line text not null,
  phone text not null,
  whatsapp text not null,
  offering_one text not null,
  offering_two text not null
) on commit drop;

insert into staging_businesses
  (slug, name, description, category_slug, domain_id, city, neighborhood, address_line, phone, whatsapp, offering_one, offering_two)
values
  ('stg-luz-embu-eletrica', 'Luz Embu Eletrica', 'Eletricistas ficticios para manutencao residencial em Embu das Artes.', 'eletricistas', 'services', 'Embu das Artes', 'Centro', 'Rua da Matriz, 101', '(11) 4000-1001', '551140001001', 'Instalacao residencial', 'Manutencao eletrica'),
  ('stg-volts-pirajussara', 'Volts Pirajussara', 'Atendimento eletrico ficticio para testes de homologacao.', 'eletricistas', 'services', 'Embu das Artes', 'Parque Pirajussara', 'Avenida Rotary, 220', '(11) 4000-1002', '551140001002', 'Troca de disjuntores', 'Revisao de instalacao'),
  ('stg-hidraulica-das-artes', 'Hidraulica das Artes', 'Servicos hidraulicos ficticios com atendimento local.', 'encanadores', 'services', 'Embu das Artes', 'Jardim Santo Eduardo', 'Rua Belo Horizonte, 88', '(11) 4000-1003', '551140001003', 'Reparo de vazamentos', 'Instalacao hidraulica'),
  ('stg-encanador-taboao', 'Encanador Taboao', 'Profissional ficticio para testes de busca e perfil.', 'encanadores', 'services', 'Taboao da Serra', 'Centro', 'Rua do Tesouro, 310', '(11) 4000-1004', '551140001004', 'Desentupimento', 'Troca de torneiras'),
  ('stg-auto-centro-embu', 'Auto Centro Embu', 'Mecanica ficticia para homologacao da plataforma.', 'mecanicas', 'services', 'Embu das Artes', 'Cercado Grande', 'Estrada de Itapecerica, 455', '(11) 4000-1005', '551140001005', 'Revisao automotiva', 'Troca de oleo'),
  ('stg-garagem-taboao', 'Garagem Taboao', 'Oficina ficticia com manutencao preventiva.', 'mecanicas', 'services', 'Taboao da Serra', 'Jardim Maria Rosa', 'Avenida Vida Nova, 72', '(11) 4000-1006', '551140001006', 'Freios e suspensao', 'Diagnostico automotivo'),
  ('stg-barbearia-praca', 'Barbearia da Praca', 'Barbearia ficticia no centro de Embu das Artes.', 'beleza', 'services', 'Embu das Artes', 'Centro', 'Rua Nossa Senhora do Rosario, 44', '(11) 4000-1007', '551140001007', 'Corte masculino', 'Barba'),
  ('stg-studio-itapecerica', 'Studio Itapecerica', 'Salao ficticio para testes de descoberta local.', 'beleza', 'services', 'Itapecerica da Serra', 'Centro', 'Rua Major Manoel Francisco de Moraes, 150', '(11) 4000-1008', '551140001008', 'Corte e escova', 'Manicure'),
  ('stg-pizza-forno-embu', 'Pizza Forno Embu', 'Pizzaria ficticia com sabores artesanais.', 'pizzarias', 'shop', 'Embu das Artes', 'Vila Isis Cristina', 'Rua das Artes, 90', '(11) 4000-1009', '551140001009', 'Pizza artesanal', 'Pizza doce'),
  ('stg-pizzaria-taboao', 'Pizzaria Taboao Central', 'Pizzaria ficticia para homologacao de Shop.', 'pizzarias', 'shop', 'Taboao da Serra', 'Centro', 'Avenida Armando Andrade, 540', '(11) 4000-1010', '551140001010', 'Pizza tradicional', 'Combos de pizza'),
  ('stg-pizza-serra', 'Pizza da Serra', 'Pizzaria ficticia de Itapecerica da Serra.', 'pizzarias', 'shop', 'Itapecerica da Serra', 'Jardim Jacira', 'Estrada de Itapecerica, 820', '(11) 4000-1011', '551140001011', 'Pizza especial', 'Bebidas'),
  ('stg-pet-artes', 'Pet Artes', 'Pet shop ficticio com produtos e cuidados locais.', 'pet-shops', 'shop', 'Embu das Artes', 'Centro', 'Rua da Ajuda, 63', '(11) 4000-1012', '551140001012', 'Racao para pets', 'Acessorios pet'),
  ('stg-pet-taboao', 'Pet Taboao', 'Loja pet ficticia para homologacao.', 'pet-shops', 'shop', 'Taboao da Serra', 'Parque Assuncao', 'Rua das Acacias, 205', '(11) 4000-1013', '551140001013', 'Produtos veterinarios', 'Higiene pet'),
  ('stg-casa-util-embu', 'Casa Util Embu', 'Loja ficticia de utilidades para a casa.', 'lojas-locais', 'shop', 'Embu das Artes', 'Jardim Vista Alegre', 'Avenida Elias Yazbek, 640', '(11) 4000-1014', '551140001014', 'Utilidades domesticas', 'Organizacao'),
  ('stg-papelaria-taboao', 'Papelaria Taboao', 'Papelaria ficticia com materiais para rotina local.', 'lojas-locais', 'shop', 'Taboao da Serra', 'Jardim Record', 'Estrada Kizaemon Takeuti, 330', '(11) 4000-1015', '551140001015', 'Material escolar', 'Itens de escritorio'),
  ('stg-presentes-serra', 'Presentes da Serra', 'Loja ficticia de presentes e decoracao.', 'lojas-locais', 'shop', 'Itapecerica da Serra', 'Centro', 'Rua Treze de Maio, 117', '(11) 4000-1016', '551140001016', 'Presentes locais', 'Decoracao'),
  ('stg-frete-embu', 'Frete Embu Local', 'Prestador ficticio de pequenos fretes locais.', 'fretes-locais', 'mobility', 'Embu das Artes', 'Parque Industrial', 'Rua dos Transportes, 18', '(11) 4000-1017', '551140001017', 'Pequenos fretes', 'Coletas locais'),
  ('stg-rota-taboao', 'Rota Taboao', 'Servico ficticio de coleta e transporte local.', 'fretes-locais', 'mobility', 'Taboao da Serra', 'Pirajussara', 'Avenida Intermunicipal, 410', '(11) 4000-1018', '551140001018', 'Frete urbano', 'Coleta agendada'),
  ('stg-mobilidade-serra', 'Mobilidade Serra', 'Opcao ficticia de transporte para homologacao.', 'fretes-locais', 'mobility', 'Itapecerica da Serra', 'Jardim Branca Flor', 'Rua da Mobilidade, 55', '(11) 4000-1019', '551140001019', 'Transporte local', 'Frete leve'),
  ('stg-coleta-regional', 'Coleta Regional Sul', 'Servico ficticio de coleta entre cidades da regiao.', 'fretes-locais', 'mobility', 'Itapecerica da Serra', 'Centro', 'Avenida Quinze de Novembro, 930', '(11) 4000-1020', '551140001020', 'Coleta regional', 'Transporte de volumes');

insert into public.businesses
  (slug, name, description, phone, whatsapp, verified, status, trusted_since)
select slug, name, description, phone, whatsapp, true, 'published', date '2025-01-01'
from staging_businesses;

insert into public.business_domains (business_id, domain_id, is_primary)
select business.id, staging.domain_id, true
from staging_businesses staging
join public.businesses business on business.slug = staging.slug;

insert into public.business_categories (business_id, category_id, is_primary)
select business.id, category.id, true
from staging_businesses staging
join public.businesses business on business.slug = staging.slug
join public.categories category on category.slug = staging.category_slug;

insert into public.locations
  (business_id, label, city, state_code, neighborhood, address_line, service_area, is_primary)
select business.id, 'Principal', staging.city, 'SP', staging.neighborhood, staging.address_line, staging.city || ' e regiao', true
from staging_businesses staging
join public.businesses business on business.slug = staging.slug;

insert into public.business_hours (business_id, weekday, opens_at, closes_at, is_closed, timezone)
select business.id, weekday.value, time '08:00', time '18:00', false, 'America/Sao_Paulo'
from staging_businesses staging
join public.businesses business on business.slug = staging.slug
cross join (values (1), (2), (3), (4), (5), (6)) as weekday(value);

insert into public.offerings (business_id, category_id, type, name, active)
select
  business.id,
  category.id,
  case staging.domain_id
    when 'shop' then 'product_reference'::public.offering_type
    when 'mobility' then 'mobility_capability'::public.offering_type
    else 'service'::public.offering_type
  end,
  offering.name,
  true
from staging_businesses staging
join public.businesses business on business.slug = staging.slug
join public.categories category on category.slug = staging.category_slug
cross join lateral (values (staging.offering_one), (staging.offering_two)) as offering(name);

insert into public.trust_signals (business_id, type, source, active)
select business.id, 'verified', 'admin', true
from staging_businesses staging
join public.businesses business on business.slug = staging.slug;

commit;
