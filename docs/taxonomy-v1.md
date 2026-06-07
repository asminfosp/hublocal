# HUB LOCAL - Taxonomia Oficial V1

Status: aprovada para implementacao na Arquitetura V1.3.

## Objetivo

Organizar a descoberta sem confundir dominio, categoria, subcategoria e oferta.

## Conceitos

### Dominio

Responsabilidade ampla e estavel do produto.

Valores oficiais:

- Servicos (`services`).
- Shop (`shop`).
- Mobilidade (`mobility`).

### Categoria

Classificacao navegavel que agrupa intencoes relacionadas.

Exemplos:

- Casa e manutencao.
- Alimentacao.
- Saude.
- Entregas.

### Subcategoria

Categoria filha mais especifica.

Exemplos:

- Eletricista.
- Pizzaria.
- Dentista.
- Motoboy.

### Especializacao

Terceiro nivel opcional para refinamento de descoberta.

Exemplos:

- Instalacao residencial.
- Pizza artesanal.
- Ortodontia.
- Entrega expressa.

### Offering

Algo que um negocio declara oferecer.

Tipos:

- `service`.
- `product_reference`.
- `mobility_capability`.

Offering nao e categoria e nao cria uma pagina taxonomica automaticamente.

## Hierarquia Oficial

```text
Dominio
  -> Categoria
    -> Subcategoria
      -> Especializacao opcional
```

Limite V1: tres niveis em `categories`.

## Regras

- Um negocio pode participar de varios dominios.
- Uma categoria pode participar de varios dominios quando a intencao justificar.
- Um negocio pode possuir varias categorias, com uma principal.
- Categoria descreve classificacao; offering descreve capacidade real do negocio.
- Tags editoriais nao substituem categorias.
- Slugs sao unicos globalmente.
- Mudancas taxonomicas exigem migracao ou alias para nao quebrar descoberta.

## Exemplo

```text
services
  Casa e manutencao
    Eletricista
      Instalacao residencial

shop
  Alimentacao
    Padaria

mobility
  Entregas
    Motoboy
```

## Mapeamento Inicial da Base Mockada

| Classificacao atual | Tratamento V1 |
| --- | --- |
| Alimentacao | categoria, principalmente em Shop |
| Servicos | dominio tecnico antigo; deve ser decomposto em categorias |
| Automotivo | categoria em Servicos |
| Saude | categoria em Servicos |
| Beleza | categoria em Servicos |
| Pet | categoria que pode participar de Servicos e Shop |
| Pizzaria, Eletricista, Dentista | subcategorias |
| Lista de servicos do negocio | offerings |

## Governanca

Somente Admin pode:

- Criar ou arquivar categorias.
- Alterar hierarquia.
- Associar categorias a dominios.
- Gerenciar aliases.

Owner pode sugerir classificacao, mas nao alterar a taxonomia oficial diretamente.

## Evitar

- Usar dominio como categoria.
- Criar categoria para cada texto informado por empresa.
- Duplicar categoria por cidade.
- Misturar operacao JOOIN em Mobilidade.
- Modelar produtos como categorias.

## Criterio de Aprovacao

A taxonomia deve responder claramente:

- Qual intencao o usuario esta resolvendo?
- Em qual dominio ela vive?
- Qual classificacao permite encontra-la?
- Qual capacidade o negocio realmente oferece?
