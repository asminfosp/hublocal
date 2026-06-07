# HUB LOCAL - Plano de Migracao Supabase V1

Status: aprovado como sequencia de implementacao futura.

## Objetivo

Migrar de adapters mockados para adapters Supabase sem alterar a UI, quebrar contratos ou expor dados indevidamente.

## Condicoes de Entrada

- Arquitetura V1.1 aprovada.
- Schema V1 aprovado.
- Ownership aprovado.
- Estrategia RLS aprovada.
- Taxonomia aprovada.
- Seed e ambientes definidos.
- Nenhuma dependencia direta da UI para infraestrutura.

## Passo 1 - Schema

Entregas:

- Traduzir `docs/database-schema-v1.md` para definicoes SQL revisaveis.
- Validar enums, tabelas, FKs, constraints e indices.
- Confirmar exclusoes da V1.

Gate:

- Revisao arquitetural e de seguranca concluida.

## Passo 2 - Migrations

Entregas:

- Criar migrations versionadas e ordenadas.
- Testar aplicacao em banco vazio.
- Testar atualizacao incremental.
- Definir rollback ou estrategia de correcao.

Gate:

- Migrations reproduzem o schema em Development e Staging.

## Passo 3 - RLS

Entregas:

- Habilitar RLS.
- Implementar policies por papel e ownership.
- Proteger campos administrativos.
- Criar testes positivos e negativos.

Gate:

- Nenhuma tabela acessivel sem policy explicita.
- Owner de um negocio nao altera outro.
- Visitor nao le registros nao publicados.

## Passo 4 - Seed

Entregas:

- Criar exportador da base mockada.
- Gerar seed deterministico.
- Carregar Development e Staging.
- Comparar resultados dos repositorios.

Gate:

- Ecossistema atual e recriado sem edicao manual.
- Testes de contrato passam sobre dados semeados.

## Passo 5 - Adapters Supabase

Entregas:

- Implementar cada contrato oficial.
- Mapear linhas para entidades canonicas.
- Normalizar erros para `RepositoryError`.
- Evitar vazamento de tipos gerados para a aplicacao.

Ordem recomendada:

1. CategoryRepository.
2. BusinessRepository.
3. DiscoveryRepository.
4. ServiceRepository.
5. ShopRepository.
6. MobilityRepository.

Gate:

- Testes de contrato passam contra mock e Supabase.

## Passo 6 - Troca de Composicao

Entregas:

- Selecionar implementacao por ambiente no ponto unico de composicao.
- Manter UI inalterada.
- Executar smoke tests de Home, Busca, Perfil e Dominios.

Gate:

- Staging opera apenas com adapters Supabase.
- Nenhum import Supabase existe na apresentacao.

## Passo 7 - Ativacao

Entregas:

- Aplicar migrations em Production.
- Carregar somente taxonomia e dados aprovados.
- Ativar composicao Supabase.
- Monitorar erros, latencia, buscas sem resultado e autorizacao.

Gate:

- Criterios de saude permanecem dentro dos limites aprovados.

## Rollback

### Antes da ativacao

- Reverter deploy.
- Corrigir migration em nova versao.
- Preservar banco de Staging para diagnostico.

### Durante ativacao

- Restaurar composicao anterior quando compativel.
- Desabilitar escrita quando houver risco.
- Restaurar backup somente por decisao de incidente.

Nunca apagar migration aplicada em Production para simular rollback.

## Criterios de Pausa

Pausar migracao se houver:

- Falha de RLS.
- Divergencia entre contratos mock e Supabase.
- Perda de relacionamentos.
- Dados publicos indevidos.
- Latencia que comprometa os fluxos principais.
- Migration nao reproduzivel.

## Fora de Escopo

- Marketplace.
- Pagamentos.
- Reviews.
- Favoritos.
- Dashboard.
- Operacao JOOIN.

## Regra Final

Primeiro schema.

Depois migrations e seguranca.

Depois adapters.

Somente entao ativacao.
