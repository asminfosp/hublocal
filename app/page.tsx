import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Car,
  HeartPulse,
  MapPin,
  PawPrint,
  Scissors,
  Search,
  Sparkles,
  Star,
  Utensils,
  Wrench,
} from "lucide-react"

import { BottomNav } from "@/components/bottom-nav"
import { BusinessCard } from "@/components/business-card"
import {
  businesses,
  categoryOptions,
  getBusinessesByBadge,
  popularSearches,
} from "@/lib/hub-data"

const categoryIcons = {
  Alimentacao: Utensils,
  Servicos: Wrench,
  Automotivo: Car,
  Saude: HeartPulse,
  Beleza: Scissors,
  Pet: PawPrint,
}

const categoryCopy = {
  Alimentacao: "Sabores, cafes e lugares para ir hoje",
  Servicos: "Profissionais prontos para resolver",
  Automotivo: "Oficinas e cuidados para seu carro",
  Saude: "Clinicas e cuidados com confianca",
  Beleza: "Barbearias, saloes e autocuidado",
  Pet: "Banho, tosa, veterinarios e produtos",
}

const nearbyBusinesses = [...businesses].sort((a, b) => a.distanceMeters - b.distanceMeters)
const verifiedBusinesses = getBusinessesByBadge("Empresa Verificada", 10)
const mostSearchedBusinesses = getBusinessesByBadge("Mais Procurado", 10)
const topRatedBusinesses = [...businesses].sort((a, b) => b.rating - a.rating).slice(0, 10)
const openBusinesses = businesses.filter((business) => business.isOpen).slice(0, 10)

const signalStats = [
  { value: `${businesses.length}+`, label: "negocios locais" },
  { value: "4.8", label: "media de avaliacao" },
  { value: `${verifiedBusinesses.length}`, label: "verificados" },
]

const discoveryRails = [
  {
    eyebrow: "Confianca",
    title: "Empresas Verificadas",
    href: "/buscar?filter=verified",
    items: verifiedBusinesses,
  },
  {
    eyebrow: "Movimento",
    title: "Mais Procurados",
    href: "/buscar?filter=top",
    items: mostSearchedBusinesses,
  },
  {
    eyebrow: "Regiao",
    title: "Destaques da Regiao",
    href: "/buscar?filter=top",
    items: topRatedBusinesses,
  },
  {
    eyebrow: "Agora",
    title: "Abertos Agora",
    href: "/buscar?filter=open",
    items: openBusinesses,
  },
  {
    eyebrow: "Novidades",
    title: "Novos Negocios",
    href: "/buscar?filter=nearby",
    items: [...businesses].sort((a, b) => Number(b.trustedSince) - Number(a.trustedSince)).slice(0, 10),
  },
  {
    eyebrow: "Perto",
    title: "Mais Proximos",
    href: "/buscar?filter=nearby",
    items: nearbyBusinesses.slice(0, 10),
  },
]

