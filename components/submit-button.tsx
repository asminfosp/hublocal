"use client"

import { LoaderCircle } from "lucide-react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  pendingLabel = "Carregando...",
  className,
  disabled = false,
}: {
  children: React.ReactNode
  pendingLabel?: string
  className: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending || disabled} className={className}>
      {pending && <LoaderCircle className="size-4 animate-spin" />}
      {pending ? pendingLabel : children}
    </button>
  )
}
