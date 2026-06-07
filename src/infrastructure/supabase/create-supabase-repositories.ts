import type { HubRepositories } from "@/src/infrastructure/repositories"

import { createHubSupabaseClient } from "./client"
import {
  SupabaseBusinessRepository,
  SupabaseCategoryRepository,
  SupabaseDiscoveryRepository,
  SupabaseMobilityRepository,
  SupabaseServiceRepository,
  SupabaseShopRepository,
} from "./repositories"

export function createSupabaseRepositories(): HubRepositories {
  const client = createHubSupabaseClient()
  const businesses = new SupabaseBusinessRepository(client)
  const categories = new SupabaseCategoryRepository(client)

  return {
    businesses,
    categories,
    discovery: new SupabaseDiscoveryRepository(businesses, categories),
    services: new SupabaseServiceRepository(client, businesses),
    shop: new SupabaseShopRepository(client, businesses),
    mobility: new SupabaseMobilityRepository(client, businesses),
  }
}
