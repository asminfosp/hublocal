import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Business status history", () => {
  test("migration creates audit table and status-change trigger", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/017_business_lifecycle.sql"), "utf8")

    expect(sql).toContain("create table if not exists public.business_status_history")
    expect(sql).toContain("old_status public.business_status")
    expect(sql).toContain("new_status public.business_status not null")
    expect(sql).toContain("changed_by uuid")
    expect(sql).toContain("reason text")
    expect(sql).toContain("create or replace function public.record_business_status_change")
    expect(sql).toContain("after update of status on public.businesses")
    expect(sql).toContain("insert into public.business_status_history")
  })

  test("expected lifecycle transitions are represented by transition service", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/017_business_lifecycle.sql"), "utf8")

    expect(sql).toContain("public.transition_business_status")
    expect(sql).toContain("target_status public.business_status")
    expect(sql).toContain("status = target_status")
    expect(sql).toContain("draft")
    expect(sql).toContain("pending_review")
    expect(sql).toContain("published")
    expect(sql).toContain("suspended")
    expect(sql).toContain("rejected")
  })
})
