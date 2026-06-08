import Link from "next/link"
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  ExternalLink,
  GalleryHorizontal,
  ImagePlus,
  LayoutDashboard,
  MapPin,
  PanelLeft,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  UserRoundCog,
} from "lucide-react"

import {
  addBusinessMediaAction,
  updateBusinessHoursAction,
  updateBusinessLocationAction,
  updateBusinessProfileAction,
} from "@/app/negocio/[id]/actions"
import ForbiddenBusiness from "@/app/negocio/[id]/forbidden"
import {
  capabilityNames,
  getArchetypeLabel,
  getArchetypePanelItems,
  getCapabilityBlocks,
  getOwnedBusinessConsole,
  trustLevelLabel,
  type BusinessConsole,
} from "@/src/application/business-console"
import { requireAuth } from "@/src/application/auth"
import { capabilityCatalog } from "@/src/modules/capabilities/domain/capability"

type BusinessDashboardPageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ saved?: string; error?: string }>
}

const navItems = [
  { href: "#dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#perfil", label: "Perfil Publico", icon: UserRoundCog },
  { href: "#localizacao", label: "Informacoes", icon: MapPin },
  { href: "#galeria", label: "Galeria", icon: GalleryHorizontal },
  { href: "#horarios", label: "Horarios", icon: Clock3 },
  { href: "#capacidades", label: "Capacidades", icon: SlidersHorizontal },
  { href: "#configuracoes", label: "Configuracoes", icon: Settings2 },
]

const weekdays = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"]
const serviceCities = ["Embu das Artes", "Taboao da Serra", "Cotia", "Itapecerica"]

function sectionTitle(icon: React.ElementType, eyebrow: string, title: string) {
  const Icon = icon
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-[8px] bg-[#FF6B00]/16 text-[#FF6B00]"><Icon className="size-5" /></span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/40">{eyebrow}</p>
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
    </div>
  )
}

function Field({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/42">
      {label}
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} className="h-12 rounded-[8px] border border-white/10 bg-white px-3 text-sm font-bold normal-case tracking-normal text-neutral-950 outline-none" />
    </label>
  )
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/42">
      {label}
      <textarea name={name} defaultValue={defaultValue} className="min-h-28 rounded-[8px] border border-white/10 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-neutral-950 outline-none" />
    </label>
  )
}

function SaveButton({ children }: { children: React.ReactNode }) {
  return <button className="flex h-11 w-fit items-center justify-center rounded-[8px] bg-[#FF6B00] px-5 text-sm font-black text-white">{children}</button>
}

function HiddenBusiness({ business }: { business: BusinessConsole }) {
  return <input type="hidden" name="business_id" value={business.id} />
}

function DashboardCards({ business }: { business: BusinessConsole }) {
  const cards = [
    { label: "Status do Negocio", value: business.statusLabel, detail: business.statusReason || business.statusDescription },
    { label: "Categoria", value: business.categoryName, detail: business.categorySlug || "categoria principal" },
    { label: "Arquetipo", value: getArchetypeLabel(business.businessArchetype), detail: business.businessArchetype },
    { label: "Trust Level", value: trustLevelLabel(business.trustLevel), detail: `Nivel ${business.trustLevel}` },
    { label: "Ownership", value: "Proprietario", detail: business.role },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article key={card.label} className="rounded-[8px] border border-white/10 bg-white/6 p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-white/38">{card.label}</p>
          <p className="mt-3 text-xl font-black capitalize">{card.value}</p>
          <p className="mt-2 text-sm font-medium text-white/46">{card.detail}</p>
        </article>
      ))}
    </div>
  )
}

function ArchetypeExperience({ business }: { business: BusinessConsole }) {
  return (
    <section className="rounded-[8px] border border-white/10 bg-white/6 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-white/38">Experiencia por Arquetipo</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {getArchetypePanelItems(business.businessArchetype).map((item) => (
          <span key={item} className="rounded-[8px] border border-white/10 bg-[#090B10]/55 px-3 py-2 text-sm font-black text-white/72">{item}</span>
        ))}
      </div>
    </section>
  )
}

