import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"

import { GlobalNav } from "@/components/global-nav"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className="antialiased">
        <GlobalNav />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
