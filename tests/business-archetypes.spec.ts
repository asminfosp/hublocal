import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  businessArchetypeLabels,
  businessArchetypePanels,
  inferBusinessArchetype,
} from "@/src/modules/businesses/domain/business-archetype"

const root = process.cwd()

test.describe("Business Archetypes V1", () => {
  test("official category to archetype mapping is explicit", () => {
    expect(inferBusinessArchetype("eletricista")).toBe("service_provider")
    expect(inferBusinessArchetype("barbearia")).toBe("appointment_business")
    expect(inferBusinessArchetype("dentista")).toBe("appointment_business")
    expect(inferBusinessArchetype("pet-shop")).toBe("catalog_business")
    expect(inferBusinessArchetype("autopeca")).toBe("catalog_business")
    expect(inferBusinessArchetype("restaurante")).toBe("food_business")
    expect(businessArchetypeLabels.food_business).toBe("Negocio Alimenticio")
    expect(businessArchetypePanels.service_provider).toContain("Orcamentos")
    expect(businessArchetypePanels.food_business).toContain("Pedidos")
  })

  test("migration persists business_archetype and derives it in onboarding RPC", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/016_business_onboarding_v2.sql"), "utf8")

    expect(sql).toContain("add column if not exists business_archetype text not null default 'service_provider'")
    expect(sql).toContain("businesses_business_archetype_check")
    expect(sql).toContain("'appointment_business'")
    expect(sql).toContain("'catalog_business'")
    expect(sql).toContain("'food_business'")
    expect(sql).toContain("derived_archetype")
    expect(sql).toContain("category_record.slug")
  })

  test("business console uses archetype before capabilities", async () => {
    const consoleApp = await readFile(path.join(root, "src/application/business-console.ts"), "utf8")
    const page = await readFile(path.join(root, "app/negocio/[id]/page.tsx"), "utf8")

    expect(consoleApp).toContain("business_archetype")
    expect(consoleApp).toContain("inferBusinessArchetype")
    expect(consoleApp).toContain("businessArchetypePanels")
    expect(page).toContain("Arquetipo")
    expect(page).toContain("Experiencia por Arquetipo")
    expect(page).toContain("getCapabilityBlocks(business.businessArchetype, business.capabilities)")
  })

  test("official archetypes are documented", async () => {
    const doc = await readFile(path.join(root, "docs/business-archetypes-v1.md"), "utf8")

    expect(doc).toContain("service_provider")
    expect(doc).toContain("appointment_business")
    expect(doc).toContain("catalog_business")
    expect(doc).toContain("food_business")
    expect(doc).toContain("Categoria\n-> Arquetipo")
    expect(doc).toContain("mobility_operation")
  })
})
