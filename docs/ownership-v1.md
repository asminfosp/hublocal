# HUB LOCAL - Ownership V1

Status: aprovado para implementacao na Arquitetura V1.3.

## Objetivo

Definir quem pode administrar um negocio sem misturar identidade de usuario com o cadastro canonico da empresa.

## Modelo

```text
Identity futura
  -> Profile
    -> Business Member
      -> Business
```

O vinculo oficial existe em `business_members`.

## Regras V1

- Um usuario pode possuir multiplos negocios.
- Todo negocio administravel possui um proprietario principal.
- Na V1, existe exatamente um proprietario principal por negocio.
- O proprietario principal possui `role = owner` e `is_primary = true`.
- Um negocio criado sem identidade associada permanece `draft` e nao pode ser publicado.
- Transferencia de ownership exige fluxo administrativo futuro.
- Ownership nao concede permissao de moderacao ou verificacao.

## Preparacao para Multiplos Administradores

O schema permite varios membros por negocio desde o inicio.

Papeis previstos:

- `owner`: responsavel legal e principal.
- `manager`: administrador delegado futuro.

Na V1.3, apenas `owner` sera ativado. `manager` permanece reservado e sem fluxo visual.

## Limites

O proprietario pode futuramente:

- Editar dados do proprio negocio.
- Gerenciar ofertas.
- Gerenciar horarios.
- Gerenciar galeria.

O proprietario nao pode:

- Marcar o proprio negocio como verificado.
- Criar sinais de confianca administrativos.
- Editar categorias e dominios oficiais.
- Editar outro negocio sem vinculo.
- Publicar diretamente sem passar pelas regras definidas.

## Ciclo de Vida

```text
draft
  -> pending_review
    -> published
      -> suspended
      -> archived
```

- Owner cria e edita `draft`.
- Owner solicita revisao.
- Admin publica, suspende ou arquiva.
- Alteracoes sensiveis em negocio publicado podem exigir nova revisao futuramente.

## Invariantes

- Um perfil nao e uma empresa.
- Um negocio nao depende de um unico email para ownership.
- Remover o proprietario principal exige atribuir outro primeiro.
- Negocio suspenso continua pertencendo ao owner, mas deixa de ser publico.
- Exclusao de identidade nao apaga automaticamente o negocio.

## Auditoria Futura

Operacoes de ownership que exigirao registro:

- Criacao de vinculo.
- Transferencia.
- Remocao de membro.
- Mudanca de papel.
- Publicacao e suspensao.

## Decisoes Pendentes para V1.3

- Como o primeiro owner sera vinculado.
- Quem pode iniciar transferencia.
- Como recuperar ownership perdido.
- Quais alteracoes exigem nova moderacao.
