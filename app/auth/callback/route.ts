import { NextResponse } from "next/server"

import { exchangeAuthCode } from "@/src/application/auth-commands"
import { recordAuthEvent } from "@/src/application/auth-telemetry"

function withLoginEvent(path: string) {
  if (path.includes("auth=")) return path
  return `${path}${path.includes("?") ? "&" : "?"}auth=login`
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const requestedNext = url.searchParams.get("next") ?? "/minha-conta"
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/minha-conta"

  if (code) {
    const { error } = await exchangeAuthCode(code)
    if (!error) {
      recordAuthEvent("login_success", { provider: "oauth_or_magic_link" })
      return NextResponse.redirect(new URL(withLoginEvent(next), url.origin))
    }
  }

  recordAuthEvent("login_failed", { provider: "oauth_or_magic_link" })
  return NextResponse.redirect(new URL("/entrar?error=Falha%20ao%20confirmar%20acesso", url.origin))
}
