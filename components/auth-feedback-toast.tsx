"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

const messages: Record<string, string> = {
  login: "Bem-vindo ao Hub Local.",
  logout: "Sessao encerrada.",
  signup: "Conta criada com sucesso.",
  reset: "Enviamos um link para redefinir sua senha.",
}

export function AuthFeedbackToast() {
  const searchParams = useSearchParams()
  const authEvent = searchParams.get("auth")
  const message = useMemo(() => (authEvent ? messages[authEvent] : null), [authEvent])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 3800)
    return () => window.clearTimeout(timer)
  }, [message])

  if (!message || !visible) return null

  return (
    <div role="status" className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-[8px] border border-emerald-300/20 bg-[#11141D] p-4 text-sm font-black text-white shadow-[0_22px_70px_rgba(0,0,0,0.42)]">
      <CheckCircle2 className="size-5 shrink-0 text-emerald-300" />
      {message}
    </div>
  )
}
