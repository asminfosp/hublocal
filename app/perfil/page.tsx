import { CalendarDays, Heart, Mail, MapPin, ShieldCheck, User } from "lucide-react"

import { updateProfileAction } from "@/app/auth/actions"
import { SubmitButton } from "@/components/submit-button"
import { requireAuth } from "@/src/application/auth"

type ProfilePageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const profile = await requireAuth("/perfil")
  const params = (await searchParams) ?? {}
  const joinedAt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(profile.createdAt))

  return (
    <div className="min-h-screen bg-[#090B10] px-4 pb-20 pt-28 text-white md:px-8 md:pt-36">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,107,0,0.16)_0%,transparent_30%),linear-gradient(180deg,#090B10_0%,#11141D_60%,#090B10_100%)]" />
      <main className="relative mx-auto grid max-w-5xl gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[34px] border border-white/10 bg-[#11141D] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.32)]">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-[32px] bg-[#FF6B00] text-4xl font-black shadow-[0_18px_42px_rgba(255,107,0,0.3)]">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-full object-cover" /> : profile.displayName.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-5 text-3xl font-black">{profile.displayName}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/52"><Mail className="size-4 text-[#FF6B00]" />{profile.email}</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/52"><CalendarDays className="size-4 text-[#FF6B00]" />Desde {joinedAt}</p>
          <div className="mt-6 flex items-center gap-2 rounded-[22px] bg-emerald-400/10 p-3 text-sm font-black text-emerald-100 ring-1 ring-emerald-300/18">
            <ShieldCheck className="size-5" />
            Conta identificada
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-[34px] border border-white/10 bg-white/7 p-5 backdrop-blur-xl md:p-7">
            <div className="flex items-center gap-3">
              <User className="size-6 text-[#FF6B00]" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#FF6B00]">Meu perfil</p>
                <h2 className="mt-1 text-3xl font-black">Sua presenca no Hub.</h2>
              </div>
            </div>
            {params.saved && <p className="mt-5 rounded-[20px] bg-emerald-400/10 p-3 text-sm font-bold text-emerald-100 ring-1 ring-emerald-300/18">Perfil atualizado.</p>}
            {params.error && <p className="mt-5 rounded-[20px] bg-red-400/10 p-3 text-sm font-bold text-red-100 ring-1 ring-red-300/18">{params.error}</p>}
            <form action={updateProfileAction} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/48">
                Nome
                <input name="display_name" defaultValue={profile.displayName} required className="h-14 rounded-[22px] bg-white px-4 text-sm font-bold normal-case tracking-normal text-neutral-950 outline-none" />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/48">
                Cidade
                <div className="flex h-14 items-center gap-2 rounded-[22px] bg-white px-4 text-neutral-950">
                  <MapPin className="size-5 text-[#FF6B00]" />
                  <input name="city" defaultValue={profile.city} placeholder="Sua cidade" className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold normal-case tracking-normal outline-none" />
                </div>
              </label>
              <SubmitButton pendingLabel="Salvando..." className="flex h-14 items-center justify-center gap-2 rounded-[22px] bg-[#FF6B00] text-sm font-black text-white shadow-[0_16px_34px_rgba(255,107,0,0.26)] disabled:opacity-60">Salvar perfil</SubmitButton>
            </form>
          </section>

          <section id="favoritos" className="rounded-[34px] border border-white/10 bg-[#11141D] p-5 md:p-7">
            <div className="flex items-center gap-3">
              <Heart className="size-6 text-[#FF6B00]" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#FF6B00]">Favoritos</p>
                <h2 className="mt-1 text-2xl font-black">Sua base pessoal esta ativa.</h2>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/56">
              Negocios favoritados ja podem ser persistidos. A experiencia completa de favoritos chega na Sprint 5.2.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
