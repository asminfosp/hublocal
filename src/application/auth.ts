import { redirect } from "next/navigation"

import type { UserProfile } from "@/src/modules/identity/domain/user-profile"
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/auth/server"

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, city, created_at")
    .eq("id", user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email,
    displayName: profile?.display_name ?? user.user_metadata.full_name ?? user.email?.split("@")[0] ?? "Usuario Hub",
    avatarUrl: user.user_metadata.avatar_url ?? user.user_metadata.picture ?? profile?.avatar_url,
    city: profile?.city ?? undefined,
    createdAt: profile?.created_at ?? user.created_at,
  }
}

export async function requireAuth(next = "/minha-conta") {
  const profile = await getCurrentUserProfile()
  if (!profile) redirect(`/entrar?next=${encodeURIComponent(next)}`)
  return profile
}
