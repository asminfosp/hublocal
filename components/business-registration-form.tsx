"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, Check, MapPin, Search, ShieldCheck, Sparkles, UserRound } from "lucide-react"

import { createBusinessAction } from "@/app/auth/actions"
import { SubmitButton } from "@/components/submit-button"
import {
  capabilityCatalog,
  inferCapabilitiesFromCategories,
  type CapabilityId,
} from "@/src/modules/capabilities/domain/capability"

const storageKey = "hub-local-business-onboarding-v2"
const serviceCities = ["Embu das Artes", "Taboao da Serra", "Itapecerica da Serra", "Cotia"]
const steps = ["Identificacao", "Categoria", "Capacidades", "Dados publicos", "Localizacao", "Revisao"]

const businessTypes = [
  { label: "Barbearia", slug: "barbearia" },
  { label: "Salao", slug: "salao" },
  { label: "Restaurante", slug: "restaurante" },
  { label: "Pet Shop", slug: "pet-shop" },
  { label: "Eletricista", slug: "eletricista" },
  { label: "Dentista", slug: "dentista" },
  { label: "Oficina", slug: "mecanico" },
  { label: "Autopecas", slug: "autopeca" },
]
const businessTypeSlugs = new Set(businessTypes.map((type) => type.slug))
const legacyCategorySlugs: Record<string, string> = {
  "auto-eletrica": "autopeca",
}

type BusinessKind = "individual" | "company"
type LocationMode = "physical" | "service_area"

type WizardState = {
  businessKind: BusinessKind
  cpf: string
  cnpj: string
  fullName: string
  legalName: string
  tradeName: string
  whatsapp: string
  categorySlug: string
  categoryLabel: string
  capabilities: CapabilityId[]
  description: string
  phone: string
  instagram: string
  website: string
  locationMode: LocationMode
  postalCode: string
  addressLine: string
  city: string
  stateCode: string
  neighborhood: string
  serviceArea: string[]
}

const initialState: WizardState = {
  businessKind: "individual",
  cpf: "",
  cnpj: "",
  fullName: "",
  legalName: "",
  tradeName: "",
  whatsapp: "",
  categorySlug: "",
  categoryLabel: "",
  capabilities: [],
  description: "",
  phone: "",
  instagram: "",
  website: "",
  locationMode: "physical",
  postalCode: "",
  addressLine: "",
  city: "",
  stateCode: "SP",
  neighborhood: "",
  serviceArea: [],
}

function digits(value: string) {
  return value.replace(/\D/g, "")
}

