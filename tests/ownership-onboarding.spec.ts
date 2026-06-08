import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()

test.describe("Ownership in Business Onboarding V2", () => {
  test("migration adds onboarding metadata without exposing document numbers publicly", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/016_business_onboarding_v2.sql"), "utf8")

    expect(sql).toContain("business_kind")
    expect(sql).toContain("business_archetype")
    expect(sql).toContain("document_type")
    expect(sql).toContain("document_number")
    expect(sql).toContain("trust_level")
    expect(sql).toContain("businesses_unique_document_idx")
    expect(sql).toContain("revoke select on public.businesses from anon, authenticated")
    expect(sql).not.toContain("grant select (document_number")
    expect(sql).toContain("grant execute on function public.create_business_with_owner")
  })

  test("migration can be reapplied without duplicate constraints", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/016_business_onboarding_v2.sql"), "utf8")

    for (const constraint of [
      "businesses_business_kind_check",
      "businesses_business_archetype_check",
      "businesses_document_type_check",
      "businesses_trust_level_check",
    ]) {
      expect(sql).toContain(`where conname = '${constraint}'`)
    }

    expect(sql).not.toContain("alter table public.businesses\n  add constraint")
    expect(sql).toContain("create unique index if not exists businesses_unique_document_idx")
    expect(sql).toContain("create or replace function public.create_business_with_owner")
  })

  test("migration guarantees categories used by onboarding", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/016_business_onboarding_v2.sql"), "utf8")
    const wizard = await readFile(path.join(root, "components/business-registration-form.tsx"), "utf8")

    for (const slug of [
      "barbearia",
      "salao",
      "restaurante",
      "pet-shop",
      "eletricista",
      "dentista",
      "mecanico",
      "autopeca",
    ]) {
      expect(sql).toContain(`'${slug}'`)
      expect(wizard).toContain(`slug: "${slug}"`)
    }

    expect(sql).toContain("on conflict (slug) do update")
    expect(sql).toContain("on conflict (category_id, domain_id) do nothing")
  })

  test("onboarding publication still creates primary owner membership", async () => {
    const sql = await readFile(path.join(root, "supabase/migrations/016_business_onboarding_v2.sql"), "utf8")
    const action = await readFile(path.join(root, "app/auth/actions.ts"), "utf8")
    const ownership = await readFile(path.join(root, "src/application/ownership.ts"), "utf8")

    expect(sql).toContain("insert into public.business_members")
    expect(sql).toContain("'owner', true")
    expect(sql).toContain("'pending_review'")
    expect(sql).toContain("derived_archetype := case category_record.slug")
    expect(sql).toContain("business_archetype")
    expect(sql).toContain("document_already_registered")
    expect(action).toContain("Este documento ja possui um negocio cadastrado.")
    expect(sql).toContain("p_document_type text := $6")
    expect(sql).toContain("existing_business.document_type = p_document_type")
    expect(ownership).toContain("business_kind")
    expect(ownership).toContain("location_service_area")
  })
})
