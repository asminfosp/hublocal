# Auth Experience V1

## Regra oficial

A navegacao do Hub Local reflete o estado real da sessao:

```txt
loading
authenticated
unauthenticated
```

Durante o carregamento da sessao, a navbar exibe skeleton e evita mostrar o menu
errado.

## Visitante

Visitantes veem os pontos publicos:

```txt
Buscar
Cadastrar Empresa
Entrar
```

Ao acessar `/cadastrar-empresa`, o middleware redireciona para `/entrar` com o
parametro `next=/cadastrar-empresa` e a mensagem de contexto.

## Usuario autenticado

Usuarios autenticados veem avatar e dropdown com:

```txt
Minha Conta
Meus Negocios
Favoritos
Configuracoes
Sair
```

O avatar segue a prioridade:

```txt
Foto Google
  -> Avatar salvo
  -> Inicial do nome
```

## Login e cadastro

O fluxo principal de login usa email e senha. Google continua disponivel e magic
link permanece como alternativa secundaria. Cadastro tenta login automatico e
redireciona para `/minha-conta`.

## Feedback e telemetria

Eventos preparados:

```txt
login_success
login_failed
signup_success
logout
password_reset
```

Feedback visual usa `auth` na URL para exibir toasts de login, logout, cadastro e
recuperacao de acesso.

## Compatibilidade

Auth Experience V1 e compativel com Ownership V1, Domain Capabilities V1 e
Supabase Auth.
