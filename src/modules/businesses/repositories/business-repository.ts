import type { Business, BusinessId } from "../domain/business"

export type BusinessListQuery = {
  domainId?: string
  categoryId?: string
  city?: string
  limit?: number
}

export type BusinessInput = Omit<Business, "id" | "createdAt" | "updatedAt">

export interface BusinessRepository {
  getBusiness(id: BusinessId): Promise<Business | null>
  getBusinessBySlug(slug: string): Promise<Business | null>
  listBusinesses(query?: BusinessListQuery): Promise<Business[]>
  createBusiness(input: BusinessInput): Promise<Business>
  updateBusiness(id: BusinessId, input: Partial<BusinessInput>): Promise<Business>
}
