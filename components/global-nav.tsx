"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Building2,
  Compass,
  Heart,
  Home,
  LogIn,
  Menu,
  Search,
  Sparkles,
  Store,
  User,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react"

const desktopNav = [
  { label: "Explorar", href: "/", active: true },
  { label: "Categorias", href: "/buscar" },
  { label: "Empresas", href: "/buscar?filter=verified" },
  { label: "Servicos", href: "/buscar?category=Servicos" },
]

type MobileNavItem =
  | { icon: LucideIcon; label: string; href: string; future?: false }
  | { icon: LucideIcon; label: string; future: true }

const mobileNav: MobileNavItem[] = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Compass, label: "Categorias", href: "/buscar" },
  { icon: Building2, label: "Empresas", href: "/buscar?filter=verified" },
  { icon: Heart, label: "Favoritos", future: true },
  { icon: User, label: "Perfil", future: true },
]

function LogoMark() {
  return (
    <span className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-[18px] bg-[#FF6B00] text-xl font-black text-white shadow-[0_16px_36px_rgba(255,107,0,0.32)]">
        H
      </span>
      <span className="hidden text-sm font-black uppercase tracking-[0.18em] text-white sm:block">
        Hub Local
      </span>
    </span>
  )
}

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] border-b border-white/10 bg-[#090B10]/86 text-white shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
        <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/" aria-label="Hub Local" className="shrink-0">
            <LogoMark />
          </Link>

          <div className="hidden items-center gap-1 rounded-full bg-white/7 p-1 ring-1 ring-white/10 lg:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-black transition hover:bg-white/10 hover:text-white ${
                  item.active ? "bg-white/10 text-white" : "text-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/buscar"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-white/8 px-4 text-sm font-black text-white/76 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              <Search className="size-4 text-[#FF6B00]" />
              Buscar
            </Link>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#FF6B00]/16 px-4 text-sm font-black text-orange-100 ring-1 ring-[#FF6B00]/24"
              title="Disponivel na proxima camada"
            >
              <Store className="size-4" />
              Cadastrar Empresa
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5"
              title="Disponivel na proxima camada"
            >
              <LogIn className="size-4" />
              Entrar
            </button>
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            className="flex size-11 items-center justify-center rounded-[18px] bg-white/8 text-white ring-1 ring-white/10 md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-[80] bg-black/72 text-white backdrop-blur-sm md:hidden">
          <aside className="ml-auto flex h-full w-[86%] max-w-sm flex-col border-l border-white/10 bg-[#090B10] p-4 shadow-[0_0_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between">
              <LogoMark />
              <button
                type="button"
                aria-label="Fechar menu"
                className="flex size-11 items-center justify-center rounded-[18px] bg-white/8 ring-1 ring-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-2">
              {mobileNav.map((item) => {
                const Icon = item.icon
                if (item.future) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex h-14 items-center justify-between rounded-[22px] bg-white/6 px-4 text-left text-sm font-black text-white/44 ring-1 ring-white/8"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-5 text-white/34" />
                        {item.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-white/28">
                        Futuro
                      </span>
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex h-14 items-center gap-3 rounded-[22px] bg-white/8 px-4 text-sm font-black text-white ring-1 ring-white/10 transition active:scale-[0.99]"
                  >
                    <Icon className="size-5 text-[#FF6B00]" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="mt-auto rounded-[28px] border border-white/10 bg-white/7 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#FF6B00]">
                <Sparkles className="size-4" />
                Hub Local Premium
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-white/58">
                A melhor porta de entrada para a economia local.
              </p>
              <button
                type="button"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF6B00] text-sm font-black text-white"
              >
                <Wrench className="size-4" />
                Cadastrar Empresa
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
