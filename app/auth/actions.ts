"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import {
  beginEmailSignIn,
  beginGoogleSignIn,
  createEmailAccount,
  sendPasswordRecovery,
  signInWithPassword,
  signOutCurrentUser,
  toggleCurrentUserFavorite,
  updateCurrentPassword,
  updateCurrentProfile,
} from "@/src/application/auth-commands"
import { recordAuthEvent } from "@/src/application/auth-telemetry"
import { createOwnedBusiness } from "@/src/application/ownership"
import type { CapabilityId } from "@/src/modules/capabilities/domain/capability"

function safeNext(value: FormDataEntryValue | null, fallback = "/") {
  const next = typeof value === "string" ? value : fallback
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback
}

function withAuthEvent(path: string, event: "login" | "signup" | "logout" | "reset") {
  const separator = path.includes("?") ? "&" : "?"
  return `${path}${separator}auth=${event}`
}

function digits(value: FormDataEntryValue | null) {
  return String(value ?? "").replace(/\D/g, "")
}

function isValidCpf(value: string) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1+$/.test(value)) return false
  const calc = (base: string, factor: number) => {
    const total = base.split("").reduce((sum, digit) => sum + Number(digit) * factor--, 0)
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return calc(value.slice(0, 9), 10) === Number(value[9]) && calc(value.slice(0, 10), 11) === Number(value[10])
}

export async function signInWithGoogleAction(formData: FormData) {
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const next = safeNext(formData.get("next"))
  const { data, error } = await beginGoogleSignIn(`${origin}/auth/callback?next=${encodeURIComponent(next)}`)

  if (error || !data.url) {
    recordAuthEvent("login_failed", { provider: "google" })
    redirect(`/entrar?error=${encodeURIComponent(error?.message ?? "Google indisponivel")}`)
  }
  redirect(data.url)
}

