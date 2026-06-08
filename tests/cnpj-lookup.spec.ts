import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("CNPJ lookup", () => {
  test("server route integrates with BrasilAPI and normalizes public fields", async () => {
    const route = await readFile(path.join(root, "app/api/cnpj/[cnpj]/route.ts"), "utf8")

    expect(route).toContain("https://brasilapi.com.br/api/cnpj/v1/")
    expect(route).toContain("legalName")
    expect(route).toContain("tradeName")
    expect(route).toContain("postalCode")
    expect(route).toContain("addressLine")
    expect(route).toContain("cnpj_lookup_unavailable")
    expect(route).toContain('cache: "no-store"')
    expect(route).toContain('"user-agent": "Hub Local CNPJ Lookup"')
    expect(route).not.toContain("revalidate")
  })

  test("invalid CNPJ fails before calling the external API", async ({ request }) => {
    const response = await request.get("/api/cnpj/123")
    expect(response.status()).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: "invalid_cnpj" })
  })
})
