import { ComingSoonPage } from "@/components/coming-soon-page"
import { hubRepositories } from "@/src/application/repositories"

export default async function ShopDomainPage() {
  const stores = await hubRepositories.shop.getStores()

  return (
    <ComingSoonPage
      eyebrow="Dominio oficial"
      title="O comercio local tera uma nova vitrine."
      description={`Shop sera o caminho para descobrir lojas e referencias de produtos da regiao. A base atual reconhece ${stores.length} lojas, sem carrinho, checkout ou promessas de marketplace.`}
    />
  )
}
