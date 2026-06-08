# Hub Local - Domain Experience V1

Status: decisao oficial da Camada 5.2.

## Principio

A experiencia nao nasce apenas da pagina ou da categoria. Ela nasce da combinacao entre dominio e capabilities ativas.

## Services

- Objetivo: encontrar e contratar.
- Conversao: lead.
- CTAs principais: WhatsApp, ligar, solicitar orcamento e agendar horario.
- Capabilities principais: `appointment`, `quote`, `service_area`, `reservation`, `call_request`.

Exemplo de perfil de barbearia:

- Agenda.
- Horarios.
- Profissionais.
- CTA de agendamento.

Exemplo de perfil de eletricista:

- Area atendida.
- Solicitacao de orcamento.
- WhatsApp.

## Shop

- Objetivo: encontrar e comprar.
- Conversao: pedido.
- CTAs principais: ver produto, adicionar ao carrinho e comprar.
- Capabilities principais: `catalog`, `ordering`, `delivery`.

Exemplo de perfil de loja:

- Catalogo.
- Produtos.
- Promocoes.

## Mobilidade

Mobilidade nao pertence ao dominio Empresas e nao participa de `business_capabilities`.

Mobilidade e um servico proprio do Hub Local:

```text
Hub Local
  -> Mobilidade
    -> JOOIN
```

Consequencias oficiais:

- Nao aparece no cadastro de empresas.
- Possui fluxo proprio.
- Possui painel proprio.
- Possui operacao propria.
- Sua conversao e uma solicitacao operacional.

## Renderizacao dinamica

O perfil publico deve:

1. Ler as capabilities habilitadas.
2. Exibir apenas experiencias suportadas.
3. Priorizar o CTA coerente com a intencao do dominio.
4. Preservar os dados gerais de perfil, confianca, localizacao e contato.

A V1 prepara a renderizacao e os contratos. Agendas, carrinho, pedidos, reservas e operacoes completas evoluem em
sprints proprias.

