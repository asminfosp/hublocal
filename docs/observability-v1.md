# HUB LOCAL - Observabilidade V1

Status: estrategia aprovada. Nenhuma integracao implementada.

## Objetivo

Tornar falhas de descoberta, dados e autorizacao visiveis sem expor informacoes sensiveis.

## Principios

- Registrar eventos uteis, nao tudo.
- Nunca registrar segredos, tokens ou dados pessoais desnecessarios.
- Erros tecnicos possuem correlation ID.
- Eventos possuem ambiente e versao da aplicacao.
- Falhas esperadas e incidentes possuem severidades diferentes.

## Estrutura Minima de Evento

```text
timestamp
environment
application_version
event_name
severity
correlation_id
repository
operation
duration_ms
result
error_code
```

Campos de usuario, busca ou negocio devem ser reduzidos ou anonimizados quando possivel.

## Logs de Repositorio

Registrar:

- Operacao.
- Duracao.
- Sucesso ou falha.
- Codigo de erro normalizado.
- Quantidade de registros quando relevante.

Nao registrar:

- Payload completo de negocio.
- Telefone, WhatsApp ou email.
- Tokens.
- Credenciais.
- SQL com valores sensiveis.

## Erros

Categorias iniciais:

- `validation`.
- `not_found`.
- `conflict`.
- `unauthorized`.
- `unavailable`.
- `unexpected`.

Erros inesperados exigem:

- Correlation ID.
- Contexto tecnico minimo.
- Stack trace apenas em ambiente seguro.
- Alerta conforme frequencia e impacto.

## Buscas sem Resultado

Evento recomendado:

`discovery.search_no_results`

Registrar de forma segura:

- Termo normalizado ou hash, conforme politica futura.
- Cidade.
- Dominio.
- Categoria.
- Filtros ativos.
- Data.

Objetivo:

- Identificar demanda nao atendida.
- Melhorar taxonomia.
- Detectar problemas de indexacao.

Nao usar esse evento para criar funcionalidades automaticas sem revisao.

## Falhas de Autorizacao

Evento recomendado:

`authorization.denied`

Registrar:

- Papel esperado.
- Recurso.
- Operacao.
- Motivo normalizado.
- Correlation ID.

Nunca registrar token ou policy completa.

Alertar quando:

- Um usuario tenta acessar repetidamente negocios sem vinculo.
- O volume aumenta apos deploy.
- Admin perde acesso esperado.
- Visitor acessa informacao nao publica.

## Metricas Futuras

- Latencia por repositorio e operacao.
- Taxa de erro.
- Buscas sem resultado.
- Perfis nao encontrados.
- Negocios publicados por cidade.
- Falhas de RLS.
- Midia quebrada.
- Tempo de carregamento das rotas principais.

## Health Checks Futuros

- Aplicacao responde.
- Banco responde em operacao segura.
- Migrations esperadas estao aplicadas.
- Repositorios essenciais executam leitura minima.

Health check nao pode depender de service role no navegador.

## Alertas

Severidades:

- Info: comportamento esperado.
- Warning: degradacao ou repeticao anormal.
- Error: operacao relevante falhou.
- Critical: indisponibilidade, vazamento potencial ou falha ampla de autorizacao.

## Retencao e Privacidade

- Retencao deve ser definida antes de Production.
- Dados sensiveis devem ser mascarados.
- Acesso a logs de Production deve ser restrito.
- Eventos devem respeitar a futura politica de privacidade.

## Criterio de Aprovacao

Antes da ativacao real, a equipe deve conseguir responder:

- O que falhou?
- Em qual ambiente?
- Qual operacao foi afetada?
- Desde quando?
- Quantos usuarios foram impactados?
- Houve falha de autorizacao ou risco de dados?
