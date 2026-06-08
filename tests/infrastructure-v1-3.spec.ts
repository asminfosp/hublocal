import { expect, test } from "@playwright/test"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { createRepositories } from "@/src/infrastructure/repositories"

const root = process.cwd()

test.describe("Architecture V1.3 infrastructure", () => {
  test("migrations are ordered and cover the approved schema", async () => {
    const directory = path.join(root, "supabase/migrations")
    const files = (await readdir(directory)).sort()
    const sql = await Promise.all(files.map((file) => readFile(path.join(directory, file), "utf8")))
    const combined = sql.join("\n").toLowerCase()
    const tables = [
      "domains",
      "categories",
      "businesses",
      "profiles",
      "business_members",
      "locations",
      "business_hours",
      "business_media",
      "offerings",
      "trust_signals",
      "favorites",
      "capabilities",
      "business_capabilities",
      "business_domains",
      "category_domains",
      "business_categories",
    ]

    expect(files[0]).toBe("001_domains.sql")
    expect(files).toContain("011_rls.sql")
    for (const table of tables) expect(combined).toContain(`create table public.${table}`)
  })

  test("every application table has RLS enabled and explicit policies", async () => {
    const migrationDirectory = path.join(root, "supabase/migrations")
    const migrationFiles = await readdir(migrationDirectory)
    const sql = (
      await Promise.all(migrationFiles.map((file) => readFile(path.join(migrationDirectory, file), "utf8")))
    ).join("\n")
    const tables = [
      "profiles",
      "businesses",
      "business_members",
      "domains",
      "categories",
      "business_domains",
      "category_domains",
      "business_categories",
      "locations",
      "business_hours",
      "business_media",
      "offerings",
      "trust_signals",
      "favorites",
      "capabilities",
      "business_capabilities",
    ]

    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security`)
      expect(sql).toContain(`on public.${table}`)
    }
  })

  test("seed recreates the current ecosystem with valid relationships", async () => {
    const readSeed = async (name: string) => JSON.parse(await readFile(path.join(root, "seed", name), "utf8"))
    const businesses = await readSeed("businesses.json")
    const categories = await readSeed("categories.json")
    const relations = await readSeed("business-relations.json")
    const locations = await readSeed("locations.json")
    const offerings = await readSeed("offerings.json")
    const businessIds = new Set(businesses.map((business: { id: string }) => business.id))
    const categoryIds = new Set(categories.map((category: { id: string }) => category.id))

    expect(businesses).toHaveLength(384)
    expect(categories.length).toBeGreaterThan(20)
    expect(locations).toHaveLength(businesses.length)
    expect(offerings.length).toBeGreaterThan(businesses.length)
    expect(relations.business_domains.every((relation: { business_id: string }) => businessIds.has(relation.business_id))).toBeTruthy()
    expect(relations.business_categories.every((relation: { category_id: string }) => categoryIds.has(relation.category_id))).toBeTruthy()
  })

  test("repository factory keeps mock as the safe default", async () => {
    const repositories = createRepositories()
    const result = await repositories.discovery.search({ term: "pizzaria", limit: 1 })
    expect(result.items).toHaveLength(1)
  })

  test("Supabase provider requires explicit environment configuration", () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => createRepositories("supabase")).toThrow(/requires NEXT_PUBLIC_SUPABASE_URL/)

    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey
  })

  test("Staging hotfix seed contains the requested homologation dataset", async () => {
    const sql = await readFile(path.join(root, "supabase/seeds/staging.sql"), "utf8")
    const businessRows = sql.match(/^\s*\('stg-[^']+'/gm) ?? []

    expect(businessRows).toHaveLength(20)
    expect(sql).toContain("('services', 'Servicos'")
    expect(sql).toContain("('shop', 'Shop'")
    expect(sql).toContain("('mobility', 'Mobilidade'")
    expect(sql).toContain("cross join lateral (values (staging.offering_one), (staging.offering_two))")
    expect(sql).toContain("select business.id, 'verified', 'admin', true")
    expect(sql).toContain("delete from public.businesses where slug like 'stg-%'")
  })
})
