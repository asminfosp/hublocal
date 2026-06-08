export const OFFICIAL_CAPABILITY_IDS = [
  "appointment",
  "quote",
  "catalog",
  "ordering",
  "delivery",
  "reservation",
  "service_area",
  "call_request",
] as const

export type CapabilityId = (typeof OFFICIAL_CAPABILITY_IDS)[number]

export type Capability = {
  id: CapabilityId
  name: string
  description: string
  domainId: "services" | "shop"
}

export const capabilityCatalog: Record<CapabilityId, Capability> = {
  appointment: {
    id: "appointment",
    name: "Agendamento",
    description: "Horarios, agenda, reservas e confirmacao.",
    domainId: "services",
  },
  quote: {
    id: "quote",
    name: "Orcamento",
    description: "Solicitacao de orcamento, envio de informacoes e contato rapido.",
    domainId: "services",
  },
  catalog: {
    id: "catalog",
    name: "Catalogo",
    description: "Produtos, vitrines e promocoes.",
    domainId: "shop",
  },
  ordering: {
    id: "ordering",
    name: "Pedidos",
    description: "Pedido, carrinho e compra.",
    domainId: "shop",
  },
  delivery: {
    id: "delivery",
    name: "Entrega",
    description: "Entrega de pedidos e acompanhamento.",
    domainId: "shop",
  },
  reservation: {
    id: "reservation",
    name: "Reserva",
    description: "Reservas de mesas, espacos e atendimentos.",
    domainId: "services",
  },
  service_area: {
    id: "service_area",
    name: "Area de atendimento",
    description: "Bairros e cidades atendidos.",
    domainId: "services",
  },
  call_request: {
    id: "call_request",
    name: "Solicitar ligacao",
    description: "Pedido de retorno por telefone.",
    domainId: "services",
  },
}

const categoryCapabilityRules: Array<{ terms: string[]; capabilities: CapabilityId[] }> = [
  {
    terms: ["barbearia", "salao", "manicure", "estetica", "clinica", "dentista"],
    capabilities: ["appointment"],
  },
  {
    terms: ["eletricista", "encanador", "pedreiro", "pintor", "marceneiro", "assistencia tecnica", "oficina", "mecanico", "auto eletrica"],
    capabilities: ["quote", "service_area"],
  },
  {
    terms: ["loja", "pet shop", "moda", "brinquedo", "autopeca", "autopecas"],
    capabilities: ["catalog"],
  },
  {
    terms: ["pizzaria", "lanche", "mercado", "restaurante"],
    capabilities: ["catalog", "ordering"],
  },
]

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
}

export function inferCapabilitiesFromCategories(categories: Array<{ name: string }>): CapabilityId[] {
  const categoryNames = categories.map((category) => normalize(category.name))
  const capabilities = new Set<CapabilityId>()

  for (const rule of categoryCapabilityRules) {
    if (rule.terms.some((term) => categoryNames.some((category) => category.includes(term)))) {
      rule.capabilities.forEach((capability) => capabilities.add(capability))
    }
  }

  return [...capabilities]
}

export function getCapabilities(ids: CapabilityId[]) {
  return ids.map((id) => capabilityCatalog[id])
}
