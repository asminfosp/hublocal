import Link from "next/link"
import { Heart, Search } from "lucide-react"

import { requireAuth } from "@/src/application/auth"
import { listCurrentUserFavorites } from "@/src/application/favorites"

export default async function FavoritesPage() {
  await requireAuth("/favoritos")
  const favorites = await listCurrentUserFavorites()

  return (
    <main className="min-h-screen bg-[#090B10] px-4 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Minha Conta</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">Favoritos</h1>
        {favorites.length ? (
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {favorites.map((business: any) => (
              <Link key={business.id} href={`/empresa/${business.slug}`} className="rounded-[8px] border border-white/10 bg-white/6 p-5 hover:border-[#FF6B00]/50">
                <Heart className="size-5 fill-[#FF6B00] text-[#FF6B00]" />
                <h2 className="mt-4 text-xl font-black">{business.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-white/48">{business.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-[8px] border border-dashed border-white/16 p-8 text-center">
            <Heart className="mx-auto size-8 text-[#FF6B00]" />
            <h2 className="mt-4 text-2xl font-black">Nenhuma empresa salva ainda.</h2>
            <Link href="/buscar" className="mx-auto mt-6 flex h-12 w-fit items-center gap-2 rounded-[8px] bg-[#FF6B00] px-5 text-sm font-black"><Search className="size-4" /> Buscar empresas</Link>
          </section>
        )}
      </div>
    </main>
  )
}
