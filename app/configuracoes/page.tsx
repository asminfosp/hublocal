import { Bell, LockKeyhole, Settings } from "lucide-react"

import { requireAuth } from "@/src/application/auth"

export default async function SettingsPage() {
  await requireAuth("/configuracoes")

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Minha Conta</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">Configuracoes</h1>
        <div className="mt-8 divide-y divide-white/10 rounded-[8px] border border-white/10 bg-white/6">
          <section className="flex items-start gap-4 p-5"><Settings className="size-5 shrink-0 text-[#FF6B00]" /><div><h2 className="font-black">Preferencias</h2><p className="mt-1 text-sm font-medium text-white/48">Configuracoes gerais da experiencia Hub Local.</p></div></section>
          <section className="flex items-start gap-4 p-5"><Bell className="size-5 shrink-0 text-[#FF6B00]" /><div><h2 className="font-black">Notificacoes</h2><p className="mt-1 text-sm font-medium text-white/48">Controles de comunicacao serao habilitados por capacidade.</p></div></section>
          <section className="flex items-start gap-4 p-5"><LockKeyhole className="size-5 shrink-0 text-[#FF6B00]" /><div><h2 className="font-black">Seguranca</h2><p className="mt-1 text-sm font-medium text-white/48">Identidade protegida pelo Supabase Auth.</p></div></section>
        </div>
      </div>
    </main>
  )
}
