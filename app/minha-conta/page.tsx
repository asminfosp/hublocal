import Link from "next/link"
import { Building2, CalendarDays, Heart, Mail, Settings, ShieldCheck, User } from "lucide-react"

import { requireAuth } from "@/src/application/auth"
import { listCurrentUserBusinesses } from "@/src/application/ownership"

export default async function MyAccountPage() {
  const profile = await requireAuth("/minha-conta")
  const businesses = await listCurrentUserBusinesses()
  const joinedAt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(profile.createdAt))

  const sections = [
    { href: "/perfil", icon: User, title: "Perfil", description: "Nome, email, avatar e cidade." },
    { href: "/favoritos", icon: Heart, title: "Favoritos", description: "Empresas que voce salvou." },
    { href: "/meus-negocios", icon: Building2, title: "Meus Negocios", description: `${businesses.length} negocio(s) sob sua gestao.` },
    { href: "/configuracoes", icon: Settings, title: "Configuracoes", description: "Preferencias da sua conta." },
  ]

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <section className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#FF6B00] text-3xl font-black">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-full object-cover" /> : profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Minha Conta</p>
            <h1 className="mt-2 truncate text-4xl font-black">{profile.displayName}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/50"><Mail className="size-4" /> {profile.email}</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/50"><CalendarDays className="size-4" /> Membro desde {joinedAt}</p>
          </div>
          <div className="grid w-fit gap-2 md:ml-auto">
            <span className="flex items-center gap-2 rounded-[8px] border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-100">
              <ShieldCheck className="size-4" /> Identidade verificada
            </span>
            <span className="flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/6 px-3 py-2 text-xs font-black text-white/70">
              <Building2 className="size-4 text-[#FF6B00]" /> {businesses.length} empresas vinculadas
            </span>
          </div>
        </section>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {sections.map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href} className="flex items-start gap-4 rounded-[8px] border border-white/10 bg-white/6 p-5 transition hover:border-[#FF6B00]/50 hover:bg-white/9">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-[#FF6B00]/16 text-[#FF6B00]"><Icon className="size-5" /></span>
              <span><strong className="text-lg font-black">{title}</strong><span className="mt-1 block text-sm font-medium text-white/48">{description}</span></span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
