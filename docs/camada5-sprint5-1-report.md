# HUB LOCAL - Camada 5 Sprint 5.1

Status: implementacao concluida; ativacao externa parcialmente pendente.

Data: 7 de junho de 2026.

## O que foi implementado

- Supabase Auth SSR com cookies e fluxo PKCE.
- Login Google.
- Login por email com link magico.
- Callback de autenticacao.
- Logout.
- `requireAuth()`.
- Rota protegida `/perfil`.
- Perfil com nome, avatar, cidade e data de cadastro.
- Navbar adaptativa para visitante e usuario autenticado.
- Menu Meu Perfil, Favoritos e Sair.
- Migration `profiles.city` e `favorites`.
- RLS de favoritos por usuario.
- Favoritar e Compartilhar no perfil empresarial.
- Estados de carregamento em formularios e acoes.

## Arquitetura

- Supabase continua isolado em `src/infrastructure/supabase`.
- Server Actions consomem comandos da camada de aplicacao.
- UI nao acessa client Supabase diretamente.
- Proxy renova sessoes por cookies.

## Estado Real do Staging

Verificado em 7 de junho de 2026:

- Email Auth: habilitado.
- Google Auth: desabilitado no Dashboard Supabase.
- Tabela `favorites`: ainda nao aplicada no Staging.
- Coluna `profiles.city`: ainda nao aplicada no Staging.

## Ativacao Pendente

1. Habilitar Google provider no Supabase Dashboard.
2. Configurar credenciais Google e redirect URLs.
3. Aplicar migration `013_user_profiles_favorites.sql`.
4. Validar login Google real.
5. Validar email magic link real.
6. Validar persistencia e remocao de favoritos com usuario autenticado.

## Fora do Escopo Preservado

- Dashboard empresa.
- Reviews.
- Marketplace.
- Chat.
- Pagamentos.
- JOOIN.

## Proxima Sprint

Sprint 5.2:

- Favoritos completos.
- Historico.
- Preferencias.
- Personalizacao da Home.
