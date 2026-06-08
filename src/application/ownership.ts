import { createServerSupabaseClient } from "@/src/infrastructure/supabase/auth/server"
import type { CapabilityId } from "@/src/modules/capabilities/domain/capability"
import { businessStatusLabel } from "@/src/modules/businesses/domain/business-lifecycle"

export type OwnedBusinessSummary = {
  id: string
  slug: string
  name: string
  description: string
  status: string
  statusLabel: string
  categoryName?: string
  capabilities: CapabilityId[]
}

export async function listCurrentUserBusinesses(): Promise<OwnedBusinessSummary[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("business_members")
    .select(`
      role,
      is_primary,
      businesses(
        id, slug, name, description, status,
        business_categories(is_primary, categories(name)),
        business_capabilities(capability_id, enabled)
      )
    `)
    .eq("profile_id", user.id)
    .eq("role", "owner")

  if (error) return []

  return (data ?? []).flatMap((membership: any) => {
    const business = membership.businesses
    if (!business) return []
    return [{
      id: business.id,
      slug: business.slug,
      name: business.name,
      description: business.description,
      status: business.status,
      statusLabel: businessStatusLabel(business.status),
      categoryName: business.business_categories?.find((relation: any) => relation.is_primary)?.categories?.name,
      capabilities: (business.business_capabilities ?? [])
        .filter((relation: any) => relation.enabled)
        .map((relation: any) => relation.capability_id as CapabilityId),
    }]
  })
}

export async function getOwnedBusiness(businessId: string) {
  const businesses = await listCurrentUserBusinesses()
  return businesses.find((business) => business.id === businessId) ?? null
}

export async function createOwnedBusiness(input: {
  name: string
  description: string
  categorySlug: string
  capabilities: CapabilityId[]
  businessKind: "individual" | "company"
  documentType: "cpf" | "cnpj"
  documentNumber: string
  whatsapp: string
  phone?: string
  instagram?: string
  website?: string
  postalCode?: string
  city: string
  stateCode: string
  neighborhood?: string
  addressLine?: string
  serviceArea?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.rpc("create_business_with_owner", {
    business_name: input.name,
    business_description: input.description,
    primary_category_slug: input.categorySlug,
    requested_capabilities: input.capabilities,
    business_kind: input.businessKind,
    document_type: input.documentType,
    document_number: input.documentNumber,
    contact_whatsapp: input.whatsapp,
    contact_phone: input.phone ?? "",
    contact_instagram: input.instagram ?? "",
    contact_website: input.website ?? "",
    location_postal_code: input.postalCode ?? "",
    location_city: input.city,
    location_state_code: input.stateCode,
    location_neighborhood: input.neighborhood ?? "",
    location_address_line: input.addressLine ?? "",
    location_service_area: input.serviceArea ?? "",
  })

  return { businessId: data as string | null, error }
}
