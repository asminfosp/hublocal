import { BusinessRegistrationForm } from "@/components/business-registration-form"
import { requireAuth } from "@/src/application/auth"

type RegisterBusinessPageProps = {
  searchParams?: Promise<{ error?: string }>
}

export default async function RegisterBusinessPage({ searchParams }: RegisterBusinessPageProps) {
  await requireAuth("/cadastrar-empresa")
  const params = (await searchParams) ?? {}

  return <BusinessRegistrationForm error={params.error} />
}
