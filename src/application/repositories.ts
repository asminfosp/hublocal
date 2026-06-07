import type { HubRepositories } from "@/src/infrastructure/repositories"
import { repositories } from "@/src/infrastructure/repositories"

// Presentation imports this typed application boundary, never an adapter.
export const hubRepositories: HubRepositories = repositories
