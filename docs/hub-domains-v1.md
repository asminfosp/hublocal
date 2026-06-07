# HUB LOCAL - Dominios Oficiais V1

Status: aprovado como base da Arquitetura Oficial V1.

Data: 6 de junho de 2026.

## Decisao Executiva

O Hub Local sera organizado como uma plataforma de descoberta local composta por:

- Uma superficie principal de entrada: Inicio.
- Tres dominios de oferta visiveis ao usuario: Servicos, Shop e Mobilidade.
- Dois dominios compartilhados de plataforma: Descoberta e Negocios.

Inicio e uma experiencia agregadora, nao um dominio de dados independente.

Descoberta e Negocios sustentam toda a plataforma, mas nao precisam aparecer como secoes isoladas na navegacao.

Pilar permanente:

> Ser a melhor porta de entrada para a economia local.

## Principios de Organizacao

### Dominio nao e categoria

Dominio representa uma responsabilidade ampla e estavel do produto.

Categoria representa uma forma de classificar uma empresa, profissional, loja ou oferta dentro de um dominio.

Exemplo:

- Servicos e um dominio.
- Eletricista e uma categoria.
- Instalacao eletrica e um servico oferecido.

### Empresa nao deve ser duplicada

Uma empresa possui um unico cadastro principal e pode participar de mais de um dominio por meio de capacidades.

Exemplo:

- Uma loja de informatica participa de Shop ao expor produtos.
- A mesma empresa participa de Servicos ao oferecer manutencao.
- Caso ofereca entrega propria, pode indicar essa capacidade sem se tornar uma operacao JOOIN.

### Dominios representam intencao

A classificacao principal deve considerar o que o usuario deseja resolver:

- Contratar uma execucao: Servicos.
- Encontrar uma loja ou produto: Shop.
- Resolver deslocamento ou logistica local: Mobilidade.
- Explorar possibilidades sem uma intencao definida: Inicio e Descoberta.

### V1 continua orientada a descoberta

Os dominios organizam busca, navegacao, dados e roadmap. Eles nao transformam o Hub Local em marketplace.

Nesta fase, o Hub apresenta opcoes, contexto e meios de contato. Nao realiza pagamento, reserva, pedido ou operacao logistica.

## Mapa Oficial

| Camada | Dominio | Responsabilidade principal |
| --- | --- | --- |
| Experiencia | Inicio | Agregar descoberta e apresentar a economia local |
| Plataforma | Descoberta | Busca, filtros, destaques, proximidade e relevancia |
| Plataforma | Negocios | Cadastro canonico de empresas e profissionais |
| Oferta | Servicos | Descoberta de prestadores e servicos locais |
| Oferta | Shop | Descoberta de lojas e produtos do comercio local |
| Oferta | Mobilidade | Descoberta de opcoes de deslocamento e logistica local |

## Inicio

### Papel

Inicio e a porta de entrada da plataforma. Sua funcao e apresentar sinais vivos da economia local e conduzir o usuario para os demais dominios.

### Responsabilidades

- Busca principal.
- Localizacao atual.
- Categorias e caminhos de descoberta.
- Empresas proximas e verificadas.
- Tendencias e destaques da regiao.
- Conteudo agregado de Servicos, Shop e Mobilidade.

### Limites

- Nao possui cadastro proprio de empresas.
- Nao define regras exclusivas de categorias.
- Nao duplica logica de busca ou relevancia.
- Nao realiza operacoes dos demais dominios.

### Impacto arquitetural

Inicio deve ser implementado como composicao de consultas e modulos dos dominios compartilhados e de oferta.

## Descoberta

### Papel

Descoberta e o motor transversal que conecta intencao, localizacao e oferta.

### Responsabilidades

- Busca textual.
- Filtros.
- Ordenacao.
- Proximidade.
- Destaques.
- Recomendacoes editoriais.
- Estados vazios e sugestoes relacionadas.
- Navegacao por cidade, dominio e categoria.

### Limites