function CapabilityBlocks({ business }: { business: BusinessConsole }) {
  const blocks = getCapabilityBlocks(business.businessArchetype, business.capabilities)
  if (!blocks.length) {
    return <p className="rounded-[8px] border border-white/10 bg-white/6 p-4 text-sm font-bold text-white/52">Nenhum bloco operacional ativo para esta categoria.</p>
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {blocks.map((block) => (
        <article key={block.id} className="rounded-[8px] border border-white/10 bg-[#090B10]/55 p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#FF6B00]">{block.capability}</p>
          <p className="mt-3 text-4xl font-black">{block.metric}</p>
          <h3 className="mt-3 text-lg font-black">{block.title}</h3>
          <p className="mt-2 text-sm font-bold text-white/42">{block.subtitle}</p>
        </article>
      ))}
    </div>
  )
}

function PublicProfileSection({ business }: { business: BusinessConsole }) {
  return (
    <section id="perfil" className="scroll-mt-28 border-t border-white/10 pt-8">
      {sectionTitle(Store, "Perfil Publico", "Editar dados publicos")}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <form action={updateBusinessProfileAction} className="grid gap-4 rounded-[8px] border border-white/10 bg-white/6 p-5">
          <HiddenBusiness business={business} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={business.businessKind === "company" ? "Nome Fantasia" : "Nome"} name="name" defaultValue={business.name} />
            <Field label="WhatsApp" name="whatsapp" defaultValue={business.whatsapp} />
            <Field label="Telefone" name="phone" defaultValue={business.phone} />
            <Field label="Instagram" name="instagram" defaultValue={business.instagram} />
            <Field label="Website" name="website" defaultValue={business.website} />
          </div>
          <TextArea label="Descricao" name="description" defaultValue={business.description} />
          <SaveButton>Salvar Perfil</SaveButton>
        </form>

        <aside className="rounded-[8px] border border-white/10 bg-[#090B10]/60 p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/38">Preview</p>
          <h3 className="mt-4 text-2xl font-black">{business.name}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-white/54">{business.description}</p>
          <div className="mt-5 grid gap-2 text-sm font-bold text-white/62">
            <span>{business.whatsapp || "WhatsApp nao informado"}</span>
            <span>{business.instagram || "Instagram nao informado"}</span>
          </div>
          <Link href={`/empresa/${business.slug}`} className="mt-5 flex h-11 w-fit items-center gap-2 rounded-[8px] border border-white/12 px-4 text-sm font-black hover:bg-white/8">
            Ver Perfil Publico <ExternalLink className="size-4 text-[#FF6B00]" />
          </Link>
        </aside>
      </div>
    </section>
  )
}

function LocationSection({ business }: { business: BusinessConsole }) {
  const selectedCities = new Set((business.location?.serviceArea ?? "").split(",").map((item) => item.trim()).filter(Boolean))

  return (
    <section id="localizacao" className="scroll-mt-28 border-t border-white/10 pt-8">
      {sectionTitle(MapPin, "Informacoes", "Localizacao e area atendida")}
      <form action={updateBusinessLocationAction} className="mt-5 grid gap-5 rounded-[8px] border border-white/10 bg-white/6 p-5">
        <HiddenBusiness business={business} />
        <input type="hidden" name="location_id" value={business.location?.id ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CEP" name="postal_code" defaultValue={business.location?.postalCode} />
          <Field label="Endereco" name="address_line" defaultValue={business.location?.addressLine} />
          <Field label="Cidade" name="city" defaultValue={business.location?.city} />
          <Field label="Bairro" name="neighborhood" defaultValue={business.location?.neighborhood} />
          <Field label="Estado" name="state_code" defaultValue={business.location?.stateCode ?? "SP"} />
          <Field label="Area de Atendimento Livre" name="service_area" defaultValue={business.location?.serviceArea} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-white/42">Prestador</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCities.map((city) => (
              <label key={city} className="flex min-h-12 items-center gap-2 rounded-[8px] border border-white/10 bg-[#090B10]/45 px-3 text-sm font-black">
                <input type="checkbox" name="service_area" value={city} defaultChecked={selectedCities.has(city)} className="size-4 accent-[#FF6B00]" />
                {city}
              </label>
            ))}
          </div>
        </div>
        <SaveButton>Salvar Localizacao</SaveButton>
      </form>
    </section>
  )
}

