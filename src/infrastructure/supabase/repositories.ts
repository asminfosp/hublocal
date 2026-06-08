import type { SupabaseClient } from "@supabase/supabase-js"

import type { Business, BusinessId } from "@/src/modules/businesses/domain/business"
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
import { OFFICIAL_DOMAIN_IDS, type DomainId, type HubDomain } from "@/src/modules/taxonomy/domain/category"
import type { CategoryRepository } from "@/src/modules/taxonomy/repositories/category-repository"
import { RepositoryError } from "@/src/shared/types/repository-error"

import { mapBusiness, mapCategory } from "./mappers"

const businessSelect = `
  id,
  slug,
  name,
  description,
  specialty,
  phone,
  whatsapp,
  email,
  website,
  verified,
  status,
  trusted_since,
  created_at,
  updated_at,
  business_domains(domain_id),
  business_categories(is_primary, categories(id, name)),
  locations(*),
  business_hours(*),
  business_media(*),
  offerings(*),
  trust_signals(*)
`

function fail(operation: string, error: unknown): never {
  throw new RepositoryError("unavailable", `Supabase operation failed: ${operation}`, error)
}

export class SupabaseBusinessRepository implements BusinessRepository {
  constructor(private readonly client: SupabaseClient) {}

  private async withCapabilities<T extends Record<string, any>>(rows: T[]): Promise<T[]> {
    if (!rows.length) return rows

    const ids = rows.map((row) => row.id)
    const { data, error } = await this.client
      .from("business_capabilities")
      .select("business_id, capability_id, enabled")
      .in("business_id", ids)

    // Staging remains compatible before migration 014 is promoted.
    if (error) return rows

    return rows.map((row) => ({
      ...row,
      business_capabilities: (data ?? []).filter((relation) => relation.business_id === row.id),
    }))
  }

  async getBusiness(id: BusinessId) {
    const { data, error } = await this.client.from("businesses").select(businessSelect).eq("id", id).maybeSingle()
    if (error) fail("getBusiness", error)
    return data ? mapBusiness((await this.withCapabilities([data]))[0]) : null
  }

  async getBusinessBySlug(slug: string) {
    const { data, error } = await this.client.from("businesses").select(businessSelect).eq("slug", slug).maybeSingle()
    if (error) fail("getBusinessBySlug", error)
    return data ? mapBusiness((await this.withCapabilities([data]))[0]) : null
  }

  async listBusinesses(query: BusinessListQuery = {}) {
    const { data, error } = await this.client.from("businesses").select(businessSelect)
    if (error) fail("listBusinesses", error)
    const businesses = (await this.withCapabilities(data ?? [])).map(mapBusiness).filter((business) =>
      (!query.city || business.location.city === query.city) &&
      (!query.domainId || business.domainIds.includes(query.domainId)) &&
      (!query.categoryId || business.categories.some((category) => category.id === query.categoryId)),
    )
    return query.limit ? businesses.slice(0, query.limit) : businesses
  }

  async createBusiness(input: BusinessInput) {
    const { data, error } = await this.client
      .from("businesses")
      .insert({
        slug: input.slug,
        name: input.name,
        description: input.description,
        specialty: input.specialty,
        phone: input.contact.phone,
        whatsapp: input.contact.whatsapp,
        email: input.contact.email,
      })
      .select(businessSelect)
      .single()
    if (error) fail("createBusiness", error)
    return mapBusiness((await this.withCapabilities([data]))[0])
  }

  async updateBusiness(id: BusinessId, input: Partial<BusinessInput>) {
    const { data, error } = await this.client
      .from("businesses")
      .update({
        slug: input.slug,
        name: input.name,
        description: input.description,
        specialty: input.specialty,
        phone: input.contact?.phone,
        whatsapp: input.contact?.whatsapp,
        email: input.contact?.email,
      })
      .eq("id", id)
      .select(businessSelect)
      .single()
    if (error) fail("updateBusiness", error)
    return mapBusiness((await this.withCapabilities([data]))[0])
  }
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getDomains(): Promise<HubDomain[]> {
    const { data, error } = await this.client.from("domains").select("*").eq("active", true).order("sort_order")
    if (error) fail("getDomains", error)
    return (data ?? []).map((domain) => ({ id: domain.id as DomainId, name: domain.name, description: domain.description }))
  }

  async getCategories() {
    const { data, error } = await this.client
      .from("categories")
      .select("*, category_domains(domain_id)")
      .eq("active", true)
      .order("sort_order")
    if (error) fail("getCategories", error)
    return (data ?? []).map(mapCategory)
  }

