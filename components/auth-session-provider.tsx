"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

import type { UserProfile } from "@/src/modules/identity/domain/user-profile"

type AuthSessionStatus = "loading" | "authenticated" | "unauthenticated"

type AuthSessionValue = {
  status: AuthSessionStatus
  profile: UserProfile | null
}

const AuthSessionContext = createContext<AuthSessionValue>({
  status: "loading",
  profile: null,
})

export function AuthSessionProvider({
  initialProfile,
  children,
}: {
  initialProfile: UserProfile | null
  children: React.ReactNode
}) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const value = useMemo<AuthSessionValue>(() => ({
    status: hydrated ? (initialProfile ? "authenticated" : "unauthenticated") : "loading",
    profile: initialProfile,
  }), [hydrated, initialProfile])

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

export function useAuthSession() {
  return useContext(AuthSessionContext)
}
