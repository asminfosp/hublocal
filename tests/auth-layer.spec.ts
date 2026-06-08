import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

test.describe("Layer 5 authentication", () => {
  test("login exposes Google and email access", async ({ page }) => {
    await page.goto("/entrar")
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Continuar com Google" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Enviar link de acesso" })).toBeVisible()
  })

  test("profile guard redirects visitors to login", async ({ page }) => {
    await page.goto("/perfil")
    await expect(page).toHaveURL(/\/entrar\?/)
    expect(new URL(page.url()).searchParams.get("next")).toBe("/perfil")
  })

  test("business profile exposes favorite and share actions", async ({ page }) => {
    await page.goto("/empresa/bella-massa-pizzaria-embu-das-artes", { waitUntil: "domcontentloaded", timeout: 60000 })
    await expect(page.getByRole("button", { name: "Favoritar" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Compartilhar" })).toBeVisible()
  })

  test("favorites migration defines table and owner-only RLS", async () => {
    const sql = await readFile(path.join(process.cwd(), "supabase/migrations/013_user_profiles_favorites.sql"), "utf8")
    expect(sql).toContain("create table public.favorites")
    expect(sql).toContain("profile_id = auth.uid()")
    expect(sql).toContain("alter table public.favorites enable row level security")
  })
})
