import Link from "next/link"
import { Globe2, LockKeyhole, Mail, UserPlus } from "lucide-react"

import { signInWithGoogleAction, signUpWithEmailAction } from "@/app/auth/actions"
import { SubmitButton } from "@/components/submit-button"

type SignUpPageProps = {
  searchParams?: Promise<{ sent?: string; email?: string; error?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = (await searchParams) ?? {}

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-20 pt-28 text-white md:px-8 md:pt-36">
      <section className="mx-auto max-w-xl rounded-[8px] border border-white/10 bg-white/7 p-5 shadow-[0_32px_110px_rgba(0,0,0,0.42)] md:p-8">
        <UserPlus className="size-8 text-[#FF6B00]" />
        <h1 className="mt-4 text-4xl font-black">Criar Conta Hub Local</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-white/56">Sua identidade conecta favoritos, negocios e gestao oficial.</p>

        {params.sent && <p className="mt-5 rounded-[8px] bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">Confirme o cadastro pelo email enviado para {params.email}.</p>}
        {params.error && <p className="mt-5 rounded-[8px] bg-red-400/10 p-4 text-sm font-bold text-red-100">{params.error}</p>}

        <form action={signUpWithEmailAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-xs font-black uppercase text-white/48">Nome<input name="name" required className="h-12 rounded-[8px] bg-white px-4 text-sm font-bold normal-case text-neutral-950 outline-none" /></label>
          <label className="grid gap-2 text-xs font-black uppercase text-white/48">Email<div className="flex h-12 items-center gap-2 rounded-[8px] bg-white px-4 text-neutral-950"><Mail className="size-4 text-[#FF6B00]" /><input name="email" type="email" required className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold normal-case outline-none" /></div></label>
          <label className="grid gap-2 text-xs font-black uppercase text-white/48">Senha<div className="flex h-12 items-center gap-2 rounded-[8px] bg-white px-4 text-neutral-950"><LockKeyhole className="size-4 text-[#FF6B00]" /><input name="password" type="password" minLength={8} required className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold normal-case outline-none" /></div></label>
          <label className="grid gap-2 text-xs font-black uppercase text-white/48">Confirmar senha<input name="password_confirmation" type="password" minLength={8} required className="h-12 rounded-[8px] bg-white px-4 text-sm font-bold normal-case text-neutral-950 outline-none" /></label>
          <SubmitButton pendingLabel="Criando conta..." className="flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B00] text-sm font-black text-white">Criar Conta</SubmitButton>
        </form>

        <form action={signInWithGoogleAction} className="mt-3">
          <input type="hidden" name="next" value="/minha-conta" />
          <SubmitButton pendingLabel="Conectando..." className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-white text-sm font-black text-neutral-950"><Globe2 className="size-4 text-[#FF6B00]" />Continuar com Google</SubmitButton>
        </form>
        <p className="mt-5 text-center text-sm font-bold text-white/48">Ja possui conta? <Link href="/entrar" className="text-[#FF6B00]">Entrar</Link></p>
      </section>
    </main>
  )
}
