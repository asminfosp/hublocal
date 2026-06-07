import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react"

import { BottomNav } from "@/components/bottom-nav"
import { BusinessCard } from "@/components/business-card"
import { hubRepositories } from "@/src/application/repositories"
import { formatDistance } from "@/src/shared/utils/format-distance"

type CompanyProfilePageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const businesses = await hubRepositories.businesses.listBusinesses()
  return businesses.map((business) => ({
    slug: business.slug,
  }))
}

export async function generateMetadata({ params }: CompanyProfilePageProps) {
  const { slug } = await params
  const business = await hubRepositories.businesses.getBusinessBySlug(slug)

  if (!business) {
    return {
      title: "Empresa nao encontrada | Hub Local",
    }
  }

  return {
    title: `${business.name} | Hub Local`,
    description: `${business.categories[0]?.name ?? "Negocio local"} em ${business.location.city}. Veja endereco, telefone e WhatsApp.`,
  }
}

export default async function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const { slug } = await params
  const business = await hubRepositories.businesses.getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const category = business.categories[0]
  const whatsappUrl = `https://wa.me/${business.contact.whatsapp?.replace(/\D/g, "") ?? ""}`
  const similarBusinesses = category
    ? (await hubRepositories.businesses.listBusinesses({ categoryId: category.id }))
        .filter((item) => item.id !== business.id)
        .slice(0, 8)
    : []
  const rating = business.rating ?? 0
  const reviewCount = business.reviewCount ?? 0

  return (
    <div className="min-h-screen overflow-hidden bg-[#090B10] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,107,0,0.14)_0%,transparent_30%),linear-gradient(180deg,#090B10_0%,#11141D_52%,#090B10_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.14] [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:62px_62px]" />

      <main className="relative mx-auto max-w-[1440px] px-4 pb-28 pt-28 md:px-8 md:pb-20 md:pt-32">
        <header className="flex items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm font-bold text-white/48">
            <Link href="/" className="transition hover:text-white">
              Inicio
            </Link>
            <span className="text-white/20">/</span>
            <Link
              href={`/buscar?category=${category?.id ?? ""}`}
              className="transition hover:text-white"
            >
              {category?.name ?? "Negocio local"}
            </Link>
            <span className="text-white/20">/</span>
            <span className="truncate text-white">{business.name}</span>
          </nav>
          <div className="flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-xs font-black text-white ring-1 ring-white/12">
            <ShieldCheck className="size-4 text-[#FF6B00]" />
            Perfil verificado
          </div>
        </header>

        <section className="grid gap-6 pt-5 md:grid-cols-[minmax(0,1fr)_420px] lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_520px]">
          <div>
            <div className="relative overflow-hidden rounded-[38px] bg-[#11141D] shadow-[0_34px_100px_rgba(0,0,0,0.44),0_0_40px_rgba(255,107,0,0.08)] ring-1 ring-white/10">
              <div className="relative h-[460px] md:h-[640px]">
                <img src={business.media.cover} alt="" className="size-full object-cover opacity-86" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-black/48 to-black/10" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(255,107,0,0.28)]">
                  <Sparkles className="size-3.5" />
                  {business.trustSignals.includes("verified") ? "Empresa Verificada" : "Destaque Local"}
                </div>
                <div className="absolute inset-x-5 bottom-5 md:bottom-8 md:left-8 md:right-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/12 px-3 py-2 text-xs font-black text-white ring-1 ring-white/16 backdrop-blur-xl">
                      {category?.name ?? "Negocio local"}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-white/12 px-3 py-2 text-xs font-black text-white ring-1 ring-white/16 backdrop-blur-xl">
                      <Star className="size-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                      {rating.toFixed(1)} de {reviewCount} avaliacoes
                    </span>
                  </div>
                  <h1 className="max-w-3xl text-5xl font-black leading-none md:text-7xl">
                    {business.name}
                  </h1>
                  <p className="mt-4 max-w-xl text-base font-medium leading-7 text-white/68 md:text-xl">
                    {business.specialty}
                  </p>
                </div>
              </div>
            </div>

            <section className="pt-5">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                    Galeria local
                  </p>
                  <h2 className="mt-2 text-3xl font-black">Um olhar rapido sobre o negocio.</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {business.media.gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`overflow-hidden rounded-[28px] bg-[#11141D] ring-1 ring-white/10 ${
                      index === 0 ? "col-span-2 h-56" : "h-40 md:h-56"
                    }`}
                  >
                    <img src={image} alt="" className="size-full object-cover" />
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-6">
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[34px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                    Servicos
                  </p>
                  <h2 className="mt-2 text-3xl font-black">O que resolve.</h2>
                  <div className="mt-5 grid gap-2">
                    {business.offerings.map((offering) => (
                      <div
                        key={offering.id}
                        className="flex items-center gap-3 rounded-[22px] bg-white/8 p-3 text-sm font-black text-white ring-1 ring-white/10"
                      >
                        <BadgeCheck className="size-5 shrink-0 text-[#FF6B00]" />
                        {offering.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#11141D] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                    Localizacao
                  </p>
                  <h2 className="mt-2 text-3xl font-black">Perto da sua rotina.</h2>
                  <div className="relative mt-5 h-64 overflow-hidden rounded-[28px] bg-[#090B10] ring-1 ring-white/10">
                    <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:38px_38px]" />
                    <div className="absolute left-8 right-8 top-1/2 h-px bg-[#FF6B00]/34" />
                    <div className="absolute bottom-8 top-8 left-1/2 w-px bg-white/12" />
                    <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] bg-[#FF6B00] shadow-[0_0_48px_rgba(255,107,0,0.48)]">
                      <MapPin className="size-8 fill-white/20" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-black/48 p-3 ring-1 ring-white/10 backdrop-blur-xl">
                      <p className="text-sm font-black">{business.location.address}</p>
                      <p className="mt-1 text-xs font-medium text-white/58">{business.location.serviceArea}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-6">
              <div className="rounded-[34px] border border-white/10 bg-[#11141D] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                      Avaliacoes
                    </p>
                    <h2 className="mt-2 text-3xl font-black">Confianca antes do contato.</h2>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#FF6B00] px-3 py-2 text-sm font-black text-white">
                    <Star className="size-4 fill-white" />
                    {rating.toFixed(1)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {business.reviewHighlights.map((review) => (
                    <article key={review.name} className="rounded-[26px] bg-white/8 p-4 text-white ring-1 ring-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{review.name}</p>
                          <div className="mt-1 flex items-center gap-0.5 text-[#FF6B00]">
                            {Array.from({ length: review.rating }).map((_, index) => (
                              <Star key={index} className="size-3.5 fill-[#FF6B00]" />
                            ))}
                          </div>
                        </div>
                        <BadgeCheck className="size-5 text-emerald-300" />
                      </div>
                      <p className="mt-3 text-sm font-medium leading-6 text-white/62">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="pt-6">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">
                    Empresas semelhantes
                  </p>
                  <h2 className="mt-2 text-3xl font-black">Mais opcoes confiaveis.</h2>
                </div>
                <Link
                  href={`/buscar?category=${category?.id ?? ""}`}
                  className="hidden text-sm font-black text-[#FF6B00] md:block"
                >
                  Ver categoria
                </Link>
              </div>
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden">
                {similarBusinesses.map((item) => (
                  <div key={item.slug} className="w-[292px] shrink-0">
                    <BusinessCard business={item} compact />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 md:sticky md:top-28 md:self-start">
            <section className="rounded-[34px] border border-white/10 bg-[#11141D] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-[#FF6B00]">{category?.name ?? "Negocio local"}</p>
                  <h2 className="mt-1 text-2xl font-black leading-tight">
                    Perfil local de confianca
                  </h2>
                </div>
                <ShieldCheck className="size-6 shrink-0 text-[#FF6B00]" />
              </div>

              <p className="mt-5 text-[15px] font-medium leading-7 text-white/62">
                {business.description}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FF6B00]/14 px-3 py-2 text-xs font-black text-orange-100 ring-1 ring-[#FF6B00]/24">
                <Sparkles className="size-4" />
                {business.highlight}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-[20px] bg-white/8 p-3 text-center ring-1 ring-white/8">
                  <p className="text-lg font-black">{reviewCount}</p>
                  <p className="mt-1 text-[11px] font-bold text-white/44">avaliacoes</p>
                </div>
                <div className="rounded-[20px] bg-white/8 p-3 text-center ring-1 ring-white/8">
                  <p className="text-lg font-black">{formatDistance(business.distanceMeters)}</p>
                  <p className="mt-1 text-[11px] font-bold text-white/44">de voce</p>
                </div>
                <div className="rounded-[20px] bg-white/8 p-3 text-center ring-1 ring-white/8">
                  <p className="text-lg font-black">{business.trustedSince}</p>
                  <p className="mt-1 text-[11px] font-bold text-white/44">no local</p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <div className="flex items-start gap-3 rounded-[22px] bg-white/8 p-3 ring-1 ring-white/8">
                  <Clock3 className="mt-0.5 size-5 shrink-0 text-[#FF6B00]" />
                  <div>
                    <p className="text-sm font-black">
                      {business.hours.isOpen ? `Aberto agora ate ${business.hours.closingTime}` : "Fechado agora"}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white/48">
                      {business.hours.summary}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[22px] bg-white/8 p-3 ring-1 ring-white/8">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-[#FF6B00]" />
                  <div>
                    <p className="text-sm font-black">{business.location.address}</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/48">
                      {business.location.serviceArea}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[22px] bg-white/8 p-3 ring-1 ring-white/8">
                  <Phone className="mt-0.5 size-5 shrink-0 text-[#FF6B00]" />
                  <div>
                    <p className="text-sm font-black">{business.contact.phone}</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/48">
                      Ligue ou chame no WhatsApp para falar direto.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#11141D] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <h2 className="text-2xl font-black">Entrar em contato</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-white/62">
                O Hub Local conecta voce direto com o negocio.
              </p>
              <div className="mt-5 grid gap-3">
                <a
                  href={whatsappUrl}
                  className="flex h-14 items-center justify-center gap-2 rounded-[22px] bg-[#25D366] text-sm font-black text-white shadow-[0_14px_34px_rgba(37,211,102,0.22)] transition hover:-translate-y-0.5 hover:bg-[#20BD5A] active:scale-95"
                >
                  <MessageCircle className="size-5" />
                  Chamar no WhatsApp
                </a>
                <a
                  href={`tel:${business.contact.phone ?? ""}`}
                  className="flex h-14 items-center justify-center gap-2 rounded-[22px] bg-white/10 text-sm font-black text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/14 active:scale-95"
                >
                  <Phone className="size-5" />
                  Ligar
                </a>
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
              <h2 className="text-xl font-black">Sinais de confianca</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {business.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/buscar?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/76 transition hover:bg-[#FF6B00] hover:text-white"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <Link
                href={`/buscar?category=${category?.id ?? ""}`}
                className="mt-5 flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#FF6B00] text-sm font-black text-white shadow-[0_16px_34px_rgba(255,107,0,0.24)] transition active:scale-95"
              >
                Ver similares
                <ArrowRight className="size-4" />
              </Link>
            </section>
          </aside>
        </section>
      </main>

      <BottomNav activeIndex={1} />
    </div>
  )
}
