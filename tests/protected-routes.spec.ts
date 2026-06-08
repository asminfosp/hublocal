import { expect, test } from "@playwright/test"

test.describe("protected routes", () => {
  for (const route of ["/minha-conta", "/meus-negocios", "/cadastrar-empresa", "/favoritos", "/configuracoes"]) {
    test(`visitor is redirected from ${route}`, async ({ page }) => {
      await page.goto(route)

      await expect(page).toHaveURL(/\/entrar\?/)
      expect(new URL(page.url()).searchParams.get("next")).toBe(route)
      await expect(page.getByText("Faca login para cadastrar e gerenciar seus negocios.")).toBeVisible()
    })
  }

  test("identity entry points remain public", async ({ page }) => {
    await page.goto("/entrar")
    await expect(page.getByRole("link", { name: "Criar Conta" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Esqueci minha senha" })).toBeVisible()

    await page.goto("/cadastro")
    await expect(page.getByRole("heading", { name: /Criar Conta Hub Local/i })).toBeVisible()

    await page.goto("/recuperar-acesso")
    await expect(page.getByRole("heading", { name: /Recuperar acesso/i })).toBeVisible()
  })
})
