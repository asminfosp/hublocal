import type { Business } from "../../businesses/domain/business"
import type { Category } from "../../taxonomy/domain/category"
import type { DiscoveryQuery, DiscoveryResult } from "../domain/discovery"

export interface DiscoveryRepository {
  search(query: DiscoveryQuery): Promise<DiscoveryResult>
  getTrending(query?: DiscoveryQuery): Promise<Business[]>
  getNearby(query?: DiscoveryQuery): Promise<Business[]>
  getFeatured(query?: DiscoveryQuery): Promise<Business[]>
  getCategories(): Promise<Category[]>
  getPopularSearches(): Promise<string[]>
}
