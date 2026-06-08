import { KeyRound, Mail } from "lucide-react"

import { recoverAccessAction, updatePasswordAction } from "@/app/auth/actions"
import { SubmitButton } from "@/components/submit-button"
import { getCurrentUserProfile } from "@/src/application/auth"

type RecoveryPageProps = {
  searchParams?: Promise<{ sent?: string; email?: string; error?: string; recovery?: string }>
}

export default async function RecoveryPage({ searchParams }: RecoveryPageProps) {
  const params = (await searchParams) ?? {}
  const profile = await getCurrentUserProfile()
  const canReset = Boolean(params.recovery && profile)

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-20 pt-28 text-white md:px-8 md:pt-36">
      <section className="mx-auto max-w-lg rounded-[8px] border border-white/10 bg-white/7 p-6 md:p-8">
        <KeyRound className="size-8 text-[#FF6B00]" />
        <h1 className="mt-4 text-4xl font-black">{canReset ? "Definir nova senha" : "Recuperar acesso"}</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-white/56">{canReset ? "Escolha uma nova senha segura para sua conta." : "Enviaremos um link magico para redefinir sua senha."}</p>
        {params.sent && <p className="mt-5 rounded-[8px] bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">Enviamos um link para redefinir sua senha.</p>}
        {params.error && <p className="mt-5 rounded-[8px] bg-red-400/10 p-4 text-sm font-bold text-red-100">{params.error}</p>}
        {canReset ? (
          <form action={updatePasswordAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-xs font-black uppercase text-white/48">Nova senha<input name="password" type="password" minLength={8} required className="h-12 rounded-[8px] bg-white px-4 text-sm font-bold normal-case text-neutral-950 outline-none" /></label>
            <label className="grid gap-2 text-xs font-black uppercase text-white/48">Confirmar senha<input name="password_confirmation" type="password" minLength={8} required className="h-12 rounded-[8px] bg-white px-4 text-sm font-bold normal-case text-neutral-950 outline-none" /></label>
            <SubmitButton pendingLabel="Atualizando..." className="flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B00] text-sm font-black text-white">Redefinir senha</SubmitButton>
          </form>
        ) : (
          <form action={recoverAccessAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-xs font-black uppercase text-white/48">Email<div className="flex h-12 items-center gap-2 rounded-[8px] bg-white px-4 text-neutral-950"><Mail className="size-4 text-[#FF6B00]" /><input name="email" type="email" required className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold normal-case outline-none" /></div></label>
            <SubmitButton pendingLabel="Enviando..." className="flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B00] text-sm font-black text-white">Enviar link magico</SubmitButton>
          </form>
        )}
      </section>
    </main>
  )
}
