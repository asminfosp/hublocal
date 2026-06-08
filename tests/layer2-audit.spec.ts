import { expect, test } from "@playwright/test"

test.describe("Layer 2 navigation", () => {
  test("home marks Inicio as active", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('header a[aria-current="page"]')).toContainText("Inicio")
  })

  test("search marks Buscar as active", async ({ page }) => {
    await page.goto("/buscar?q=Eletricista")
    await expect(page.locator('header a[aria-current="page"]')).toContainText("Buscar")
    await expect(page.getByText(/resultados encontrados/)).toBeVisible()
  })

  test("business profile marks Empresas and shows breadcrumb", async ({ page }) => {
    await page.goto("/empresa/bella-massa-pizzaria-embu-das-artes", { waitUntil: "domcontentloaded", timeout: 60000 })
    await expect(page.locator('header a[aria-current="page"]')).toContainText("Empresas")
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible()
  })

  test("login responds and business registration requires identity", async ({ page }) => {
    await page.goto("/entrar")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Entre no Hub Local")
    await page.goto("/cadastrar-empresa")
    await expect(page).toHaveURL(/\/entrar\?/)
    expect(new URL(page.url()).searchParams.get("next")).toBe("/cadastrar-empresa")
  })
})
