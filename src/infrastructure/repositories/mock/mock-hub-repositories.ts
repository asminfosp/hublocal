import {
  businesses as legacyBusinesses,
  categoryOptions,
  getBusinessBySlug as getLegacyBusinessBySlug,
  normalizeSearch,
  popularSearches,
  type Business as LegacyBusiness,
} from "@/lib/hub-data"
import type { Business, TrustSignal } from "@/src/modules/businesses/domain/business"
import { inferCapabilitiesFromCategories } from "@/src/modules/capabilities/domain/capability"
import type {
  BusinessInput,
  BusinessListQuery,
  BusinessRepository,
} from "@/src/modules/businesses/repositories/business-repository"
import type { DiscoveryQuery } from "@/src/modules/discovery/domain/discovery"
import type { DiscoveryRepository } from "@/src/modules/discovery/repositories/discovery-repository"
import type { MobilityCapability } from "@/src/modules/mobility/domain/mobility-capability"
import type { MobilityRepository } from "@/src/modules/mobility/repositories/mobility-repository"
import type { ServiceOffering } from "@/src/modules/services/domain/service-offering"
import type { ServiceRepository } from "@/src/modules/services/repositories/service-repository"
import type { ProductReference } from "@/src/modules/shop/domain/product-reference"
import type { ShopRepository } from "@/src/modules/shop/repositories/shop-repository"
import {
  OFFICIAL_DOMAIN_IDS,
  type Category,
  type DomainId,
  type HubDomain,
} from "@/src/modules/taxonomy/domain/category"
import type { CategoryRepository } from "@/src/modules/taxonomy/repositories/category-repository"
import { RepositoryError } from "@/src/shared/types/repository-error"

const domains: HubDomain[] = [
  {
    id: "services",
    name: "Servicos",
    description: "Prestadores e atividades executadas localmente.",
  },
  {
    id: "shop",
    name: "Shop",
    description: "Lojas, comercio local e referencias de produtos.",
  },
  {
    id: "mobility",
    name: "Mobilidade",
    description: "Opcoes locais de deslocamento e logistica.",
  },
]

const categoryDomainMap: Record<LegacyBusiness["category"], DomainId[]> = {
  Alimentacao: ["shop"],
  Servicos: ["services"],
  Automotivo: ["services"],
  Saude: ["services"],
  Beleza: ["services"],
  Pet: ["services"],
}

const trustSignalMap: Record<LegacyBusiness["badge"], TrustSignal> = {
  "Empresa Verificada": "verified",
  "Mais Procurado": "popular",
  "Melhor Avaliado": "top_rated",
  "Proximo de Voce": "nearby",
  "Aberto Agora": "open_now",
}

function slugify(value: string) {
  return normalizeSearch(value).replace(/\s+/g, "-")
}

function toBusiness(legacy: LegacyBusiness): Business {
  const trustSignals = new Set<TrustSignal>([trustSignalMap[legacy.badge]])

  if (legacy.isOpen) trustSignals.add("open_now")
  if (legacy.rating >= 4.8) trustSignals.add("top_rated")

  const categories = [
    { id: slugify(legacy.categoryLabel), name: legacy.categoryLabel },
    { id: slugify(legacy.category), name: legacy.category },
  ]

  return {
    id: legacy.slug,
    slug: legacy.slug,
    name: legacy.name,
    description: legacy.description,
    domainIds: categoryDomainMap[legacy.category],
    categories,
    capabilities: inferCapabilitiesFromCategories(categories),
    offerings: legacy.services.map((service, index) => ({
      id: `${legacy.slug}-offering-${index}`,
      type: categoryDomainMap[legacy.category].includes("shop") ? "product_reference" : "service",
      name: service,
    })),
    contact: {
      phone: legacy.phone,
      whatsapp: legacy.whatsapp,
    },
    location: {
      city: legacy.city,
      neighborhood: legacy.neighborhood,
      address: legacy.address,
      serviceArea: legacy.serviceArea,
    },
    hours: {
      summary: legacy.openingHours,
      isOpen: legacy.isOpen,
      closingTime: legacy.closingTime,
    },
    media: {
      cover: legacy.cover,
      avatar: legacy.avatar,
      gallery: legacy.gallery,
    },
    trustSignals: [...trustSignals],
    rating: legacy.rating,
    reviewCount: legacy.reviews,
    distanceMeters: legacy.distanceMeters,
    specialty: legacy.specialty,
    tags: legacy.tags,
    highlight: legacy.highlight,
    trustedSince: legacy.trustedSince,
    reviewHighlights: legacy.reviewHighlights,
  }
}

function matchesBusinessQuery(business: Business, query: BusinessListQuery) {
  return (
    (!query.domainId || business.domainIds.includes(query.domainId)) &&
    (!query.categoryId || business.categories.some((category) => category.id === query.categoryId)) &&
    (!query.city || normalizeSearch(business.location.city) === normalizeSearch(query.city))
  )
}

function applyLimit<T>(items: T[], limit?: number) {
  return typeof limit === "number" ? items.slice(0, limit) : items
}

const allBusinesses = legacyBusinesses.map(toBusiness)

export class MockBusinessRepository implements BusinessRepository {
  async getBusiness(id: string) {
    return allBusinesses.find((business) => business.id === id) ?? null
  }

  async getBusinessBySlug(slug: string) {
    const business = getLegacyBusinessBySlug(slug)
    return business ? toBusiness(business) : null
  }

