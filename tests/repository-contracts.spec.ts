import { expect, test } from "@playwright/test"

import { hubRepositories } from "@/src/application/repositories"

test.describe("Repository contracts", () => {
  test("DiscoveryRepository supports search, featured, trending and nearby", async () => {
    const search = await hubRepositories.discovery.search({ term: "pizzaria", limit: 5 })
    const featured = await hubRepositories.discovery.getFeatured({ limit: 4 })
    const trending = await hubRepositories.discovery.getTrending({ limit: 4 })
    const nearby = await hubRepositories.discovery.getNearby({ limit: 4 })

    expect(search.total).toBeGreaterThan(0)
    expect(search.items.length).toBeLessThanOrEqual(5)
    expect(featured).toHaveLength(4)
    expect(featured.every((business) => business.trustSignals.includes("verified"))).toBeTruthy()
    expect(trending).toHaveLength(4)
    expect(nearby).toHaveLength(4)
  })

  test("BusinessRepository resolves the same business by id and slug", async () => {
    const [first] = await hubRepositories.businesses.listBusinesses({ limit: 1 })
    const byId = await hubRepositories.businesses.getBusiness(first.id)
    const bySlug = await hubRepositories.businesses.getBusinessBySlug(first.slug)

    expect(byId).toEqual(first)
    expect(bySlug).toEqual(first)
  })

  test("ServiceRepository returns service providers and offerings", async () => {
    const providers = await hubRepositories.services.getProviders()
    const services = await hubRepositories.services.getServices(providers[0]?.id)

    expect(providers.length).toBeGreaterThan(0)
    expect(providers.every((business) => business.domainIds.includes("services"))).toBeTruthy()
    expect(services.length).toBeGreaterThan(0)
  })

  test("ShopRepository returns stores and product references", async () => {
    const stores = await hubRepositories.shop.getStores()
    const products = await hubRepositories.shop.getProducts(stores[0]?.id)

    expect(stores.length).toBeGreaterThan(0)
    expect(stores.every((business) => business.domainIds.includes("shop"))).toBeTruthy()
    expect(products.length).toBeGreaterThan(0)
  })

  test("MobilityRepository preserves the approved empty state", async () => {
    const providers = await hubRepositories.mobility.getProviders()
    const coverage = await hubRepositories.mobility.getCoverage("not-configured")

    expect(providers).toEqual([])
    expect(coverage).toEqual([])
  })
})
