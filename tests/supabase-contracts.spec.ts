import { expect, test } from "@playwright/test"

import { createRepositories } from "@/src/infrastructure/repositories"

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

test.describe("Supabase repository contracts", () => {
  test.skip(!configured, "Supabase environment is not configured.")

  test("real adapters expose the seeded public ecosystem", async () => {
    const repositories = createRepositories("supabase")
    const domains = await repositories.categories.getDomains()
    const categories = await repositories.categories.getCategories()
    const businesses = await repositories.businesses.listBusinesses()
    const discovery = await repositories.discovery.search({ term: "pizzaria", limit: 5 })

    expect(domains.map((domain) => domain.id)).toEqual(["services", "shop", "mobility"])
    expect(categories).toHaveLength(8)
    expect(businesses).toHaveLength(20)
    expect(businesses.every((business) => business.trustSignals.includes("verified"))).toBeTruthy()
    expect(businesses.every((business) => Boolean(business.location.city && business.location.address))).toBeTruthy()
    expect(businesses.reduce((total, business) => total + business.offerings.length, 0)).toBe(40)
    expect(new Set(businesses.map((business) => business.location.city))).toEqual(
      new Set(["Embu das Artes", "Taboao da Serra", "Itapecerica da Serra"]),
    )
    expect(discovery.total).toBeGreaterThan(0)
  })
})
