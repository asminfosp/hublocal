# HUB LOCAL - Estrategia RLS V1

Status: politica conceitual aprovada. Nenhuma policy implementada.

## Objetivo

Definir autorizacao por responsabilidade e ownership antes da criacao das policies reais.

## Principios

- RLS obrigatoria em toda tabela acessivel pela aplicacao.
- Ausencia de policy significa ausencia de acesso.
- Service role nunca e usada no cliente.
- Leitura publica exige registro publicado e ativo.
- Ownership e verificado por `business_members`, nunca por email informado no negocio.
- Admin e identificado por atributo controlado e nao autoeditavel.

## Papeis

### Visitor

Sem identidade autenticada.

Pode:

- Ler dominios e categorias ativos.
- Ler negocios `published`.
- Ler localizacoes, horarios, midia e ofertas ativas de negocios publicados.
- Ler sinais de confianca ativos e publicos.

Nao pode escrever.

### User

Identidade autenticada sem ownership.

Possui as mesmas leituras do Visitor.

Preferencias pessoais permanecem fora do schema V1.

### Business Owner

Usuario com linha valida em `business_members`.

Pode:

- Ler seus negocios em qualquer status.
- Criar e editar dados permitidos de seus negocios.
- Gerenciar localizacoes, horarios, midia e ofertas dos seus negocios.
- Solicitar revisao por transicao autorizada.

Nao pode:

- Alterar `verified`.
- Alterar sinais de confianca administrativos.
- Alterar taxonomia oficial.
- Editar ownership diretamente.
- Publicar, suspender ou moderar.

### Admin

Pode:

- Moderar negocios.
- Gerenciar dominios e categorias.
- Gerenciar sinais de confianca.
- Administrar ownership por operacao controlada.

Permissoes administrativas devem ser explicitas e auditaveis.

## Matriz Conceitual

| Tabela | Visitor/User | Business Owner | Admin |
| --- | --- | --- | --- |
| profiles | nenhuma leitura publica; proprio perfil futuro | proprio perfil | leitura controlada |
| businesses | select published | select e update dos proprios; insert futuro | select/update moderacao |
| business_members | nenhuma | select dos proprios vinculos | gerenciamento controlado |
| domains | select active | select active | gerenciamento |
| categories | select active | select active | gerenciamento |
| business_domains | select de published | select; mudanca mediada | gerenciamento |
| business_categories | select de published | select; mudanca mediada | gerenciamento |
| locations | select de published | CRUD dos proprios | moderacao |
| business_hours | select de published | CRUD dos proprios | moderacao |
| business_media | select de published | CRUD dos proprios | moderacao |
| offerings | select active de published | CRUD dos proprios | moderacao |
| trust_signals | select ativos | select | gerenciamento |

## Predicados Conceituais

### Negocio publico

```text
business.status = published
```

### Proprietario autorizado

```text
exists business_members
where business_id = row.business_id
and profile_id = current_user
and role = owner
```

### Administrador

```text
current profile role = admin
```

O mecanismo real sera definido nas migrations. Estes predicados descrevem comportamento, nao SQL final.

## Protecao de Campos

RLS controla linhas, mas nao resolve sozinha permissao por coluna.

Campos protegidos exigirao funcoes, views ou operacoes server-side controladas:

- `verified`.
- `status`.
- `slug` depois da publicacao.
- Ownership.
- Sinais de confianca.
- Papel administrativo.

## Testes Obrigatorios na V1.3

Para cada policy:

- Visitor permitido.
- Visitor negado.
- User permitido.
- Owner do registro permitido.
- Owner de outro registro negado.
- Admin permitido.
- Registro suspenso nao publico.
- Tentativa de alterar campo protegido negada.

## Falhas de Autorizacao

- Devem ser registradas sem dados sensiveis.
- Devem distinguir falha esperada de comportamento suspeito.
- Repeticoes anormais devem gerar alerta futuro.

## Regra Final

Autenticacao prova identidade.

Ownership prova responsabilidade.

RLS aplica autorizacao.
