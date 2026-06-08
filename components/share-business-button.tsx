"use client"

import { Share2 } from "lucide-react"

export function ShareBusinessButton({ title }: { title: string }) {
  async function share() {
    const data = { title, text: `Conheca ${title} no Hub Local`, url: window.location.href }
    if (navigator.share) await navigator.share(data)
    else await navigator.clipboard.writeText(window.location.href)
  }

  return (
    <button type="button" onClick={share} className="flex h-11 items-center justify-center gap-2 rounded-full bg-white/8 px-4 text-xs font-black text-white ring-1 ring-white/12 transition hover:bg-white/14">
      <Share2 className="size-4 text-[#FF6B00]" />
      Compartilhar
    </button>
  )
}