function GallerySection({ business }: { business: BusinessConsole }) {
  const galleryCount = business.media.length

  return (
    <section id="galeria" className="scroll-mt-28 border-t border-white/10 pt-8">
      {sectionTitle(GalleryHorizontal, "Galeria", "Logo, capa e fotos")}
      <div className="mt-5 grid gap-5 xl:grid-cols-[360px_1fr]">
        <form action={addBusinessMediaAction} className="grid gap-4 rounded-[8px] border border-white/10 bg-white/6 p-5">
          <HiddenBusiness business={business} />
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/42">
            Tipo
            <select name="type" className="h-12 rounded-[8px] border border-white/10 bg-white px-3 text-sm font-bold normal-case tracking-normal text-neutral-950 outline-none">
              <option value="avatar">Logo</option>
              <option value="cover">Capa</option>
              <option value="gallery">Foto</option>
            </select>
          </label>
          <Field label="URL da Imagem" name="url" placeholder="/businesses/minha-foto.jpg" />
          <Field label="Texto Alternativo" name="alt_text" />
          <p className="text-xs font-bold text-white/42">{galleryCount}/20 imagens cadastradas</p>
          <SaveButton>Adicionar Imagem</SaveButton>
        </form>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {business.media.length ? business.media.map((media) => (
            <article key={media.id} className="overflow-hidden rounded-[8px] border border-white/10 bg-white/6">
              <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${media.url})` }} />
              <div className="p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#FF6B00]">{media.type === "avatar" ? "Logo" : media.type === "cover" ? "Capa" : "Foto"}</p>
                <p className="mt-1 truncate text-sm font-bold text-white/60">{media.altText || media.url}</p>
              </div>
            </article>
          )) : (
            <div className="rounded-[8px] border border-dashed border-white/16 p-6 text-center text-sm font-bold text-white/44">
              <ImagePlus className="mx-auto size-6 text-[#FF6B00]" />
              <p className="mt-3">Nenhuma imagem cadastrada.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function HoursSection({ business }: { business: BusinessConsole }) {
  const byWeekday = new Map(business.hours.map((hour) => [hour.weekday, hour]))

  return (
    <section id="horarios" className="scroll-mt-28 border-t border-white/10 pt-8">
      {sectionTitle(Clock3, "Horarios", "Funcionamento semanal")}
      <form action={updateBusinessHoursAction} className="mt-5 grid gap-3 rounded-[8px] border border-white/10 bg-white/6 p-5">
        <HiddenBusiness business={business} />
        {weekdays.map((weekday, index) => {
          const hour = byWeekday.get(index)
          return (
            <div key={weekday} className="grid gap-3 rounded-[8px] border border-white/10 bg-[#090B10]/45 p-3 md:grid-cols-[1fr_140px_140px_120px] md:items-center">
              <p className="font-black">{weekday}</p>
              <Field label="Abre" name={`opens_${index}`} defaultValue={hour?.opensAt || "09:00"} />
              <Field label="Fecha" name={`closes_${index}`} defaultValue={hour?.closesAt || "18:00"} />
              <label className="flex h-12 items-center gap-2 text-sm font-black text-white/70">
                <input type="checkbox" name={`closed_${index}`} defaultChecked={hour?.isClosed} className="size-4 accent-[#FF6B00]" />
                Fechado
              </label>
            </div>
          )
        })}
        <SaveButton>Salvar Horarios</SaveButton>
      </form>
    </section>
  )
}

function CapabilitiesSection({ business }: { business: BusinessConsole }) {
  return (
    <section id="capacidades" className="scroll-mt-28 border-t border-white/10 pt-8">
      {sectionTitle(SlidersHorizontal, "Capacidades", "Ferramentas ativas")}
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {business.capabilities.map((id) => {
          const capability = capabilityCatalog[id]
          return (
            <article key={id} className="rounded-[8px] border border-white/10 bg-white/6 p-5">
              <div className="flex items-start justify-between gap-3">
                <BadgeCheck className="size-5 text-[#FF6B00]" />
                <span className="rounded-[8px] bg-emerald-400/10 px-2 py-1 text-xs font-black text-emerald-100">Ativa</span>
              </div>
              <h3 className="mt-3 text-lg font-black">{capability.name}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-white/50">{capability.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default async function BusinessDashboardPage({ params, searchParams }: BusinessDashboardPageProps) {
  await requireAuth("/meus-negocios")
  const { id } = await params
  const query = (await searchParams) ?? {}
  const business = await getOwnedBusinessConsole(id)

  if (!business) return <ForbiddenBusiness />

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-24 pt-28 text-white md:px-8 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <Link href="/meus-negocios" className="flex w-fit items-center gap-2 text-sm font-black text-white/56 hover:text-white"><ArrowLeft className="size-4" /> Meus Negocios</Link>
          <nav className="mt-5 grid gap-2 rounded-[8px] border border-white/10 bg-white/6 p-3">
            <div className="flex items-center gap-2 px-2 pb-2 text-xs font-black uppercase tracking-[0.12em] text-white/36"><PanelLeft className="size-4 text-[#FF6B00]" /> Business Console</div>
            {navItems.map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} className="flex h-10 items-center gap-3 rounded-[8px] px-3 text-sm font-black text-white/64 hover:bg-white/8 hover:text-white">
                <Icon className="size-4 text-[#FF6B00]" /> {label}
              </a>
            ))}
          </nav>
        </aside>

        <div>
          <section id="dashboard" className="scroll-mt-28 border-b border-white/10 pb-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Business Console V1</p>
                <h1 className="mt-3 text-4xl font-black md:text-5xl">{business.name}</h1>
                <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-white/54">{business.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {capabilityNames(business.capabilities).map((name) => (
                  <span key={name} className="rounded-[8px] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-2 text-xs font-black text-orange-100">{name}</span>
                ))}
              </div>
            </div>
          </section>

          {query.saved && <p className="mt-5 rounded-[8px] border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">Alteracoes salvas em {query.saved}.</p>}
          {query.error && <p className="mt-5 rounded-[8px] border border-red-300/20 bg-red-400/10 p-4 text-sm font-bold text-red-100">{query.error}</p>}

          <div className="mt-7 grid gap-8">
            <DashboardCards business={business} />
            <ArchetypeExperience business={business} />
            <CapabilityBlocks business={business} />
            <PublicProfileSection business={business} />
            <LocationSection business={business} />
            <GallerySection business={business} />
            <HoursSection business={business} />
            <CapabilitiesSection business={business} />
            <section id="configuracoes" className="scroll-mt-28 border-t border-white/10 pt-8">
              {sectionTitle(ShieldCheck, "Configuracoes", "Seguranca e ownership")}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <article className="rounded-[8px] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-white/38">Ownership preservado</p>
                  <p className="mt-3 text-lg font-black">Apenas proprietarios acessam este console.</p>
                </article>
                <article className="rounded-[8px] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-white/38">Proximas ferramentas</p>
                  <p className="mt-3 text-lg font-black">Pedidos, agendamentos e orcamentos reais ficam para proximas sprints.</p>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
