# Supabase Adapter Boundary

Este diretorio recebera as implementacoes Supabase somente depois da aprovacao da Arquitetura Oficial V1.

Regras:

- Implementacoes devem satisfazer os contratos definidos em `src/modules/*/repositories`.
- Componentes, paginas e modulos visuais nao podem importar clientes Supabase.
- RLS e obrigatoria para toda tabela acessivel pela aplicacao.
- Segredos e service role nunca podem ser expostos ao cliente.
- A troca entre mock e Supabase deve ocorrer na composicao de `src/infrastructure/repositories`.

## Documentos Oficiais

- `docs/database-schema-v1.md`
- `docs/ownership-v1.md`
- `docs/rls-strategy-v1.md`
- `docs/taxonomy-v1.md`
- `docs/seed-strategy-v1.md`
- `docs/environments-v1.md`
- `docs/observability-v1.md`
- `docs/supabase-migration-plan-v1.md`

## Implementacao V1.3

- Client isolado em `client.ts`.
- Adapters oficiais em `repositories.ts`.
- Mapeamento Banco -> Entidade em `mappers.ts`.
- Factory em `create-supabase-repositories.ts`.
- Migrations e RLS em `supabase/migrations`.
- Seed executavel em `supabase/seed.sql`.

Ativacao:

```text
HUB_REPOSITORY_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Sem essas variaveis, o projeto permanece em `mock`.
