import Link from "next/link"
import { Building2, Plus, Settings2 } from "lucide-react"

import { requireAuth } from "@/src/application/auth"
import { listCurrentUserBusinesses } from "@/src/application/ownership"

type MyBusinessesPageProps = {
  searchParams?: Promise<{ created?: string }>
}

export default async function MyBusinessesPage({ searchParams }: MyBusinessesPageProps) {
  await requireAuth("/meus-negocios")
  const businesses = await listCurrentUserBusinesses()
  const params = (await searchParams) ?? {}

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Ownership</p>
            <h1 className="mt-2 text-4xl font-black md:text-5xl">Meus Negocios</h1>
          </div>
          <Link href="/cadastrar-empresa" className="flex h-12 items-center gap-2 rounded-[8px] bg-[#FF6B00] px-5 text-sm font-black">
            <Plus className="size-4" /> Adicionar Negocio
          </Link>
        </div>
        {params.created && <p className="mt-6 rounded-[8px] border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">Empresa criada com sucesso.</p>}
        {businesses.length ? (
          <div className="mt-7 grid gap-3">
            {businesses.map((business) => (
              <article key={business.id} className="flex flex-col justify-between gap-5 rounded-[8px] border border-white/10 bg-white/6 p-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[#FF6B00]/16 text-[#FF6B00]"><Building2 className="size-5" /></span>
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-black">{business.name}</h2>
                    <p className="mt-1 text-sm font-medium text-white/48">{business.categoryName ?? "Categoria em configuracao"} · Status: {business.statusLabel}</p>
                  </div>
                </div>
                <Link href={`/negocio/${business.id}`} className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-white/12 px-4 text-sm font-black hover:bg-white/8">
                  <Settings2 className="size-4 text-[#FF6B00]" /> Gerenciar
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-[8px] border border-dashed border-white/16 p-8 text-center">
            <Building2 className="mx-auto size-8 text-[#FF6B00]" />
            <h2 className="mt-4 text-2xl font-black">Voce ainda nao possui negocios cadastrados.</h2>
            <Link href="/cadastrar-empresa" className="mx-auto mt-6 flex h-12 w-fit items-center gap-2 rounded-[8px] bg-[#FF6B00] px-5 text-sm font-black">
              <Plus className="size-4" /> Adicionar Primeiro Negocio
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}
