# HUB LOCAL - Database Schema V1

Status: aprovado para implementacao na Arquitetura V1.3.

Data: 6 de junho de 2026.

## Objetivo

Definir o modelo relacional oficial que sustentara os contratos da aplicacao sem transformar Supabase na arquitetura do produto.

## Convencoes

- PostgreSQL.
- Chaves primarias UUID.
- Datas em `timestamptz`, armazenadas em UTC.
- Nomes tecnicos em ingles e `snake_case`.
- Slugs unicos e normalizados.
- Exclusao logica por `status`, quando necessaria.
- Toda tabela acessivel pela aplicacao tera RLS.
- `created_at` e `updated_at` sao obrigatorios em entidades mutaveis.

## Enums Conceituais

```text
business_status: draft | pending_review | published | suspended | archived
business_member_role: owner | manager
offering_type: service | product_reference | mobility_capability
media_type: cover | avatar | gallery
trust_signal_type: verified | featured | top_rated
trust_signal_source: system | admin
weekday: 0..6
```

`open_now` e um sinal calculado a partir de horarios e timezone. Nao deve ser persistido como verdade permanente.

## Diagrama Relacional

```text
profiles 1:N business_members N:1 businesses

businesses N:N domains              via business_domains
businesses N:N categories           via business_categories
categories N:N domains              via category_domains
categories 1:N categories           via parent_id

businesses 1:N locations
businesses 1:N business_hours
businesses 1:N business_media
businesses 1:N offerings
businesses 1:N trust_signals
```

## Tabelas de Identidade e Ownership

### profiles

Perfil interno associado futuramente a uma identidade autenticada.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK; futuramente referencia `auth.users.id` |
| display_name | text | opcional |
| avatar_url | text | opcional |
| role | text | `user` ou `admin`; default `user` |
| created_at | timestamptz | obrigatorio |
| updated_at | timestamptz | obrigatorio |

`profiles` nao representa empresa e nao deve conter dados publicos do negocio.

### business_members

Relaciona pessoas autorizadas a negocios.

| Campo | Tipo | Regra |
| --- | --- | --- |
| business_id | uuid | FK `businesses.id` |
| profile_id | uuid | FK `profiles.id` |
| role | business_member_role | `owner` ou `manager` |
| is_primary | boolean | default `false` |
| created_at | timestamptz | obrigatorio |

Chave unica: `(business_id, profile_id)`.

Regra V1: cada negocio publicado possui exatamente um membro `owner` com `is_primary = true`.

## Tabelas Canonicas

### businesses

Cadastro canonico de empresa ou profissional.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| slug | text | unico, obrigatorio |
| name | text | obrigatorio |
| description | text | obrigatorio |
| specialty | text | opcional |
| phone | text | opcional |
| whatsapp | text | opcional |
| email | citext | opcional |
| website | text | opcional |
| verified | boolean | default `false`; somente moderacao altera |
| status | business_status | default `draft` |
| trusted_since | date | opcional |
| created_at | timestamptz | obrigatorio |
| updated_at | timestamptz | obrigatorio |

Indices:

- Unique em `slug`.
- Parcial para registros `published`.
- Busca textual sobre nome, descricao e especialidade.

### domains

Dominios oficiais de oferta.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | text | PK |
| name | text | unico |
| description | text | obrigatorio |
| sort_order | integer | obrigatorio |
| active | boolean | default `true` |

Valores oficiais e imutaveis:

- `services`.
- `shop`.
- `mobility`.

### categories

Classificacao navegavel e hierarquica.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| parent_id | uuid | FK opcional para `categories.id` |
| slug | text | unico |
| name | text | obrigatorio |
| description | text | opcional |
| sort_order | integer | obrigatorio |
| active | boolean | default `true` |
| created_at | timestamptz | obrigatorio |
| updated_at | timestamptz | obrigatorio |

Regras:

- Uma categoria nao pode ser pai de si mesma.
- A V1 aceita no maximo tres niveis.
- Slug e unico globalmente para manter URLs previsiveis.

## Tabelas de Relacionamento

### business_domains

Relacionamento N:N entre negocios e dominios.

| Campo | Tipo | Regra |
| --- | --- | --- |
| business_id | uuid | FK `businesses.id` |
| domain_id | text | FK `domains.id` |
| is_primary | boolean | default `false` |
| created_at | timestamptz | obrigatorio |

Chave primaria composta: `(business_id, domain_id)`.

### category_domains

Relacionamento N:N entre categorias e dominios.

| Campo | Tipo | Regra |
| --- | --- | --- |
| category_id | uuid | FK `categories.id` |
| domain_id | text | FK `domains.id` |

