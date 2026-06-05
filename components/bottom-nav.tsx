"use client"

import Link from "next/link"
import { Compass, Home, MapPin, Search } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Buscar", href: "/buscar" },
  { icon: MapPin, label: "Proximos", href: "/buscar?filter=nearby" },
  { icon: Compass, label: "Abertos", href: "/buscar?filter=open" },
]

interface BottomNavProps {
  activeIndex?: number
}

export function BottomNav({ activeIndex = 0 }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-neutral-950/92 px-3 pb-3 pt-2 text-white shadow-[0_-18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 gap-1 rounded-[24px] bg-white/7 p-1 ring-1 ring-white/10 md:max-w-3xl">
        {navItems.map((item, index) => {
          const isActive = activeIndex === index
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-[20px] text-[11px] font-bold transition active:scale-95 ${
                isActive
                  ? "bg-[#FF6B00] text-white shadow-[0_10px_24px_rgba(255,107,0,0.28)]"
                  : "text-white/62 hover:bg-white/8 hover:text-white"
              }`}
            >
              <item.icon className="size-5" strokeWidth={isActive ? 2.6 : 2.1} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