export async function signInWithPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = safeNext(formData.get("next"), "/minha-conta")
  if (!email || !password) redirect("/entrar?error=Informe%20email%20e%20senha")

  const { error } = await signInWithPassword(email, password)
  if (error) {
    recordAuthEvent("login_failed", { provider: "password" })
    redirect(`/entrar?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
  }

  recordAuthEvent("login_success", { provider: "password" })
  redirect(withAuthEvent(next, "login"))
}

export async function signInWithEmailAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const next = safeNext(formData.get("next"))
  if (!email) redirect("/entrar?error=Informe%20seu%20email")

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const { error } = await beginEmailSignIn(email, `${origin}/auth/callback?next=${encodeURIComponent(next)}`)

  if (error) {
    recordAuthEvent("login_failed", { provider: "magic_link" })
    redirect(`/entrar?error=${encodeURIComponent(error.message)}`)
  }
  redirect(`/entrar?sent=1&email=${encodeURIComponent(email)}`)
}

export async function signUpWithEmailAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmation = String(formData.get("password_confirmation") ?? "")
  if (!name || !email || password.length < 8) redirect("/cadastro?error=Preencha%20os%20campos%20e%20use%20uma%20senha%20com%208%20caracteres")
  if (password !== confirmation) redirect("/cadastro?error=As%20senhas%20nao%20coincidem")

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const { data, error } = await createEmailAccount(name, email, password, `${origin}/auth/callback?next=/minha-conta`)
  if (error) {
    recordAuthEvent("login_failed", { provider: "signup" })
    redirect(`/cadastro?error=${encodeURIComponent(error.message)}`)
  }
  if (data.session) {
    recordAuthEvent("signup_success")
    redirect("/minha-conta?auth=signup")
  }
  const { error: loginError } = await signInWithPassword(email, password)
  if (!loginError) {
    recordAuthEvent("signup_success")
    redirect("/minha-conta?auth=signup")
  }
  redirect(`/cadastro?sent=1&email=${encodeURIComponent(email)}`)
}

export async function recoverAccessAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) redirect("/recuperar-acesso?error=Informe%20seu%20email")
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const { error } = await sendPasswordRecovery(email, `${origin}/auth/callback?next=/recuperar-acesso?recovery=1`)
  if (error) redirect(`/recuperar-acesso?error=${encodeURIComponent(error.message)}`)
  recordAuthEvent("password_reset")
  redirect(`/recuperar-acesso?sent=1&auth=reset&email=${encodeURIComponent(email)}`)
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "")
  const confirmation = String(formData.get("password_confirmation") ?? "")
  if (password.length < 8) redirect("/recuperar-acesso?recovery=1&error=A%20senha%20deve%20ter%208%20caracteres")
  if (password !== confirmation) redirect("/recuperar-acesso?recovery=1&error=As%20senhas%20nao%20coincidem")
  const { error } = await updateCurrentPassword(password)
  if (error) redirect(`/recuperar-acesso?recovery=1&error=${encodeURIComponent(error.message)}`)
  await signOutCurrentUser()
  redirect("/entrar?password_updated=1")
}

export async function createBusinessAction(formData: FormData) {
  const businessKind = String(formData.get("business_kind") ?? "company") as "individual" | "company"
  const documentType = businessKind === "individual" ? "cpf" : "cnpj"
  const documentNumber = digits(formData.get("document_number"))
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const categorySlug = String(formData.get("category_slug") ?? "")
  const capabilities = formData.getAll("capabilities").map(String) as CapabilityId[]
  const whatsapp = digits(formData.get("whatsapp"))
  const phone = digits(formData.get("phone"))
  const city = String(formData.get("city") ?? "").trim()
  const stateCode = String(formData.get("state_code") ?? "SP").trim().toUpperCase()
  const serviceArea = formData.getAll("service_area").map(String).filter(Boolean).join(", ")

  if (!name || !description || !categorySlug || !whatsapp || !city) redirect("/cadastrar-empresa?error=Preencha%20os%20dados%20obrigatorios%20do%20onboarding")
  if (businessKind === "individual" && !isValidCpf(documentNumber)) redirect("/cadastrar-empresa?error=Informe%20um%20CPF%20valido")
  if (businessKind === "company" && documentNumber.length !== 14) redirect("/cadastrar-empresa?error=Informe%20um%20CNPJ%20valido")

  const { error } = await createOwnedBusiness({
    name,
    description,
    categorySlug,
    capabilities,
    businessKind,
    documentType,
    documentNumber,
    whatsapp,
    phone,
    instagram: String(formData.get("instagram") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
    postalCode: digits(formData.get("postal_code")),
    city,
    stateCode,
    neighborhood: String(formData.get("neighborhood") ?? "").trim(),
    addressLine: String(formData.get("address_line") ?? "").trim(),
    serviceArea,
  })
  if (error) {
    const message = error.message.includes("document_already_registered")
      ? "Este documento ja possui um negocio cadastrado."
      : error.message
    redirect(`/cadastrar-empresa?error=${encodeURIComponent(message)}`)
  }
  revalidatePath("/meus-negocios")
  redirect("/meus-negocios?created=1")
}

export async function signOutAction() {
  await signOutCurrentUser()
  recordAuthEvent("logout")
  redirect("/?auth=logout")
}

export async function updateProfileAction(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const { error } = await updateCurrentProfile(displayName, city)

  if (error) redirect(error.message === "not_authenticated" ? "/entrar?next=/perfil" : `/perfil?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/perfil")
  redirect("/perfil?saved=1")
}

export async function toggleFavoriteAction(formData: FormData) {
  const businessId = String(formData.get("business_id") ?? "")
  const slug = String(formData.get("slug") ?? "")
  const { authenticated, error } = await toggleCurrentUserFavorite(businessId)
  if (!authenticated) redirect(`/entrar?next=${encodeURIComponent(`/empresa/${slug}`)}`)
  if (error) redirect(`/empresa/${slug}?favorite_error=1`)
  revalidatePath(`/empresa/${slug}`)
}
