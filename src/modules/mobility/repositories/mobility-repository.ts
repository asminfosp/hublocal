import type { Business } from "../../businesses/domain/business"
import type { MobilityCapability } from "../domain/mobility-capability"

export interface MobilityRepository {
  getProviders(categoryId?: string): Promise<Business[]>
  getCoverage(businessId: string): Promise<MobilityCapability[]>
}
