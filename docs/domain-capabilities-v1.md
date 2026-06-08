# Hub Local - Domain Capabilities V1

Status: decisao oficial da Camada 5.2.

## Regra oficial

O Hub Local nao sera orientado somente pelo tipo da empresa. A plataforma sera orientada pelas capacidades que cada
negocio oferece:

```text
Empresa
  -> Capacidades
    -> Experiencia especifica
```

Categoria continua sendo a taxonomia usada para descoberta, classificacao e ativacao inicial. Capability passa a
representar um comportamento de negocio que altera a experiencia, os dados e as conversoes disponiveis.

## Entidade Capability

Uma capability possui:

- `id`: identificador estavel em ingles.
- `name`: nome de apresentacao.
- `description`: comportamento habilitado.
- `domain_id`: dominio empresarial responsavel, limitado a `services` ou `shop`.
- `allowed_category_slugs`: categorias que podem habilitar a capability na V1.
- `active`: disponibilidade global.

Catalogo oficial V1:

| ID | Nome | Dominio | Responsabilidade |
| --- | --- | --- | --- |
| `appointment` | Agendamento | Services | Horarios, agenda, reservas e confirmacao |
| `quote` | Orcamento | Services | Solicitacao, envio de informacoes e contato rapido |
| `catalog` | Catalogo | Shop | Produtos, vitrines e promocoes |
| `ordering` | Pedidos | Shop | Pedido, carrinho e compra |
| `delivery` | Entrega | Shop | Entrega e acompanhamento |
| `reservation` | Reserva | Services | Reserva de mesas, espacos e atendimentos |
| `service_area` | Area de atendimento | Services | Bairros e cidades atendidos |
| `call_request` | Solicitar ligacao | Services | Pedido de retorno por telefone |

## Ciclo de vida

1. A empresa escolhe seu tipo principal durante o cadastro.
2. A categoria principal ativa automaticamente as capabilities permitidas.
3. O proprietario pode ativar ou desativar somente capabilities permitidas para a categoria.
4. O perfil publico renderiza secoes e CTAs a partir das capabilities habilitadas.
5. Novos produtos de dominio usam capabilities como contrato, sem exigir novos tipos de empresa.

## Banco de dados

A migration `014_domain_capabilities.sql` adiciona, sem alterar tabelas atuais:

- `capabilities`: catalogo oficial.
- `business_capabilities`: capacidades habilitadas por empresa.

`business_capabilities` respeita ownership por `owns_business()`. Leitura publica exige capability habilitada e empresa
publicada. A ativacao inicial ocorre por trigger quando uma categoria principal e vinculada.

## Compatibilidade

- Dados antigos continuam funcionando por inferencia de categoria enquanto nao possuem registros persistidos.
- Supabase permanece confinado na camada de infraestrutura.
- Mobilidade nao e uma capability empresarial e nao pode ser vinculada por `business_capabilities`.

