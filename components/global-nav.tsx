"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Building2,
  Compass,
  Heart,
  Home,
  LogIn,
  Menu,
  Route,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  User,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react"

import { signOutAction } from "@/app/auth/actions"
import { useAuthSession } from "@/components/auth-session-provider"

const desktopNav = [
  { label: "Inicio", href: "/" },
  { label: "Servicos", href: "/servicos" },
  { label: "Shop", href: "/shop" },
  { label: "Mobilidade", href: "/mobilidade" },
  { label: "Empresas", href: "/buscar?filter=verified" },
]

type MobileNavItem =
  | { icon: LucideIcon; label: string; href: string; future?: false }
  | { icon: LucideIcon; label: string; future: true }

const mobileNav: MobileNavItem[] = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Wrench, label: "Servicos", href: "/servicos" },
  { icon: ShoppingBag, label: "Shop", href: "/shop" },
  { icon: Route, label: "Mobilidade", href: "/mobilidade" },
  { icon: Compass, label: "Buscar", href: "/buscar" },
  { icon: Building2, label: "Empresas", href: "/buscar?filter=verified" },
  { icon: Heart, label: "Favoritos", future: true },
  { icon: User, label: "Minha Conta", future: true },
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

function AvatarMark({ name, image }: { name: string; image?: string }) {
  return image ? (
    <img src={image} alt="" className="size-full object-cover" />
  ) : (
    <span>{name.charAt(0).toUpperCase()}</span>
  )
}

function AccountSkeleton() {
  return (
    <div aria-label="Carregando sessao" className="flex size-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
      <span className="size-6 animate-pulse rounded-full bg-white/20" />
    </div>
  )
}

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { status, profile } = useAuthSession()
  const pathname = usePathname()
  const activeSection =
    pathname === "/"
      ? "Inicio"
      : pathname.startsWith("/empresa/")
        ? "Empresas"
        : pathname === "/buscar"
          ? "Buscar"
          : pathname === "/servicos"
            ? "Servicos"
            : pathname === "/shop"
              ? "Shop"
                : pathname === "/mobilidade"
                  ? "Mobilidade"
                  : pathname === "/perfil" || pathname === "/minha-conta"
                    ? "Minha Conta"
                : ""

  const accountMobileItems: MobileNavItem[] = profile
    ? [
        { icon: User, label: "Minha Conta", href: "/minha-conta" },
        { icon: Store, label: "Meus Negocios", href: "/meus-negocios" },
        { icon: Heart, label: "Favoritos", href: "/favoritos" },
        { icon: Settings, label: "Configuracoes", href: "/configuracoes" },
      ]
    : [
      { icon: Heart, label: "Favoritos", future: true },
        { icon: LogIn, label: "Entrar", href: "/entrar" },
      ]
  const currentMobileNav = [...mobileNav.filter((item) => item.label !== "Favoritos" && item.label !== "Minha Conta"), ...accountMobileItems]

  function isActive(label: string) {
    return activeSection === label
  }

  function isMobileActive(label: string) {
    return isActive(label)
  }

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
                aria-current={isActive(item.label) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-black transition hover:bg-white/10 hover:text-white ${
                  isActive(item.label) ? "bg-[#FF6B00] text-white shadow-[0_8px_24px_rgba(255,107,0,0.22)]" : "text-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/buscar"
              aria-current={isActive("Buscar") ? "page" : undefined}
              className={`flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-black ring-1 transition ${
                isActive("Buscar")
                  ? "bg-[#FF6B00] text-white ring-[#FF6B00] shadow-[0_8px_24px_rgba(255,107,0,0.22)]"
                  : "bg-white/8 text-white/76 ring-white/10 hover:bg-white/12 hover:text-white"
              }`}
            >
              <Search className={`size-4 ${isActive("Buscar") ? "text-white" : "text-[#FF6B00]"}`} />
              Buscar
            </Link>
            <Link
              href="/cadastrar-empresa"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#FF6B00]/16 px-4 text-sm font-black text-orange-100 ring-1 ring-[#FF6B00]/24"
            >
              <Store className="size-4" />
              Cadastrar Empresa
            </Link>
            {status === "loading" ? (
              <AccountSkeleton />
            ) : profile ? (
              <details className="group relative">
                <summary className="flex size-11 cursor-pointer list-none items-center justify-center overflow-hidden rounded-full bg-[#FF6B00] text-sm font-black text-white ring-1 ring-[#FF6B00]/50">
                  <AvatarMark name={profile.displayName} image={profile.avatarUrl} />
                </summary>
                <div className="absolute right-0 top-14 w-60 rounded-[8px] border border-white/10 bg-[#11141D] p-2 shadow-[0_22px_70px_rgba(0,0,0,0.46)]">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-black">{profile.displayName}</p>
                    <p className="truncate text-xs font-medium text-white/42">{profile.email}</p>
                  </div>
                  <Link href="/minha-conta" className="flex h-11 items-center gap-2 rounded-[8px] px-3 text-sm font-black text-white/76 hover:bg-white/8 hover:text-white"><User className="size-4 text-[#FF6B00]" />Minha Conta</Link>
                  <Link href="/meus-negocios" className="flex h-11 items-center gap-2 rounded-[8px] px-3 text-sm font-black text-white/76 hover:bg-white/8 hover:text-white"><Store className="size-4 text-[#FF6B00]" />Meus Negocios</Link>
                  <Link href="/favoritos" className="flex h-11 items-center gap-2 rounded-[8px] px-3 text-sm font-black text-white/76 hover:bg-white/8 hover:text-white"><Heart className="size-4 text-[#FF6B00]" />Favoritos</Link>
                  <Link href="/configuracoes" className="flex h-11 items-center gap-2 rounded-[8px] px-3 text-sm font-black text-white/76 hover:bg-white/8 hover:text-white"><Settings className="size-4 text-[#FF6B00]" />Configuracoes</Link>
                  <form action={signOutAction}><button className="flex h-11 w-full items-center gap-2 rounded-[8px] px-3 text-sm font-black text-white/76 hover:bg-white/8 hover:text-white"><LogIn className="size-4 rotate-180 text-[#FF6B00]" />Sair</button></form>
                </div>
              </details>
            ) : (
              <Link href="/entrar" className="flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5">
                <LogIn className="size-4" />
                Entrar
              </Link>
            )}
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
              {currentMobileNav.map((item) => {
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
                    aria-current={isMobileActive(item.label) ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`flex h-14 items-center gap-3 rounded-[22px] px-4 text-sm font-black text-white ring-1 transition active:scale-[0.99] ${
                      isMobileActive(item.label)
                        ? "bg-[#FF6B00] ring-[#FF6B00]"
                        : "bg-white/8 ring-white/10"
                    }`}
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
              <Link
                href="/cadastrar-empresa"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF6B00] text-sm font-black text-white"
              >
                <Wrench className="size-4" />
                Cadastrar Empresa
              </Link>
              {status === "loading" ? (
                <div className="mt-4 flex h-12 w-full items-center justify-center rounded-[20px] bg-white/8 text-sm font-black text-white/40 ring-1 ring-white/10">
                  Carregando sessao
                </div>
              ) : profile && (
                <form action={signOutAction}>
                  <button className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[20px] bg-white/8 text-sm font-black text-white ring-1 ring-white/10">
                    <LogIn className="size-4 rotate-180 text-[#FF6B00]" />
                    Sair
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
