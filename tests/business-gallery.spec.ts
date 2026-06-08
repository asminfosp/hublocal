import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business Console gallery", () => {
  test("console manages logo, cover and gallery images through business_media", async () => {
    const page = await readFile(path.join(root, "app/negocio/[id]/page.tsx"), "utf8")
    const actions = await readFile(path.join(root, "app/negocio/[id]/actions.ts"), "utf8")

    expect(page).toContain("Logo")
    expect(page).toContain("Capa")
    expect(page).toContain("Foto")
    expect(page).toContain("URL da Imagem")
    expect(page).toContain("/20 imagens cadastradas")
    expect(actions).toContain('from("business_media")')
    expect(actions).toContain(">= 20")
    expect(actions).toContain('.eq("type", type)')
    expect(actions).toContain("alt_text")
  })
})
