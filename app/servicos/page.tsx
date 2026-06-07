import { ComingSoonPage } from "@/components/coming-soon-page"
import { hubRepositories } from "@/src/application/repositories"

export default async function ServicesDomainPage() {
  const providers = await hubRepositories.services.getProviders()

  return (
    <ComingSoonPage
      eyebrow="Dominio oficial"
      title="Servicos locais, organizados para resolver."
      description={`Estamos estruturando a experiencia oficial para descobrir profissionais e empresas prestadoras de servicos com contexto, proximidade e confianca. A base atual ja reconhece ${providers.length} prestadores.`}
    />
  )
}
