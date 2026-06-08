import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business Onboarding V2", () => {
  test("wizard replaces the single business registration form", async () => {
    const wizard = await readFile(path.join(root, "components/business-registration-form.tsx"), "utf8")

    for (const step of ["Identificacao", "Categoria", "Capacidades", "Dados publicos", "Localizacao", "Revisao"]) {
      expect(wizard).toContain(step)
    }
    expect(wizard).toContain("localStorage")
    expect(wizard).toContain("Publicar Negocio")
    expect(wizard).toContain("Trust Level")
    expect(wizard).toContain("0 - Nao Verificado")
    expect(wizard).toContain('"auto-eletrica": "autopeca"')
  })

  test("individual flow validates CPF and requires WhatsApp", async () => {
    const wizard = await readFile(path.join(root, "components/business-registration-form.tsx"), "utf8")
    const action = await readFile(path.join(root, "app/auth/actions.ts"), "utf8")

    expect(wizard).toContain("isValidCpf")
    expect(wizard).toContain("Sou Profissional Autonomo")
    expect(wizard).toContain("WhatsApp")
    expect(action).toContain("Informe%20um%20CPF%20valido")
  })

  test("company and service-area flows capture public data and location shape", async () => {
    const wizard = await readFile(path.join(root, "components/business-registration-form.tsx"), "utf8")

    expect(wizard).toContain("Tenho CNPJ")
    expect(wizard).toContain("Consultar CNPJ")
    expect(wizard).toContain("Descricao")
    expect(wizard).toContain("Instagram")
    expect(wizard).toContain("Website")
    expect(wizard).toContain("Negocio fisico")
    expect(wizard).toContain("Prestador de servico")
    expect(wizard).toContain("Embu das Artes")
    expect(wizard).toContain("Taboao da Serra")
  })
})
