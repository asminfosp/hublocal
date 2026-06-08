# Hub Local - Business Archetypes V1

Status: Sprint 5.4.2.

## Conceito

Categoria representa o que o negocio e.

Arquetipo representa como o negocio opera.

```txt
Categoria
-> Arquetipo
-> Experiencia
-> Painel
```

## Arquetipos oficiais

| Arquetipo | Exemplos | Painel |
| --- | --- | --- |
| `service_provider` | Eletricista, Encanador, Pintor, Pedreiro, Marceneiro | Orcamentos, Area de Atendimento, Galeria, Perfil Publico |
| `appointment_business` | Barbearia, Salao, Manicure, Clinica, Dentista | Agenda, Horarios, Profissionais, Perfil Publico |
| `catalog_business` | Pet Shop, Loja, Mercado, Autopecas | Catalogo, Produtos, Galeria, Perfil Publico |
| `food_business` | Restaurante, Pizzaria, Hamburgueria, Acai | Cardapio, Pedidos, Horarios, Perfil Publico |

`mobility_operation` pertence ao ecossistema Hub Local e nao usa Business Console.

## Mapeamento inicial

| Categoria | Arquetipo |
| --- | --- |
| `eletricista` | `service_provider` |
| `mecanico` | `service_provider` |
| `barbearia` | `appointment_business` |
| `salao` | `appointment_business` |
| `dentista` | `appointment_business` |
| `pet-shop` | `catalog_business` |
| `autopeca` | `catalog_business` |
| `restaurante` | `food_business` |

O Business Console usa o arquetipo como base do dashboard e capabilities como refinamento operacional.