  async listBusinesses(query: BusinessListQuery = {}) {
    return applyLimit(allBusinesses.filter((business) => matchesBusinessQuery(business, query)), query.limit)
  }

  async createBusiness(_input: BusinessInput): Promise<Business> {
    throw new RepositoryError("unavailable", "O repositorio mockado e somente leitura.")
  }

  async updateBusiness(_id: string, _input: Partial<BusinessInput>): Promise<Business> {
    throw new RepositoryError("unavailable", "O repositorio mockado e somente leitura.")
  }
}

export class MockDiscoveryRepository implements DiscoveryRepository {
  async search(query: DiscoveryQuery) {
    const normalizedTerm = normalizeSearch(query.term ?? "")
    const items = allBusinesses
      .filter((business) => {
        const searchable = normalizeSearch(
          [
            business.name,
            business.description,
            business.location.city,
            business.location.neighborhood,
            ...business.categories.map((category) => category.name),
          ].join(" "),
        )

        return (
          (!normalizedTerm || searchable.includes(normalizedTerm)) &&
          (!query.domainId || business.domainIds.includes(query.domainId)) &&
          (!query.categoryId || business.categories.some((category) => category.id === query.categoryId)) &&
          (!query.city || normalizeSearch(business.location.city) === normalizeSearch(query.city)) &&
          (!query.openNow || business.hours.isOpen) &&
          (!query.verified || business.trustSignals.includes("verified"))
        )
      })
      .sort((a, b) => {
        if (query.sort === "nearby") return (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity)
        if (query.sort === "top_rated") return (b.rating ?? 0) - (a.rating ?? 0)
        return Number(b.trustSignals.includes("featured")) - Number(a.trustSignals.includes("featured"))
      })

    return {
      items: applyLimit(items, query.limit),
      total: items.length,
      query,
    }
  }

  async getTrending(query: DiscoveryQuery = {}) {
    const result = await this.search({ ...query, sort: "top_rated", limit: query.limit ?? 12 })
    return result.items
  }

  async getNearby(query: DiscoveryQuery = {}) {
    const result = await this.search({ ...query, sort: "nearby", limit: query.limit ?? 12 })
    return result.items
  }

  async getFeatured(query: DiscoveryQuery = {}) {
    const result = await this.search({ ...query, verified: true, limit: query.limit ?? 12 })
    return result.items
  }

  async getCategories() {
    return new MockCategoryRepository().getCategories()
  }

  async getPopularSearches() {
    return popularSearches
  }
}

export class MockCategoryRepository implements CategoryRepository {
  async getDomains() {
    return domains
  }

  async getCategories(): Promise<Category[]> {
    return categoryOptions.map((category) => ({
      id: slugify(category.id),
      slug: slugify(category.id),
      name: category.label,
      description: category.description,
      domainIds: categoryDomainMap[category.id],
    }))
  }

  async getDomainCategories(domainId: DomainId) {
    const categories = await this.getCategories()
    return categories.filter((category) => category.domainIds.includes(domainId))
  }

  async getCategoryBySlug(slug: string) {
    const categories = await this.getCategories()
    return categories.find((category) => category.slug === slug) ?? null
  }
}

export class MockServiceRepository implements ServiceRepository {
  async getServices(businessId?: string): Promise<ServiceOffering[]> {
    return legacyBusinesses
      .filter((business) => !businessId || business.slug === businessId)
      .filter((business) => categoryDomainMap[business.category].includes("services"))
      .flatMap((business) =>
        business.services.map((service, index) => ({
          id: `${business.slug}-service-${index}`,
          businessId: business.slug,
          categoryId: slugify(business.categoryLabel),
          name: service,
          serviceArea: business.serviceArea,
        })),
      )
  }

  async getProviders(categoryId?: string) {
    return allBusinesses.filter(
      (business) =>
        business.domainIds.includes("services") &&
        (!categoryId || business.categories.some((category) => category.id === categoryId)),
    )
  }
}

export class MockShopRepository implements ShopRepository {
  async getStores(categoryId?: string) {
    return allBusinesses.filter(
      (business) =>
        business.domainIds.includes("shop") &&
        (!categoryId || business.categories.some((category) => category.id === categoryId)),
    )
  }

  async getProducts(businessId?: string): Promise<ProductReference[]> {
    return legacyBusinesses
      .filter((business) => categoryDomainMap[business.category].includes("shop"))
      .filter((business) => !businessId || business.slug === businessId)
      .flatMap((business) =>
        business.services.map((product, index) => ({
          id: `${business.slug}-product-${index}`,
          businessId: business.slug,
          categoryId: slugify(business.categoryLabel),
          name: product,
          image: business.gallery[index % business.gallery.length],
        })),
      )
  }
}

export class MockMobilityRepository implements MobilityRepository {
  async getProviders(categoryId?: string) {
    return allBusinesses.filter(
      (business) =>
        business.domainIds.includes("mobility") &&
        (!categoryId || business.categories.some((category) => category.id === categoryId)),
    )
  }

  async getCoverage(_businessId: string): Promise<MobilityCapability[]> {
    return []
  }
}

export function assertOfficialDomain(domainId: string): asserts domainId is DomainId {
  if (!OFFICIAL_DOMAIN_IDS.includes(domainId as DomainId)) {
    throw new RepositoryError("validation", `Dominio invalido: ${domainId}`)
  }
}
