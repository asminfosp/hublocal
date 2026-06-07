import type { Category, DomainId, HubDomain } from "../domain/category"

export interface CategoryRepository {
  getDomains(): Promise<HubDomain[]>
  getCategories(): Promise<Category[]>
  getDomainCategories(domainId: DomainId): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | null>
}
