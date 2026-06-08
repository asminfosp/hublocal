import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business public visibility", () => {
  test("public policies expose only published businesses and relations", async () => {
    const rls = await readFile(path.join(root, "supabase/migrations/011_rls.sql"), "utf8")
    const lifecycle = await readFile(path.join(root, "supabase/migrations/017_business_lifecycle.sql"), "utf8")

    expect(rls).toContain("public reads published businesses")
    expect(rls).toContain("status = 'published'")
    expect(rls).toContain("public reads published locations")
    expect(rls).toContain("public reads published media")
    expect(lifecycle).toContain("'suspended'")
    expect(lifecycle).toContain("'rejected'")
  })

  test("business lists and public profiles keep relying on published visibility", async () => {
    const repositories = await readFile(path.join(root, "src/infrastructure/supabase/repositories.ts"), "utf8")
    const profile = await readFile(path.join(root, "app/empresa/[slug]/page.tsx"), "utf8")

    expect(repositories).toContain("businessSelect")
    expect(profile).toContain("getBusinessBySlug")
    expect(profile).not.toContain("business_members")
  })
})
