import Link from "next/link"
import {
  BadgeCheck,
  Clock3,
  Flame,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react"

import type { Business, TrustSignal } from "@/src/modules/businesses/domain/business"
import { formatDistance } from "@/src/shared/utils/format-distance"

const badgeConfig: Record<TrustSignal, { label: string; icon: typeof BadgeCheck; className: string }> = {
  verified: {
    label: "Empresa Verificada",
    icon: BadgeCheck,
    className: "bg-emerald-400/14 text-emerald-200 ring-emerald-300/20",
  },
  popular: {
    label: "Mais Procurado",
    icon: Flame,
    className: "bg-[#FF6B00]/18 text-orange-100 ring-[#FF6B00]/30",
  },
  top_rated: {
    label: "Melhor Avaliado",
    icon: Star,
    className: "bg-amber-300/16 text-amber-100 ring-amber-300/24",
  },
  nearby: {
    label: "Proximo de Voce",
    icon: MapPin,
    className: "bg-sky-300/14 text-sky-100 ring-sky-300/20",
  },
  open_now: {
    label: "Aberto Agora",
    icon: Clock3,
    className: "bg-emerald-400/14 text-emerald-100 ring-emerald-300/24",
  },
  featured: {
    label: "Destaque Local",
    icon: BadgeCheck,
    className: "bg-[#FF6B00]/18 text-orange-100 ring-[#FF6B00]/30",
  },
}

type BusinessCardProps = {
  business: Business
  compact?: boolean
}

export function BusinessCard({ business, compact = false }: BusinessCardProps) {
  const primarySignal = business.trustSignals[0] ?? "featured"
  const badge = badgeConfig[primarySignal]
  const BadgeIcon = badge.icon
  const rating = business.rating ?? 0
  const category = business.categories[0]?.name ?? "Negocio local"

  return (
    <article className="group h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#10131A] text-white shadow-[0_24px_80px_rgba(0,0,0,0.34)] transition duration-300 hover:-translate-y-1.5 hover:border-[#FF6B00]/35 hover:shadow-[0_34px_110px_rgba(0,0,0,0.48),0_0_34px_rgba(255,107,0,0.12)]">
      <Link href={`/empresa/${business.slug}`} className={`relative block overflow-hidden ${compact ? "h-52" : "h-64"}`}>
        <img
          src={business.media.avatar ?? business.media.cover}
          alt=""
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-black/28 to-black/10" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black shadow-sm ring-1 backdrop-blur-xl ${badge.className}`}
        >
          <BadgeIcon className="size-3.5" />
          {badge.label}
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xl font-black leading-tight text-white">{business.name}</p>
              <p className="mt-1 truncate text-sm font-bold text-white/62">{category}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#FF6B00] px-3 py-2 text-xs font-black text-white shadow-[0_12px_26px_rgba(255,107,0,0.3)]">
              <Star className="size-3.5 fill-white" />
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        {!compact && (
          <p className="line-clamp-2 text-sm font-medium leading-6 text-white/58">
            {business.description}
          </p>
        )}

        <div className={`${compact ? "" : "mt-4"} grid grid-cols-3 gap-2`}>
          <div className="rounded-[18px] bg-white/7 p-2.5 ring-1 ring-white/8">
            <p className="flex items-center gap-1 text-xs font-black text-[#FF6B00]">
              <Star className="size-3.5 fill-[#FF6B00]" />
              {rating.toFixed(1)}
            </p>
            <p className="mt-1 text-[10px] font-bold text-white/44">nota</p>
          </div>
          <div className="rounded-[18px] bg-white/7 p-2.5 ring-1 ring-white/8">
            <p className="text-xs font-black text-white">{formatDistance(business.distanceMeters)}</p>
            <p className="mt-1 text-[10px] font-bold text-white/44">distancia</p>
          </div>
          <div className="rounded-[18px] bg-white/7 p-2.5 ring-1 ring-white/8">
            <p className={`text-xs font-black ${business.hours.isOpen ? "text-emerald-300" : "text-white/54"}`}>
              {business.hours.isOpen ? "Aberto" : "Fechado"}
            </p>
            <p className="mt-1 text-[10px] font-bold text-white/44">status</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-white/48">
          <span>{business.reviewCount ?? 0} avaliacoes</span>
          <span className="text-white/20">/</span>
          <span className="flex items-center gap-1">
            <Clock3 className="size-3.5 text-[#FF6B00]" />
            {business.hours.isOpen ? `Ate ${business.hours.closingTime}` : "Abre amanha"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {business.offerings.slice(0, compact ? 2 : 3).map((offering) => (
            <span
              key={offering.id}
              className="rounded-full bg-white/7 px-2.5 py-1 text-[11px] font-black text-white/58 ring-1 ring-white/8"
            >
              {offering.name}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/${business.contact.whatsapp?.replace(/\D/g, "") ?? ""}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-[18px] bg-[#25D366] text-xs font-black text-white shadow-[0_12px_26px_rgba(37,211,102,0.22)] transition hover:-translate-y-0.5 hover:bg-[#20BD5A] active:scale-95"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <Link
            href={`/empresa/${business.slug}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-[18px] bg-white/10 text-xs font-black text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-[#FF6B00] hover:ring-[#FF6B00] active:scale-95"
          >
            <ShieldCheck className="size-4" />
            Perfil
          </Link>
        </div>
      </div>
    </article>
  )
}
