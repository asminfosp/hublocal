# HUB LOCAL - Estrategia de Seeds V1

Status: aprovada para implementacao na Arquitetura V1.3.

## Objetivo

Transformar a base mockada atual em um seed deterministico capaz de recriar o ecossistema de desenvolvimento e homologacao.

## Principios

- Seed e reproduzivel.
- Seed e idempotente.
- Seed nao depende da ordem acidental dos arrays atuais.
- IDs estaveis sao gerados a partir de chaves conhecidas.
- Dados ficticios nunca sao carregados automaticamente em Production.
- Seed respeita o mesmo schema e restricoes dos dados reais.
- Nenhum segredo ou identidade real entra no seed.

## Escopo

O seed V1 deve recriar:

- Dominios oficiais.
- Categorias e hierarquia.
- Associacoes entre categorias e dominios.
- Empresas ficticias.
- Associacoes de empresas com dominios e categorias.
- Localizacoes.
- Horarios.
- Midia por URL controlada.
- Ofertas.
- Sinais de confianca permitidos.

Fora do seed V1:

- Auth.
- Owners reais.
- Reviews.
- Favoritos.
- Storage.
- Operacao JOOIN.

## Fontes

Fonte temporaria:

- `lib/hub-data.ts`.

Destino planejado:

```text
seed/
  domains.json
  categories.json
  businesses.json
  business-relations.json
  locations.json
  business-hours.json
  business-media.json
  offerings.json
  trust-signals.json
```

Os arquivos finais devem ser gerados por um exportador validado, nao mantidos manualmente em paralelo com a base mockada.

## Ordem de Carga

1. `domains`.
2. `categories`.
3. `category_domains`.
4. `businesses`.
5. `business_domains`.
6. `business_categories`.
7. `locations`.
8. `business_hours`.
9. `business_media`.
10. `offerings`.
11. `trust_signals`.

Ownership nao sera criado automaticamente enquanto Auth estiver fora do escopo.

## Identificadores Estaveis

Registros de seed precisam manter IDs estaveis entre execucoes.

Chaves recomendadas:

- Domain: ID textual oficial.
- Category: UUID deterministico derivado do slug.
- Business: UUID deterministico derivado do slug.
- Registros filhos: UUID deterministico derivado de negocio + tipo + indice estavel.

Slugs e indices devem ser validados antes da geracao.

## Idempotencia

Cada execucao deve:

- Inserir registros ausentes.
- Atualizar registros ficticios identificados como seed.
- Nao duplicar relacionamentos.
- Nao sobrescrever dados reais.
- Remover dados antigos somente em reset explicito de Development.

Uma marca de origem, como `seed_key`, pode existir apenas em ambientes nao produtivos ou em tabela interna de controle.

## Transformacoes Necessarias

### Categorias

A estrutura atual mistura categorias amplas e subcategorias. O exportador deve aplicar `docs/taxonomy-v1.md`.

### Trust Signals

- `verified`, `featured` e `top_rated` podem gerar registros ficticios.
- `open_now` nao deve gerar registro; sera calculado.
- `nearby` nao deve gerar registro; depende do usuario.

### Reviews

`reviewHighlights` atuais nao entram no schema V1. Podem continuar no mock visual ate uma decisao futura, mas nao devem ser migrados como reviews reais.

### Midia

URLs locais atuais podem ser usadas em Development e Staging. Production exigira estrategia aprovada de Storage.

## Validacoes

Antes da carga:

- Slugs unicos.
- Dominios validos.
- Categorias sem ciclos.
- Negocios com nome e descricao.
- Pelo menos um dominio por negocio.
- Pelo menos uma categoria por negocio.
- Uma localizacao principal por negocio.
- Horarios validos.
- Tipos de offering validos.
- Trust signals permitidos.

Depois da carga:

- Contagens esperadas.
- Integridade de FKs.
- Nenhum relacionamento orfao.
- Consultas dos repositorios retornam resultados equivalentes ao mock.
- Testes de contrato passam.

## Ambientes

### Development

- Seed completo.
- Reset permitido explicitamente.
- Dados ficticios identificaveis.

### Staging

- Seed completo ou subconjunto aprovado.
- Reset controlado.
- Nunca usar dados pessoais reais.

### Production

- Seed somente para dominios e taxonomia oficial.
- Empresas ficticias proibidas por padrao.
- Qualquer carga inicial exige aprovacao formal.

## Criterio de Sucesso

Uma base vazia de Development deve conseguir reproduzir a experiencia atual executando migrations e seed, sem edicao manual.
