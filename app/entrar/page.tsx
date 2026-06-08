import Link from "next/link"
import { Globe2, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react"

import { signInWithEmailAction, signInWithGoogleAction, signInWithPasswordAction } from "@/app/auth/actions"
import { SubmitButton } from "@/components/submit-button"
import { getCurrentUserProfile } from "@/src/application/auth"
import { redirect } from "next/navigation"

type LoginPageProps = {
  searchParams?: Promise<{ next?: string; sent?: string; email?: string; error?: string; message?: string; password_updated?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const profile = await getCurrentUserProfile()
  if (profile) redirect("/minha-conta")
  const params = (await searchParams) ?? {}
  const next = params.next?.startsWith("/") ? params.next : "/minha-conta"

  return (
    <div className="min-h-screen bg-[#090B10] px-4 pb-16 pt-28 text-white md:px-8 md:pt-36">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,107,0,0.18)_0%,transparent_32%),linear-gradient(180deg,#090B10_0%,#11141D_60%,#090B10_100%)]" />
      <main className="relative mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="py-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00]/14 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 ring-1 ring-[#FF6B00]/24">
            <Sparkles className="size-4 text-[#FF6B00]" />
            Sua economia local
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-none md:text-7xl">Entre no Hub Local.</h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/62 md:text-lg">
            Guarde negocios importantes e construa uma experiencia local cada vez mais relevante.
          </p>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-white/7 p-5 shadow-[0_32px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-7">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-[20px] bg-[#FF6B00] shadow-[0_14px_34px_rgba(255,107,0,0.28)]">
              <ShieldCheck className="size-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black">Acessar Hub Local</h2>
              <p className="text-sm font-medium text-white/48">Entrada segura com criptografia de dados.</p>
            </div>
          </div>

          {params.sent && (
            <div className="mt-5 rounded-[22px] bg-emerald-400/12 p-4 text-sm font-bold text-emerald-100 ring-1 ring-emerald-300/20">
              Enviamos um link seguro para {params.email}. Abra o email para continuar.
            </div>
          )}
          {params.message && <div className="mt-5 rounded-[22px] bg-[#FF6B00]/12 p-4 text-sm font-bold text-orange-100 ring-1 ring-[#FF6B00]/20">{params.message}</div>}
          {params.password_updated && <div className="mt-5 rounded-[22px] bg-emerald-400/12 p-4 text-sm font-bold text-emerald-100 ring-1 ring-emerald-300/20">Senha atualizada. Entre novamente.</div>}
          {params.error && (
            <div className="mt-5 rounded-[22px] bg-red-400/12 p-4 text-sm font-bold text-red-100 ring-1 ring-red-300/20">
              {params.error}
            </div>
          )}

          <form action={signInWithPasswordAction} className="mt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <label className="text-xs font-black uppercase tracking-[0.12em] text-white/48" htmlFor="email">Email</label>
            <div className="flex h-14 items-center gap-3 rounded-[8px] bg-white px-4 text-neutral-950">
              <Mail className="size-5 text-[#FF6B00]" />
              <input id="email" name="email" type="email" required placeholder="voce@email.com" className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
            </div>
            <label className="text-xs font-black uppercase tracking-[0.12em] text-white/48" htmlFor="password">Senha</label>
            <div className="flex h-14 items-center gap-3 rounded-[8px] bg-white px-4 text-neutral-950">
              <LockKeyhole className="size-5 text-[#FF6B00]" />
              <input id="password" name="password" type="password" required minLength={8} className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
            </div>
            <SubmitButton pendingLabel="Entrando..." className="flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#FF6B00] text-sm font-black text-white shadow-[0_16px_34px_rgba(255,107,0,0.26)] disabled:opacity-60">
              Entrar
            </SubmitButton>
          </form>

          <form action={signInWithGoogleAction} className="mt-3">
            <input type="hidden" name="next" value={next} />
            <SubmitButton pendingLabel="Conectando..." className="flex h-14 w-full items-center justify-center gap-3 rounded-[8px] bg-white text-sm font-black text-neutral-950 transition hover:-translate-y-0.5 disabled:opacity-60">
              <Globe2 className="size-5 text-[#FF6B00]" />
              Continuar com Google
            </SubmitButton>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.12em] text-white/28">
            <span className="h-px flex-1 bg-white/10" />
            acesso sem senha
            <span className="h-px flex-1 bg-white/10" />
          </div>

          
          <form action={signInWithEmailAction}>
            <input type="hidden" name="next" value={next} />
            <label className="text-xs font-black uppercase tracking-[0.12em] text-white/48" htmlFor="magic_email">Magic Link</label>
            <div className="mt-2 flex h-14 items-center gap-3 rounded-[8px] bg-white/90 px-4 text-neutral-950">
              <Mail className="size-5 text-[#FF6B00]" />
              <input id="magic_email" name="email" type="email" required placeholder="voce@email.com" className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
            </div>
            <SubmitButton pendingLabel="Enviando link..." className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/8 text-sm font-black text-white disabled:opacity-60">
              Enviar link de acesso
            </SubmitButton>
          </form>
          
          <div className="mt-5 flex items-center justify-between gap-4 text-sm font-black">
            <Link href="/cadastro" className="text-[#FF6B00]">Criar Conta</Link>
            <Link href="/recuperar-acesso" className="text-white/56 hover:text-white">Esqueci minha senha</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
