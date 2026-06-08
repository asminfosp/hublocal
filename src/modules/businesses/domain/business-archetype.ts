export const OFFICIAL_BUSINESS_ARCHETYPES = [
  "service_provider",
  "appointment_business",
  "catalog_business",
  "food_business",
] as const

export type BusinessArchetype = (typeof OFFICIAL_BUSINESS_ARCHETYPES)[number]

export const businessArchetypeLabels: Record<BusinessArchetype, string> = {
  service_provider: "Prestador de Servico",
  appointment_business: "Negocio com Agenda",
  catalog_business: "Negocio com Catalogo",
  food_business: "Negocio Alimenticio",
}

export const businessArchetypePanels: Record<BusinessArchetype, string[]> = {
  service_provider: ["Orcamentos", "Area de Atendimento", "Galeria", "Perfil Publico"],
  appointment_business: ["Agenda", "Horarios", "Profissionais", "Perfil Publico"],
  catalog_business: ["Catalogo", "Produtos", "Galeria", "Perfil Publico"],
  food_business: ["Cardapio", "Pedidos", "Horarios", "Perfil Publico"],
}

const categoryArchetypeMap: Record<string, BusinessArchetype> = {
  eletricista: "service_provider",
  encanador: "service_provider",
  pintor: "service_provider",
  pedreiro: "service_provider",
  marceneiro: "service_provider",
  jardineiro: "service_provider",
  mecanico: "service_provider",
  barbearia: "appointment_business",
  salao: "appointment_business",
  manicure: "appointment_business",
  estetica: "appointment_business",
  dentista: "appointment_business",
  "clinica-medica": "appointment_business",
  "pet-shop": "catalog_business",
  loja: "catalog_business",
  mercado: "catalog_business",
  autopeca: "catalog_business",
  moda: "catalog_business",
  restaurante: "food_business",
  pizzaria: "food_business",
  hamburgueria: "food_business",
  acaiteria: "food_business",
  lanchonete: "food_business",
}

export function inferBusinessArchetype(categorySlug: string): BusinessArchetype {
  return categoryArchetypeMap[categorySlug] ?? "service_provider"
}