- Nao e proprietaria dos dados de empresas.
- Nao executa transacoes.
- Nao administra operacoes logisticas.
- Nao deve criar uma copia de cada empresa para cada resultado.

### Impacto arquitetural

Busca e Home devem consumir contratos de Descoberta, sem consultar diretamente o provedor de banco de dados.

## Negocios

### Papel

Negocios e a fonte canonica de empresas e profissionais presentes no Hub Local.

### Responsabilidades

- Identidade publica do negocio.
- Nome, descricao, contato e endereco.
- Cidades e areas atendidas.
- Horarios.
- Imagens.
- Sinais de verificacao.
- Associacao com categorias, dominios e capacidades.

### Limites

- Nao define ranking de busca sozinho.
- Nao representa usuario autenticado.
- Nao deve misturar cadastro publico com operacao interna do JOOIN.
- Nao deve duplicar registros quando um negocio participa de varios dominios.

### Impacto arquitetural

O perfil atual de empresa pertence a Negocios. Servicos, produtos e capacidades de mobilidade devem se relacionar com esse cadastro canonico.

## Servicos

### Papel

Conectar usuarios a profissionais e empresas que executam atividades locais.

### Exemplos

- Eletricista.
- Encanador.
- Chaveiro.
- Dentista.
- Mecanico.
- Barbearia.
- Pintor.
- Marceneiro.

### Responsabilidades

- Classificar prestadores e tipos de servico.
- Expor servicos oferecidos.
- Informar area atendida, disponibilidade e contato.
- Apoiar comparacao por confianca, proximidade e avaliacao.

### Limites

- Nao gerencia agenda ou reserva na V1.
- Nao intermedeia pagamento.
- Nao acompanha execucao do servico.
- Nao substitui o cadastro canonico de Negocios.

### Regra de classificacao

Quando o principal resultado esperado pelo usuario e uma atividade executada por alguem, a intencao pertence a Servicos.

## Shop

Nome publico recomendado: Shop.

Descricao complementar recomendada: Comercio Local.

### Papel

Permitir a descoberta de lojas e produtos disponiveis na regiao.

### Exemplos

- Moda.
- Presentes.
- Papelaria.
- Informatica.
- Brinquedos.
- Utilidades.
- Decoracao.

### Responsabilidades

- Classificar lojas e segmentos comerciais.
- Apresentar produtos ou linhas de produto como informacao de descoberta.
- Mostrar localizacao, contato, horario e sinais de confianca da loja.
- Conectar a necessidade de entrega ao dominio Mobilidade quando aplicavel.

### Limites

- Nao e marketplace na V1.
- Nao possui carrinho, checkout, pagamento ou gestao de pedido.
- Nao promete estoque em tempo real sem uma capacidade futura especifica.
- Nao executa entrega.

### Regra de classificacao

Quando o principal resultado esperado pelo usuario e encontrar um produto ou uma loja, a intencao pertence a Shop.

## Mobilidade

### Papel

Permitir a descoberta de opcoes locais para movimentacao de pessoas, itens e pequenas cargas.

### Exemplos

- Motoboy.
- Entregas.
- Fretes.
- Transporte local.
- Coletas.

### Responsabilidades

- Classificar prestadores de mobilidade.
- Informar area de cobertura e tipo de atendimento.
- Expor contato e disponibilidade declarada.
- Conectar necessidades originadas em Shop ou Servicos a opcoes locais.

### Limites

- O Hub Local descobre e apresenta opcoes.
- O Hub Local nao despacha entregadores.
- O Hub Local nao rastreia corridas ou entregas.
- O Hub Local nao gerencia frota, rota, tarifa ou operacao.
- Toda execucao logistica estruturada pertence ao JOOIN.

### Regra de classificacao

Quando o principal resultado esperado pelo usuario e mover uma pessoa, item ou carga, a intencao pertence a Mobilidade.

## Hub Local x JOOIN

### Hub Local

O Hub Local e responsavel por descoberta:

- Apresentar empresas, profissionais, lojas e opcoes de mobilidade.
- Organizar busca, categorias e sinais de confianca.
- Facilitar contato direto.
- Conectar intencoes locais.

