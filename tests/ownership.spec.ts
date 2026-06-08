import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Identity & Ownership V1", () => {
  test("business creation RPC establishes primary ownership from auth.uid", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/015_identity_ownership.sql"), "utf8")

    expect(sql).toContain("create_business_with_owner")
    expect(sql).toContain("current_profile_id uuid := auth.uid()")
    expect(sql).toContain("insert into public.business_members")
    expect(sql).toContain("'owner', true")
    expect(sql).toContain("raise exception 'authentication_required'")
    expect(sql).toContain("owners read own business categories")
    expect(sql).toContain("owners read own business domains")
    expect(sql).toContain("grant execute on function public.create_business_with_owner")
  })

  test("private business queries derive identity from the Supabase session", async () => {
    const ownership = await readFile(path.join(root, "src/application/ownership.ts"), "utf8")

    expect(ownership).toContain("supabase.auth.getUser()")
    expect(ownership).toContain('.eq("profile_id", user.id)')
    expect(ownership).toContain('.eq("role", "owner")')
    expect(ownership).not.toContain("profileId:")
  })

  test("business registration sends category and capability choices to the protected action", async () => {
    const registration = await readFile(path.join(root, "components/business-registration-form.tsx"), "utf8")
    const action = await readFile(path.join(root, "app/auth/actions.ts"), "utf8")

    expect(registration).toContain("createBusinessAction")
    expect(registration).toContain('name="category_slug"')
    expect(registration).toContain('name="capabilities"')
    expect(action).toContain('redirect("/meus-negocios?created=1")')
  })
})
