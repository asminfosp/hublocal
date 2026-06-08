import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { businessStatusLabel } from "@/src/modules/businesses/domain/business-lifecycle"

const root = process.cwd()

test.describe("Business Lifecycle V1", () => {
  test("official statuses and labels are defined", () => {
    expect(businessStatusLabel("draft")).toBe("Rascunho")
    expect(businessStatusLabel("pending_review")).toBe("Em analise")
    expect(businessStatusLabel("approved")).toBe("Aprovado")
    expect(businessStatusLabel("published")).toBe("Publicado")
    expect(businessStatusLabel("suspended")).toBe("Suspenso")
    expect(businessStatusLabel("rejected")).toBe("Rejeitado")
  })

  test("migration adds lifecycle fields and transition foundation", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/017_business_lifecycle.sql"), "utf8")

    expect(sql).toContain("alter type public.business_status add value if not exists 'approved'")
    expect(sql).toContain("alter type public.business_status add value if not exists 'rejected'")
    expect(sql).toContain("add column if not exists status_reason text")
    expect(sql).toContain("add column if not exists reviewed_at timestamptz")
    expect(sql).toContain("add column if not exists reviewed_by uuid")
    expect(sql).toContain("grant select (status_reason) on public.businesses to authenticated")
    expect(sql).toContain("create or replace function public.transition_business_status")
    expect(sql).toContain("target_status::text in ('approved', 'published', 'suspended', 'rejected')")
  })

  test("new onboarding businesses enter review before public visibility", async () => {
    const migration016 = await readFile(path.join(root, "supabase/migrations/016_business_onboarding_v2.sql"), "utf8")
    const migration017 = await readFile(path.join(root, "supabase/migrations/017_business_lifecycle.sql"), "utf8")

    expect(migration016).toContain("'pending_review'")
    expect(migration017).toContain("'pending_review'")
    expect(migration017).not.toContain("'published',\n    false")
  })
})