### JOOIN

O JOOIN e responsavel por execucao logistica:

- Operacao de entregas.
- Gestao de entregadores.
- Despacho.
- Rotas.
- Acompanhamento operacional.
- Regras e estados da entrega.

### Fronteira oficial

O Hub pode encaminhar uma necessidade de mobilidade ao JOOIN no futuro, mas nao deve incorporar a operacao do JOOIN ao seu dominio.

## Relacoes Entre Dominios

### Shop para Mobilidade

1. Usuario encontra uma loja ou produto em Shop.
2. Identifica necessidade de entrega.
3. Descobre uma opcao em Mobilidade ou e encaminhado ao JOOIN no futuro.

### Servicos para Mobilidade

1. Usuario encontra um prestador em Servicos.
2. O atendimento exige coleta, transporte ou deslocamento.
3. Mobilidade apresenta opcoes compativeis.

### Inicio para qualquer dominio

1. Usuario inicia sem intencao totalmente definida.
2. Descoberta interpreta busca, categoria e localizacao.
3. A experiencia encaminha para Servicos, Shop, Mobilidade ou um perfil de Negocio.

### Negocios para multiplos dominios

1. Um negocio possui um cadastro canonico.
2. Capacidades e ofertas associam o negocio aos dominios aplicaveis.
3. Descoberta apresenta o mesmo negocio conforme a intencao do usuario.

## Avaliacao da Proposta

### 1. Os quatro dominios fazem sentido?

Sim, como estrutura de experiencia:

- Inicio funciona como agregador.
- Servicos representa contratacao de atividades.
- Shop representa comercio local.
- Mobilidade representa deslocamento e logistica.

Arquiteturalmente, Inicio nao deve ser tratado como dominio de dados. Descoberta e Negocios precisam ser reconhecidos como dominios compartilhados.

### 2. Existe algum dominio faltando?

Nao falta outro dominio publico para a V1.

Descoberta e Negocios estavam implicitos e devem ser formalizados como dominios internos. Identidade, Localizacao, Confianca e Midia sao capacidades compartilhadas, nao dominios publicos neste momento.

### 3. Algum dominio esta amplo demais?

Servicos e amplo, mas essa amplitude e adequada desde que categorias e capacidades organizem os diferentes tipos de prestador.

Shop precisa manter o limite de descoberta comercial para nao se tornar marketplace.

Mobilidade precisa manter a fronteira com JOOIN para nao absorver operacao logistica.

### 4. Alguma funcionalidade atual esta no dominio errado?

Nao ha funcionalidade atual claramente no dominio errado, mas a taxonomia atual mistura dominios e categorias:

- Alimentacao pode representar lojas em Shop ou experiencias e negocios locais em Descoberta.
- Automotivo, Saude, Beleza e Pet sao familias de categorias, nao dominios.
- Perfil Empresa pertence a Negocios.
- Busca pertence a Descoberta.
- Home corresponde a Inicio.

A migracao deve preservar a experiencia atual e substituir gradualmente a taxonomia tecnica.

### 5. Como a divisao impacta a Arquitetura V1?

A arquitetura deve separar:

- Dados canonicos de negocio.
- Taxonomia de dominios e categorias.
- Ofertas e capacidades do negocio.
- Consultas de descoberta.
- Identidade e permissoes.
- Integracoes externas, incluindo uma futura ponte com JOOIN.

## Impactos Arquiteturais

### Estrutura de pastas

Estrutura recomendada:

```text
app/
  (discovery)/
    page.tsx
    buscar/
  servicos/
  shop/
  mobilidade/
  empresa/[slug]/

modules/
  discovery/
  businesses/
  services/
  shop/
  mobility/
  taxonomy/
  location/
```

Rotas e modulos nao precisam ser criados antes de existirem experiencias reais. A estrutura define direcao, nao autoriza telas vazias.

### Rotas

Rotas publicas candidatas:

