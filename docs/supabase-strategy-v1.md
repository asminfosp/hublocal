# HUB LOCAL - Estrategia Supabase V1

Status: planejamento. Supabase ainda nao integrado.

## Objetivo

Definir como o Supabase entrara no Hub Local sem acoplar a experiencia visual ao banco de dados.

## Fronteira

Implementacoes Supabase devem existir apenas em `src/infrastructure/supabase` e implementar contratos de `src/modules/*/repositories`.

Proibido em `app/`, `components/` e UI de modulos:

```tsx
const { data } = await supabase.from("businesses").select()
```

## Auth

Metodos iniciais planejados:

- Google.
- Email.

Papeis conceituais:

- Visitor.
- User.
- Business Owner.
- Admin.

Papeis e vinculos devem ser persistidos separadamente do perfil publico do negocio.

## Database

PostgreSQL com migrations versionadas.

Ordem inicial de schema:

1. Dominios e categorias.
2. Negocios e localizacoes.
3. Relacionamentos de dominio e categoria.
4. Horarios, midia e ofertas.
5. Sinais de confianca.
6. Identidade, ownership e permissoes.
7. Reviews e favoritos somente em fases futuras aprovadas.

## Storage

Buckets planejados:

- `businesses`.
- `profiles`.

Regras:

- Upload exige identidade autorizada.
- Leitura publica depende da finalidade do arquivo.
- Nome de arquivo nao representa autorizacao.
- Metadados relevantes permanecem no banco.

## RLS

RLS e obrigatoria em toda tabela acessivel pela aplicacao.

Politicas minimas:

- Visitor le somente registros publicos aprovados.
- User altera apenas seus recursos pessoais.
- Business Owner altera apenas negocios vinculados a ele.
- Admin executa moderacao por politica explicita.
- Service role nunca e exposta ao cliente.

## Repositorios Supabase

Adapters previstos:

- `SupabaseDiscoveryRepository`.
- `SupabaseBusinessRepository`.
- `SupabaseServiceRepository`.
- `SupabaseShopRepository`.
- `SupabaseMobilityRepository`.
- `SupabaseCategoryRepository`.

Cada adapter converte linhas do banco em entidades oficiais. Tipos gerados pelo Supabase nao devem atravessar a fronteira da infraestrutura.

## Migracao

### Fase 1 - Mock protegido por contratos

- Dados atuais permanecem ativos.
- Repositorios mockados tornam-se a fonte oficial temporaria.

### Fase 2 - Schema e RLS

- Criar migrations.
- Criar politicas.
- Validar acessos por papel.

### Fase 3 - Adapters Supabase

- Implementar contratos sem alterar a UI.
- Executar testes de contrato contra mock e Supabase.

### Fase 4 - Seed

- Converter a base mockada para seed reproduzivel.
- Validar categorias, dominios e relacionamentos.

### Fase 5 - Ativacao

- Trocar a composicao dos repositorios.
- Manter fallback controlado apenas durante homologacao.
- Monitorar erros, latencia e estados vazios.

## Observabilidade

Antes da ativacao real, definir:

- Registro seguro de erros.
- Correlation ID para operacoes relevantes.
- Monitoramento de falhas de repositorio.
- Metricas de busca sem resultado.
- Alertas para falhas de autorizacao inesperadas.

## Bloqueios Antes da Integracao

- Aprovacao da Arquitetura Oficial V1.
- Schema revisado.
- RLS testada.
- Ownership de negocios definido.
- Estrategia de ambientes definida.
- Seed validado.
- Contratos de repositorio cobertos por testes.

## Regra Final

Supabase e uma implementacao de infraestrutura.

Nao e a arquitetura do Hub Local.
