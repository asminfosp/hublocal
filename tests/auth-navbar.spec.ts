import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Auth navbar experience", () => {
  test("visitor sees the public session navigation", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 })

    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Abrir menu" }).click()
    }

    await expect(page.getByRole("link", { name: "Buscar" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Cadastrar Empresa" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Entrar" }).first()).toBeVisible()
  })

  test("business registration CTA sends visitors to login with context", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 })
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Abrir menu" }).click()
    }
    await page.getByRole("link", { name: "Cadastrar Empresa" }).first().click()

    await expect(page).toHaveURL(/\/entrar\?/)
    expect(new URL(page.url()).searchParams.get("next")).toBe("/cadastrar-empresa")
    await expect(page.getByText("Faca login para cadastrar e gerenciar seus negocios.")).toBeVisible()
  })

  test("authenticated dropdown contract includes official account entries", async () => {
    const nav = await readFile(path.join(root, "components/global-nav.tsx"), "utf8")

    expect(nav).toContain("useAuthSession")
    expect(nav).toContain("Carregando sessao")
    expect(nav).toContain("Minha Conta")
    expect(nav).toContain("Meus Negocios")
    expect(nav).toContain("Favoritos")
    expect(nav).toContain("Configuracoes")
    expect(nav).toContain("Sair")
  })
})
