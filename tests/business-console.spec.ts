import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business Console V1", () => {
  test("business console replaces the old informational page with operational sections", async () => {
    const page = await readFile(path.join(root, "app/negocio/[id]/page.tsx"), "utf8")
    const consoleApp = await readFile(path.join(root, "src/application/business-console.ts"), "utf8")

    for (const section of [
      "Business Console V1",
      "Dashboard",
      "Perfil Publico",
      "Informacoes",
      "Galeria",
      "Horarios",
      "Capacidades",
      "Configuracoes",
    ]) {
      expect(page).toContain(section)
    }

    expect(page).toContain("Status do Negocio")
    expect(page).toContain("lg:grid-cols-[260px_1fr]")
    expect(page).toContain("trustLevelLabel")
    expect(page).toContain("Experiencia por Arquetipo")
    expect(page).toContain("getArchetypeLabel")
    expect(consoleApp).toContain("Nao Verificado")
    expect(consoleApp).toContain("WhatsApp Verificado")
    expect(consoleApp).toContain("CNPJ Confirmado")
    expect(consoleApp).toContain("Verificado Hub Local")
  })

  test("capability blocks render only compatible operational placeholders", async () => {
    const consoleApp = await readFile(path.join(root, "src/application/business-console.ts"), "utf8")

    expect(consoleApp).toContain("Orcamentos recebidos")
    expect(consoleApp).toContain("Itens cadastrados")
    expect(consoleApp).toContain("Agendamentos")
    expect(consoleApp).toContain("Pedidos")
    expect(consoleApp).toContain('archetype === "service_provider"')
    expect(consoleApp).toContain('archetype === "catalog_business"')
    expect(consoleApp).toContain('archetype === "appointment_business"')
    expect(consoleApp).toContain('capabilities.includes("quote")')
  })
})
