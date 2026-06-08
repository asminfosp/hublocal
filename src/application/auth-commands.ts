import { createServerSupabaseClient } from "@/src/infrastructure/supabase/auth/server"

export async function beginGoogleSignIn(redirectTo: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } })
}

export async function beginEmailSignIn(email: string, emailRedirectTo: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function createEmailAccount(name: string, email: string, password: string, emailRedirectTo: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo, data: { full_name: name } },
  })
}

export async function sendPasswordRecovery(email: string, redirectTo: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.resetPasswordForEmail(email, { redirectTo })
}

export async function updateCurrentPassword(password: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.updateUser({ password })
}

export async function exchangeAuthCode(code: string) {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.exchangeCodeForSession(code)
}

export async function signOutCurrentUser() {
  const supabase = await createServerSupabaseClient()
  return supabase.auth.signOut()
}

export async function updateCurrentProfile(displayName: string, city: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error("not_authenticated") }
  return supabase.from("profiles").upsert({ id: user.id, display_name: displayName, city, updated_at: new Date().toISOString() })
}

export async function toggleCurrentUserFavorite(businessId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { authenticated: false, error: null }

  const { data: existing } = await supabase
    .from("favorites")
    .select("business_id")
    .eq("profile_id", user.id)
    .eq("business_id", businessId)
    .maybeSingle()
  const request = existing
    ? supabase.from("favorites").delete().eq("profile_id", user.id).eq("business_id", businessId)
    : supabase.from("favorites").insert({ profile_id: user.id, business_id: businessId })
  const { error } = await request
  return { authenticated: true, error }
}