function BusinessRail({
  eyebrow,
  title,
  href,
  items,
}: {
  eyebrow: string
  title: string
  href: string
  items: typeof businesses
}) {
  return (
    <section className="pt-10 md:pt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-normal md:text-5xl">{title}</h2>
        </div>
        <Link href={href} className="hidden text-sm font-black text-[#FF6B00] md:block">
          Ver todos
        </Link>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden">
        {items.map((business) => (
          <div key={business.slug} className="w-[292px] shrink-0">
            <BusinessCard business={business} compact />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#090B10] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,107,0,0.16)_0%,transparent_28%),linear-gradient(180deg,#090B10_0%,#11141D_58%,#090B10_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:64px_64px]" />

      <main className="relative mx-auto max-w-[1440px] px-4 pb-28 pt-28 md:px-8 md:pb-20 md:pt-32">
        <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_440px] md:items-end xl:grid-cols-[minmax(0,1fr)_540px]">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/74 ring-1 ring-white/12">
              <Sparkles className="size-3.5 text-[#FF6B00]" />
              Descoberta premium local
            </div>
            <h1 className="max-w-5xl text-[46px] font-black leading-[0.94] tracking-normal text-white md:text-7xl xl:text-8xl">
              Encontre o melhor da sua cidade.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/68 md:text-xl">
              Busque empresas, servicos e lugares reais em Embu das Artes com sinais de confianca antes do contato.
            </p>

            <form
              action="/buscar"
              className="mt-8 max-w-4xl rounded-[32px] bg-white p-2 shadow-[0_28px_90px_rgba(0,0,0,0.42),0_0_52px_rgba(255,107,0,0.18)] ring-1 ring-white/20"
            >
              <div className="flex min-h-16 items-center gap-3 rounded-[26px] bg-[#FBFBFA] px-4 text-neutral-950 md:min-h-20 md:px-6">
                <Search className="size-6 shrink-0 text-[#FF6B00]" />
                <input
                  name="q"
                  placeholder="Buscar eletricista, pizzaria, dentista..."
                  className="h-14 min-w-0 flex-1 bg-transparent text-[16px] font-bold outline-none placeholder:text-neutral-500 md:text-xl"
                />
                <button className="flex size-12 shrink-0 items-center justify-center rounded-[20px] bg-[#FF6B00] text-white shadow-[0_14px_30px_rgba(255,107,0,0.34)] transition active:scale-95 md:size-14">
                  <ArrowRight className="size-6" />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {popularSearches.slice(0, 5).map((search, index) => (
                <Link
                  key={search}
                  href={`/buscar?q=${encodeURIComponent(search)}`}
                  className={`rounded-full px-4 py-2 text-sm font-black transition active:scale-95 ${
                    index === 0
                      ? "bg-[#FF6B00] text-white shadow-[0_14px_30px_rgba(255,107,0,0.24)]"
                      : "bg-white/8 text-white/72 ring-1 ring-white/12 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {search}
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-[34px] bg-white/8 p-4 ring-1 ring-white/12 backdrop-blur-xl md:p-5">
            <div className="relative h-80 overflow-hidden rounded-[28px] bg-[#11141D] ring-1 ring-white/10 xl:h-[420px]">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:38px_38px]" />
              <div className="absolute left-6 right-6 top-1/2 h-px bg-[#FF6B00]/40" />
              <div className="absolute bottom-8 left-1/2 top-8 w-px bg-white/12" />
              <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] bg-[#FF6B00] shadow-[0_0_48px_rgba(255,107,0,0.52)]">
                <MapPin className="size-8 fill-white/20" />
              </div>
              {nearbyBusinesses.slice(0, 4).map((business, index) => {
                const positions = [
                  "left-[12%] top-[18%]",
                  "right-[12%] top-[22%]",
                  "left-[18%] bottom-[18%]",
                  "right-[18%] bottom-[16%]",
                ]
                return (
                  <Link
                    key={business.slug}
                    href={`/empresa/${business.slug}`}
                    className={`absolute ${positions[index]} rounded-2xl bg-white px-3 py-2 text-xs font-black text-neutral-950 shadow-[0_16px_40px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5`}
                  >
                    <span className="block max-w-28 truncate">{business.name}</span>
                    <span className="mt-1 flex items-center gap-1 text-[#FF6B00]">
                      <Star className="size-3 fill-[#FF6B00]" />
                      {business.rating.toFixed(1)}
                    </span>
                  </Link>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {signalStats.map((stat) => (
                <div key={stat.label} className="rounded-[22px] bg-black/24 p-3 ring-1 ring-white/10">
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-bold leading-3 text-white/52">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="pt-10 md:pt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                Categorias vivas
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-normal md:text-5xl">
                Caminhos para descobrir.
              </h2>
            </div>
            <Link href="/buscar" className="hidden text-sm font-black text-[#FF6B00] md:block">
              Explorar tudo
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryOptions.map((category, index) => {
              const Icon = categoryIcons[category.id]
              return (
                <Link
                  key={category.id}
                  href={`/buscar?category=${category.id}`}
                  className={`group min-h-44 overflow-hidden rounded-[30px] border border-white/10 bg-[#11141D] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-[#FF6B00]/40 ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-14 items-center justify-center rounded-[22px] bg-[#FF6B00] text-white shadow-[0_16px_34px_rgba(255,107,0,0.24)]">
                      <Icon className="size-6" />
                    </span>
                    <ArrowRight className="size-5 text-white/34 transition group-hover:translate-x-1 group-hover:text-[#FF6B00]" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-white">{category.label}</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-white/58">
                    {categoryCopy[category.id]}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {discoveryRails.map((rail) => (
          <BusinessRail key={rail.title} {...rail} />
        ))}

        <section className="pt-10 md:pt-14">
          <div className="rounded-[34px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-[#FF6B00]">
                <BadgeCheck className="size-5" />
                Porta de entrada da economia local
              </div>
              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
                Descubra, compare sinais de confianca e fale direto com o negocio.
              </h2>
            </div>
            <Link
              href="/buscar"
              className="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-[22px] bg-[#FF6B00] px-6 text-sm font-black text-white shadow-[0_18px_38px_rgba(255,107,0,0.28)] transition active:scale-95 md:mt-0"
            >
              Comecar busca
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav activeIndex={0} />
    </div>
  )
}
