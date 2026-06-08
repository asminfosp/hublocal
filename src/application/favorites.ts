import { createServerSupabaseClient } from "@/src/infrastructure/supabase/auth/server"

export async function isBusinessFavorite(businessId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("favorites")
    .select("business_id")
    .eq("profile_id", user.id)
    .eq("business_id", businessId)
    .maybeSingle()

  return Boolean(data)
}

export async function listCurrentUserFavorites() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("favorites")
    .select("created_at, businesses(id, slug, name, description, verified)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return []

  return (data ?? []).flatMap((favorite: any) => favorite.businesses ? [favorite.businesses] : [])
}
