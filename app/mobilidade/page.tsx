import { ComingSoonPage } from "@/components/coming-soon-page"
import { hubRepositories } from "@/src/application/repositories"

export default async function MobilityDomainPage() {
  const providers = await hubRepositories.mobility.getProviders()

  return (
    <ComingSoonPage
      eyebrow="Dominio oficial"
      title="Mobilidade local com limites claros."
      description={`Esta experiencia apresentara opcoes locais de transporte e logistica. Hoje existem ${providers.length} provedores validados; a operacao, o despacho e a entrega continuarao pertencendo ao JOOIN.`}
    />
  )
}
