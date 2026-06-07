# HUB LOCAL - Relatorio Arquitetura V1.1

Status: concluida.

Data: 6 de junho de 2026.

## Objetivo

Conectar a experiencia atual aos contratos e repositorios da Arquitetura Oficial V1 sem adicionar funcionalidades ou realizar integracao Supabase.

## O que foi migrado

### Home

A Home deixou de importar `lib/hub-data.ts`.

Agora utiliza somente `DiscoveryRepository` por meio da fronteira da aplicacao:

- `search()`.
- `getFeatured()`.
- `getTrending()`.
- `getNearby()`.
- `getCategories()`.
- `getPopularSearches()`.

Trilhos, categorias, estatisticas e empresas proximas desconhecem a origem dos dados.

### Busca

A Busca deixou de acessar arrays e funcoes mockadas.

Agora utiliza:

- `DiscoveryRepository.search()`.
- Categorias e buscas populares fornecidas pelo mesmo contrato de descoberta.

Filtros preservados:

- Mais proximos.
- Melhor avaliados.
- Verificados.
- Aberto agora.
- Categoria.
- Termo textual.

### Perfil Empresa

O Perfil Empresa deixou de acessar a base mockada.

Agora utiliza:

- `BusinessRepository.getBusinessBySlug()`.
- `BusinessRepository.listBusinesses()` para parametros estaticos e semelhantes.

O perfil consome o agregado canonico `Business`, incluindo contato, localizacao, horarios, midia, categorias, ofertas e sinais de confianca.

### Dominios

Cada superficie oficial consulta somente seu contrato:

- Servicos usa `ServiceRepository`.
- Shop usa `ShopRepository`.
- Mobilidade usa `MobilityRepository`.

Mobilidade preserva um estado vazio real, pois nenhum provedor foi validado na base atual.

### Componentes

`BusinessCard` e `FeaturedBusinesses` deixaram de depender dos tipos e arrays legados.

`BusinessCard` utiliza o modelo canonico `Business`.

### Composicao

`src/infrastructure/repositories/index.ts` permanece como ponto unico de composicao.

A UI acessa a composicao por meio de:

`src/application/repositories.ts`

Essa fronteira entrega contratos tipados e impede imports diretos de adapters pela apresentacao.

## Tipagem padronizada

O agregado canonico `Business` agora inclui:

- Identidade.
- Categorias.
- Dominios.
- Ofertas.
- Contato.
- Localizacao.
- Horarios.
- Midia.
- Sinais de confianca.
- Destaques de avaliacao somente leitura.

Tipos oficiais consolidados:

- `Business`.
- `BusinessLocation`.
- `Category`.
- `Offering`.
- `TrustSignal`.

Tipos especificos de oferta continuam isolados em seus dominios:

- `ServiceOffering`.
- `ProductReference`.
- `MobilityCapability`.

## Testes implementados

### Testes de contrato

Cobertura para:

- DiscoveryRepository.
- BusinessRepository.
- ServiceRepository.
- ShopRepository.
- MobilityRepository.

Os mesmos comportamentos deverao ser satisfeitos pelos futuros adapters Supabase.

### Testes de fronteira

A suite falha caso a apresentacao:

- Importe `lib/hub-data.ts`.
- Importe infraestrutura ou adapters diretamente.
- Acesse Supabase diretamente.

## O que ainda depende de mock

- As implementacoes concretas dos repositorios.
- A geracao da base ficticia em `lib/hub-data.ts`.
- Empresas, categorias, ofertas, imagens e sinais simulados.

Essa dependencia esta confinada em:

`src/infrastructure/repositories/mock/mock-hub-repositories.ts`

Nenhuma tela principal ou componente visual conhece essa origem.

## O que esta pronto para Supabase

- Entidades canonicas.
- Contratos oficiais.
- Ponto unico de composicao.
- Fronteira de aplicacao.
- Repositorios mockados como referencia comportamental.
- Testes de contrato.
- Protecao contra acesso direto da UI.
- Build com verificacao TypeScript obrigatoria.

Uma futura implementacao Supabase podera substituir os adapters mockados sem alterar Home, Busca, Perfil ou componentes.

## Proximos riscos

### Schema

O agregado `Business` precisa ser convertido em tabelas relacionais sem perder seus limites de dominio.

### Taxonomia

Categorias amplas e subcategorias coexistem na base mockada. O schema deve formalizar hierarquia e associacoes entre dominios.

### Sinais derivados

`open_now`, distancia e parte dos destaques podem ser calculados em tempo de consulta, nao necessariamente persistidos.

### Reviews

Destaques de avaliacao existem apenas para preservar a experiencia atual. Reviews continuam fora do escopo funcional e precisam de decisao propria.

### Ownership e RLS

Antes da integracao, e obrigatorio definir propriedade dos negocios, papeis e politicas RLS.

### Contratos assincronos

Toda UI principal ja trata repositorios como assincronos. Estados de indisponibilidade e observabilidade deverao ser definidos antes dos dados reais.

## Decisao de Fechamento

A Sprint Arquitetura V1.1 esta concluida.

A experiencia atual utiliza contratos oficiais e desconhece a fonte concreta dos dados.

Proxima etapa:

Arquitetura V1.2 - Schema SQL, Ownership, RLS, Migrations, Seeds e Ambientes.
