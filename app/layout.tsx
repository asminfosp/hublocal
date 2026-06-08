import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"

import { AuthFeedbackToast } from "@/components/auth-feedback-toast"
import { AuthSessionProvider } from "@/components/auth-session-provider"
import { GlobalNav } from "@/components/global-nav"
import { getCurrentUserProfile } from "@/src/application/auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "HUB LOCAL - Descubra negocios locais",
  description:
    "Plataforma premium de descoberta local. Encontre os melhores negocios, produtos e servicos perto de voce.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getCurrentUserProfile()

  return (
    <html lang="pt-BR" className="bg-background">
      <body className="antialiased">
        <AuthSessionProvider initialProfile={profile}>
          <GlobalNav />
          {children}
          <AuthFeedbackToast />
        </AuthSessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
