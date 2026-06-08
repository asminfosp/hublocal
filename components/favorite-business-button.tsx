import { Heart } from "lucide-react"

import { toggleFavoriteAction } from "@/app/auth/actions"
import { SubmitButton } from "@/components/submit-button"

export function FavoriteBusinessButton({ businessId, slug, active }: { businessId: string; slug: string; active: boolean }) {
  return (
    <form action={toggleFavoriteAction}>
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton pendingLabel="Salvando..." className={`flex h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-black ring-1 transition hover:-translate-y-0.5 disabled:opacity-60 ${active ? "bg-[#FF6B00] text-white ring-[#FF6B00]" : "bg-white/8 text-white ring-white/12 hover:bg-white/14"}`}>
        <Heart className={`size-4 ${active ? "fill-white" : "text-[#FF6B00]"}`} />
        {active ? "Favoritado" : "Favoritar"}
      </SubmitButton>
    </form>
  )
}
