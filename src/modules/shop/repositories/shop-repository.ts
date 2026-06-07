import type { Business } from "../../businesses/domain/business"
import type { ProductReference } from "../domain/product-reference"

export interface ShopRepository {
  getStores(categoryId?: string): Promise<Business[]>
  getProducts(businessId?: string): Promise<ProductReference[]>
}