  async getDomainCategories(domainId: DomainId) {
    const categories = await this.getCategories()
    return categories.filter((category) => category.domainIds.includes(domainId))
  }

  async getCategoryBySlug(slug: string) {
    const { data, error } = await this.client
      .from("categories")
      .select("*, category_domains(domain_id)")
      .eq("slug", slug)
      .maybeSingle()
    if (error) fail("getCategoryBySlug", error)
    return data ? mapCategory(data) : null
  }
}

export class SupabaseDiscoveryRepository implements DiscoveryRepository {
  constructor(
    private readonly businesses: BusinessRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async search(query: DiscoveryQuery) {
    let items = await this.businesses.listBusinesses({
      domainId: query.domainId,
      categoryId: query.categoryId,
      city: query.city,
    })
    const term = query.term?.toLocaleLowerCase()
    if (term) items = items.filter((item) => `${item.name} ${item.description} ${item.specialty ?? ""}`.toLocaleLowerCase().includes(term))
    if (query.openNow) items = items.filter((item) => item.hours.isOpen)
    if (query.verified) items = items.filter((item) => item.trustSignals.includes("verified"))
    if (query.sort === "nearby") items.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))
    if (query.sort === "top_rated") items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    const total = items.length
    if (query.limit) items = items.slice(0, query.limit)
    return { items, total, query }
  }

  async getTrending(query: DiscoveryQuery = {}) {
    return (await this.search({ ...query, sort: "top_rated", limit: query.limit ?? 12 })).items
  }

  async getNearby(query: DiscoveryQuery = {}) {
    return (await this.search({ ...query, sort: "nearby", limit: query.limit ?? 12 })).items
  }

  async getFeatured(query: DiscoveryQuery = {}) {
    return (await this.search({ ...query, verified: true, limit: query.limit ?? 12 })).items
  }

  getCategories() {
    return this.categories.getCategories()
  }

  async getPopularSearches() {
    return ["Eletricista", "Mecanico", "Dentista", "Pizzaria", "Barbearia", "Pet Shop", "Chaveiro", "Farmacia"]
  }
}

abstract class SupabaseOfferingRepository {
  constructor(
    protected readonly client: SupabaseClient,
    protected readonly businesses: BusinessRepository,
  ) {}

  protected async getOfferings(type: "service" | "product_reference" | "mobility_capability", businessId?: string) {
    let request = this.client.from("offerings").select("*").eq("type", type).eq("active", true)
    if (businessId) request = request.eq("business_id", businessId)
    const { data, error } = await request
    if (error) fail("getOfferings", error)
    return data ?? []
  }
}

export class SupabaseServiceRepository extends SupabaseOfferingRepository implements ServiceRepository {
  async getServices(businessId?: string): Promise<ServiceOffering[]> {
    return (await this.getOfferings("service", businessId)).map((row) => ({
      id: row.id, businessId: row.business_id, categoryId: row.category_id, name: row.name, description: row.description ?? undefined,
    }))
  }
  getProviders(categoryId?: string): Promise<Business[]> {
    return this.businesses.listBusinesses({ domainId: "services", categoryId })
  }
}

export class SupabaseShopRepository extends SupabaseOfferingRepository implements ShopRepository {
  async getProducts(businessId?: string): Promise<ProductReference[]> {
    return (await this.getOfferings("product_reference", businessId)).map((row) => ({
      id: row.id, businessId: row.business_id, categoryId: row.category_id, name: row.name, description: row.description ?? undefined,
    }))
  }
  getStores(categoryId?: string): Promise<Business[]> {
    return this.businesses.listBusinesses({ domainId: "shop", categoryId })
  }
}

export class SupabaseMobilityRepository extends SupabaseOfferingRepository implements MobilityRepository {
  async getCoverage(businessId: string): Promise<MobilityCapability[]> {
    return (await this.getOfferings("mobility_capability", businessId)).map((row) => ({
      id: row.id,
      businessId: row.business_id,
      categoryId: row.category_id,
      name: row.name,
      description: row.description ?? undefined,
      coverage: Array.isArray(row.metadata?.coverage) ? row.metadata.coverage : [],
    }))
  }
  async getProviders(_categoryId?: string): Promise<Business[]> {
    // Camada 5.2: Mobility is a Hub-owned service, never a business provider list.
    return []
  }
}

export function assertSupabaseDomain(domainId: string): asserts domainId is DomainId {
  if (!OFFICIAL_DOMAIN_IDS.includes(domainId as DomainId)) {
    throw new RepositoryError("validation", `Dominio invalido: ${domainId}`)
  }
}
