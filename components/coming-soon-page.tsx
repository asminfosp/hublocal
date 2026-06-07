import Link from "next/link"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"

type ComingSoonPageProps = {
  eyebrow: string
  title: string
  description: string
}

export function ComingSoonPage({ eyebrow, title, description }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-[#090B10] px-4 pb-16 pt-28 text-white md:px-8 md:pt-36">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,107,0,0.18)_0%,transparent_30%),linear-gradient(180deg,#090B10_0%,#11141D_60%,#090B10_100%)]" />
      <main className="relative mx-auto flex min-h-[70vh] max-w-4xl items-center">
        <section className="w-full rounded-[34px] border border-white/10 bg-white/7 p-6 shadow-[0_32px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00]/14 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 ring-1 ring-[#FF6B00]/24">
            <Sparkles className="size-4 text-[#FF6B00]" />
            {eyebrow}
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-none md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/62 md:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#FF6B00] px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(255,107,0,0.24)]"
            >
              <ArrowLeft className="size-4" />
              Voltar ao inicio
            </Link>
            <Link
              href="/buscar"
              className="flex h-12 items-center justify-center gap-2 rounded-[20px] bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/10"
            >
              Explorar empresas
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
