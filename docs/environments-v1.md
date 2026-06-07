# HUB LOCAL - Ambientes V1

Status: estrategia aprovada. Ambientes ainda nao provisionados.

## Objetivo

Separar desenvolvimento, homologacao e producao para impedir vazamento de dados, configuracoes e riscos operacionais.

## Regra Principal

Cada ambiente possui:

- Projeto de banco independente.
- Credenciais independentes.
- Deploy independente.
- Dados independentes.
- Politicas e migrations na mesma versao aprovada.

Nunca compartilhar banco entre Staging e Production.

## Development

Uso:

- Desenvolvimento local.
- Testes automatizados.
- Validacao de migrations e seed.

Caracteristicas:

- Mock repositories continuam como padrao ate a V1.3.
- Banco local ou projeto remoto exclusivo futuro.
- Seed ficticio completo permitido.
- Reset explicito permitido.
- Logs detalhados sem segredos.

## Staging

Uso:

- Homologacao funcional.
- Validacao de RLS.
- Testes de adapters reais.
- Validacao de migrations antes de Production.

Caracteristicas:

- Projeto isolado.
- Dados ficticios ou anonimizados.
- Mesmas migrations de Production.
- Deploy automatico a partir de branch protegida de homologacao.
- Acesso restrito a equipe.

## Production

Uso:

- Usuarios e negocios reais.

Caracteristicas:

- Projeto isolado e protegido.
- Sem seed de empresas ficticias.
- Migrations somente por pipeline aprovado.
- Backups e restauracao definidos antes da ativacao.
- Logs minimizados e sem dados sensiveis.
- Acesso administrativo restrito e auditavel.

## Variaveis

Variaveis futuras previstas:

```text
NEXT_PUBLIC_APP_ENV
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

Regras:

- Variaveis `NEXT_PUBLIC_*` podem chegar ao navegador.
- Service role e `DATABASE_URL` existem apenas em contexto seguro.
- `.env.local` nunca e fonte oficial de Production.
- Segredos nao entram em Git, logs, screenshots ou fixtures.
- Validacao de ambiente deve falhar cedo quando variavel obrigatoria estiver ausente.

Nenhuma dessas variaveis Supabase sera adicionada nesta sprint.

## Estrategia de Deploy

### Pull Request

- TypeScript.
- Testes de fronteira.
- Testes de contrato mock.
- Build.
- Futuramente, preview isolado sem banco de Production.

### Staging

- Aplicar migrations pendentes em ambiente de homologacao.
- Executar testes RLS e contratos.
- Executar smoke tests.
- Aprovar manualmente promocao.

### Production

- Backup ou ponto de restauracao.
- Aplicar migration aprovada.
- Validar health checks.
- Publicar aplicacao.
- Monitorar erros e autorizacao.
- Executar rollback quando criterio definido for atingido.

## Estrategia de Banco

- Migrations sao a unica fonte de alteracao estrutural.
- Alteracao manual no painel deve ser reproduzida imediatamente em migration ou revertida.
- Staging recebe migrations antes de Production.
- Migrations destrutivas exigem estrategia expand-and-contract.
- Dados de Production nunca descem para Development sem anonimizacao formal.

## Matriz

| Caracteristica | Development | Staging | Production |
| --- | --- | --- | --- |
| Dados ficticios | sim | sim | nao |
| Reset permitido | sim, explicito | controlado | nao |
| Debug detalhado | sim | limitado | nao |
| Service role | ferramenta segura futura | pipeline seguro | pipeline seguro |
| Deploy automatico | local | branch protegida | promocao aprovada |

## Criterio de Aprovacao

Antes da integracao real:

- Projetos independentes definidos.
- Responsaveis e acessos definidos.
- Variaveis inventariadas.
- Pipeline de migrations definido.
- Estrategia de backup e rollback aprovada.
