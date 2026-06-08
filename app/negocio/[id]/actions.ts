"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { assertOwnsBusiness } from "@/src/application/business-console"
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/auth/server"

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function digits(formData: FormData, key: string) {
  return value(formData, key).replace(/\D/g, "")
}

async function withOwnership(formData: FormData) {
  const businessId = value(formData, "business_id")
  if (!businessId) throw new Error("missing_business_id")
  await assertOwnsBusiness(businessId)
  return businessId
}

function done(businessId: string, section: string) {
  revalidatePath(`/negocio/${businessId}`)
  redirect(`/negocio/${businessId}?saved=${section}`)
}

export async function updateBusinessProfileAction(formData: FormData) {
  const businessId = await withOwnership(formData)
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("businesses")
    .update({
      name: value(formData, "name"),
      description: value(formData, "description"),
      whatsapp: digits(formData, "whatsapp"),
      phone: digits(formData, "phone"),
      instagram: value(formData, "instagram"),
      website: value(formData, "website"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", businessId)

  if (error) redirect(`/negocio/${businessId}?error=${encodeURIComponent(error.message)}`)
  done(businessId, "perfil")
}

export async function updateBusinessLocationAction(formData: FormData) {
  const businessId = await withOwnership(formData)
  const locationId = value(formData, "location_id")
  const supabase = await createServerSupabaseClient()
  const payload = {
    business_id: businessId,
    label: "Principal",
    city: value(formData, "city") || "Nao informado",
    state_code: value(formData, "state_code").toUpperCase() || "SP",
    neighborhood: value(formData, "neighborhood") || "Nao informado",
    address_line: value(formData, "address_line") || "Atendimento por area",
    postal_code: digits(formData, "postal_code") || null,
    service_area: formData.getAll("service_area").map(String).filter(Boolean).join(", ") || value(formData, "service_area") || null,
    is_primary: true,
    updated_at: new Date().toISOString(),
  }

  const request = locationId
    ? supabase.from("locations").update(payload).eq("id", locationId).eq("business_id", businessId)
    : supabase.from("locations").insert(payload)
  const { error } = await request

  if (error) redirect(`/negocio/${businessId}?error=${encodeURIComponent(error.message)}`)
  done(businessId, "localizacao")
}

export async function updateBusinessHoursAction(formData: FormData) {
  const businessId = await withOwnership(formData)
  const supabase = await createServerSupabaseClient()
  const rows = Array.from({ length: 7 }, (_, weekday) => {
    const isClosed = formData.get(`closed_${weekday}`) === "on"
    return {
      business_id: businessId,
      weekday,
      opens_at: isClosed ? null : value(formData, `opens_${weekday}`),
      closes_at: isClosed ? null : value(formData, `closes_${weekday}`),
      is_closed: isClosed,
      timezone: "America/Sao_Paulo",
    }
  })

  const { error: deleteError } = await supabase.from("business_hours").delete().eq("business_id", businessId)
  if (deleteError) redirect(`/negocio/${businessId}?error=${encodeURIComponent(deleteError.message)}`)

  const { error } = await supabase.from("business_hours").insert(rows)
  if (error) redirect(`/negocio/${businessId}?error=${encodeURIComponent(error.message)}`)
  done(businessId, "horarios")
}

export async function addBusinessMediaAction(formData: FormData) {
  const businessId = await withOwnership(formData)
  const supabase = await createServerSupabaseClient()
  const type = value(formData, "type") as "avatar" | "cover" | "gallery"
  const url = value(formData, "url")

  if (!url) redirect(`/negocio/${businessId}?error=Informe%20a%20URL%20da%20imagem`)

  const { count } = await supabase
    .from("business_media")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId)

  if ((count ?? 0) >= 20) redirect(`/negocio/${businessId}?error=Limite%20de%2020%20imagens%20atingido`)

  if (type === "avatar" || type === "cover") {
    await supabase.from("business_media").delete().eq("business_id", businessId).eq("type", type)
  }

  const { error } = await supabase.from("business_media").insert({
    business_id: businessId,
    type,
    url,
    alt_text: value(formData, "alt_text"),
    sort_order: count ?? 0,
  })

  if (error) redirect(`/negocio/${businessId}?error=${encodeURIComponent(error.message)}`)
  done(businessId, "galeria")
}