Chave primaria composta: `(category_id, domain_id)`.

### business_categories

Relacionamento N:N entre negocios e categorias.

| Campo | Tipo | Regra |
| --- | --- | --- |
| business_id | uuid | FK `businesses.id` |
| category_id | uuid | FK `categories.id` |
| is_primary | boolean | default `false` |
| created_at | timestamptz | obrigatorio |

Chave primaria composta: `(business_id, category_id)`.

## Tabelas Operacionais de Descoberta

### locations

Enderecos e areas atendidas por um negocio.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| business_id | uuid | FK `businesses.id` |
| label | text | opcional |
| city | text | obrigatorio |
| state_code | char(2) | obrigatorio |
| neighborhood | text | obrigatorio |
| address_line | text | obrigatorio |
| postal_code | text | opcional |
| latitude | numeric(9,6) | opcional |
| longitude | numeric(9,6) | opcional |
| service_area | text | opcional |
| is_primary | boolean | default `false` |
| created_at | timestamptz | obrigatorio |
| updated_at | timestamptz | obrigatorio |

Indices:

- `business_id`.
- Cidade e bairro normalizados.
- Geoespacial futuro, somente apos decisao de extensao.

### business_hours

Horario semanal declarado pelo negocio.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| business_id | uuid | FK `businesses.id` |
| weekday | smallint | 0 a 6 |
| opens_at | time | opcional |
| closes_at | time | opcional |
| is_closed | boolean | default `false` |
| timezone | text | default `America/Sao_Paulo` |

Chave unica: `(business_id, weekday, opens_at)`.

Horarios excepcionais e feriados ficam para uma evolucao posterior.

### business_media

Metadados publicos da galeria.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| business_id | uuid | FK `businesses.id` |
| type | media_type | obrigatorio |
| url | text | obrigatorio |
| alt_text | text | opcional |
| sort_order | integer | default `0` |
| created_at | timestamptz | obrigatorio |

Storage nao sera implementado nesta sprint. A V1.3 definira como `url` sera produzida.

### offerings

Oferta publica de descoberta.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| business_id | uuid | FK `businesses.id` |
| category_id | uuid | FK opcional `categories.id` |
| type | offering_type | obrigatorio |
| name | text | obrigatorio |
| description | text | opcional |
| metadata | jsonb | default `{}` |
| active | boolean | default `true` |
| created_at | timestamptz | obrigatorio |
| updated_at | timestamptz | obrigatorio |

`metadata` aceita apenas detalhes informativos por tipo. Nao armazena carrinho, pedido, pagamento, rota ou execucao.

### trust_signals

Sinais persistidos e auditaveis de confianca.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | uuid | PK |
| business_id | uuid | FK `businesses.id` |
| type | trust_signal_type | obrigatorio |
| source | trust_signal_source | obrigatorio |
| active | boolean | default `true` |
| starts_at | timestamptz | opcional |
| ends_at | timestamptz | opcional |
| created_at | timestamptz | obrigatorio |
| updated_at | timestamptz | obrigatorio |

Regras:

- `verified` somente por Admin.
- `featured` pode ter janela de validade.
- `top_rated` pode ser materializado futuramente, mas sua origem deve ser sistemica.
- `open_now` e calculado e nao possui linha persistida.

## Dados Derivados

Nao persistir como verdade primaria:

- Distancia do usuario.
- `open_now`.
- Contagem de resultados.
- Ranking de busca.
- Recomendacoes.
- Media de avaliacao enquanto Reviews estiver fora da V1.

Esses valores pertencem a consultas de Descoberta ou a futuras projecoes.

## Exclusoes da V1

Nao fazem parte do schema aprovado:

- Reviews reais.
- Favoritos.
- Pedidos.
- Carrinho.
- Checkout.
- Pagamentos.
- Entregas.
- Rotas JOOIN.

## Mapeamento para Entidades

| Entidade da aplicacao | Fonte relacional |
| --- | --- |
| Business | businesses + relacionamentos |
| BusinessLocation | locations |
| BusinessHours | business_hours |
| BusinessMedia | business_media |
| Category | categories + category_domains |
| Offering | offerings |
| TrustSignal | businesses.verified + trust_signals + sinais calculados |

## Criterio de Aprovacao

- Entidades possuem fonte relacional clara.
- Ownership nao esta misturado ao cadastro publico.
- Categorias suportam hierarquia.
- Negocios podem participar de varios dominios.
- Sinais calculados nao sao persistidos incorretamente.
- Nenhuma entidade fora do escopo foi introduzida.
