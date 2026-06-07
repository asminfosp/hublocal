# HUB LOCAL - Relatorio Arquitetura V1.3

Status: infraestrutura implementada; Staging funcional para leitura e homologacao.

Data: 6 de junho de 2026.

## Objetivo

Transformar a Arquitetura Oficial V1 em infraestrutura Supabase operacional sem alterar a experiencia visual.

## O que foi migrado

### Estrutura Supabase

- Supabase CLI inicializado em `supabase/config.toml`.
- Migrations versionadas criadas em `supabase/migrations`.
- Seed SQL executavel criado em `supabase/seed.sql`.
- Client oficial adicionado apenas na infraestrutura.
- Factory de repositorios permite alternar entre `mock` e `supabase`.

### Migrations

Migrations implementadas:

1. `001_domains.sql`.
2. `002_categories.sql`.
3. `003_businesses.sql`.
4. `004_business_members.sql`.
5. `005_locations.sql`.
6. `006_business_hours.sql`.
7. `007_business_media.sql`.
8. `008_offerings.sql`.
9. `009_trust_signals.sql`.
10. `010_relationships.sql`.
11. `011_rls.sql`.
12. `012_privileges.sql`.

### RLS e privilegios

RLS foi habilitada para todas as tabelas acessiveis pela aplicacao.

Policies implementadas para:

- Leitura publica de negocios publicados e dados relacionados.
- Leitura publica de dominios e categorias ativos.
- Owner gerenciar localizacoes, horarios, midia e ofertas vinculadas.
- Owner editar apenas campos permitidos do proprio negocio.
- Admin moderar negocios por funcao protegida.
- Admin gerenciar taxonomia, relacionamentos, ownership e sinais de confianca.

Funcoes auxiliares:

- `is_admin()`.
- `owns_business()`.
- `admin_moderate_business()`.

### Seeds

Arquivos gerados em `seed/`:

- `domains.json`.
- `categories.json`.
- `businesses.json`.
- `business-relations.json`.
- `locations.json`.
- `business-hours.json`.
- `business-media.json`.
- `offerings.json`.
- `trust-signals.json`.

Resultado atual:

- 384 negocios.
- 38 categorias.
- Relacionamentos, horarios, midia, ofertas e sinais reproduziveis.

Comandos:

```text
npm run seed:export
npm run seed:sql
```

### Adapters Supabase

Implementados:

- `SupabaseCategoryRepository`.
- `SupabaseBusinessRepository`.
- `SupabaseDiscoveryRepository`.
- `SupabaseServiceRepository`.
- `SupabaseShopRepository`.
- `SupabaseMobilityRepository`.

Tipos Supabase permanecem confinados em `src/infrastructure/supabase`.

### Composicao

`createRepositories()` aceita:

- `mock`.
- `supabase`.

Selecao por ambiente:

```text
HUB_REPOSITORY_PROVIDER=mock
HUB_REPOSITORY_PROVIDER=supabase
```

Mock permanece como padrao seguro.

## O que permanece mockado

- A composicao ativa nesta maquina continua `mock`.
- Avaliacoes e metricas visuais simuladas continuam fora do banco V1.
- Dados atuais continuam gerados originalmente por `lib/hub-data.ts`, mas agora podem ser exportados para seed.

## Tabelas ativas nas migrations

- profiles.
- businesses.
- business_members.
- domains.
- categories.
- business_domains.
- category_domains.
- business_categories.
- locations.
- business_hours.
- business_media.
- offerings.
- trust_signals.

## Policies ativas nas migrations

- Leitura publica somente de registros publicados/ativos.
- Leitura e escrita de owner somente em negocios vinculados.
- Gerenciamento administrativo condicionado a `is_admin()`.
- Nenhuma tabela publica sem RLS e policy explicita.
- Campos de moderacao protegidos por privilegios e funcao administrativa.

## Cobertura de testes

Cobertura implementada:

- Ordem e completude das migrations.
- RLS habilitada em todas as tabelas.
- Presenca de policies explicitas.
- Integridade e contagens do seed.
- Factory de repositorios.
- Falha segura quando Supabase nao esta configurado.
- Suite de contrato Supabase condicional para ambiente configurado.
- Testes de contrato mock existentes.
- Testes de navegacao desktop/mobile existentes.

## Validacao de Banco Real

O Supabase CLI foi instalado e inicializado.

A execucao local real foi tentada com:

```text
npx supabase start
```

Bloqueio encontrado:

- Docker Desktop nao esta disponivel/ativo nesta maquina.

O ambiente Staging configurado foi validado pelos adapters Supabase reais.

Resultado comprovado:

- 3 dominios.
- 8 categorias.
- 20 empresas publicadas e verificadas.
- 20 localizacoes.
- 40 ofertas.
- Embu das Artes, Taboao da Serra e Itapecerica da Serra.
- Home, Busca e Perfil consumindo Supabase.

## Staging

Staging esta funcional para leitura e homologacao da experiencia atual.

O hotfix oficial esta documentado em:

`docs/staging-seed-hotfix.md`

O seed reproduzivel esta em:

`supabase/seeds/staging.sql`

A suite de contratos Supabase passou em desktop e mobile.

## Riscos Remanescentes

- O historico completo de migrations e policies ainda precisa ser validado com acesso administrativo ou ambiente local Docker.
- Policies precisam de testes positivos e negativos com identidades reais.
- Adapters Supabase precisam passar a suite de contratos em Staging.
- Descoberta inicialmente agrega e filtra parte dos dados em memoria; deve evoluir para consultas eficientes.
- `open_now`, distancia e ranking precisam de projecoes reais.
- Metricas de avaliacao continuam fora do schema V1.
- Strategy de Storage continua fora desta sprint.

## Proximos Passos para Ativacao

1. Configurar `SUPABASE_ACCESS_TOKEN` para operacoes administrativas via CLI.
2. Validar historico completo de migrations e RLS contra banco limpo.
3. Executar testes positivos e negativos de ownership.
4. Definir promocao controlada para Production.

## Decisao de Fechamento

A infraestrutura V1.3 esta implementada no repositorio e Staging esta funcional para homologacao.

A aprovacao operacional completa permanece condicionada aos testes administrativos de migrations, RLS e ownership.
