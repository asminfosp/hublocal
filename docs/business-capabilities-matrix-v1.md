# Hub Local - Business Capabilities Matrix V1

Status: matriz oficial da Camada 5.2.

## Matriz inicial

| Tipo principal | Categoria de referencia | Capabilities ativadas |
| --- | --- | --- |
| Barbearia | `barbearia` | `appointment` |
| Salao | `salao` | `appointment` |
| Manicure | `manicure` | `appointment` |
| Estetica | `estetica` | `appointment` |
| Clinica | `clinica-medica` | `appointment` |
| Dentista | `dentista` | `appointment` |
| Eletricista | `eletricista` | `quote`, `service_area` |
| Encanador | `encanador` | `quote`, `service_area` |
| Pedreiro | `pedreiro` | `quote` |
| Pintor | `pintor` | `quote`, `service_area` |
| Marceneiro | `marceneiro` | `quote` |
| Assistencia Tecnica | `assistencia-tecnica` | `service_area` |
| Loja | `loja` | `catalog` |
| Pet Shop | `pet-shop` | `catalog` |
| Moda | `moda` | `catalog` |
| Brinquedos | `brinquedo` | `catalog` |
| Autopecas | `autopeca` | `catalog` |
| Pizzaria | `pizzaria` | `catalog`, `ordering` |
| Lanchonete | `lanchonete` | `catalog`, `ordering` |
| Mercado | `mercado` | `catalog`, `ordering` |
| Restaurante | `restaurante` | `catalog`, `ordering` |

## Regras

- A escolha do tipo principal e obrigatoria no cadastro.
- A categoria principal e a fonte da ativacao automatica.
- O proprietario pode configurar somente capabilities permitidas pela categoria.
- Capabilities futuras podem nascer desativadas ate possuirem experiencia operacional.
- Mobilidade nao aparece nesta matriz porque nao pertence a Empresas.

## Perfis dinamicos de referencia

| Perfil | Experiencia visivel |
| --- | --- |
| Barbearia | Agenda, horarios e profissionais |
| Eletricista | Area atendida, solicitar orcamento e WhatsApp |
| Loja | Catalogo, produtos e promocoes |
