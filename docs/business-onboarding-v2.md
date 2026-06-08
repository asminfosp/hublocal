# Business Onboarding V2

## Objetivo

O cadastro de negocios passa a ser um wizard oficial para participantes da
economia local: empresas com CNPJ, MEIs, profissionais autonomos, prestadores de
servico, negocios fisicos e negocios com area de atendimento.

## Etapas

```txt
1. Identificacao
2. Categoria Principal
3. Capacidades
4. Dados Publicos
5. Localizacao
6. Revisao e Publicacao
```

O estado do wizard e salvo temporariamente no navegador para reduzir perda de
dados durante o preenchimento.

## Identificacao

O onboarding suporta:

```txt
individual -> CPF, nome completo e WhatsApp
company    -> CNPJ com consulta BrasilAPI e fallback manual
```

CPF e `document_number` nao sao expostos em consultas publicas.

## CNPJ

A rota interna `/api/cnpj/[cnpj]` consulta:

```txt
https://brasilapi.com.br/api/cnpj/v1/{cnpj}
```

Quando a consulta falha, o usuario continua com preenchimento manual.

## Trust Level

Todo negocio nasce com:

```txt
trust_level = 0
```

Isto representa `Nao Verificado`.

## Ownership

A publicacao continua usando `create_business_with_owner`. Todo negocio publicado
cria automaticamente `business_members` com `role = owner` e `is_primary = true`.

## Fora do escopo

Agendamentos, console do negocio, pedidos, carrinho, pagamentos, assinaturas e
JOOIN continuam fora desta sprint.
