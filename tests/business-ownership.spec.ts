import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business Console ownership", () => {
  test("console reads and writes only after owner membership validation", async () => {
    const page = await readFile(path.join(root, "app/negocio/[id]/page.tsx"), "utf8")
    const actions = await readFile(path.join(root, "app/negocio/[id]/actions.ts"), "utf8")
    const consoleApp = await readFile(path.join(root, "src/application/business-console.ts"), "utf8")
    const forbidden = await readFile(path.join(root, "app/negocio/[id]/forbidden.tsx"), "utf8")

    expect(page).toContain("return <ForbiddenBusiness />")
    expect(page).not.toContain("forbidden()")
    expect(forbidden).toContain("403 Forbidden")
    expect(consoleApp).toContain('from("business_members")')
    expect(consoleApp).toContain('.eq("role", "owner")')
    expect(consoleApp).toContain('.eq("business_id", businessId)')
    expect(actions).toContain("assertOwnsBusiness")
    expect(actions).toContain("withOwnership")
  })
})
