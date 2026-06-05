import Link from "next/link"

import { BusinessCard } from "./business-card"
import { businesses } from "@/lib/hub-data"

export function FeaturedBusinesses() {
  return (
    <section className="px-4 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Negocios em Destaque</h2>
        <Link href="/buscar?filter=top" className="text-sm font-medium text-primary hover:underline">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {businesses.slice(0, 6).map((business) => (
          <BusinessCard key={business.slug} business={business} />
        ))}
      </div>
    </section>
  )
}