function isValidCpf(value: string) {
  const cpf = digits(value)
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false
  const calc = (base: string, factor: number) => {
    const total = base.split("").reduce((sum, digit) => sum + Number(digit) * factor--, 0)
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return calc(cpf.slice(0, 9), 10) === Number(cpf[9]) && calc(cpf.slice(0, 10), 11) === Number(cpf[10])
}

function normalizeSavedState(saved: Partial<WizardState>) {
  const categorySlug = legacyCategorySlugs[saved.categorySlug ?? ""] ?? saved.categorySlug
  const categoryType = businessTypes.find((type) => type.slug === categorySlug)

  if (!categoryType || !businessTypeSlugs.has(categoryType.slug)) {
    return {
      ...saved,
      categorySlug: "",
      categoryLabel: "",
      capabilities: [],
    }
  }

  return {
    ...saved,
    categorySlug: categoryType.slug,
    categoryLabel: categoryType.label,
    capabilities: inferCapabilitiesFromCategories([{ name: categoryType.label }]),
  }
}

export function BusinessRegistrationForm({ error }: { error?: string }) {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>(initialState)
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return

    try {
      setState({ ...initialState, ...normalizeSavedState(JSON.parse(saved)) })
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const businessName = state.businessKind === "company"
    ? state.tradeName || state.legalName
    : state.fullName
  const documentNumber = state.businessKind === "company" ? state.cnpj : state.cpf
  const allowedCapabilities = useMemo(
    () => state.categoryLabel ? inferCapabilitiesFromCategories([{ name: state.categoryLabel }]) : [],
    [state.categoryLabel],
  )

  function update(partial: Partial<WizardState>) {
    setState((current) => ({ ...current, ...partial }))
  }

  function selectCategory(type: (typeof businessTypes)[number]) {
    const capabilities = inferCapabilitiesFromCategories([{ name: type.label }])
    update({ categorySlug: type.slug, categoryLabel: type.label, capabilities })
  }

  function toggleCapability(capability: CapabilityId) {
    if (!allowedCapabilities.includes(capability)) return
    update({
      capabilities: state.capabilities.includes(capability)
        ? state.capabilities.filter((id) => id !== capability)
        : [...state.capabilities, capability],
    })
  }

  function toggleServiceCity(city: string) {
    update({
      serviceArea: state.serviceArea.includes(city)
        ? state.serviceArea.filter((item) => item !== city)
        : [...state.serviceArea, city],
      city: state.city || city,
    })
  }

  async function lookupCnpj() {
    const cleanCnpj = digits(state.cnpj)
    if (cleanCnpj.length !== 14) {
      setLookupStatus("error")
      return
    }
    setLookupStatus("loading")
    try {
      const response = await fetch(`/api/cnpj/${cleanCnpj}`)
      if (!response.ok) throw new Error("lookup_failed")
      const data = await response.json()
      update({
        legalName: data.legalName,
        tradeName: data.tradeName || data.legalName,
        postalCode: data.postalCode,
        city: data.city,
        stateCode: data.stateCode || "SP",
        neighborhood: data.neighborhood,
        addressLine: data.addressLine,
      })
      setLookupStatus("success")
    } catch {
      setLookupStatus("error")
    }
  }

  function canAdvance() {
    if (step === 0) {
      if (state.businessKind === "individual") return isValidCpf(state.cpf) && state.fullName.trim() && digits(state.whatsapp).length >= 10
      return digits(state.cnpj).length === 14 && (state.legalName.trim() || state.tradeName.trim())
    }
    if (step === 1) return Boolean(state.categorySlug)
    if (step === 2) return state.capabilities.every((capability) => allowedCapabilities.includes(capability))
    if (step === 3) return state.description.trim().length > 0 && digits(state.whatsapp).length >= 10
    if (step === 4) return state.locationMode === "physical"
      ? Boolean(state.postalCode && state.addressLine && state.city && state.neighborhood)
      : state.serviceArea.length > 0
    return true
  }

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-24 pt-28 text-white md:px-8 md:pt-32">
      <form action={createBusinessAction} className="mx-auto max-w-6xl">
        <input type="hidden" name="business_kind" value={state.businessKind} />
        <input type="hidden" name="document_number" value={documentNumber} />
        <input type="hidden" name="name" value={businessName} />
        <input type="hidden" name="category_slug" value={state.categorySlug} />
        <input type="hidden" name="description" value={state.description} />
        <input type="hidden" name="whatsapp" value={state.whatsapp} />
        <input type="hidden" name="phone" value={state.phone} />
        <input type="hidden" name="instagram" value={state.instagram} />
        <input type="hidden" name="website" value={state.website} />
        <input type="hidden" name="postal_code" value={state.postalCode} />
        <input type="hidden" name="address_line" value={state.addressLine || "Atendimento por area"} />
        <input type="hidden" name="city" value={state.city || state.serviceArea[0] || ""} />
        <input type="hidden" name="state_code" value={state.stateCode || "SP"} />
        <input type="hidden" name="neighborhood" value={state.neighborhood || "Nao informado"} />
        {state.serviceArea.map((city) => <input key={city} type="hidden" name="service_area" value={city} />)}
        {state.capabilities.map((capability) => <input key={capability} type="hidden" name="capabilities" value={capability} />)}

        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Business Onboarding V2</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">Cadastre seu negocio com dados melhores.</h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/58">
              Um wizard guiado para empresas, MEIs e profissionais autonomos da economia local.
            </p>
          </div>
          <div className="min-w-[260px]">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-white/40">Etapa {step + 1} de {steps.length}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-[#FF6B00]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {error && <p className="mt-6 rounded-[8px] border border-red-300/20 bg-red-400/10 p-4 text-sm font-bold text-red-100">{error}</p>}

        <div className="mt-6 grid gap-2 md:grid-cols-6">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => setStep(index)}
              className={`min-h-12 rounded-[8px] border px-3 text-xs font-black ${index === step ? "border-[#FF6B00] bg-[#FF6B00]/16 text-white" : "border-white/10 bg-white/6 text-white/46"}`}>
              {index + 1}. {label}
            </button>
          ))}
        </div>

        <section className="mt-8 rounded-[8px] border border-white/10 bg-white/6 p-5 md:p-7">
          {step === 0 && (
            <div className="grid gap-6">
              <h2 className="text-2xl font-black">Como deseja cadastrar seu negocio?</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { kind: "individual" as const, label: "Sou Profissional Autonomo", icon: UserRound },
                  { kind: "company" as const, label: "Tenho CNPJ", icon: Building2 },
                ].map(({ kind, label, icon: Icon }) => (
                  <button key={kind} type="button" onClick={() => update({ businessKind: kind })}
                    className={`flex min-h-20 items-center gap-3 rounded-[8px] border p-4 text-left ${state.businessKind === kind ? "border-[#FF6B00] bg-[#FF6B00]/14" : "border-white/10 bg-white/6"}`}>
                    <Icon className="size-5 text-[#FF6B00]" />
                    <span className="font-black">{label}</span>
                  </button>
                ))}
              </div>
              {state.businessKind === "individual" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="CPF" value={state.cpf} onChange={(cpf) => update({ cpf })} />
                  <Input label="Nome Completo" value={state.fullName} onChange={(fullName) => update({ fullName })} />
                  <Input label="WhatsApp" value={state.whatsapp} onChange={(whatsapp) => update({ whatsapp })} />
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <Input label="CNPJ" value={state.cnpj} onChange={(cnpj) => update({ cnpj })} />
                    <button type="button" onClick={lookupCnpj} className="mt-6 flex h-14 items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-sm font-black text-neutral-950">
                      <Search className="size-4 text-[#FF6B00]" /> Consultar CNPJ
                    </button>
                  </div>
                  {lookupStatus === "success" && <p className="text-sm font-bold text-emerald-200">CNPJ encontrado. Revise os dados preenchidos.</p>}
                  {lookupStatus === "error" && <p className="text-sm font-bold text-orange-100">Nao foi possivel consultar. Voce pode preencher manualmente.</p>}
                  {lookupStatus === "loading" && <p className="text-sm font-bold text-white/50">Consultando BrasilAPI...</p>}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input label="Razao Social" value={state.legalName} onChange={(legalName) => update({ legalName })} />
                    <Input label="Nome Fantasia" value={state.tradeName} onChange={(tradeName) => update({ tradeName })} />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black">Categoria principal</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {businessTypes.map((type) => {
                  const selected = state.categorySlug === type.slug
                  return (
                    <button key={type.slug} type="button" onClick={() => selectCategory(type)}
                      className={`flex min-h-20 items-center gap-3 rounded-[8px] border p-4 text-left ${selected ? "border-[#FF6B00] bg-[#FF6B00]/14" : "border-white/10 bg-white/6"}`}>
                      {selected ? <Check className="size-5 text-[#FF6B00]" /> : <BriefcaseBusiness className="size-5 text-white/50" />}
                      <span className="font-black">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3"><Sparkles className="size-5 text-[#FF6B00]" /><h2 className="text-2xl font-black">Capacidades automaticas</h2></div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {allowedCapabilities.map((capabilityId) => {
                  const capability = capabilityCatalog[capabilityId]
                  const enabled = state.capabilities.includes(capabilityId)
                  return (
                    <article key={capability.id} className="rounded-[8px] border border-white/10 bg-[#090B10]/40 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <BadgeCheck className={`size-5 ${enabled ? "text-[#FF6B00]" : "text-white/28"}`} />
                        <button type="button" role="switch" aria-checked={enabled} onClick={() => toggleCapability(capabilityId)}
                          className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-[#FF6B00]" : "bg-white/14"}`}>
                          <span className={`absolute top-1 size-5 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} />
                        </button>
                      </div>
                      <h3 className="mt-3 text-lg font-black">{capability.name}</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-white/54">{capability.description}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              <h2 className="text-2xl font-black">Dados publicos</h2>
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/48">Descricao<textarea value={state.description} onChange={(event) => update({ description: event.target.value })} className="min-h-28 rounded-[8px] bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-neutral-950 outline-none" /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="WhatsApp" value={state.whatsapp} onChange={(whatsapp) => update({ whatsapp })} />
                <Input label="Telefone" value={state.phone} onChange={(phone) => update({ phone })} />
                <Input label="Instagram" value={state.instagram} onChange={(instagram) => update({ instagram })} />
                <Input label="Website" value={state.website} onChange={(website) => update({ website })} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-5">
              <h2 className="text-2xl font-black">Localizacao</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[{ value: "physical" as const, label: "Negocio fisico" }, { value: "service_area" as const, label: "Prestador de servico" }].map((mode) => (
                  <button key={mode.value} type="button" onClick={() => update({ locationMode: mode.value })}
                    className={`flex h-14 items-center gap-3 rounded-[8px] border px-4 text-sm font-black ${state.locationMode === mode.value ? "border-[#FF6B00] bg-[#FF6B00]/14" : "border-white/10 bg-white/6"}`}>
                    <MapPin className="size-4 text-[#FF6B00]" /> {mode.label}
                  </button>
                ))}
              </div>
              {state.locationMode === "physical" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="CEP" value={state.postalCode} onChange={(postalCode) => update({ postalCode })} />
                  <Input label="Endereco" value={state.addressLine} onChange={(addressLine) => update({ addressLine })} />
                  <Input label="Cidade" value={state.city} onChange={(city) => update({ city })} />
                  <Input label="Bairro" value={state.neighborhood} onChange={(neighborhood) => update({ neighborhood })} />
                  <Input label="Estado" value={state.stateCode} onChange={(stateCode) => update({ stateCode })} />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {serviceCities.map((city) => (
                    <button key={city} type="button" onClick={() => toggleServiceCity(city)}
                      className={`min-h-14 rounded-[8px] border px-4 text-sm font-black ${state.serviceArea.includes(city) ? "border-[#FF6B00] bg-[#FF6B00]/14" : "border-white/10 bg-white/6"}`}>
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-5">
              <div className="flex items-center gap-3"><ShieldCheck className="size-6 text-[#FF6B00]" /><h2 className="text-2xl font-black">Revisao e Publicacao</h2></div>
              <div className="grid gap-3 md:grid-cols-2">
                <Review label="Nome" value={businessName || "Pendente"} />
                <Review label="Categoria" value={state.categoryLabel || "Pendente"} />
                <Review label="Capacidades" value={state.capabilities.map((id) => capabilityCatalog[id].name).join(", ") || "Nenhuma"} />
                <Review label="Cidade" value={state.city || state.serviceArea.join(", ") || "Pendente"} />
                <Review label="Contato" value={state.whatsapp || "Pendente"} />
                <Review label="Trust Level" value="0 - Nao Verificado" />
              </div>
              <SubmitButton disabled={!canAdvance()} pendingLabel="Publicando..." className="flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#FF6B00] text-sm font-black text-white disabled:opacity-40 md:w-fit md:px-8">
                Publicar Negocio
                <ArrowRight className="size-4" />
              </SubmitButton>
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-5 text-sm font-black text-white/70 disabled:opacity-30">
            <ArrowLeft className="size-4" /> Anterior
          </button>
          {step < steps.length - 1 && (
            <button type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))} disabled={!canAdvance()}
              className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#FF6B00] px-5 text-sm font-black text-white disabled:opacity-35">
              Proximo <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </form>
    </main>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/48">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-14 rounded-[8px] bg-white px-4 text-sm font-bold normal-case tracking-normal text-neutral-950 outline-none" />
    </label>
  )
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-[#090B10]/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-white/38">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  )
}
