import type { Business } from "../../businesses/domain/business"
import type { ServiceOffering } from "../domain/service-offering"

export interface ServiceRepository {
  getServices(businessId?: string): Promise<ServiceOffering[]>
  getProviders(categoryId?: string): Promise<Business[]>
}