- `/` para Inicio.
- `/buscar` para busca transversal.
- `/servicos` para descoberta orientada a servicos.
- `/shop` para descoberta orientada a comercio local.
- `/mobilidade` para descoberta orientada a deslocamento e logistica.
- `/empresa/[slug]` para o perfil canonico do negocio.

Categorias devem ser filtros ou segmentos dessas rotas, evitando uma pagina duplicada para cada combinacao.

### Navegacao

A navegacao global futura deve refletir os dominios publicos:

- Inicio.
- Servicos.
- Shop.
- Mobilidade.

Busca permanece uma acao transversal. Empresas pode continuar como caminho de descoberta enquanto houver valor para o usuario, mas nao representa um dominio separado da arquitetura.

Qualquer alteracao na navbar depende de uma experiencia real para a rota correspondente.

### Banco de dados

Entidades conceituais minimas:

- `businesses`: cadastro canonico.
- `domains`: Servicos, Shop e Mobilidade.
- `categories`: classificacoes navegaveis.
- `business_domains`: participacao de um negocio em dominios.
- `business_categories`: classificacao de um negocio.
- `offerings`: servicos, produtos informativos ou capacidades oferecidas.
- `locations`: endereco e cobertura.
- `business_hours`: horarios.
- `business_media`: imagens.
- `trust_signals`: verificacao e outros sinais de confianca.

Uma oferta deve possuir um tipo claro, como `service`, `product_reference` ou `mobility_capability`. A V1 nao deve modelar pedido, pagamento ou entrega operacional.

### Categorias

Categorias atuais devem ser migradas para uma taxonomia hierarquica.

Exemplo:

```text
Servicos
  Casa e manutencao
    Eletricista
    Encanador

Shop
  Alimentacao
    Padaria
  Informatica
    Loja de computadores

Mobilidade
  Entregas
    Motoboy
  Cargas
    Frete local
```

Uma categoria pode ser associada a mais de um dominio somente quando a intencao realmente variar. Essa associacao nao duplica o negocio.

### Permissoes

Permissoes devem acompanhar responsabilidade, nao pagina:

- Visitante consulta descoberta e perfis publicos.
- Usuario autenticado gerencia recursos pessoais futuros.
- Responsavel pelo negocio gerencia apenas seu cadastro e suas ofertas.
- Moderacao valida conteudo e sinais de confianca.
- Integracoes acessam somente contratos explicitamente autorizados.
- JOOIN nao recebe acesso irrestrito aos dados internos do Hub Local.

### Contratos e repositorios

Componentes nao devem consultar Supabase diretamente.

Contratos recomendados:

- `DiscoveryRepository`.
- `BusinessRepository`.
- `TaxonomyRepository`.
- `ServiceOfferingRepository`.
- `ShopOfferingRepository`.
- `MobilityOfferingRepository`.

As implementacoes podem inicialmente consumir dados mockados e depois migrar para Supabase sem alterar a interface de apresentacao.

### Roadmap

Ordem recomendada antes do Supabase:

1. Aprovar este documento.
2. Definir linguagem ubiqua e nomes oficiais.
3. Definir entidades e relacionamentos.
4. Definir contratos de repositorio.
5. Definir papeis, permissoes e RLS.
6. Planejar migracao dos dados mockados.
7. Implementar a Arquitetura Oficial V1.
8. Integrar Supabase por dominio.

## Decisoes que Precisam de Aprovacao

- Tratar Inicio como superficie agregadora, e nao como dominio de dados.
- Reconhecer Descoberta e Negocios como dominios compartilhados.
- Adotar Shop como nome publico, acompanhado de "Comercio Local".
- Classificar negocios por capacidades sem duplicar cadastros.
- Manter Mobilidade limitada a descoberta e separar a operacao JOOIN.
- Preservar Busca como experiencia transversal.

## Regra de Aprovacao

Nenhuma decisao da Arquitetura Oficial V1 deve ser tomada antes da aprovacao destes dominios, limites e relacoes.

Primeiro definimos como a plataforma se organiza.

Depois definimos como ela sera construida.
