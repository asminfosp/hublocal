# Identity & Ownership V1

## Regra oficial

Todo negocio nasce vinculado a uma identidade autenticada. O fluxo oficial e:

```txt
Visitante
  -> Criar conta ou entrar
  -> Minha Conta
  -> Meus Negocios
  -> Cadastrar Empresa
```

## Identidade

O Supabase Auth e a fonte de identidade. A tabela `profiles` complementa `auth.users`
com dados publicos da conta. Rotas privadas nunca aceitam um `profile_id` informado
pelo frontend como prova de identidade.

## Ownership

A funcao `create_business_with_owner` cria o negocio e, na mesma transacao, registra:

```txt
business_members
  business_id = negocio criado
  profile_id = auth.uid()
  role = owner
  is_primary = true
```

O dashboard e as consultas privadas derivam o usuario da sessao e exigem membership
com papel `owner`. As politicas RLS continuam sendo a barreira final de autorizacao.

## Rotas

Publicas: `/`, `/buscar`, `/empresa/*`, `/servicos`, `/shop`, `/mobilidade`,
`/entrar`, `/cadastro` e `/recuperar-acesso`.

Privadas: `/minha-conta`, `/meus-negocios`, `/cadastrar-empresa`, `/favoritos`,
`/configuracoes` e `/negocio/*`.

## Compatibilidade

Esta camada e aditiva, compativel com Supabase, Arquitetura V1 e Domain Capabilities V1.
Mobilidade permanece fora do dominio Empresas.
