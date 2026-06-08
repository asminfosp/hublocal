import Link from "next/link"
import { ArrowLeft, ShieldAlert } from "lucide-react"

export default function ForbiddenBusiness() {
  return (
    <main className="min-h-screen bg-[#090B10] px-4 pt-36 text-white">
      <section className="mx-auto max-w-xl rounded-[8px] border border-red-300/20 bg-red-400/10 p-7">
        <ShieldAlert className="size-7 text-red-200" />
        <h1 className="mt-4 text-3xl font-black">403 Forbidden</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-red-100/70">Sua identidade nao possui ownership deste negocio.</p>
        <Link href="/meus-negocios" className="mt-6 flex w-fit items-center gap-2 text-sm font-black text-white"><ArrowLeft className="size-4" /> Meus Negocios</Link>
      </section>
    </main>
  )
}
