import Link from "next/link"
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react"

import { BottomNav } from "@/components/bottom-nav"
import { BusinessCard } from "@/components/business-card"
import {
  categoryOptions,
  popularSearches,
  searchBusinesses,
} from "@/lib/hub-data"

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string
    category?: string
    filter?: string
  }>
}

const filters = [
  { id: "", label: "Todos" },
  { id: "nearby", label: "Mais proximos" },
  { id: "top", label: "Melhor avaliados" },
  { id: "verified", label: "Verificados" },
  { id: "open", label: "Aberto agora" },
]

function buildSearchHref(params: { q?: string; category?: string; filter?: string }) {
  const query = new URLSearchParams()

  if (params.q) query.set("q", params.q)
  if (params.category) query.set("category", params.category)
  if (params.filter) query.set("filter", params.filter)

  const queryString = query.toString()
  return queryString ? `/buscar?${queryString}` : "/buscar"
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const params = (await searchParams) ?? {}
  const q = params.q ?? ""
  const category = params.category ?? ""
  const filter = params.filter ?? ""
  const results = searchBusinesses(q, category, filter)
  const activeCategory = categoryOptions.find((item) => item.id === category)
  const title = q || activeCategory?.label || "Economia local"

  return (
    <div className="min-h-screen overflow-hidden bg-[#090B10] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,107,0,0.14)_0%,transparent_30%),linear-gradient(180deg,#090B10_0%,#11141D_55%,#090B10_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:60px_60px]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090B10]/88 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Voltar"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/8 text-white ring-1 ring-white/12 transition active:scale-95"
            >
              <ArrowLeft className="size-5" />
            </Link>

            <form action="/buscar" className="min-w-0 flex-1">
              <div className="flex h-12 items-center gap-2 rounded-[20px] bg-white px-4 text-neutral-950 shadow-[0_14px_34px_rgba(0,0,0,0.24)]">
                <Search className="size-5 shrink-0 text-[#FF6B00]" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Buscar no Hub Local"
                  className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-bold outline-none placeholder:text-neutral-500"
                />
                {category && <input type="hidden" name="category" value={category} />}
              </div>
            </form>

            <Link
              href={buildSearchHref({ q, category, filter: "open" })}
              aria-label="Filtrar resultados"
              className="flex size-11 shrink-0 items-center justify-center rounded-[18px] bg-[#FF6B00] text-white shadow-[0_12px_28px_rgba(255,107,0,0.28)] transition active:scale-95"
            >
              <SlidersHorizontal className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl gap-6 px-4 pb-28 pt-5 md:grid-cols-[340px_minmax(0,1fr)] md:px-8 md:pb-32">
        <aside className="space-y-4 md:sticky md:top-24 md:self-start">
          <section className="rounded-[34px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                  Descoberta local
                </p>
                <h1 className="mt-2 text-4xl font-black leading-none">{title}</h1>
                <p className="mt-3 text-sm font-medium leading-6 text-white/62">
                  {results.length} resultados encontrados em uma economia local ativa.
                </p>
              </div>
              <ShieldCheck className="size-6 shrink-0 text-[#FF6B00]" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-[20px] bg-black/24 p-3 ring-1 ring-white/10">
                <p className="text-xl font-black">{results.length}</p>
                <p className="mt-1 text-[11px] font-bold text-white/50">resultados</p>
              </div>
              <div className="rounded-[20px] bg-black/24 p-3 ring-1 ring-white/10">
                <p className="text-xl font-black">{results.filter((item) => item.badge === "Empresa Verificada").length}</p>
                <p className="mt-1 text-[11px] font-bold text-white/50">verificados</p>
              </div>
              <div className="rounded-[20px] bg-black/24 p-3 ring-1 ring-white/10">
                <p className="text-xl font-black">{results.filter((item) => item.isOpen).length}</p>
                <p className="mt-1 text-[11px] font-bold text-white/50">abertos</p>
              </div>
            </div>
          </section>

          <section className="rounded-[34px] border border-white/10 bg-[#11141D] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Filtros</h2>
              <SlidersHorizontal className="size-5 text-[#FF6B00]" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 md:grid">
              {filters.map((item) => (
                <Link
                  key={item.label}
                  href={buildSearchHref({ q, category, filter: item.id })}
                  className={`rounded-[18px] px-4 py-3 text-sm font-black transition active:scale-95 ${
                    filter === item.id
                      ? "bg-[#FF6B00] text-white shadow-[0_14px_30px_rgba(255,107,0,0.22)]"
                      : "bg-white/8 text-white/68 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-white/10 bg-[#11141D] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Categorias</h2>
              <Sparkles className="size-5 text-[#FF6B00]" />
            </div>
            <div className="mt-3 grid gap-2">
              <Link
                href={buildSearchHref({ q, filter })}
                className={`rounded-[18px] px-4 py-3 text-sm font-black transition ${
                  !category ? "bg-[#FF6B00] text-white" : "bg-white/8 text-white/68 hover:text-white"
                }`}
              >
                Todas as categorias
              </Link>
              {categoryOptions.map((item) => (
                <Link
                  key={item.id}
                  href={buildSearchHref({ q, category: item.id, filter })}
                  className={`rounded-[18px] px-4 py-3 text-sm font-black transition ${
                    category === item.id
                      ? "bg-[#FF6B00] text-white"
                      : "bg-white/8 text-white/68 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-5">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
            <div className="relative h-56 overflow-hidden rounded-[28px] bg-[#11141D] md:h-72">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:44px_44px]" />
              <div className="absolute left-8 right-8 top-1/2 h-px bg-[#FF6B00]/34" />
              <div className="absolute bottom-8 top-8 left-1/2 w-px bg-white/12" />
              {results.slice(0, 5).map((business, index) => {
                const positions = [
                  "left-[14%] top-[20%]",
                  "left-[58%] top-[18%]",
                  "left-[36%] top-[56%]",
                  "left-[74%] top-[58%]",
                  "left-[18%] top-[70%]",
                ]
                return (
                  <Link
                    key={business.slug}
                    href={`/empresa/${business.slug}`}
                    className={`absolute ${positions[index]} flex items-center gap-2 rounded-full bg-[#FF6B00] px-3 py-2 text-xs font-black text-white shadow-[0_12px_34px_rgba(255,107,0,0.4)] ring-4 ring-white/10 transition hover:-translate-y-0.5`}
                  >
                    <Zap className="size-4 fill-white" />
                    <span className="hidden sm:inline">{business.categoryLabel}</span>
                  </Link>
                )
              })}
              <div className="absolute bottom-4 left-4 right-4 rounded-[24px] bg-black/46 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <p className="text-sm font-black">Mapa de descoberta</p>
                <p className="mt-1 text-xs font-medium text-white/58">
                  Empresas, servicos e contatos reais perto da sua rotina.
                </p>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="rounded-[34px] border border-white/10 bg-white/8 p-8 text-center backdrop-blur-xl">
              <h2 className="text-3xl font-black">Nada encontrado ainda</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/58">
                Tente uma busca popular ou remova filtros para descobrir mais opcoes locais.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {popularSearches.slice(0, 3).map((item) => (
                  <Link
                    key={item}
                    href={`/buscar?q=${encodeURIComponent(item)}`}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white"
                  >
                    {item}
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {categoryOptions.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/buscar?category=${item.id}`}
                    className="rounded-full bg-[#FF6B00] px-4 py-2 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,107,0,0.2)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((business) => (
                <BusinessCard key={business.slug} business={business} />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav activeIndex={1} />
    </div>
  )
}
