import type { Business, TrustSignal } from "@/src/modules/businesses/domain/business"
import { inferCapabilitiesFromCategories, type CapabilityId } from "@/src/modules/capabilities/domain/capability"
import type { Category, DomainId } from "@/src/modules/taxonomy/domain/category"

type Row = Record<string, any>

const persistedTrustSignals: Record<string, TrustSignal> = {
  verified: "verified",
  featured: "featured",
  top_rated: "top_rated",
}

function simulatedMetric(id: string, minimum: number, range: number) {
  const value = [...id].reduce((total, character) => total + character.charCodeAt(0), 0)
  return minimum + (value % range)
}

function mapHours(rows: Row[]) {
  const now = new Date()
  const weekday = now.getDay()
  const currentTime = now.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })
  const today = rows.find((row) => row.weekday === weekday)
  const isOpen = Boolean(today && !today.is_closed && currentTime >= today.opens_at.slice(0, 5) && currentTime < today.closes_at.slice(0, 5))

  return {
    summary: rows.length ? "Consulte os horarios do negocio" : "Horario nao informado",
    isOpen,
    closingTime: today?.closes_at?.slice(0, 5),
  }
}

export function mapCategory(row: Row): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    parentId: row.parent_id ?? undefined,
    domainIds: (row.category_domains ?? []).map((relation: Row) => relation.domain_id as DomainId),
  }
}

export function mapBusiness(row: Row): Business {
  const media = row.business_media ?? []
  const locations = row.locations ?? []
  const hours = row.business_hours ?? []
  const signals = new Set<TrustSignal>(
    (row.trust_signals ?? [])
      .filter((signal: Row) => signal.active)
      .map((signal: Row) => persistedTrustSignals[signal.type])
      .filter(Boolean),
  )

  if (row.verified) signals.add("verified")
  const domainIds = (row.business_domains ?? []).map((relation: Row) => relation.domain_id)
  const fallbackImage = domainIds.includes("shop")
    ? "/businesses/alimentacao-1.jpg"
    : domainIds.includes("mobility")
      ? "/businesses/automotivo-1.jpg"
      : "/businesses/servicos-1.jpg"

  const categories = (row.business_categories ?? []).map((relation: Row) => ({
    id: relation.categories.id,
    name: relation.categories.name,
  }))
  const persistedCapabilities = (row.business_capabilities ?? [])
    .filter((relation: Row) => relation.enabled)
    .map((relation: Row) => relation.capability_id as CapabilityId)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    specialty: row.specialty ?? undefined,
    domainIds,
    categories,
    capabilities: persistedCapabilities.length ? persistedCapabilities : inferCapabilitiesFromCategories(categories),
    offerings: (row.offerings ?? []).map((offering: Row) => ({
      id: offering.id,
      type: offering.type,
      name: offering.name,
      description: offering.description ?? undefined,
    })),
    contact: {
      phone: row.phone ?? undefined,
      whatsapp: row.whatsapp ?? undefined,
      email: row.email ?? undefined,
    },
    location: {
      city: locations[0]?.city ?? "",
      neighborhood: locations[0]?.neighborhood ?? "",
      address: locations[0]?.address_line ?? "",
      latitude: locations[0]?.latitude ?? undefined,
      longitude: locations[0]?.longitude ?? undefined,
      serviceArea: locations[0]?.service_area ?? undefined,
    },
    hours: mapHours(hours),
    media: {
      cover: media.find((item: Row) => item.type === "cover")?.url ?? fallbackImage,
      avatar: media.find((item: Row) => item.type === "avatar")?.url ?? fallbackImage,
      gallery: media.filter((item: Row) => item.type === "gallery").map((item: Row) => item.url),
    },
    trustSignals: [...signals],
    rating: signals.has("top_rated") ? 4.9 : signals.has("verified") ? 4.8 : 4.7,
    reviewCount: simulatedMetric(row.id, 40, 240),
    distanceMeters: simulatedMetric(row.id, 250, 4800),
    tags: [],
    reviewHighlights: [],
    highlight: signals.has("verified") ? "Empresa verificada" : undefined,
    trustedSince: row.trusted_since?.slice(0, 4),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
