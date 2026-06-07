import type { Business } from "../../businesses/domain/business"

export type DiscoverySort = "relevance" | "nearby" | "top_rated"

export type DiscoveryQuery = {
  term?: string
  domainId?: string
  categoryId?: string
  city?: string
  openNow?: boolean
  verified?: boolean
  sort?: DiscoverySort
  limit?: number
}

export type DiscoveryResult = {
  items: Business[]
  total: number
  query: DiscoveryQuery
}
