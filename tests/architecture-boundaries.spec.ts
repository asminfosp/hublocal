import { expect, test } from "@playwright/test"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { repositories } from "@/src/infrastructure/repositories"

const root = process.cwd()
const protectedDirectories = ["app", "components"]

async function listSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return listSourceFiles(entryPath)
      return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : []
    }),
  )

  return files.flat()
}

test.describe("Architecture V1 boundaries", () => {
  test("presentation does not access Supabase directly", async () => {
    const files = (
      await Promise.all(protectedDirectories.map((directory) => listSourceFiles(path.join(root, directory))))
    ).flat()

    const violations: string[] = []

    for (const file of files) {
      const source = await readFile(file, "utf8")
      if (/from\s+["'][^"']*supabase|supabase\.(from|auth|storage)/i.test(source)) {
        violations.push(path.relative(root, file))
      }
    }

    expect(violations).toEqual([])
  })

  test("presentation does not access mock data or infrastructure directly", async () => {
    const files = (
      await Promise.all(protectedDirectories.map((directory) => listSourceFiles(path.join(root, directory))))
    ).flat()
    const violations: string[] = []

    for (const file of files) {
      const source = await readFile(file, "utf8")
      if (/["']@\/lib\/hub-data["']|["']@\/src\/infrastructure\//.test(source)) {
        violations.push(path.relative(root, file))
      }
    }

    expect(violations).toEqual([])
  })

  test("official repository contracts exist", async () => {
    const contracts = [
      "src/modules/discovery/repositories/discovery-repository.ts",
      "src/modules/businesses/repositories/business-repository.ts",
      "src/modules/services/repositories/service-repository.ts",
      "src/modules/shop/repositories/shop-repository.ts",
      "src/modules/mobility/repositories/mobility-repository.ts",
      "src/modules/taxonomy/repositories/category-repository.ts",
    ]

    await expect(Promise.all(contracts.map((file) => readFile(path.join(root, file), "utf8")))).resolves.toHaveLength(
      contracts.length,
    )
  })

  test("Architecture V1.2 documents exist and only the official Supabase client is allowed", async () => {
    const documents = [
      "docs/database-schema-v1.md",
      "docs/ownership-v1.md",
      "docs/rls-strategy-v1.md",
      "docs/seed-strategy-v1.md",
      "docs/taxonomy-v1.md",
      "docs/environments-v1.md",
      "docs/observability-v1.md",
      "docs/supabase-migration-plan-v1.md",
    ]
    const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    await expect(Promise.all(documents.map((file) => readFile(path.join(root, file), "utf8")))).resolves.toHaveLength(
      documents.length,
    )
    expect(Object.keys(dependencies).filter((name) => name.toLowerCase().includes("supabase"))).toEqual([
      "@supabase/supabase-js",
    ])
  })

  test("mock adapters satisfy the official contracts", async () => {
    const domains = await repositories.categories.getDomains()
    const businesses = await repositories.businesses.listBusinesses({ limit: 3 })
    const discovery = await repositories.discovery.search({ term: "pizzaria", limit: 5 })
    const mobilityProviders = await repositories.mobility.getProviders()

    expect(domains.map((domain) => domain.id)).toEqual(["services", "shop", "mobility"])
    expect(businesses).toHaveLength(3)
    expect(discovery.total).toBeGreaterThan(0)
    expect(mobilityProviders).toEqual([])
  })

  test("official domain routes are navigable", async ({ page }) => {
    for (const domain of [
      { path: "/servicos", label: "Servicos" },
      { path: "/shop", label: "Shop" },
      { path: "/mobilidade", label: "Mobilidade" },
    ]) {
      await page.goto(domain.path)
      await expect(page.locator('header a[aria-current="page"]')).toContainText(domain.label)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    }
  })
})
