import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  inferCapabilitiesFromCategories,
  OFFICIAL_CAPABILITY_IDS,
} from "@/src/modules/capabilities/domain/capability"

const root = process.cwd()

test.describe("Domain Capabilities V1", () => {
  test("official capability matrix infers initial business behavior", () => {
    expect(inferCapabilitiesFromCategories([{ name: "Barbearia" }])).toEqual(["appointment"])
    expect(inferCapabilitiesFromCategories([{ name: "Eletricista" }])).toEqual(["quote", "service_area"])
    expect(inferCapabilitiesFromCategories([{ name: "Pizzaria" }])).toEqual(["catalog", "ordering"])
    expect(OFFICIAL_CAPABILITY_IDS).not.toContain("mobility")
  })

  test("migration is additive, protected by RLS and excludes mobility", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/014_domain_capabilities.sql"), "utf8")

    expect(sql).toContain("create table public.capabilities")
    expect(sql).toContain("create table public.business_capabilities")
    expect(sql).toContain("alter table public.capabilities enable row level security")
    expect(sql).toContain("alter table public.business_capabilities enable row level security")
    expect(sql).toContain("public.owns_business(business_id)")
    expect(sql).toContain("domain_id in ('services', 'shop')")
    expect(sql).toContain("array['eletricista', 'encanador'")
    expect(sql).toContain("insert into public.business_capabilities (business_id, capability_id)")
    expect(sql).not.toContain("alter table public.businesses add")
  })

  test("official sprint documents exist and separate mobility from businesses", async () => {
    const documents = await Promise.all(
      ["domain-capabilities-v1.md", "domain-experience-v1.md", "business-capabilities-matrix-v1.md"].map((document) =>
        readFile(path.join(root, "docs", document), "utf8"),
      ),
    )

    expect(documents[0]).toContain("Empresa\n  -> Capacidades")
    expect(documents[1]).toContain("Mobilidade nao pertence ao dominio Empresas")
    expect(documents[2]).toContain("Mobilidade nao aparece nesta matriz")
  })

  test("business profile renders capability-driven experience", async ({ page }) => {
    await page.goto("/buscar?q=Eletricista")
    const profilePath = await page.locator('a[href^="/empresa/"]').first().getAttribute("href")
    expect(profilePath).toBeTruthy()

    await page.goto(profilePath!)
    await expect(page.getByText("O que voce pode fazer aqui")).toBeVisible()
    await expect(page.getByText("Solicitar orcamento", { exact: true })).toBeVisible()
    await expect(page.getByText("Ver area atendida", { exact: true })).toBeVisible()
  })
})
