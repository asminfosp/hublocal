# HUB LOCAL - Arquitetura Oficial V1

Status: aprovada e implementada.

Data: 6 de junho de 2026.

## Objetivo

Organizar o Hub Local por dominios antes da integracao com Supabase.

Pilar permanente:

> Ser a melhor porta de entrada para a economia local.

## Decisoes Oficiais

- A arquitetura e orientada por dominios, nao por telas.
- Inicio e uma superficie agregadora sem dados proprios.
- Descoberta e Negocios sao dominios compartilhados.
- Servicos, Shop e Mobilidade sao dominios de oferta.
- Negocios mantem o cadastro canonico.
- Uma empresa pode participar de varios dominios sem duplicacao.
- A UI nunca acessa Supabase diretamente.
- Toda fonte de dados implementa contratos de repositorio.
- A operacao logistica pertence ao JOOIN, nunca ao Hub Local.

Os limites detalhados permanecem definidos em `docs/hub-domains-v1.md`.

## Estrutura Implementada

```text
src/
  modules/
    businesses/
      domain/
      repositories/
    discovery/
      domain/
      repositories/
    services/
      domain/
      repositories/
    shop/
      domain/
      repositories/
    mobility/
      domain/
      repositories/
    taxonomy/
      domain/
      repositories/
  shared/
    types/
  infrastructure/
    repositories/
      mock/
    supabase/
```

### Estrutura transitoria

As rotas atuais continuam em `app/`, os componentes em `components/` e a base mockada em `lib/hub-data.ts`.

Esta e uma decisao controlada:

- Preserva a experiencia aprovada.
- Evita uma migracao ampla sem ganho funcional.
- Permite adotar os contratos gradualmente.
- Mantem o build validavel durante a transicao.

O destino futuro e mover rotas, UI compartilhada e utilitarios para `src/` por etapas, sem alterar URLs publicas.

## Camadas

### Domain

Contem entidades, tipos e regras estaveis.

Pode importar:

- Outros tipos de dominio quando a relacao for explicita.

Nao pode importar:

- React.
- Next.js.
- Supabase.
- Componentes visuais.
- Implementacoes de infraestrutura.

### Repository Contracts

Definem como cada dominio solicita e persiste dados.

Contratos oficiais:

- `DiscoveryRepository`.
- `BusinessRepository`.
- `ServiceRepository`.
- `ShopRepository`.
- `MobilityRepository`.
- `CategoryRepository`.

### Infrastructure

Implementa contratos e conecta fontes externas ou locais.

Implementacao atual:

- Repositorios mockados sobre `lib/hub-data.ts`.

Implementacao futura:

- Repositorios Supabase.

### Presentation

Inclui rotas e componentes.

Pode consumir casos de uso ou repositorios disponibilizados pela composicao de infraestrutura.

Nao pode importar cliente Supabase.

## Entidades Oficiais

### Business

Cadastro canonico de empresa ou profissional.

Inclui:

- Identidade publica.
- Contatos.
- Localizacao e area atendida.
- Horarios.
- Midia.
- Dominios e categorias.
- Sinais de confianca.

### Domain

Valores oficiais:

- `services`.
- `shop`.
- `mobility`.

### Category

Classificacao navegavel associada a um ou mais dominios.

### Offering

Representa uma oferta publica vinculada a um negocio:

- `ServiceOffering`.
- `ProductReference`.
- `MobilityCapability`.

Nao representa pedido, pagamento ou execucao.

## Repositorios Oficiais

### DiscoveryRepository

- `search()`.
- `getTrending()`.
- `getNearby()`.
- `getFeatured()`.

### BusinessRepository

- `getBusiness()`.
- `getBusinessBySlug()`.
- `listBusinesses()`.
- `createBusiness()`.
- `updateBusiness()`.

### ServiceRepository

- `getServices()`.
- `getProviders()`.

### ShopRepository

- `getStores()`.
- `getProducts()`.

### MobilityRepository

- `getProviders()`.
- `getCoverage()`.

### CategoryRepository

- `getDomains()`.
- `getCategories()`.
- `getDomainCategories()`.
- `getCategoryBySlug()`.

## Composicao

O ponto oficial de composicao esta em:

`src/infrastructure/repositories/index.ts`

Hoje ele entrega adapters mockados. A integracao Supabase deve substituir implementacoes nesse ponto sem alterar contratos ou componentes.

## Banco de Dados Conceitual

Tabelas previstas:

- `businesses`.
- `domains`.
- `categories`.
- `business_domains`.
- `business_categories`.
- `offerings`.
- `locations`.
- `business_hours`.
- `business_media`.
- `trust_signals`.
- `reviews`, futura.
- `favorites`, futura.

Relacionamentos principais:

```text
businesses 1:N locations
businesses 1:N business_hours
businesses 1:N business_media
businesses N:N domains
businesses N:N categories
businesses 1:N offerings
businesses 1:N trust_signals
```

## Permissoes Conceituais

### Visitor

- Navegar.
- Buscar.
- Abrir perfis publicos.

### User

- Capacidades pessoais futuras, como favoritos e preferencias.

### Business Owner

- Gerenciar apenas negocios vinculados a sua identidade.
- Gerenciar ofertas e galeria autorizadas.

### Admin

- Moderar conteudo.
- Validar empresas.
- Gerenciar sinais de confianca.

## Regras Obrigatorias

- Nenhum componente ou `page.tsx` acessa Supabase diretamente.
- Nenhuma tabela publica existe sem politica RLS explicita.
- Nenhum dominio duplica o cadastro canonico de Negocios.
- Nenhuma oferta da V1 representa transacao.
- Mobilidade nao incorpora despacho, entrega ou operacao JOOIN.
- Erros de TypeScript bloqueiam o build.

## Plano de Adocao

1. Aprovar entidades e contratos implementados.
2. Migrar consultas da Home para `DiscoveryRepository`.
3. Migrar Busca para `DiscoveryRepository`.
4. Migrar Perfil Empresa para `BusinessRepository`.
5. Definir schema SQL e politicas RLS.
6. Implementar adapters Supabase.
7. Executar seed dos dados mockados.
8. Trocar a composicao de mock para Supabase.
9. Migrar estrutura visual para `src/app` de forma incremental.

## Arquitetura V1.2

O modelo de dados e as estrategias operacionais oficiais estao definidos em:

- `docs/database-schema-v1.md`.
- `docs/ownership-v1.md`.
- `docs/rls-strategy-v1.md`.
- `docs/taxonomy-v1.md`.
- `docs/seed-strategy-v1.md`.
- `docs/environments-v1.md`.
- `docs/observability-v1.md`.
- `docs/supabase-migration-plan-v1.md`.

Esses documentos devem ser aprovados antes da criacao de migrations ou integracao Supabase.

## Criterio de Aprovacao

A fundacao arquitetural esta pronta quando:

- Dominios possuem estrutura propria.
- Entidades e contratos compilam.
- Repositorios mockados implementam os contratos.
- A fronteira Supabase esta documentada.
- Testes impedem acesso direto ao Supabase pela UI.
- Build e TypeScript passam sem ignorar erros.

Somente depois dessa aprovacao deve iniciar a integracao definitiva com Supabase.
