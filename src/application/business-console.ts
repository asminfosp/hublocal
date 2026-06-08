import { createServerSupabaseClient } from "@/src/infrastructure/supabase/auth/server"
import {
  businessArchetypeLabels,
  businessArchetypePanels,
  inferBusinessArchetype,
  type BusinessArchetype,
} from "@/src/modules/businesses/domain/business-archetype"
import {
  businessStatusDescription,
  businessStatusLabel,
} from "@/src/modules/businesses/domain/business-lifecycle"
import { capabilityCatalog, type CapabilityId } from "@/src/modules/capabilities/domain/capability"

export type ConsoleLocation = {
  id: string
  city: string
  stateCode: string
  neighborhood: string
  addressLine: string
  postalCode: string
  serviceArea: string
}

export type ConsoleHour = {
  id: string
  weekday: number
  opensAt: string
  closesAt: string
  isClosed: boolean
}

export type ConsoleMedia = {
  id: string
  type: "avatar" | "cover" | "gallery"
  url: string
  altText: string
  sortOrder: number
}

export type BusinessConsole = {
  id: string
  slug: string
  name: string
  description: string
  status: string
  statusLabel: string
  statusDescription: string
  statusReason: string
  phone: string
  whatsapp: string
  website: string
  instagram: string
  businessKind: "individual" | "company"
  businessArchetype: BusinessArchetype
  documentType: string
  trustLevel: number
  verified: boolean
  categoryName: string
  categorySlug: string
  role: string
  capabilities: CapabilityId[]
  location: ConsoleLocation | null
  hours: ConsoleHour[]
  media: ConsoleMedia[]
}

function timeValue(value: string | null | undefined) {
  return value ? value.slice(0, 5) : ""
}

export function trustLevelLabel(level: number) {
  if (level >= 3) return "Verificado Hub Local"
  if (level === 2) return "CNPJ Confirmado"
  if (level === 1) return "WhatsApp Verificado"
  return "Nao Verificado"
}

export function getArchetypePanelItems(archetype: BusinessArchetype) {
  return businessArchetypePanels[archetype]
}

export function getArchetypeLabel(archetype: BusinessArchetype) {
  return businessArchetypeLabels[archetype]
}

export function getCapabilityBlocks(archetype: BusinessArchetype, capabilities: CapabilityId[]) {
  const blocks = new Map<string, { id: string; title: string; subtitle: string; metric: string; capability: string }>()
  const add = (block: { id: string; title: string; subtitle: string; metric: string; capability: string }) => blocks.set(block.id, block)

  if (archetype === "service_provider") add({ id: "quote", title: "Orcamentos recebidos", subtitle: "Em breve", metric: "0", capability: "Orcamento" })
  if (archetype === "appointment_business") add({ id: "appointment", title: "Agendamentos", subtitle: "Em breve", metric: "0", capability: "Agendamento" })
  if (archetype === "catalog_business") add({ id: "catalog", title: "Itens cadastrados", subtitle: "Em breve", metric: "0", capability: "Catalogo" })
  if (archetype === "food_business") {
    add({ id: "menu", title: "Itens do cardapio", subtitle: "Em breve", metric: "0", capability: "Cardapio" })
    add({ id: "ordering", title: "Pedidos", subtitle: "Em breve", metric: "0", capability: "Pedidos" })
  }

  if (capabilities.includes("quote")) add({ id: "quote", title: "Orcamentos recebidos", subtitle: "Em breve", metric: "0", capability: "Orcamento" })
  if (capabilities.includes("catalog")) add({ id: "catalog", title: "Itens cadastrados", subtitle: "Em breve", metric: "0", capability: "Catalogo" })
  if (capabilities.includes("appointment")) add({ id: "appointment", title: "Agendamentos", subtitle: "Em breve", metric: "0", capability: "Agendamento" })
  if (capabilities.includes("ordering")) add({ id: "ordering", title: "Pedidos", subtitle: "Em breve", metric: "0", capability: "Pedidos" })

  return [...blocks.values()]
}

export function capabilityNames(capabilities: CapabilityId[]) {
  return capabilities.map((id) => capabilityCatalog[id]?.name ?? id)
}

export async function getOwnedBusinessConsole(businessId: string): Promise<BusinessConsole | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("business_members")
    .select(`
      role,
      businesses(
        id,
        slug,
        name,
        description,
        status,
        status_reason,
        phone,
        whatsapp,
        website,
        instagram,
        business_kind,
        business_archetype,
        document_type,
        trust_level,
        verified,
        business_categories(is_primary, categories(name, slug)),
        business_capabilities(capability_id, enabled),
        locations(id, city, state_code, neighborhood, address_line, postal_code, service_area, is_primary),
        business_hours(id, weekday, opens_at, closes_at, is_closed),
        business_media(id, type, url, alt_text, sort_order)
      )
    `)
    .eq("profile_id", user.id)
    .eq("business_id", businessId)
    .eq("role", "owner")
    .maybeSingle()

  if (error || !data?.businesses) return null

  const business = data.businesses as any
  const primaryCategory = business.business_categories?.find((relation: any) => relation.is_primary)?.categories
  const primaryLocation = business.locations?.find((location: any) => location.is_primary) ?? business.locations?.[0]
  const businessArchetype = business.business_archetype ?? inferBusinessArchetype(primaryCategory?.slug ?? "")

  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    description: business.description,
    status: business.status,
    statusLabel: businessStatusLabel(business.status),
    statusDescription: businessStatusDescription(business.status),
    statusReason: business.status_reason ?? "",
    phone: business.phone ?? "",
    whatsapp: business.whatsapp ?? "",
    website: business.website ?? "",
    instagram: business.instagram ?? "",
    businessKind: business.business_kind ?? "company",
    businessArchetype,
    documentType: business.document_type ?? "",
    trustLevel: business.trust_level ?? 0,
    verified: Boolean(business.verified),
    categoryName: primaryCategory?.name ?? "Categoria em configuracao",
    categorySlug: primaryCategory?.slug ?? "",
    role: data.role,
    capabilities: (business.business_capabilities ?? [])
      .filter((relation: any) => relation.enabled)
      .map((relation: any) => relation.capability_id as CapabilityId),
    location: primaryLocation ? {
      id: primaryLocation.id,
      city: primaryLocation.city ?? "",
      stateCode: primaryLocation.state_code ?? "SP",
      neighborhood: primaryLocation.neighborhood ?? "",
      addressLine: primaryLocation.address_line ?? "",
      postalCode: primaryLocation.postal_code ?? "",
      serviceArea: primaryLocation.service_area ?? "",
    } : null,
    hours: (business.business_hours ?? [])
      .map((hour: any) => ({
        id: hour.id,
        weekday: hour.weekday,
        opensAt: timeValue(hour.opens_at),
        closesAt: timeValue(hour.closes_at),
        isClosed: Boolean(hour.is_closed),
      }))
      .sort((a: ConsoleHour, b: ConsoleHour) => a.weekday - b.weekday),
    media: (business.business_media ?? [])
      .map((media: any) => ({
        id: media.id,
        type: media.type,
        url: media.url,
        altText: media.alt_text ?? "",
        sortOrder: media.sort_order ?? 0,
      }))
      .sort((a: ConsoleMedia, b: ConsoleMedia) => a.sortOrder - b.sortOrder),
  }
}

export async function assertOwnsBusiness(businessId: string) {
  const business = await getOwnedBusinessConsole(businessId)
  if (!business) throw new Error("forbidden")
  return business
}
