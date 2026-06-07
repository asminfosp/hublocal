import type { BusinessRepository } from "@/src/modules/businesses/repositories/business-repository"
import type { DiscoveryRepository } from "@/src/modules/discovery/repositories/discovery-repository"
import type { MobilityRepository } from "@/src/modules/mobility/repositories/mobility-repository"
import type { ServiceRepository } from "@/src/modules/services/repositories/service-repository"
import type { ShopRepository } from "@/src/modules/shop/repositories/shop-repository"
import type { CategoryRepository } from "@/src/modules/taxonomy/repositories/category-repository"

import {
  MockBusinessRepository,
  MockCategoryRepository,
  MockDiscoveryRepository,
  MockMobilityRepository,
  MockServiceRepository,
  MockShopRepository,
} from "./mock/mock-hub-repositories"
import { createSupabaseRepositories } from "../supabase/create-supabase-repositories"

export type HubRepositories = {
  discovery: DiscoveryRepository
  businesses: BusinessRepository
  services: ServiceRepository
  shop: ShopRepository
  mobility: MobilityRepository
  categories: CategoryRepository
}

function createMockRepositories(): HubRepositories {
  return {
  discovery: new MockDiscoveryRepository(),
  businesses: new MockBusinessRepository(),
  services: new MockServiceRepository(),
  shop: new MockShopRepository(),
  mobility: new MockMobilityRepository(),
  categories: new MockCategoryRepository(),
  }
}

export type RepositoryProvider = "mock" | "supabase"

export function createRepositories(provider: RepositoryProvider = "mock"): HubRepositories {
  return provider === "supabase" ? createSupabaseRepositories() : createMockRepositories()
}

const provider = process.env.HUB_REPOSITORY_PROVIDER === "supabase" ? "supabase" : "mock"

export const repositories: HubRepositories = createRepositories(provider)
