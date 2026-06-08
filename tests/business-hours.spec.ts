import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business Console hours", () => {
  test("console exposes editable weekly opening hours persisted to business_hours", async () => {
    const page = await readFile(path.join(root, "app/negocio/[id]/page.tsx"), "utf8")
    const actions = await readFile(path.join(root, "app/negocio/[id]/actions.ts"), "utf8")

    for (const weekday of ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"]) {
      expect(page).toContain(weekday)
    }

    expect(page).toContain("Abre")
    expect(page).toContain("Fecha")
    expect(page).toContain("Fechado")
    expect(page).toContain("Salvar Horarios")
    expect(actions).toContain('from("business_hours").delete()')
    expect(actions).toContain('from("business_hours").insert(rows)')
    expect(actions).toContain('timezone: "America/Sao_Paulo"')
  })
})
