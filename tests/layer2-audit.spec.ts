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
    await page.goto("/buscar")
    const profilePath = await page.locator('a[href^="/empresa/"]').first().getAttribute("href")
    expect(profilePath).toBeTruthy()
    await page.goto(profilePath!)
    await expect(page.locator('header a[aria-current="page"]')).toContainText("Empresas")
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible()
  })

  test("official placeholders respond", async ({ page }) => {
    await page.goto("/entrar")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("preparando sua entrada")
    await page.goto("/cadastrar-empresa")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("preparando o cadastro")
  })
})
